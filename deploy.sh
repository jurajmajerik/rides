#!/bin/bash
sshcmd="ssh -t juraj@app.jurajmajerik.com"
$sshcmd screen -S "deployment" bash /home/juraj/app/prod.sh
