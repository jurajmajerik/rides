#!/bin/bash
SECONDS=0

cd $HOME/server


msg () {
  echo -e "$1\n--------------------\n"
}

msg "stopping server"
sudo pkill server

msg "pulling from github"
rm nohup.out
git pull

msg "building"
go build

msg "starting"
nohup sudo ./server &

duration=$SECONDS

echo
msg "Deploy finished in $(($duration / 60)) in minutes and $(($duration % 60)) seconds."
msg "Press Enter to exit"
read