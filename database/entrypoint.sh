set -eu 

main() {
    local is_cluster_setup=1
    if [ "${IS_REPLICA:--1}" = -1 ]; then
        is_cluster_setup=0
    fi 

    local replica_flag=""
    if [ "${is_cluster_setup}" = 1 ]; then 
        replica_flag="--replSet sbm" 
    fi
    mongod ${replica_flag} --bind_ip_all --port ${MONGODB_PORT:-27017} &
    sleep 30

    if [ "${is_cluster_setup}" = 1 ]; then 
        if [ "${IS_REPLICA}" = 0 ]; then
            mongosh -f ./initiate_replication.js || true
            sh ./tmp/add_test_users.sh || true
            python3 ./mock_data_gen.py -g 30 -s day -e day
        else
            sleep 10 
        fi
    else
        sh ./tmp/add_test_users.sh || true
        python3 ./mock_data_gen.py -g 30 -s day -e day
    fi

    tail -f /dev/null
}

main
