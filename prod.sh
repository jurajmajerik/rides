#!/bin/bash
SECONDS=0

cd $HOME/app

msg () {
  echo -e "$1\n--------------------\n"
}

msg "stopping app"
sudo pkill app

msg "pulling from github"
git pull

msg "building"
go build

msg "starting"
nohup sudo ./app &>/dev/null &

duration=$SECONDS

echo
msg "Deploy finished in $(($duration % 60)) seconds."
msg "Press Enter to exit"
read