mongod & \
    sleep 25 && \
    python3 ./mock_data_gen.py -g 30 -s day -e day && \
    tail -f /dev/null



