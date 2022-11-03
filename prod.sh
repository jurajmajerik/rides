#!/bin/bash
cd $HOME/server

msg() {
  txt=""
  for i in {1..5}
    do
      if $i
      then
        txt="${txt}${$i} \n -------------------- \n "
      else
        break
      fi
    done
  echo -e $txt
}

msg "stopping server!"
sudo pkill server

echo -e "pulling from github \n -------------------- \n"
git pull

echo -e "building \n -------------------- \n"
go build

echo -e "starting \n -------------------- \n"
nohup sudo ./server &

echo
echo -e "starting \n Deploy finished \n Press Enter to exit"
read