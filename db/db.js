const spicedPg = require("spiced-pg")
let db;
if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL)
} else {
    db = spicedPg('postgres:sergioherrero:password@localhost:5432/galeria');
}

exports.getPassword = function() {
    return db.query(`SELECT pass FROM login;`).then(results => {
        return results.rows[0]
    })
}

exports.getEmail = function() {
    return db.query(`SELECT email FROM login;`).then(results => {
        return results.rows[0]
    })
}

exports.getPhotos = function() {
    return db.query(`SELECT * FROM photos;`).then(results => {
        return results.rows
    })
}

exports.updateEmail = function(email) {
    const params = [email];
    const q = `
        UPDATE login SET
        email = $1
        WHERE id = 2
        RETURNING *;
        `;
    return db.query(q, params).then(userInfo => {
        return userInfo.rows[0]
    })
}

exports.updatePassword = function(pass) {
    const params = [pass];
    const q = `
        UPDATE login SET
        pass = $1
        WHERE id = 2
        RETURNING *;
        `;
    return db.query(q, params).then(userInfo => {
        return userInfo.rows[0]
    })
}

exports.updateEmailAndPassword = function(email, pass) {
    const q = `
        UPDATE login SET email = $1, pass = $2
        WHERE id = 2
        RETURNING *;
    `;
    const params = [email, pass];
    return db.query(q, params).then(updatedProfile => {
        return updatedProfile.rows[0];
    });
}

exports.saveImageNoAlbum = async function(imageUrl, filename) {
    const q = `
        INSERT INTO photos (img_url, filename)
        VALUES ($1, $2)
        RETURNING *;
        `
    const params = [imageUrl, filename]
    return db.query(q, params).then(results => {
        return results.rows[0]
    })
}

exports.savePreviewImageNoAlbum = async function(imageUrl, filename) {
    const q = `
        INSERT INTO previews (img_url, filename)
        VALUES ($1, $2)
        RETURNING *;
        `
    const params = [imageUrl, filename]
    return db.query(q, params).then(results => {
        return results.rows[0]
    })
}

exports.getPreviews = function() {
    return db.query(`SELECT * FROM previews;`).then(results => {
        console.log("results.rows: ", results.rows);
        return results.rows
    })
}

exports.rebootPreviewsTable = async function() {
    const q = `DELETE FROM previews;`
    return db.query(q).then(results => {
        return results.rows
    })
}
