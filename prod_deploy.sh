#!/bin/bash
SECONDS=0

cd $HOME/rides

msg () {
  echo -e "\n$1\n--------------------\n"
}

msg "Pulling from Github"
git pull

msg "Building images"
sudo docker compose build

msg "Stopping containers"
sudo docker compose down --remove-orphans

msg "Starting containers"
sudo docker compose up -d

msg "Pruning stale Docker images"
sudo docker image prune -f

duration=$SECONDS

echo
msg "Deploy finished in $(($duration % 60)) seconds."
msg "Press Enter to exit"
read