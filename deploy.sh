#!/bin/bash
cd frontend
npm run build
sshcmd="ssh -t juraj@app.jurajmajerik.com"
$sshcmd screen -S "deployment" /home/juraj/app/prod_deploy.sh
