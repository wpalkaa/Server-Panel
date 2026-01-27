#!/bin/bash

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

wait
