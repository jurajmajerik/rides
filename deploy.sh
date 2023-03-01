#!/bin/bash
cd frontend
npm run build
cd ..
git add .
git commit -m "build"
git push
sshcmd="ssh -t juraj@rides.jurajmajerik.com"
$sshcmd screen -S "deployment" /home/juraj/rides/prod_deploy.sh
