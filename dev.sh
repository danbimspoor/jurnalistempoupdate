#!/bin/bash
# Seed the database if not exists
npx wrangler d1 execute news_db --local --file=./schema.sql || true
# Start wrangler pages dev
npx wrangler pages dev dist --port 3000 --ip 0.0.0.0 --local
