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

    echo "Stopping database and broker..."
    cd backend/data || exit
    docker-compose down
    cd ../..

    echo "============ All services stopped ============"

    exit 0
}
trap cleanup SIGINT SIGTERM

mkdir -p logs


echo "============ Installing Dependencies ============"

echo "1/2 Installing Backend dependencies..."
cd backend || exit
npm install
if [ $? -ne 0 ]; then
    echo "Error installing backend dependencies!"
    exit 1
fi
cd ..

echo "2/2 Installing Frontend dependencies..."
cd frontend || exit
npm install
if [ $? -ne 0 ]; then
    echo "Error installing frontend dependencies!"
    exit 1
fi
cd ..

echo "============ Starting Services ============"


echo "Starting database and broker..."
cd backend/data || exit
docker-compose up -d > ../../logs/containers.log 2>&1 &
cd ../..

echo "Starting frontend..."
cd frontend || exit
npm run dev > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend started with PID $FRONTEND_PID"
sleep 5

echo "Starting backend..."
cd .. || exit
echo "Copying frontend TLS certificate to backend..."
cp frontend/certificates/localhost.pem backend/localhost.pem
cp frontend/certificates/localhost-key.pem backend/localhost-key.pem
cd backend || exit
node src/server.js > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend started with PID $BACKEND_PID"
cd ..




echo ""
echo "============ Status ============"
echo "Frontend PID: $FRONTEND_PID; Access at https://localhost:3000"
echo "Backend PID:  $BACKEND_PID"
echo "Logs available in ./logs directory"
echo "================================"


echo "Type 'stop' to stop all services."

while true; do
    read input
    if [ $input == "stop" ]; then
        cleanup
    else
        echo "Unknown command: $input. Type 'stop' to stop all services."
    fi
done
