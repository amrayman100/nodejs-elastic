exports.developmentEmployees = {
    
        "query": {
          "parent_id": {
            "type": "employee",
            "id": 1
          }
    }
}

exports.developmentEmployees2 = {
    
    "query": {
        "has_parent": {
          "parent_type": "department",
          "score": true,
          "query": {
            "term": {
              "name.keyword": "Development"
            }
          }
        }
      }
}
