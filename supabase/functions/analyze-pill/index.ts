
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import OpenAI from "https://esm.sh/openai@4.20.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { image } = await req.json();
    
    if (!image) {
      throw new Error('Image data is required');
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    });

    // Analyze the pill using OpenAI's vision model
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a pharmaceutical expert. Your task is to analyze images of medications and pills, identify them if possible, and provide detailed information about their purpose, recommended dosage, instructions for use, and any important warnings. Format your response as JSON with the following structure: {\"name\": \"Medication Name\", \"purpose\": \"What it's used for\", \"dosage\": \"Recommended dosage information\", \"instructions\": \"How to take it\", \"warnings\": [\"Warning 1\", \"Warning 2\"]}"
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Identify this pill/medication and provide details about it." },
            { type: "image_url", image_url: { url: image } }
          ]
        }
      ],
      response_format: { type: "json_object" },
    });
    
    // Extract the analysis result
    const analysisResult = JSON.parse(response.choices[0].message.content);
    
    console.log("Pill analysis completed successfully");
    
    return new Response(JSON.stringify({ 
      ...analysisResult, 
      imageUrl: image  // Include the image URL in the response
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error("Error analyzing pill:", error.message);
    
    return new Response(JSON.stringify({ 
      error: "Failed to analyze pill image", 
      details: error.message 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
