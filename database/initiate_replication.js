rs.initiate({
    _id: "sbm",
    members: [
        { 
            _id: 0,
            host: "sbm_database_1:27017",
            priority: 1
        },
        { 
            _id: 1, 
            host: "sbm_database_2:27018",
            priority: 0
        },
        { 
            _id: 2, 
            host: "sbm_database_3:27019",
            priority: 0
        }
    ]
}) 

database = connect("mongodb://sbm_database_1:27017,sbm_database_2:27018,sbm_database_3:27019/sbm_dashboard?replicaSet=sbm");
database.users.insertOne(
    { 
        "username" : "test-user", 
        "password" : "PBKDF2\$sha512\$100000\$8CdoYDf8d5m7gbSPyT8Tcw==\$Q+336Nlze3F6eqgBjX5fhAKmydISgnhLbJzmQskgfMKTR2dd4uAKn6imwezgT4IlCe9l0OGRX1CaMfsSlymYWw==", 
        "superuser" : false, 
        "acls" : [
            { "topic" : "ibm/temperature", "acc" : 3 }, 
            { "topic" : "ibm/temperature", "acc" : 4 }
        ] 
    }
)
