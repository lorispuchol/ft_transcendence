npm install -g serve
npm run build
serve -s build -l $REACT_APP_CLIENT_PORT > /dev/null 2>&1