exports.orderStats = {
    "size": 0,
    "aggs": {
      "status_terms": {
        "terms": {
          "field": "status"
        },
        "aggs": {
          "status_stats": {
            "stats": {
              "field": "total_amount"
            }
          }
        }
      }
    }
}