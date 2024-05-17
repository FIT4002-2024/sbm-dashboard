set -xeu 

project_root="$(pwd)"

main() {
    cd "${project_root}"/backend/alerter/
    cargo build
    cd "${project_root}"/backend/mqtt_broker/pusher/
    cargo build 
    
    cd "${project_root}"
    docker compose up --build
}

on_exit() {
    cd "${project_root}"
    docker compose down
    sudo docker image prune -f
}
trap on_exit EXIT

main
