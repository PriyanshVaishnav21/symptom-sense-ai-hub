
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.20.1";

// Define types directly in the edge function instead of importing
type SeverityLevel = "mild" | "moderate" | "severe";

type DiagnosisResult = {
  id: string;
  conditionName: string;
  confidenceScore: number; // 0-100
  description: string;
  severity: SeverityLevel;
  advice: string;
  createdAt: Date | string;
};

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
    const { symptoms, description } = await req.json();
    
    if (!symptoms && !description) {
      throw new Error('Either symptoms or description is required');
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    });

    // Prepare the prompt for OpenAI
    const symptomsText = Array.isArray(symptoms) && symptoms.length > 0 
      ? `Symptoms reported: ${symptoms.join(', ')}. ` 
      : '';
    
    const descriptionText = description 
      ? `Patient description: ${description}. ` 
      : '';

    // Analyze the symptoms using OpenAI's GPT model
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an AI medical assistant that analyzes symptoms to suggest possible conditions. For each condition, provide a detailed diagnosis including condition name, confidence score (1-100), severity (mild, moderate, severe), description, and medical advice. Structure your response as a JSON array with objects containing these fields: conditionName, confidenceScore, severity, description, advice. Give 2-3 possible conditions based on the symptoms. Do not include any other text in your response besides the JSON array."
        },
        {
          role: "user",
          content: `${symptomsText}${descriptionText}Please analyze these symptoms and provide possible conditions.`
        }
      ],
      response_format: { type: "json_object" },
    });
    
    // Extract the analysis result
    const analysisContent = response.choices[0].message.content;
    let analysisResults: { conditions: DiagnosisResult[] };
    
    try {
      analysisResults = JSON.parse(analysisContent);
    } catch (e) {
      console.error('Failed to parse OpenAI response:', e);
      throw new Error('Failed to parse diagnosis results');
    }

    // Add IDs and timestamps to each result
    const now = new Date();
    const diagnosisResults = analysisResults.conditions.map(condition => ({
      ...condition,
      id: crypto.randomUUID(),
      createdAt: now,
    }));
    
    console.log("Symptom analysis completed successfully");
    
    return new Response(JSON.stringify(diagnosisResults), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error("Error analyzing symptoms:", error.message);
    
    return new Response(JSON.stringify({ 
      error: "Failed to analyze symptoms", 
      details: error.message 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
