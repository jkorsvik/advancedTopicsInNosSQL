MATCH (a:Airport{country:"France"})
RETURN a.name, a.IATA;

MATCH (a:Airline{country:"France", active:"Y"})
WHERE EXISTS(a.IATA) 
RETURN a.name, a.IATA;

MATCH (a:Airline{country:"France"})
WHERE EXISTS(a.IATA) AND a.active = "Y"
RETURN a.name, a.IATA;

MATCH (a:Airline)
WHERE EXISTS(a.IATA) AND a.country ="France" AND a.active="Y"
RETURN a.name, a.IATA;

MATCH (a:Airline{country:"France"}) <-- (r:Route)
RETURN DISTINCT a.name;

MATCH (a:Airline{country:"France"}) <-- (r:Route)
RETURN a, r LIMIT 10;

MATCH (a:Airline{country:"France"}) <-[:by]- (r:Route)
RETURN a,r Limit 25;

MATCH (a:Airline{country:"France"}) <-- (r1), (a)<-- (r2), (a)<-- (r3), (r4:Route)
WHERE NOT (r4)-->(a) 
RETURN DISTINCT a.name; //find airline with only 3 routs

MATCH (cdg:Airport{IATA:"CDG"}) <-[f:from]- (r:Route)
RETURN cdg, f, r;


MATCH (cdg) <-[:from]- (r)
where cdg.IATA = "CDG"
RETURN cdg, r limit 30;

MATCH (cdg:Airport{IATA:"CDG"}) <-[f:from]- (r:Route)
WHERE r.equipment CONTAINS "380"
RETURN cdg, f, r;

MATCH (cdg) <-[f:from]- (r)
WHERE r.equipment CONTAINS "380" AND cdg.IATA="CDG"
RETURN cdg, f, r;
