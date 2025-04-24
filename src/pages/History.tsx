
import { useState, useEffect } from "react";
import { HistoryDashboard } from "@/components/user/HistoryDashboard";
import { DiagnosisResult } from "@/types/health";
import { useToast } from "@/components/ui/toaster";

// Mock history data for demonstration
const MOCK_HISTORY: DiagnosisResult[] = [
  {
    id: "1",
    conditionName: "Tension headache",
    confidenceScore: 85,
    description: "Tension headaches are the most common type of headache and can cause mild to moderate pain in your head, neck, and behind your eyes.",
    severity: "mild",
    advice: "Rest in a quiet, dark room. Try over-the-counter pain relievers like acetaminophen or ibuprofen. Apply a cold compress to your forehead.",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
  },
  {
    id: "2",
    conditionName: "Common cold",
    confidenceScore: 78,
    description: "A viral infection of the upper respiratory tract, including the nose and throat.",
    severity: "mild",
    advice: "Get plenty of rest. Stay hydrated. Use over-the-counter fever reducers like acetaminophen or ibuprofen.",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days ago
  },
  {
    id: "3",
    conditionName: "Possible angina",
    confidenceScore: 65,
    description: "Angina is chest pain caused by reduced blood flow to the heart muscles.",
    severity: "severe",
    advice: "Seek immediate medical attention. This could be a sign of a serious heart condition that requires prompt evaluation.",
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString() // 14 days ago
  }
];

const History = () => {
  const [history, setHistory] = useState<DiagnosisResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate API call to fetch history
    const fetchHistory = () => {
      setTimeout(() => {
        setHistory(MOCK_HISTORY);
        setIsLoading(false);
      }, 1000);
    };

    fetchHistory();
  }, []);

  const handleDeleteRecord = (id: string) => {
    setHistory(history.filter(item => item.id !== id));
    
    toast({
      title: "Record deleted",
      description: "The health record has been removed from your history.",
    });
  };

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-pulse mb-4 h-8 w-32 bg-muted rounded mx-auto"></div>
            <div className="animate-pulse h-4 w-48 bg-muted rounded mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <HistoryDashboard history={history} onDelete={handleDeleteRecord} />
    </div>
  );
};

export default History;
