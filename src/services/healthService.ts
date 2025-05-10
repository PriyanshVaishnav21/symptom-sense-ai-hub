
import { supabase } from '@/integrations/supabase/client';
import { DiagnosisResult, UserFeedback, SeverityLevel } from '@/types/health';

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

export const saveFeedback = async (feedback: Omit<UserFeedback, 'id' | 'createdAt'>) => {
  try {
    // Get the current user's ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("User not authenticated");
    
    const { data, error } = await supabase
      .from('user_feedback')
      .insert({
        diagnosis_id: feedback.diagnosisId,
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
