#!/bin/bash
SECONDS=0

cd $HOME/rides

msg () {
  echo -e "\n$1\n--------------------\n"
}

msg "Pulling from Github"
git pull

msg "App | Building images"
sudo docker compose build

msg "App | Stopping containers"
sudo docker compose down --remove-orphans

msg "App | Starting containers"
sudo docker compose up -d

# Prometheus + Grafana
cd $HOME/rides/monitor

msg "Monitor | Building images"
sudo docker compose -f ./docker-compose-linux.yml build

msg "Monitor | Stopping containers"
sudo docker compose -f ./docker-compose-linux.yml down --remove-orphans

msg "Monitor | Starting containers"
sudo docker compose -f ./docker-compose-linux.yml up -d

msg "Monitor | Pruning stale Docker images"
sudo docker image prune -f

cd $HOME/rides

duration=$SECONDS

echo
msg "Deploy finished in $(($duration % 60)) seconds."
msg "Press Enter to exit"
read