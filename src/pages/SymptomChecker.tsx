
import { useState } from "react";
import { SymptomForm } from "@/components/symptom-checker/SymptomForm";
import { DiagnosisResults } from "@/components/symptom-checker/DiagnosisResults";
import { DiagnosisResult, SeverityLevel } from "@/types/health";
import { getMockDiagnosis } from "@/services/mockHealthData";
import { useToast } from "@/hooks/use-toast";
import { FeedbackForm } from "@/components/feedback/FeedbackForm";
import { saveHealthResult, saveFeedback } from "@/services/healthService";

const SymptomChecker = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosisResults, setDiagnosisResults] = useState<DiagnosisResult[] | null>(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [currentDiagnosisId, setCurrentDiagnosisId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCheckSymptoms = async (symptoms: string[], description: string) => {
    setIsLoading(true);
    
    try {
      // Get mock diagnosis for UI demonstration
      const results = await getMockDiagnosis(symptoms, description);
      setDiagnosisResults(results);
      
      // Check for severe conditions
      const hasSevereCondition = results.some(result => result.severity === "severe");
      if (hasSevereCondition) {
        toast({
          title: "Urgent Medical Attention",
          description: "Our analysis suggests you may need immediate medical attention.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze symptoms. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveResults = async () => {
    if (!diagnosisResults || !diagnosisResults.length) return;
    
    try {
      // Save the first (most likely) diagnosis to the database
      const result = diagnosisResults[0];
      const savedDiagnosis = await saveHealthResult({
        conditionName: result.conditionName,
        confidenceScore: result.confidenceScore,
        description: result.description,
        severity: result.severity,
        advice: result.advice
      });
      
      toast({
        title: "Results saved",
        description: "Your diagnosis results have been saved to your history.",
      });
      
      // Update current diagnosis ID for feedback
      if (savedDiagnosis) {
        setCurrentDiagnosisId(savedDiagnosis.id);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save results. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFeedback = (diagnosisId: string, isHelpful: boolean) => {
    setCurrentDiagnosisId(diagnosisId);
    setShowFeedbackForm(true);
  };

  const handleFormFeedback = async (isHelpful: boolean, comments: string) => {
    if (!currentDiagnosisId) return;
    
    try {
      await saveFeedback({
        diagnosisId: currentDiagnosisId,
        isHelpful,
        comments
      });
      
      toast({
        title: "Thank you!",
        description: "Your feedback has been recorded.",
      });
      
      setShowFeedbackForm(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setDiagnosisResults(null);
    setShowFeedbackForm(false);
    setCurrentDiagnosisId(null);
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      {!diagnosisResults ? (
        <SymptomForm onSubmit={handleCheckSymptoms} isLoading={isLoading} />
      ) : showFeedbackForm ? (
        <FeedbackForm onSubmit={handleFormFeedback} />
      ) : (
        <DiagnosisResults 
          results={diagnosisResults} 
          onSave={handleSaveResults} 
          onFeedback={handleFeedback} 
          onReset={handleReset}
        />
      )}
    </div>
  );
};

export default SymptomChecker;
