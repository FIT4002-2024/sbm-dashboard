rs.initiate({
    _id: "sbm",
    members: [
        { 
            _id: 0,
            host: "initial_primary:27017",
            priority: 1
        },
        { 
            _id: 1, 
            host: "replica_1:27018",
            priority: 0
        },
        { 
            _id: 2, 
            host: "replica_2:27019",
            priority: 0
        }
    ]
}) 

database = connect("mongodb://initial_primary:27017,replica_1:27018,replica_2:27019/sbm_dashboard?replicaSet=sbm");
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
