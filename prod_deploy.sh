#!/bin/bash
SECONDS=0

cd $HOME/app

msg () {
  echo -e "$1\n--------------------\n"
}

msg "Stopping app"
sudo pkill app

msg "Pulling from GitHub"
git pull

msg "Building Go binary"
go build

msg "Starting server"
nohup sudo ./app &>/dev/null &

duration=$SECONDS

echo
msg "Deploy finished in $(($duration % 60)) seconds."
msg "Press Enter to exit"
read