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
