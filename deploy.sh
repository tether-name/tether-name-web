#!/bin/bash
set -euo pipefail

PROJECT_ID="tether-name"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "📦 Installing dependencies..."
npm ci

echo "🔨 Building..."
npm run build

echo "🚀 Deploying to Firebase Hosting..."
export GOOGLE_APPLICATION_CREDENTIALS="${SCRIPT_DIR}/../tether-name-service/src/main/resources/tether-name-firebase-adminsdk.json"
firebase deploy --only hosting --project "$PROJECT_ID"

echo "✅ Frontend deployed!"
