use stocks;
-- @block simple1
-- Get the number of rows in the stocks table
select count(*) from stocks.stocks;


-- @block simple2
-- Get the average price of all stocks
select avg(price) as average_price from stocks.stocks;


-- @block simple3



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
Optional<String>


-- @block complex2
-- get the name and price of the 10 most expensive stocks
select company, price from stocks.stocks 
where price >= 0 order by price desc limit 10;

-- @block hard1
CREATE OR REPLACE FUNCTION countGroupState ( state map<text,int>, count text )
CALLED ON NULL INPUT RETURNS map<text,int> LANGUAGE java
AS 'Integer count = (Integer) state.get(type); 
if (count == null) count = 1;
 else count++;
  state.put(type, count);
return state; ' ;

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
    PRIMARY KEY ((id), price)
);
