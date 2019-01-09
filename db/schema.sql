-- DROP TABLE IF EXISTS producers;
-- DROP TABLE IF EXISTS production_facilities;

CREATE TABLE login (
    id SERIAL PRIMARY KEY,
    pass VARCHAR(500) NOT NULL,
    email VARCHAR(200) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ALTER TABLE producers ADD column_name VARCHAR(500), ADD column_name2 VARCHAR(200);
-- ALTER TABLE producers DROP column_name, DROP column_name2;
-- UPDATE producers SET headquarter_google_maps_place_id = NULL, headquarter_formatted_address = NULL, headquarter_latitude = NULL, headquarter_longitude = NULL WHERE id = 1;
-- UPDATE producers SET bank_account_number = NULL, bank_iban = NULL WHERE id = 1;
