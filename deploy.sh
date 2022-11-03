#!/bin/bash
# sshcmd="ssh juraj@app.jurajmajerik.com"
# $sshcmd "screen -S deployment"
# $sshcmd screen -ls | grep deployment
# $sshcmd "bash -c 'cd /home/juraj/server;git pull'"

$sshcmd screen -S deployment /home/juraj/server/deploy_prod.sh
