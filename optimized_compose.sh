set -xeu 

project_root="$(pwd)"

main() {
    cd "${project_root}"/backend/database_client_rs/
    cargo build
    cd "${project_root}"/backend/alerter/
    cargo build
    cd "${project_root}"/backend/mqtt_broker/pusher/
    cargo build 
    
    cd "${project_root}"
    docker compose up --build
}

cleanup() {
    cd "${project_root}"
    docker compose down
    sudo docker image prune -f
}
trap cleanup EXIT
trap cleanup INT

main
