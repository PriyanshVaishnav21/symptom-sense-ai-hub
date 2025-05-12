
#!/bin/bash

# Deploy the application

# 1. Deploy the Supabase functions
echo "Deploying Supabase functions..."
cd backend/supabase/functions
# Add your Supabase CLI commands here
# supabase functions deploy analyze-symptoms
# supabase functions deploy analyze-pill

# 2. Build the frontend
echo "Building the frontend..."
cd ../../../frontend
npm run build

# 3. Deploy the Docker container
echo "Building and deploying Docker container..."
cd ..
docker build -t symptom-sense-ai-hub .
# Add your Docker deployment commands here
# docker push yourregistry/symptom-sense-ai-hub:latest

echo "Deployment complete!"
