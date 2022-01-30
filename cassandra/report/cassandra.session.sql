use stocks;
-- @block simple1
-- Get the number of rows in the stocks table
select count(*) from stocks.stocks;


-- @block simple2
-- Get the average price of all stocks
select avg(price) as average_price from stocks.stocks;


-- @block simple3
select count(*) from stocks.stocks 
where description['Country'] = 'USA' ALLOW FILTERING;



-- @block simple4
-- Find Tesla's stock price
select id, company, price from stocks.stocks 
where company='Tesla Motors, Inc.' ALLOW FILTERING;


-- @block simple5
-- Find all the values of tesla by using the id
select * from stocks.stocks 
where id='5285380dbb1177ca391c2f9a';

-- @block simple6
-- Find the country and industry for tesla by using the id
select company, description['Country'] as country, description['Industry'] as industry from stocks.stocks 
where id='5285380dbb1177ca391c2f9a';

-- @block complex1
-- Find mean price and stddev price for all stocks

CREATE OR REPLACE FUNCTION stocks.sdState ( 
    state tuple<int,double,double>, val float ) 
    CALLED ON NULL INPUT RETURNS tuple<int,double,double> 
    LANGUAGE java AS ' int n = state.getInt(0); double mean = state.getDouble(1); double m2 = state.getDouble(2); n++; double delta = val - mean; mean += delta / n; m2 += delta * (val - mean); state.setInt(0, n); state.setDouble(1, mean); state.setDouble(2, m2); return state;';

CREATE OR REPLACE FUNCTION stocks.sdFinal ( 
    state tuple<int,double,double>) 
    CALLED ON NULL INPUT RETURNS double 
    LANGUAGE java AS ' int n = state.getInt(0); double m2 = state.getDouble(2); if (n < 1) { return null; } return Math.sqrt(m2 / (n - 1));';

CREATE OR REPLACE AGGREGATE stocks.stddev (float)
    SFUNC sdState 
    STYPE tuple<int,double,double> 
    FINALFUNC sdFinal INITCOND (0, 0, 0);


SELECT count(*) as count,
AVG(price) as mean_price, 
stddev(price) as STD_price FROM stocks.stocks;

    



-- @block complex2
-- get the name and price of the 10 most expensive stocks
-- this not works since we are partioning by the companyid
--select company, price from stocks.stocks limit 10;
-- We instead create a MV

DROP MATERIALIZED VIEW IF EXISTS stocks.company_price_and_performance;
CREATE MATERIALIZED VIEW stocks.company_price_and_performance 
AS SELECT id, company, earningsdate, performance, price 
FROM stocks.stocks 
WHERE earningsdate IS NOT NULL AND id IS NOT NULL AND price IS NOT NULL
PRIMARY KEY (id, price, earningsdate)
WITH caching = { 'keys' : 'ALL', 'rows_per_partition' : '100' }
   AND comment = 'Based on table stocks.stocks' ;

-- Get the data for the 10 first stocks of the clean MV
select company, price, performance from stocks.company_price_and_performance limit 10;


-- @block hard1
CREATE OR REPLACE FUNCTION state_group_and_count( state map<text, int>, type text )
CALLED ON NULL INPUT
RETURNS map<text, int>
LANGUAGE java AS '
Integer count = (Integer) state.get(type);  if (count == null) count = 1; else count++; state.put(type, count); return state; ' ;

CREATE OR REPLACE AGGREGATE group_and_count(text) 
SFUNC state_group_and_count 
STYPE map<text, int> 
INITCOND {};

-- Counts the number of companies in the dataset and 
-- creates a map of the number of companies with the country as the key
select group_and_count(description['Country']) from stocks.stocks;

-- @block reinitiatetable
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
