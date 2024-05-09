rs.initiate({
    _id: "sbm",
    members: [
        { _id: 0, host: "initial_primary:27017" },
        { _id: 1, host: "replica_1:27018" },
        { _id: 2, host: "replica_2:27019" }
    ]
}) 
