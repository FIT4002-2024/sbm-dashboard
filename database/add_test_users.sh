cat <<- EOF > /tmp/add_test_users.js
    database = connect("mongodb://localhost:${MONGODB_PORT}/sbm_dashboard");
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
EOF
mongosh -f /tmp/add_test_users.js --port "${MONGODB_PORT}"
