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
