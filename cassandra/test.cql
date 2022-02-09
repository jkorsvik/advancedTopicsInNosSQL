-- create tuple type for longitude and latitude
DROP TYPE dblp.long_lat_tuple;
CREATE TYPE dblp.long_lat_tuple (
    longitude float,
    latitude float
);

--landingtable raw
CREATE TABLE dblp.raw_zips
(
city varchar,
"loc" FROZEN<dblp.long_lat_tuple>,
"pop" int,
"state" varchar,
"_id" varchar,
PRIMARY KEY (city)
);

-- Create a table
CREATE TABLE dblp.zips (
    zipcode varchar,
    city varchar,
    state varchar,
    latitude float,
    longitude float,
    population int,
    PRIMARY KEY (zipcode)
    );


-- parse json file with fields "city", "loc", "pop", "state" and "_"  into table "rawzips" using java


-- https://docs.datastax.com/en/dsbulk/doc/dsbulk/install/dsbulkInstall.html
-- to load the json file to the corresponding raw table
-- dsbulk load -k dblp -t raw_zips -c json -url zips.json