db.getCollection("dblp").find({})

db.dblp.find().limit(5)


use TP
db = db.getSiblingDB("TP");
db.getCollection("dblp").find(
    { 
        "type" : "Book"
    }, 
    { 
        "title" : 1.0
    }
);


db.dblp.find({"type": "Book"},
            {"title": 1.0}).limit(5)
            
db.getCollection("dblp").find(
    { 
        "type" : "Book"
    }, 
    { 
        "title" : "$title", 
        "_id" : NumberInt(0)
    }
);


db.dblp.find({"year": {$gte: 2011}})

db.dblp.find({"year": {$gte: 2014}})      

db.dblp.find({ 
        "publisher" : { 
            "$exists" : 1
        }
    }, 
    { 
        "title" : "$title", 
        "publisher" : "$publisher"
    });
    
//Jeffrey D. Ullman


db.dblp.find({ 
        "authors.0" : "Jeffrey D. Ullman"
    }, 
    { 
        "title" : 1, 
        "authors" : 1
    });

    
db.dblp.find({ 
        "authors.0" : "Jeffrey D. Ullman"
    }, 
    { 
        "title" : 1, 
        "authors" : 1
    });
    
    
db.dblp.find({ 
        "authors" : ["Jeffrey D. Ullman"]
    }, 
    { 
        "title" : 1, 
        "authors" : 1
    });
    
db.dblp.find({ 
        "title" : /database/i
    }, 
    { 
        "title" : 1, 
        "authors" : 1
    });
    
// Or

db.dblp.find({ 
        "title" : {$regex: /database/}
    }, 
    { 
        "title" : 1, 
        "authors" : 1
    });
    
// distinct
db.dblp.distinct("publisher")

db.dblp.distinct("authors")

//Aggregates

db.dblp.find({ 
        "authors" : "Jeffrey D. Ullman"
    }, 
    { 
        "title" : 1, 
        "authors" : 1
    }).sort("pages.start");
    
db.dblp.aggregate( [
   // Stage 1: Filter by author
   {
      $match: { "authors":  "Jeffrey D. Ullman"}
   },
   // Stage 2: Sort
   {
      $sort: { "pages.start": 1}
   },
   // Stage 3: projection
   {
       $project : {"title":1, "pages":1}
   }
] );

db.dblp.aggregate( [
   // Stage 1: Filter by authour
   {
      $match: { authors: "Jeffrey D. Ullman" }
   },
   // Stage 2: Group remaining documents by year and calculate total quantity
   {
      $group: { _id: "$year", totalQuantity: { $sum: 1 } }
   }
] )


// COMPLEX

db.dblp.aggregate( [
   // Stage 1: unwind authours
   {
     $unwind: { path: "$authors", preserveNullAndEmptyArrays: true }
   },
   // Stage 2: Group remaining documents by year and calculate total quantity
   {
      $group: { _id: "$authors", totalQuantity: { $sum: 1 } }
   },
   // Stage 3: sort DESC
   {
     $sort: { "totalQuantity": -1 }
   }
] );

db.dblp.aggregate( [
   // Stage 1 filter
  {
      $match: {publisher : { $exists : 1} }
   },
   // stage 2 group
  {
      $group: { _id:{pub: "$publications", year="$year" }, numPublications: { $sum: 1 } }
   }
   //
] );


    
