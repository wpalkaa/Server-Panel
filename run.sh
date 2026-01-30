#!/bin/bash

cleanup() {
    echo "============ Stopping services ============"

    if [ -n "$FRONTEND_PID" ]; then
        echo "Stopping frontend $$FRONTEND_PID..."
        kill $FRONTEND_PID
    fi

    if [ -n "$BACKEND_PID" ]; then
        echo "Stopping backend $$BACKEND_PID..."
        kill $BACKEND_PID
    fi

    echo "Stopping database..."
    cd backend/data || exit
    docker-compose down
    cd ../..

    echo "============ All services stopped ============"

    exit 0
}

mkdir logs

echo "Starting frontend..."
cd frontend || exit
npm run dev > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend started with PID $FRONTEND_PID"

echo "Starting backend..."
cd ../backend || exit
node src/server.js > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend started with PID $BACKEND_PID"

echo "Starting database..."
cd data || exit
docker-compose up -d > ../../logs/database.log 2>&1 &
cd ../..

echo "Running:"
echo "Frontend PID: $FRONT_PID"
echo "Backend PID: $BACK_PID"
echo "Logs in ./logs"
echo " - frontend.log"
echo " - backend.log"
echo " - database.log"

echo "Type 'stop' to stop all services."
while true; do
    read input
    if [ $input == "stop" ]; then
        cleanup
    fi
done
