#!/bin/bash
cd $HOME/server

msg () {
  echo -e "${$1} \n -------------------- \n "
}

msg "stopping server!"
sudo pkill server

echo -e "pulling from github \n -------------------- \n"
rm nohup.out
git pull

echo -e "building \n -------------------- \n"
go build

echo -e "starting \n -------------------- \n"
nohup sudo ./server &

echo
echo -e "starting \n Deploy finished \n Press Enter to exit"
read