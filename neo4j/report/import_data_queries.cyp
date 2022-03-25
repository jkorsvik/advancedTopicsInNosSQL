LOAD CSV WITH HEADERS FROM "file:/desc_nodes.csv" as l
CREATE (desc_nodes:Description{id:toInteger(l.desc_id), country:l.Country, sector:l.Sector,
industry:l.Industry});


LOAD CSV WITH HEADERS FROM "file:/stocks_clean.csv" as l
CREATE (stocks_clean:Stocks{id:toInteger(l.id), company:l.company, price:l.price,
desc_id:l.desc_id, SMA20:l.SMA20, SMA200:l.SMA200,
days50highlow:l.days50highlow, weeks52highlow:l.weeks52highlow, analyst_recommendation:l.analyst_recommendation,
avg_true_rate:l.avg_true_rate, avg_vol:l.avg_vol, beta:l.beta,
change:l.change, EPSttm:l.EPSttm, ROI:l.ROI,
ratio:l.ratio, performance:l.performance});

