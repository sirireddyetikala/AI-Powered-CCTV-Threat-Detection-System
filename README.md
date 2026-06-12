Analysis Backend

Backend API for analyzing dance videos using Google Gemini AI and PostgreSQL.

Features

Video Upload: Accept video files via multipart/form-data
AI Analysis: Analyze videos using Google Gemini 1.5 Flash/Pro
Database Storage: Store videos and analysis results in PostgreSQL
History: Retrieve analysis history for frontend display
RESTful API: Clean, documented API endpoints

Prerequisites

Node.js 18+ and npm
PostgreSQL 17 or compatible version
Google Gemini API Key Get from Google AI Studio

Setup Instructions

1. Install PostgreSQL

macOS:
brew install postgresql@17
brew services start postgresql@17

Windows/Linux:
Download from postgresql.org

2. Create Database

Access PostgreSQL
psql postgres

Create database
CREATE DATABASE nithya_analysis;

Create user optional
CREATE USER nithya_user WITH PASSWORD 'your_secure_password';

Grant privileges
GRANT ALL PRIVILEGES ON DATABASE nithya_analysis TO nithya_user;

Exit
\q

3. Run Database Schema

Run the schema file to create tables
psql -U postgres -d nithya_analysis -f database/schema.sql

Or if you created a user:
psql -U nithya_user -d nithya_analysis -f database/schema.sql

4. Configure Environment Variables

Edit the .env file:

PORT=5005
NODE_ENV=development

PostgreSQL Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nithya_analysis
DB_USER=postgres
DB_PASSWORD=your_password_here

Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

Get Gemini API Key:
1. Go to Google AI Studio
2. Create a new API key
3. Copy and paste into .env

5. Install Dependencies
npm install

6. Start the Server

Development mode with auto-reload:
npm run dev

Production mode:
npm run build
npm start

The server will start on http://localhost:5005

API Endpoints

POST /getanalysis
Upload and analyze a video

Request:
Method: POST
Content-Type: multipart/form-data
Body:
video: Video file required
prompt: Custom analysis prompt optional

Example using curl:
curl -X POST http://localhost:5005/getanalysis -F "video=@/path/to/dance-video.mp4"

Example with custom prompt:
curl -X POST http://localhost:5005/getanalysis -F "video=@/path/to/dance-video.mp4" -F "prompt=Focus on identifying Bharatanatyam mudras"

Response:
{
  "success": true,
  "message": "Video analysis completed successfully",
  "data": {
    "id": 1,
    "video_filename": "dance-video.mp4",
    "status": "completed",
    "gemini_response": {
      "analysis": {
        "danceForm": "Bharatanatyam",
        "movements": [...],
        "mudras": [...],
        "rating": 8.5
      }
    },
    "created_at": "2026-01-05T18:00:00Z"
  }
}

GET /history
Get analysis history

Query Parameters:
status: Filter by status pending, processing, completed, failed
limit: Number of results default: 50
offset: Pagination offset default: 0

Example:
curl http://localhost:5005/history?status=completed&limit=10

GET /analysis/:id
Get specific analysis by ID

DELETE /analysis/:id
Delete analysis and video file

GET /health
Health check endpoint

Project Structure

nithya-analysis-backend/
database/schema.sql
src/config/database.ts
src/config/multer.ts
src/controllers/analysisController.ts
src/middleware/errorHandler.ts
src/routes/analysisRoutes.ts
src/services/geminiService.ts
src/types/index.ts
src/server.ts
uploads/
.env
package.json
tsconfig.json
README.md

Testing the API

Using Frontend React:
const handleAnalysis = async (videoFile: File) => {
  const formData = new FormData();
  formData.append('video', videoFile);
  
  const response = await fetch('http://localhost:5005/getanalysis', {
    method: 'POST',
    body: formData
  });
  
  const data = await response.json();
  console.log(data);
};

Using Postman:
1. Create a new POST request to http://localhost:5005/getanalysis
2. Go to Body tab
3. Select form-data
4. Add key: video, type: File, select your video file
5. Click Send

Troubleshooting

Database Connection Failed
Check PostgreSQL is running: brew services list
Verify credentials in .env match your PostgreSQL setup
Test connection: psql -U postgres -d nithya_analysis

Gemini API Error
Verify your API key is correct
Check you have API quota available
Ensure video file size is under limits

File Upload Failed
Check uploads/ directory exists and is writable
Verify file size is under 100MB
Ensure MIME type is supported video format

Port Already in Use
Change PORT in .env to a different value
Or kill the process using port 5005

Notes

Video Storage: Videos are stored in uploads/ directory
Max File Size: 100MB configurable in src/config/multer.ts
Supported Formats: MP4, MPEG, MOV, AVI, MKV, WebM
Database: Analysis results include full Gemini response as JSONB

Security Considerations

For production deployment:
Use environment-specific .env files
Implement authentication/authorization
Add rate limiting
Validate file types more strictly
Use HTTPS
Sanitize user inputs
Set up proper CORS policies

License

ISC
nithya-analysis-backend
CrimeDetection_Backend
CrimeDetection_Backend
