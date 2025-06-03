#!/bin/bash

echo "💣 Killing all automation frameworks-related processes"

MASKS=("playwright" "npm exec playwright" "playwright_chromiumdev_profile" "node.*playwright" "node.*ganache" "ganache" "wdio" "node.*wdio" "chromedriver" "geckodriver" "safaridriver" "node.*mocha" "node.*testrunner" "node.*selenium" "node.*webdriver" "cypress" "Cypress" "node.*cypress")

for MASK in "${MASKS[@]}"; do
  PIDS=$(pgrep -f "$MASK")
  if [ -n "$PIDS" ]; then
    for PID in $PIDS; do
      echo "❌ Killing PID $PID (matched by '$MASK')"
      kill -9 $PID 2>/dev/null
    done
  fi
done

echo "✅ All matching automation frameworks processes killed."
