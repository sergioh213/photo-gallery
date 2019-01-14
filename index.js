const express = require('express');
const app = express();
const compression = require('compression');
const bodyParser = require('body-parser')
const db = require("./db/db.js");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const bc = require("./db/bcrypt.js")
const bcrypt = require('./db/bcrypt')
const csurf = require('csurf')
const multer = require('multer');
const uidSafe = require('uid-safe');
const path = require('path');
const s3 = require("./s3");
const config = require("./config");
const server = require('http').Server(app);

let domain
if (process.env.NODE_ENV == "production") {
    domain = 'https://the-food-market.herokuapp.com:*'
} else {
    domain = 'localhost:8080'
}

// const io = require('socket.io')(server, { origins: domain });

var diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function (req, file, callback) {
      uidSafe(24).then(function(uid) {
          callback(null, uid + path.extname(file.originalname));
      });
    }
});
var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

var saveImagesOnDb = function(files) {
    var finalizedImages = []
    files.forEach(singleFile => {
        db.saveImageNoAlbum(config.s3Url + singleFile.filename, singleFile.originalname).then(storedImg => {
            finalizedImages.push(storedImg)
        })
    })
}

const sessMiddleware = cookieSession({
       secret: `I'm always angry.`,
       maxAge: 1000 * 60 * 60 * 24 * 14
   })

app.use(sessMiddleware);
app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(csurf());
app.use(function(req, res, next){
    res.cookie('mytoken', req.csrfToken());
    next();
});

app.use(express.static("./public"))

app.use(compression());

if (process.env.NODE_ENV != 'production') {
    app.use(
        '/bundle.js',
        require('http-proxy-middleware')({
            target: 'http://localhost:8081/'
        })
    );
} else {
    app.use('/bundle.js', (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

//////////////// ROUTES ///////////////////

app.get('/email.json', (req, res) => {
    console.log("/email.json get happening");
    db.getEmail().then(({email}) => {
            if (email) {
                res.json(email);
            }
        })
});

app.post('/update-info.json', (req, res) => {
    console.log("/update-info.json post happening");
    if (!req.body.password && req.body.email) {
        db.updateEmail(req.body.email).then(data => {
            res.json({
                success: "email",
                email: data.email
            })
        })
    } else if (!req.body.email && req.body.password) {
        bcrypt.hashPassword(req.body.password).then(hashedPassword => {
            db.updatePassword(hashedPassword).then(data => {
                res.json({
                    success: "pass"
                })
            })
        })
    } else {
        bcrypt.hashPassword(req.body.password).then(hashedPassword => {
            db.updateEmailAndPassword(req.body.email, hashedPassword).then(data => {
                res.json({
                    success: "both",
                    email: data.email
                })
            })
        })
    }
})

app.post('/admin.json', (req, res) => {
    console.log("/admin.json post happening");
    db.getPassword().then(({pass}) => {
        bcrypt.checkPassword(req.body.password, pass)
            .then(passwordsMatch => {
                if (passwordsMatch) {
                    req.session.active = true;
                    res.json({ success: true });
                } else {
                    res.json({
                        success: false,
                        error: 'Wrong password'
                    })
                }
            })
    })
})

app.get("/photos.json", (req, res) => {
    console.log("/photos.json get happening");
    db.getPhotos().then(data => {
            if (data) {
                res.json(data);
            }
        })
});

app.get("/all.json", (req, res) => {
    console.log("/all.json get happening");
    db.getAlbums().then(async allAlbums => {
        console.log("albums received from db: ", allAlbums);
        if (allAlbums.length) {
            console.log("albums detected")
            var albumsWithPhotos = []
            await allAlbums.map(album => {
                console.log("Single album: ", album);
                var singleAlbum = {
                    ...album,
                    photos: []
                }
                db.getPhotosByAlbumId(album.id).then(photos => {
                    console.log("All photos of that album: ", photos);
                    console.log("photos detected in album");
                    singleAlbum.photos = photos
                    console.log("singleAlbum object after adding photos: ", singleAlbum);
                    albumsWithPhotos.push(singleAlbum)
                    if (allAlbums.length === albumsWithPhotos.length) {
                        console.log("albumsWithPhotos before sending: ", albumsWithPhotos);
                        res.json(albumsWithPhotos);
                    }
                })
            })
        }
    })
});

app.post("/add-previews-to-album.json", (req, res) => {
    console.log("/add-previews-to-album.json    req.body: ", req.body);
    db.addAlbumToPreviews(req.body.id).then(data => {
        console.log("addAlbumToPreviews data received from db: ", data);
        if (data) {
            res.json({
                success: true,
                album: data[0].album_id
             })
        }
    })
})

app.get("/previews.json", function(req, res) {

    console.log("/previews.json get happening");

    db.getPreviews().then(data => {
            if (data.length) {
                console.log("looking for data[0]: ", data[0]);
                console.log("looking for data[0].album_id: ", data[0].album_id);
                if (data[0].album_id) {
                    db.getAlbumById(data[0].album_id).then(album => {
                        res.json({
                            previews: data,
                            album: album
                        })
                    })
                } else {
                    res.json({ previews: data });
                }
            }
        })

});

app.post("/save-images.json", (req, res) => {
    console.log("/save-images.json happening. req.body: ", req.body);

    let savedImages = []

    if (req.body.albumSelected) {
        console.log("SAVING WITH ALBUM");
        req.body.finalizedImages.forEach(singleFile => {
            console.log("inside of loop: ", singleFile);
            db.saveImageWithAlbum(req.body.albumSelected.id, singleFile.img_url, singleFile.filename).then(async storedImg => {
                console.log("after saving");
                savedImages.push(storedImg)
                if (req.body.finalizedImages.length === savedImages.length) {
                    console.log("Length reached");
                    await db.rebootPreviewsTable()
                    await res.status(200).json({
                        success: true,
                        savedImages: savedImages
                    })
                }
            })
        })
    } else {
        console.log("SAVING WITHOUT ALBUM");
        req.body.finalizedImages.forEach(singleFile => {
            console.log("inside of loop: ", singleFile);
            db.saveImageNoAlbum(singleFile.img_url, singleFile.filename).then(async storedImg => {
                console.log("after saving");
                savedImages.push(storedImg)
                if (req.body.finalizedImages.length === savedImages.length) {
                    console.log("Length reached");
                    await db.rebootPreviewsTable()
                    await res.status(200).json({
                        success: true,
                        savedImages: savedImages
                    })
                }
            })
        })
    }
})

app.post('/upload-images.json', uploader.array('file',10), s3.upload, async (req, res) => {
    console.log("This happens after S3?");
    console.log("req: ", req);

    var finalizedImages = []

    req.files.forEach(singleFile => {
        db.savePreviewImageNoAlbum(config.s3Url + singleFile.filename, singleFile.originalname).then(storedImg => {
            finalizedImages.push(storedImg)
            if (req.files.length === finalizedImages.length) {
                console.log("SEND RESPONSE Server");
                res.status(200).json({
                    success: true,
                    finalizedImages: finalizedImages
                })
            }
        })
    })

})

app.post("/delete-preview.json", async (rew, res) => {
    console.log("/delete-preview happening");
    await db.rebootPreviewsTable()
    await db.getPreviews().then(data => {
        console.log("checking if previews are deleted");
            if (!data || data.length === 0) {
                console.log("previews deleted succesfully. Sending response");
                res.json({ success: true });
            }
        })
})

app.get("/albums.json", (req, res) => {
    db.getAlbums().then(data => {
        console.log("DATA from albums on server: ", data);
        res.json(data)
    })
})

app.post("/create-album.json", (req, res) => {
    console.log("/create-album req.body: ", req.body);
    db.saveAlbum(req.body.name, req.body.description).then(data => {
        console.log("data after save album: ", data);
        res.json(data)
    })
})

// app.post('/upload-images.json', uploader.array('file',10), s3.upload, async (req, res) => {
//
//     var finalizedImages = []
//
//     // this takes too long
//     await req.files.forEach(singleFile => {
//         db.saveImageNoAlbum(config.s3Url + singleFile.filename, singleFile.originalname).then(storedImg => {
//             finalizedImages.push(storedImg)
//         })
//     })
//
//
//     return new Promise(function(resolve, reject) {
//         setTimeout(function() {
//             // is this right?
//             resolve(
//                 // this happens before finalizedImages array is populated
//                 res.status(200).json(finalizedImages)
//             );
//         }, 2000);
//     });
//
// })

app.get("/admin", (req, res) => {
    console.log("/admin route");
    if (!req.session.active) {
        console.log("/admin => no session, redirecting to '/'");
        res.redirect("/")
    } else {
        console.log("/admin with session");
        res.sendFile(__dirname + '/index.html');
    }
})

app.get("/admin/home", (req, res) => {
    console.log("/admin route");
    if (!req.session.active) {
        console.log("/admin/home => no session, redirecting to '/'");
        res.redirect("/")
    } else {
        console.log("/admin/home with session");
        res.sendFile(__dirname + '/index.html');
    }
})

app.get("/login", (req, res) => {
    if (req.session.active) {
        console.log("redirecting to /admin")
        res.redirect("/admin")
    } else {
        res.sendFile(__dirname + '/index.html');
    }
})

app.get("/", (req, res) => {
    console.log("/ route");
    if (req.session.active) {
        console.log("/ => with session, redirecting to '/admin/home'");
        res.redirect("/admin/home")
    } else {
        res.sendFile(__dirname + '/index.html');
    }
})

app.get('/logout', (req, res) => {
    console.log("logout happening");
    req.session = null
    res.redirect('/')
})


app.get('*', function(req, res) {
    console.log("* get happening");
    if (!req.session.active) {
        console.log("no session");
        res.redirect("/")
    } else if (req.session.active) {
        console.log("redirecting to /admin")
        res.redirect("/admin")
    }
});

server.listen(process.env.PORT || 8080, function() {
    console.log("I'm listening.");
});
