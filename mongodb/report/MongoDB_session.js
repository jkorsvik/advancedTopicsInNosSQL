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

const match_eps =  {
    $match: { EPSttm : { $gte : 0} }
 };

const grouping = {
    $group: { _id:{
      country: "$description.Country", 
      sector: "$description.Sector" 
      }, 
      // Avg volume, price, and number of trading days in a year
      // to approximate the traded value of the company in the span of ayear
     sum_volume: { $sum: "$avg_vol" },
     sum_price: { $sum: "$price" },
         }
 }
const sorting = { 
          $sort : { 
              Valueoftrades : -1.0
          
  }};
const projection = {$project : {
              country : 1.0,
              sector : 1.0,
              Valueoftrades: {
                $multiply: ["$sum_volume", "$sum_price", 253]
                }
              }
  }
// Build an aggregation to see what the values traded in a year
// of the different sectors in countries are, for profitable business
const aggregation = [

   // Stage 1 filter for profitable businesses
match_eps,
 // stage 2 group to find the total amount of value 
 // traded grouped by country and sector
grouping,
projection,
sorting 
];

// Run the aggregation and open a cursor to the results.
// Use toArray() to exhaust the cursor to return the whole result set.
// You can use hasNext()/next() to iterate through the cursor page by page.
// sectors and countries by approximated value traded
db.stocks.aggregate(aggregation);

