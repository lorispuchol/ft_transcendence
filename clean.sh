#!/bin/bash

docker system prune -af --volumes  				# Remove all unused containers, networks, images (both dangling and unreferenced), and optionally, volumes.
docker stop $(docker ps -aq)					# Stop all running containers
docker rm -fv $(docker ps -aq)					# Remove all containers
docker rmi -f $(docker images -qa)				# Remove all images
docker volume rm -f $(docker volume ls -q)		# Remove all volumes
docker network rm -f $(docker network ls -q)	# Remove all networks
echo "Done"