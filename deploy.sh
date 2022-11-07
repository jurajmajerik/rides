#!/bin/bash
sshcmd="ssh -t juraj@app.jurajmajerik.com"
$sshcmd screen -S "deployment" /home/juraj/app/prod_deploy.sh
