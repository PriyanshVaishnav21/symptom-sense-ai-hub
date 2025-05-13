

import { supabase } from '@/integrations/supabase/client';
import { MedicalReport } from '@/types/health';

export const getMedicalReports = async (): Promise<MedicalReport[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("User not authenticated");
    
    const { data, error } = await supabase
      .from('medical_reports')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data.map(item => ({
      id: item.id,
      userId: item.user_id,
      title: item.title,
      conditionName: item.condition_name,
      medications: item.medications,
      description: item.description,
      startDate: item.start_date,
      endDate: item.end_date,
      active: item.active,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));
  } catch (error) {
    console.error('Error fetching medical reports:', error);
    throw error;
  }
};

export const createMedicalReport = async (report: Omit<MedicalReport, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<MedicalReport> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("User not authenticated");
    
    const { data, error } = await supabase
      .from('medical_reports')
      .insert([{
        user_id: user.id,
        title: report.title,
        condition_name: report.conditionName,
        medications: report.medications,
        description: report.description,
        start_date: report.startDate,
        end_date: report.endDate,
        active: report.active
      }])
      .select()
      .single();

    if (error) throw error;
    
    return {
      id: data.id,
      userId: data.user_id,
      title: data.title,
      conditionName: data.condition_name,
      medications: data.medications,
      description: data.description,
      startDate: data.start_date,
      endDate: data.end_date,
      active: data.active,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error) {
    console.error('Error creating medical report:', error);
    throw error;
  }
};

export const updateMedicalReport = async (id: string, report: Partial<Omit<MedicalReport, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): Promise<MedicalReport> => {
  try {
    const updateData: any = {};
    
    if (report.title !== undefined) updateData.title = report.title;
    if (report.conditionName !== undefined) updateData.condition_name = report.conditionName;
    if (report.medications !== undefined) updateData.medications = report.medications;
    if (report.description !== undefined) updateData.description = report.description;
    if (report.startDate !== undefined) updateData.start_date = report.startDate;
    if (report.endDate !== undefined) updateData.end_date = report.endDate;
    if (report.active !== undefined) updateData.active = report.active;
    
    updateData.updated_at = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('medical_reports')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    return {
      id: data.id,
      userId: data.user_id,
      title: data.title,
      conditionName: data.condition_name,
      medications: data.medications,
      description: data.description,
      startDate: data.start_date,
      endDate: data.end_date,
      active: data.active,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error) {
    console.error('Error updating medical report:', error);
    throw error;
  }
};

export const deleteMedicalReport = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('medical_reports')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting medical report:', error);
    throw error;
  }
};
