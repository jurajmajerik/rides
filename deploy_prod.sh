#!/bin/bash
cd $HOME/server

echo -e "stopping server \n --------------------"
sudo pkill server

echo -e "pulling from github \n --------------------"
git pull

echo -e "building \n --------------------"
go build

echo -e "starting \n --------------------"
sudo ./server &

echo
echo "Command finished"
echo "Press Enter to exit."
read