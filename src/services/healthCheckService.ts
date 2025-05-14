
import { supabase } from "@/integrations/supabase/client";

export interface HealthStatus {
  status: "healthy" | "unhealthy";
  timestamp: string;
  version: string;
  environment: string;
  error?: string;
}

export const checkHealth = async (): Promise<HealthStatus> => {
  try {
    const { data, error } = await supabase.functions.invoke('health-check');
    
    if (error) {
      console.error('Health check failed:', error);
      return {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        version: "unknown",
        environment: "unknown",
        error: error.message
      };
    }
    
    return data as HealthStatus;
  } catch (error) {
    console.error('Health check exception:', error);
    return {
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      version: "unknown",
      environment: "unknown",
      error: error instanceof Error ? error.message : String(error)
    };
  }
};
