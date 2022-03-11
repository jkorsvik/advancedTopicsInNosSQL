MATCH (a:Airport{country:"France"})
RETURN a.name, a.IATA;

MATCH (a:Airline{country:"France", active:"Y"})
WHERE EXISTS(a.IATA) 
RETURN a.name, a.IATA;

MATCH (a:Airline{country:"France"})
WHERE EXISTS(a.IATA) AND a.active = "Y"
RETURN a.name, a.IATA;

