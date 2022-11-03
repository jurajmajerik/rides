#!/bin/bash
cd $HOME/server
echo "----stopping server"
sudo pkill server

echo "----pulling"
git pull

echo "----building"
go build

echo "----starting"
sudo ./server &

echo
echo "Command finished, exit status: $status"
echo "Press Enter to exit."
read