LOAD CSV WITH HEADERS FROM "file:/desc_nodes.csv" as l
CREATE (desc_nodes:Description{id:toInteger(l.desc_id), country:l.Country, sector:l.Sector,
industry:l.Industry});

USING PERIODIT COMMIT 200
LOAD CSV WITH HEADERS FROM "file:/stocks_clean.csv" as l
MERGE (description:Description{id:toInteger(l.desc_id)})
CREATE (stocks_clean:Stocks{id:toInteger(l.id), company:l.company, price:toFloat(l.price), SMA20:toFloat(l.SMA20), SMA200:toFloat(l.SMA200),
days50highlow:l.days50highlow, weeks52highlow:l.weeks52highlow, analyst_recommendation:toFloat(l.analyst_recommendation),
avg_true_rate:toFloat(l.avg_true_rate), avg_vol:toFloat(l.avg_vol), beta:toFloat(l.beta),
change:toFloat(l.change), EPSttm:toFloat(l.EPSttm), ROI:toFloat(l.ROI),
ratio:l.ratio, performance:l.performance})
CREATE (stocks_clean) -[:descripted]-> (description);


//If you have already created a Stocks node use this code to delete before creating a new one
MATCH (n:Stocks)
DETACH
DELETE n
