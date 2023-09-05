#!/bin/bash

IP=$(ip r | grep -m 1 "src" | awk '/src/ {print $9}')
sed -i "/^SERVER_HOST=/c\SERVER_HOST='$IP'" .env.credential
