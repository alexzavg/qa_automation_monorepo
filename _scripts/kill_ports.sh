#!/bin/bash

# Array of ports to free up
PORTS=(9323 63293 3000 4723)  # Add more ports here if needed, space-separated

for PORT in "${PORTS[@]}"; do
  PIDS=$(lsof -t -i:$PORT)
  if [ -n "$PIDS" ]; then
    echo "Killing processes on port $PORT: $PIDS"
    kill -9 $PIDS
  else
    echo "No process found using port $PORT"
  fi
done

