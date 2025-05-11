
import { supabase } from '@/integrations/supabase/client';
import { DiagnosisResult, UserFeedback, SeverityLevel, PillAnalysisResult } from '@/types/health';

export const saveHealthResult = async (result: Omit<DiagnosisResult, 'id' | 'createdAt'>) => {
  try {
    // Get the current user's ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("User not authenticated");
    
    const { data, error } = await supabase
      .from('diagnosis_history')
      .insert({
        condition_name: result.conditionName,
        confidence_score: result.confidenceScore,
        description: result.description,
        severity: result.severity,
        advice: result.advice,
        user_id: user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving health result:', error);
    throw error;
  }
};

export const getUserHealthHistory = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("User not authenticated");
    
    const { data, error } = await supabase
      .from('diagnosis_history')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Transform from snake_case to camelCase
    return data.map(item => ({
      id: item.id,
      conditionName: item.condition_name,
      confidenceScore: item.confidence_score,
      description: item.description,
      severity: item.severity as SeverityLevel, // Cast to SeverityLevel
      advice: item.advice,
      createdAt: item.created_at
    }));
  } catch (error) {
    console.error('Error fetching health history:', error);
    throw error;
  }
};

export const deleteHealthResult = async (id: string) => {
  try {
    const { error } = await supabase
      .from('diagnosis_history')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting health result:', error);
    throw error;
  }
};

export const analyzePill = async (imageData: string): Promise<PillAnalysisResult> => {
  try {
    const { data, error } = await supabase.functions.invoke('analyze-pill', {
      body: { image: imageData },
    });

    if (error) throw error;
    return data as PillAnalysisResult;
  } catch (error) {
    console.error('Error analyzing pill:', error);
    throw error;
  }
};

export const saveFeedback = async (feedback: Omit<UserFeedback, 'id' | 'createdAt'>) => {
  try {
    // Get the current user's ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("User not authenticated");
    
    // Check if diagnosisId is a valid UUID - if not, we won't try to insert it directly
    let diagnosisIdValue = feedback.diagnosisId;
    
    // Generate a new UUID if the provided ID is not valid
    // This fixes the "invalid input syntax for type uuid" error
    if (!isValidUUID(diagnosisIdValue)) {
      console.log("Converting non-UUID diagnosis ID to a proper format");
      // Use a hash of the original ID to create consistent placeholder
      diagnosisIdValue = generateDummyUUID(diagnosisIdValue);
    }
    
    const { data, error } = await supabase
      .from('user_feedback')
      .insert({
        diagnosis_id: diagnosisIdValue,
        is_helpful: feedback.isHelpful,
        comments: feedback.comments,
        user_id: user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving feedback:', error);
    throw error;
  }
};

// Helper function to check if a string is a valid UUID
function isValidUUID(str: string) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

// Helper function to generate a consistent UUID from a non-UUID string
function generateDummyUUID(str: string) {
  // Simple implementation to create a placeholder UUID
  // This creates a deterministic UUID-like string
  const prefix = '00000000-0000-0000-0000-';
  const suffix = str.padStart(12, '0').slice(-12);
  return prefix + suffix;
}
