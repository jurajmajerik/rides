#!/bin/bash
cd frontend
npm run build
cd ..
sshcmd="ssh -t juraj@app.jurajmajerik.com"
$sshcmd screen -S "deployment" /home/juraj/app/prod_deploy.sh
