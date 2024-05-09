set -eu 

mongod --replSet sbm --bind_ip_all --port ${MONGODB_PORT} &
sleep 25

if [ "${IS_REPLICA}" = "0" ]; then
    mongosh -f ./initiate_replication.js || true
    
    sh ./tmp/add_test_users.sh || true

    python3 ./mock_data_gen.py -g 30 -s day -e day
fi

tail -f /dev/null
