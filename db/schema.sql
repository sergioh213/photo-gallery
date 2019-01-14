-- DROP TABLE IF EXISTS album;
-- DROP TABLE IF EXISTS production_facilities;

CREATE TABLE login (
    id SERIAL PRIMARY KEY,
    pass VARCHAR(500) NOT NULL,
    email VARCHAR(200) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE albums (
    id SERIAL PRIMARY KEY,
    name VARCHAR(500) NOT NULL,
    description VARCHAR(1500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE photos (
    id SERIAL PRIMARY KEY,
    album_id INT REFERENCES albums(id),
    img_url VARCHAR(500) NOT NULL,
    filename VARCHAR(100),
    portada BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE previews (
    id SERIAL PRIMARY KEY,
    album_id INT REFERENCES albums(id),
    img_url VARCHAR(500) NOT NULL,
    filename VARCHAR(100),
    portada BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ALTER TABLE previews ADD portada BOOLEAN;
-- ALTER TABLE photos ADD portada BOOLEAN;
-- ALTER TABLE previews ADD column_name VARCHAR(500), ADD column_name2 VARCHAR(200);
-- ALTER TABLE producers DROP column_name, DROP column_name2;
-- UPDATE producers SET headquarter_google_maps_place_id = NULL, headquarter_formatted_address = NULL, headquarter_latitude = NULL, headquarter_longitude = NULL WHERE id = 1;
-- UPDATE producers SET bank_account_number = NULL, bank_iban = NULL WHERE id = 1;
