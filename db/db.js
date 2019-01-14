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

exports.saveImageWithAlbum = async function(albumId, imageUrl, filename) {
    const q = `
        INSERT INTO photos (album_id, img_url, filename)
        VALUES ($1, $2, $3)
        RETURNING *;
        `
    const params = [albumId, imageUrl, filename]
    return db.query(q, params).then(results => {
        return results.rows[0]
    })
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

exports.addAlbumToPreviews = async function(albumId) {
    const q = `
        UPDATE previews
        SET album_id = $1
        RETURNING *;
        `
    const params = [albumId]
    return db.query(q, params).then(results => {
        return results.rows
    })
}

exports.getPreviews = function() {
    return db.query(`SELECT * FROM previews;`).then(results => {
        return results.rows
    })
}

exports.rebootPreviewsTable = async function() {
    const q = `DELETE FROM previews;`
    return db.query(q).then(results => {
        return results.rows
    })
}

exports.getAlbums = function() {
    return db.query(`SELECT * FROM albums ORDER BY id DESC;`).then(results => {
        return results.rows
    })
}

exports.saveAlbum = async function(name, description) {
    const q = `
        INSERT INTO albums (name, description)
        VALUES ($1, $2)
        RETURNING *;
        `
    const params = [name, description]
    return db.query(q, params).then(results => {
        return results.rows[0]
    })
}

exports.getAlbumById = function(albumId) {
    const q = `SELECT * FROM albums WHERE id = $1;`
    const params = [albumId]
    return db.query(q, params).then(results => {
        return results.rows[0]
    })
}

exports.getPhotosByAlbumId = function(albumId) {
    const q = `SELECT * FROM photos WHERE album_id = $1;`
    const params = [albumId]
    return db.query(q, params).then(results => {
        return results.rows
    })
}
