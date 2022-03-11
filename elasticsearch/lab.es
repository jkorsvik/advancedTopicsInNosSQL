GET /movies/_search
{
    "size": 7,
    "query": {
        "match": {
            "fields.title": "star wars"
        }
    }
}

GET /movies/_search
{
    "size": 1,
    "query": {
        "match_phrase": {
            "fields.title": "star wars"
        }
    }
}

GET /movies/_search

{
    "size":1,
    "query" : {
        "bool" : {"must": [
            { "match": { "fields.title": "Star Wars" }},
            { "match": { "fields.directors": "George Lucas" }}
]
}}}


GET /movies/_search
{
    "size": 1,
    "query": {
        "match_phrase": {
            "fields.actors": "Harrison Ford"
        }
    }
}


GET /movies/_search

{
    "size":1,
    "query" : {
        "bool" : {"should": [
            { "match": { "fields.plot": "Jones" }},
            { "match": { "fields.actors": "Harrison Ford" }}
]
}}}


GET /movies/_search

{
    "size":1,
    "query" : {
        "bool" : {"must": [
            { "match": { "fields.plot": "Jones" }},
            { "match": { "fields.actors": "Harrison Ford" }}
            ],
            "must_not": { "match": { "fields.plot": "Nazis" }}

}}}

GET /movies/_search
{
    "size": 1,
    "query": {
        "bool": {
            "must": [
                {
                    "match_phrase": {
                        "fields.director": "James Cameron"
                    }
                },
                {
                    "range": {
                        "fields.rank": {
                            "lt": 1000
                        }
                    }
                }
            ]
        }
    }
}

GET /movies/_search
{
    "size": 1,
    "query": {
        "bool": {
            "must": [
                {
                    "match_phrase": {
                        "fields.director": "James Cameron"
                    }
                },
                {
                    "range": {
                        "fields.rank": {
                            "lt": 1000
                        }
                    }
                }
            ]
        }
    }
}


GET /movies/_search
{
    "size": 1,
    "query": {
        "bool": {
            "must": [
                {
                    "match_phrase": {
                        "fields.directors": "James Cameron"
                    }
                },
                {
                    "range": {
                        "fields.rating": {
                            "gt": 5
                        }
                    }
                }
            ],
            "must_not": {
                "match": {
                    "fields.genres": [
                        "Action",
                        "Drama"
                    ]
                }
            }
        }
    }
}


GET /movies/_search
{
    "size": 0,
    "aggs": {
        "group_genres": {
            "terms": {
                "field": "fields.genres.keyword"
            },
            "aggs": {
                "avg_rating": {
                    "avg": {
                        "field": "fields.rating"
                    }
                }
            }
        }
    }
}


GET /movies/_search
{
    "size": 0,
    "aggs": {
        "group_genres": {
            "terms": {
                "field": "fields.genres.keyword"
            },
            "aggs": {
                "min_rating": {
                    "min": {
                        "field": "fields.rating"
                    }
                },
                "avg_rating": {
                    "avg": {
                        "field": "fields.rating"
                    }
                },
                "max_rating": {
                    "max": {
                        "field": "fields.rating"
                    }
                }
            }
        }
    }
}

GET /movies/_search
{
    "size": 0,
    "aggs": {
        "group_year": {
            "terms": {
                "field": "fields.year",
                "order": {
                    "avg_ranking": "asc"
                }
            },
            "aggs": {
                "avg_ranking": {
                    "avg": {
                        "field": "fields.rank"
                    }
                }
            }
        }
    }
}

PUT /movies/_mapping
{
    "size": 0,
    "aggs": {
        "occ_per_term_in_title": {
            "terms": {
                "field": "fields.title"
            }
        }
    }
}


GET /movies/_search
{
    "size": 0,
    "aggs": {
        "occ_per_term_in_title": {
            "terms": {
                "field": "fields.title",
                "size": 1000
            }
        }
    }
}


PUT /movies/_mapping
{
    "properties": {
        "fields.plot": {
            "type": "text",
            "fielddata": true
        }
    }
}


GET /movies/_search
{
"query" :{"match_phrase" : {"fields.directors" : "George Lucas"}},
"aggs" : {
"terms_significatifs" : {
"significant_terms" : {"field" : "fields.plot"}
}},
"size":1
}


