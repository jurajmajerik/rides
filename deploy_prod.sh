#!/bin/bash
cd $HOME/server

echo -e "stopping server \n -------------------- \n"
sudo pkill server

echo -e "pulling from github \n -------------------- \n"
git pull

echo -e "building \n -------------------- \n"
go build

echo -e "starting \n -------------------- \n"
sudo ./server &

echo
echo "Command finished"
echo "Press Enter to exit."
read