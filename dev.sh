#!/bin/bash
# Run wrangler in background on port 8788
npx wrangler pages dev . --port 8788 --ip 0.0.0.0 --local --inspector-port 0 &
# Run vite in foreground, passing all arguments (like --port 3000)
npx vite "$@"
