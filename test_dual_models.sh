#!/bin/bash

# Test script for dual model support
# This script demonstrates how to use both Gemini and Local models

echo "=================================="
echo "Dual Model Support - Test Script"
echo "=================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Server URL
SERVER="http://localhost:5005"

echo -e "${BLUE}Step 1: Check Available Models${NC}"
echo "GET $SERVER/models"
echo ""
curl -s "$SERVER/models" | python3 -m json.tool
echo ""
echo ""

echo -e "${BLUE}Step 2: Example - Analyze with Gemini AI${NC}"
echo "POST $SERVER/getanalysis"
echo "  - video: your_video.mp4"
echo "  - modelType: gemini"
echo "  - prompt: Analyze this Bharatanatyam performance"
echo ""
echo -e "${YELLOW}Command:${NC}"
echo 'curl -X POST http://localhost:5005/getanalysis \'
echo '  -F "video=@your_video.mp4" \'
echo '  -F "modelType=gemini" \'
echo '  -F "prompt=Analyze this Bharatanatyam performance"'
echo ""
echo ""

echo -e "${BLUE}Step 3: Example - Analyze with Local Model${NC}"
echo "POST $SERVER/getanalysis"
echo "  - video: your_video.mp4"
echo "  - modelType: local"
echo ""
echo -e "${YELLOW}Command:${NC}"
echo 'curl -X POST http://localhost:5005/getanalysis \'
echo '  -F "video=@your_video.mp4" \'
echo '  -F "modelType=local"'
echo ""
echo ""

echo -e "${BLUE}Step 4: Check Analysis History${NC}"
echo "GET $SERVER/history"
echo ""
echo -e "${YELLOW}Command:${NC}"
echo "curl -s $SERVER/history | python3 -m json.tool"
echo ""
echo ""

echo -e "${GREEN}✅ Test script completed!${NC}"
echo ""
echo "To run an actual analysis, replace 'your_video.mp4' with a real video file path."
echo "Example:"
echo '  curl -X POST http://localhost:5005/getanalysis -F "video=@dance.mp4" -F "modelType=local"'
echo ""
