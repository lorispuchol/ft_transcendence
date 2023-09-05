NAME				= ft_transcendence

all:				${NAME}

run:				${NAME}

${NAME}:			
					docker-compose up --build
			
stop:		
					docker-compose stop

start:		
					docker-compose start

down:				
					docker-compose down --rmi all -v

clean:				down
					sh ./clean.sh

re: 				clean all

ub:
					sh ip.sh
					make

.PHONY: 			all run stop start down clean re