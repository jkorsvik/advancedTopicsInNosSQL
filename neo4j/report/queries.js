//Simple Queries

//--1-- Find the number of all companies that contain 'Inc.' in their name, using regex.

MATCH (a:Stocks)
WHERE a.company =~ ".*Inc.*"
RETURN COUNT(a.company) AS number

//-- 2 -- Find the country, the sector, the industry and the id of Tesla.

MATCH (a:Stocks{company:"Tesla Motors, Inc."}) --> (b:Description)
RETURN a.company AS company, b.country AS country, b.sector AS sector, b.industry, b.id AS id

//-- 3 -- Find the names of all companies in the Technology Sector that are in the USA.

MATCH (d:Description{country:"USA"}) <-- (s:Stocks)
WHERE d.sector = "Technology"
RETURN s.company, d.country, d.sector

//-- 4 -- Find the names, sectors, industries and countries of all companies whose name begins with "Alc" (there are only 3).

MATCH (a:Description) <-- (b:Stocks)
WHERE b.company STARTS WITH 'Alc'
RETURN b.company AS name, a.country AS country, a.sector AS sector, a.industry AS industry

//-- 5 -- Find the names of all companies whose stock price is greater than 1000 (there are only 4).

MATCH (a:Stocks)
WHERE a.price > 1000
RETURN a.company, a.price ORDER BY a.price DESC

// -- 6 -- As we saw earlier, Tesla's id is 1501. Now let's find the graph of all the companies that have the same id (i.e.: same country, same industry and same sector)

MATCH (d:Description) <-[c:has_country]- (s:Stocks)
WHERE d.id = 1501
RETURN d, c, s


//Complex Queries

//--1-- Get the name, price and Industry of the top 10 most valuable companies in the United States 

MATCH (n:Stocks) --> (b:Description)
where n.price is not null and b.country='USA'
RETURN n.company, n.price, b.country ORDER BY n.price DESC limit 10

//--2-- Find mean price and stddev price for all stocks
MATCH (n:Stocks)
RETURN avg(toFloat(n.price)), stDev(toFloat(n.price)) 


//Hard query


//--1-- Graph all the companies which have the same id

MATCH p = (d:Description) <-- (:Stocks)
WHERE EXISTS (d.country)
RETURN p