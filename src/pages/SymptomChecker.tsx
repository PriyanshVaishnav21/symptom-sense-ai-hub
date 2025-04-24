
import { useState } from "react";
import { SymptomForm } from "@/components/symptom-checker/SymptomForm";
import { DiagnosisResults } from "@/components/symptom-checker/DiagnosisResults";
import { DiagnosisResult } from "@/types/health";
import { getMockDiagnosis } from "@/services/mockHealthData";
import { useToast } from "@/components/ui/toaster";
import { FeedbackForm } from "@/components/feedback/FeedbackForm";

const SymptomChecker = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosisResults, setDiagnosisResults] = useState<DiagnosisResult[] | null>(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const { toast } = useToast();

  const handleCheckSymptoms = async (symptoms: string[], description: string) => {
    setIsLoading(true);
    
    try {
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

  const handleSaveResults = () => {
    // In a real app, this would save to a database
    toast({
      title: "Results saved",
      description: "Your diagnosis results have been saved to your history.",
    });
  };

  const handleFeedback = (diagnosisId: string, isHelpful: boolean) => {
    // In a real app, this would save feedback to a database
    toast({
      title: "Thank you!",
      description: "Your feedback has been recorded.",
    });
    setShowFeedbackForm(true);
  };

  const handleFormFeedback = (isHelpful: boolean, comments: string) => {
    // In a real app, this would save detailed feedback to a database
    console.log("Feedback received:", { isHelpful, comments });
    setShowFeedbackForm(false);
  };

  const handleReset = () => {
    setDiagnosisResults(null);
    setShowFeedbackForm(false);
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
