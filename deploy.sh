#!/bin/bash
sshcmd="ssh juraj@app.jurajmajerik.com"
$sshcmd "bash -c 'cd /home/juraj/server;git pull'"
