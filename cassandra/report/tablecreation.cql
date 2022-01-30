-- Move the data
docker cp stocks_clean.csv cassandra:/
docker cp insert_json.cql cassandra:/

-- Namespace definition
CREATE KEYSPACE IF NOT EXISTS stocks
WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor': 1 };


USE stocks;

-- create table based on stocks.json file
drop table if exists stocks;
create TABLE stocks (
    id text,
    company text,
    price float,
    earningsdate timestamp,
    description map<text, text>,
    SMA20 float,
    SMA200 float,
    days50highlow tuple<float, float>,
    weeks52highlow tuple<float, float>,
    analyst_recommendation float,
    avg_true_rate float,
    avg_vol float,
    beta float,
    change float,
    EPSttm float,
    ROI float,
    ratio map<text, float>,
    performance map<text, float>,
    PRIMARY KEY (id price)
) WITH CLUSTERING ORDER BY (price DESC);

-- @block create index
ALTER TABLE stocks WITH GC_GRACE_SECONDS = 1;
CREATE INDEX btree_stocks_id on stocks(id);
CREATE INDEX btree_stocks_date on stocks(earningsdate);
CREATE INDEX btree_stocks_price on stocks(price);


-- Load the data
COPY stocks(id, company, price, earningsdate, 
description, SMA20, SMA200, days50highlow, 
weeks52highlow, analyst_recommendation, 
avg_true_rate, avg_vol, beta, change, 
EPSttm, ROI, ratio, performance)
FROM 'stocks_clean.csv' WITH HEADER = true AND DELIMITER=';';


-- Had to use json
-- delete all rows
TRUNCATE stocks.stocks;

-- insert rows using json
source 'insert_json.cql';