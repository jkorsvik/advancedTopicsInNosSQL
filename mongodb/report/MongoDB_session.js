//Simple Queries

//--1-- Find the number of all companies that contain 'Inc.' in their name (respecting upper and lower case).
db.stocks.find({"company": {$regex : /Inc./}}).count();

//--2-- Find the names of all companies whose stock price is greater than 100
db.stocks.find({"price": {$gt : 100}}, {"company" : 1, "price": 1, "_id": 0});

//--3-- Find the number of all companies that are in the healthcare Sector
db.stocks.find({"description.Sector": 'Healthcare'}).count();

//--4-- Find the names of all the different countries we have
db.stocks.distinct('description.Country');

//--5-- Find the names of all companies in the Technology Sector that are in the USA
db.stocks.find({"description.Sector":"Technology", "description.Country":"USA"}, {"company":1, "description.Sector":1, "description.Country":1, "_id":0});
                                                                                  
//--6-- Get the price of Tesla stocks
db.stocks.find({"company": "Tesla Motors, Inc."}, {"company":1, "price":1, "_id":0});

/*---------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

//Complex Queries

//--7-- Get the name, price and Industry of the top 10 most valuable companies in the United States
db.stocks.aggregate (
    [
        { 
            "$match" : { 
                "description.Country" : "USA"
            }
        }, 
        { 
            "$sort" : { 
                "price" : -1.0
            }
        }, 
        { 
            "$limit" : 10.0
        }, 
        { 
            "$project" : { 
                "company" : 1.0, 
                "price" : 1.0, 
                "description.Industry" : 1.0
            }
        }
    ]);

//--8-- Get the average price of stocks for each sector in the USA
db.stocks.aggregate(
  [
        { 
            "$match" : {"description.Country" : "USA"}
        }, 
        { 
            "$group" : { 
                "_id" : "$description.Sector", 
                "avgPrice" : { 
                    "$avg" : "$price"
                }
            }
        }
    ]
);

/*---------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

//Hard Query
//--9--
