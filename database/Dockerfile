FROM ubuntu:jammy

# mongo install
RUN apt update && \
    apt-get install -y gnupg curl && \
    curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
        gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor && \
    echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
        tee /etc/apt/sources.list.d/mongodb-org-7.0.list && \
    apt-get update && \
    apt-get install -y mongodb-org=7.0.7 mongodb-org-database=7.0.7 \
        mongodb-org-server=7.0.7 mongodb-mongosh=2.2.5 mongodb-org-mongos=7.0.7 \
        mongodb-org-tools=7.0.7 && \
    echo "mongodb-org hold" | dpkg --set-selections && \
    echo "mongodb-org-database hold" | dpkg --set-selections && \
    echo "mongodb-org-server hold" | dpkg --set-selections && \
    echo "mongodb-mongosh hold" | dpkg --set-selections && \
    echo "mongodb-org-mongos hold" | dpkg --set-selections && \
    echo "mongodb-org-tools hold" | dpkg --set-selections
    # systemctl daemon-reload && \
    
# python setup
RUN apt update && \
    apt install -y python3 && \
    apt install -y python3-pip && \
    pip install pymongo

# data population
RUN mkdir -p /data/db
RUN mongod &
EXPOSE 27017

COPY mock_data_gen.py .
CMD ["python", "./mock_data_gen.py", "-g", "10", "-s", "week", "-e", "month"]