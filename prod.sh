#!/bin/bash
cd $HOME/server

msg () {
  echo -e "$1 \n -------------------- \n "
}

msg "stopping server!"
sudo pkill server

msg "pulling from github"
rm nohup.out
git pull

msg "building"
go build

msg "starting"
nohup sudo ./server &

echo
msg "Deploy finished \n Press Enter to exit"
read