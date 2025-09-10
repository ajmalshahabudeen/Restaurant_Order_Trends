#!/bin/bash

# ----------------------------
# Run PHP API and Frontend
# ----------------------------

# Colors for output
GREEN="\033[0;32m"
NC="\033[0m" # No Color

# Function to run PHP API
run_php_api() {
    echo -e "${GREEN}Starting PHP API on http://localhost:8000...${NC}"
    cd api || { echo "API folder not found"; exit 1; }
    php -S localhost:8000
}

# Function to run frontend
run_frontend() {
    cd frontend || { echo "Frontend folder not found"; exit 1; }

if command -v bun >/dev/null 2>&1; then
    echo -e "${GREEN}Installing dependencies with bun...${NC}"
    bun install && echo -e "${GREEN}Starting frontend with bun dev...${NC}" && bun dev
else
    echo -e "${GREEN}Installing dependencies with npm...${NC}"
    npm install && echo -e "${GREEN}Starting frontend with npm run dev...${NC}" && npm run dev
fi

}

# Run both processes concurrently using & and wait
run_php_api &
PHP_PID=$!

run_frontend &
FRONTEND_PID=$!

# Trap CTRL+C to kill both processes
trap "echo 'Stopping...'; kill $PHP_PID $FRONTEND_PID; exit" INT

# Wait for both processes
wait $PHP_PID $FRONTEND_PID
