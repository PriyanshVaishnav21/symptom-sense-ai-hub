
# Symptom Sense AI

This application consists of two main components:
- Frontend: React application for symptom checking and medication identification
- Backend: Supabase edge functions for AI-powered analysis

## Project Structure
- `/frontend`: Contains the React application
- `/backend`: Contains Supabase edge functions and database configuration
- `/nginx.conf`: Nginx configuration for hosting the frontend
- `/Dockerfile`: Docker configuration for building and deploying the application
- `/deploy.sh`: Deployment script for both frontend and backend

## Development
- For frontend development, navigate to the `/frontend` directory and run `npm run dev`
- For backend development, use Supabase CLI to develop and deploy edge functions

## Deployment
Run `./deploy.sh` to deploy both frontend and backend components.
