// ELASTICSEARCH FILE UTILIZING THE ELASTICSEARCH EXTENSION
// FOR VSCODE, ".es" File extension.
// FIND SPECIFIC COMPANY WITH SPECIFIC PRICE
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
{
    "aggs": {
        "nb_distinct": {
            "terms": {
                "field": "_id"
            }
        }
    }
}
// OR

GET /stocks/_count

GET /stocks/_search?q=Tesla


GET /stocks/_stats


GET /stocks/_search?q=fields.description.Country:Norway

// FIND MIN AVG MAX OF PRICES GROUPED BY COUNTRIES
GET /stocks/_search
{
    "size": 0,
    "aggs": {
        "group_countries": {
            "terms": {
                "field": "fields.description.Country.keyword"
            },
            "aggs": {
                "avg_price": {
                    "avg": {
                        "field": "fields.price"
                    }
                },
                "min_price": {
                    "min": {
                        "field": "fields.price"
                    }
                },
                "max_price": {
                    "max": {
                        "field": "fields.price"
                    }
                }
            }
        }
    }
}

// FIND THE BEST PERFORMING INDUSTRIES ON A YEARLY BASIS
// ALSO PRESENTING THE MONTHLY PERFORMANCE
GET /stocks/_search
{
    "size": 0,
    "aggs": {
        "group_industries": {
            "terms": {
                "field": "fields.description.Industry.keyword",
                "size": 10000,
                "order": {
                    "avg_yearly_perf": "desc"
                }
            },
            "aggs": {
                "avg_yearly_perf": {
                    "avg": {
                        "field": "fields.performance.Year"
                    }
                },
                "avg_monthly_perf": {
                    "avg": {
                        "field": "fields.performance.Month"
                    }
                }
            }
        }
    }
}


// THE TWO NEXT ONE ARE USED TO FIND OCCURANCES OF TERMS

PUT /stocks/_mapping
{
    "properties": {
        "fields.company": {
            "type": "text",
            "fielddata": true
        }
    }
}

// AGGREGATING TERMS WITH OCCURANCE OF EACH DISTINCT
// COHERENT STRING WITHOUT WHITESPACE OR ESCAPE CHARACHTERS
GET /stocks/_search
{
    "size": 0,
    "aggs": {
        "occ_per_term_in_company_name": {
            "terms": {
                "field": "fields.company"
            }
        }
    }
}



// SAME AS ABOVE WITH DEFINING A MAP OF THE TEXT FIELD OF 
// COMPANIES, NOT NEEDED TO RUN AGAIN IF ALREADY DONE
//
PUT /stocks/_mapping
{
    "properties": {
        "fields.company": {
            "type": "text",
            "fielddata": true
        }
    }
}

// MOST SIGNIFICANT TERMS IN COMPANY NAMES FOR CHINESE COMPANIES
GET /stocks/_search
{
    "query": {
        "bool": {
            "must": {
                "match": {
                    "fields.description.Country": "China"
                }
            }
        }
    },
    "aggs": {
        "terms_significatifs": {
            "significant_terms": {
                "field": "fields.company"
            }
        }
    },
    "size":0
}


PUT stocks
{
  "mappings": {
    "fields": {
      "properties": {              // <--- HERE!
            "company": {
              "type": "string"
            },
            "price": {
              "type": "float"
            }
        }
      }
    }
  }
}

GET /stocks/_search
{
    "query": {
        "function_score": {
            "query": {
                "multi_match": {
                    "query": "petrol",
                    "fields": [
                        "company",
                        "description"
                    ]
                }
            },
            "field_value_factor": {
                "field": "price",
                "modifier": "log1p",
                "factor": 2
            }
        }
    }
}

GET /stocks/_search
{
    "size": 100,
    "query": {
        "function_score": {
            "query": {
                "multi_match": {
                    "query": "Information",
                    "fields": [
                        "fields.company",
                        "fields.description.Industry"
                    ]
                }
            },
            "functions": [
                {
                    "script_score": {
                        "script": "return Math.log(1 + doc['fields.price'].value * doc['fields.avg_vol'].value);"
                    }
                }
            ]
        }
    }
}
