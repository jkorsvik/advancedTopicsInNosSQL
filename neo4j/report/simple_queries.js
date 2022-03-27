//Simple Queries

//--1-- Find the number of all companies that contain 'Inc.' in their name, using regex.

MATCH (a:Stocks)
WHERE a.company =~ ".*Inc.*"
RETURN COUNT(a.company) AS number

//-- 2 -- Find the country, the sector and the industry of Tesla.

MATCH (a:Stocks{company:"Tesla Motors, Inc."}) MATCH (b:Description)
WHERE toInteger(a.desc_id) = b.id
RETURN a.company AS company, b.country AS country, b.sector AS sector, b.industry AS industry

//-- 3 -- Find the names of all companies in the Technology Sector that are in the USA.

MATCH (a:Stocks) MATCH (b:Description{country:"USA"})
WHERE toInteger(a.desc_id) = b.id AND b.sector CONTAINS  "Technology"
RETURN a.company, b.country, b.sector LIMIT 10

//-- 4 -- Find the names, sectors, industries and countries of all companies whose name begins with "Alc" (there are only 3).

MATCH (a:Description) MATCH (b:Stocks)
WHERE toInteger(b.desc_id) = a.id AND b.company STARTS WITH 'Alc'
RETURN b.company AS name, a.country AS country, a.sector AS sector, a.industry AS industry

//-- 5 -- Find the names of all companies whose stock price is greater than 1000 (there are only 4).

MATCH (a:Stocks)
WHERE toFloat(a.price) > 1000
RETURN a.company, a.price

//-- 6 -- Get the price of Tesla stocks

MATCH(a:Stocks)
WHERE a.company ='Tesla Motors, Inc.'
RETURN  a.price, a.company LIMIT 10


//Complex Queries

//--1-- Get the name, price and Industry of the top 10 most valuable companies in the United States 



//--2-- Get the average price of stocks for each sector in the USA
