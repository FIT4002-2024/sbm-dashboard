set -eu 

main() {
    local replica_flag=""
    if [ "${IS_CLUSTER_SETUP:-0}" = "1" ]; then 
        replica_flag="--replSet sbm" 
    fi
    mongod ${replica_flag} --bind_ip_all --port ${MONGODB_PORT:-27017} &
    sleep 30

    if [ "${IS_CLUSTER_SETUP:-0}" = "1" ]; then 
        mongosh -f ./initiate_replication.js || true
    fi

    sh ./tmp/add_test_users.sh || true
    python3 ./mock_data_gen.py -g 30 -s day -e day

    tail -f /dev/null
}

main
