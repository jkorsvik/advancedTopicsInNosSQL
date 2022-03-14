GET /stocks/_search
{
    "size": 7,
    "query": {
        "match": {
            "fields.price": 9.02
        }
    }
}

// COUNT NUMBER OF DOCUMENTS
GET /stocks/_search
{"aggs" : {
"nb_distinct" : {
"terms" : {"field" : "_id"}
}}}
// OR

GET /stocks/_count


GET /stocks/_search
{"aggs" : {
"nb_distinct" : {
"terms" : {"field" : "_id"}
}}}


// FIND MIN AVG MAX OF PRICES GROUPED BY COUNTRIES
GET /stocks/_search
{"size":0, "aggs" : {
"group_countries" : {
"terms" : {
"field" : "fields.description.Country.keyword"
},
"aggs" : {
"avg_price" : {"avg" : {"field" : "fields.price"}},
"min_price" : {"min" : {"field" : "fields.price"}},
"max_price" : {"max" : {"field" : "fields.price"}}}
}}}

// FIND THE BEST PERFORMING INDUSTRIES ON A YEARLY BASIS
// ALSO PRESENTING THE MONTHLY PERFORMANCE
GET /stocks/_search
{"size":0, "aggs" : {
"group_industries" : {
"terms" : {
"field" : "fields.description.Industry.keyword",
"size":10000,
"order" : { "avg_yearly_perf" : "desc" }
},
"aggs" : {
"avg_yearly_perf" : {"avg" : {"field" : "fields.performance.Year"}},
"avg_monthly_perf" : {"avg" : {"field" : "fields.performance.Month"}}
}
}}}


// THE TWO NEXT ONE ARE USED TO FIND OCCURANCES OF TERMS

PUT /stocks/_mapping
{ "properties": {
"fields.company": {
"type": "text",
"fielddata": true
}}}

// AGGREGATING TERMS WITH OCCURANCE OF EACH DISTINCT
// COHERENT STRING WITHOUT WHITESPACE OR ESCAPE CHARACHTERS
GET /stocks/_search
{"size":0, "aggs" : {
"occ_per_term_in_company_name" : {
"terms" : {"field" : "fields.company"}
}}}




PUT /movies/_mapping
{ "properties": {
"fields.plots": {
"type": "text",
"fielddata": true
}}}
GET /movies/_search
{
"query" :{"match_phrase" : {"fields.directors" : "George Lucas"}},
"aggs" : {
"terms_significatifs" : {
"significant_terms" : {"field" : "fields.plot"}
}},
"size":1
}
