#!/bin/bash

docker system prune -af
docker stop $(docker ps -aq)
docker rm -fv $(docker ps -aq)
docker rmi -f $(docker images -qa)
docker volume rm -f $(docker volume ls -q)
#docker network rm -f $(docker network ls -q)
echo "Done"