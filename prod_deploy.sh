#!/bin/bash
SECONDS=0

cd $HOME/app

msg () {
  echo -e "\n$1\n--------------------\n"
}

msg "Pulling from Github"
git pull

msg "Building the 'server' image"
sudo docker build --tag server .

msg "Stopping containers"
sudo docker compose down

msg "Starting containers"
sudo docker compose up -d

msg "Pruning stale Docker images"
sudo docker image prune -f

duration=$SECONDS

echo
msg "Deploy finished in $(($duration % 60)) seconds."
msg "Press Enter to exit"
read