"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useNotification } from "@/hooks/use-notification";
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileText,
  Calendar
} from "lucide-react";

export function VisaTracker({ visaId, workerId }) {
  const [visa, setVisa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progressValue, setProgressValue] = useState(0);
  
  const supabase = createClientComponentClient();
  const { toast } = useToast();
  const { addNotification } = useNotification();
  
  useEffect(() => {
    const fetchVisa = async () => {
      setLoading(true);
      
      const { data, error } = await supabase
        .from("visa_applications")
        .select(`
          *,
          visa_type:visa_types(*),
          worker:workers(name),
          stages:visa_stages(*)
        `)
        .eq("id", visaId)
        .single();
        
      if (error) {
        console.error("Error fetching visa:", error);
        toast({
          title: "Error",
          description: "Failed to load visa application",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
      setVisa(data);
      
      // Calculate progress based on completed stages
      if (data.stages && data.stages.length > 0) {
        const completedStages = data.stages.filter(
          stage => stage.status === "completed"
        ).length;
        const totalStages = data.stages.length;
        setProgressValue(Math.round((completedStages / totalStages) * 100));
      }
      
      setLoading(false);
    };
    
    if (visaId) {
      fetchVisa();
    }
  }, [visaId]);
  
  const handleStageUpdate = async (stageId, newStatus) => {
    const { data, error } = await supabase
      .from("visa_stages")
      .update({ 
        status: newStatus,
        completed_at: newStatus === "completed" ? new Date().toISOString() : null
      })
      .eq("id", stageId);
      
    if (error) {
      console.error("Error updating visa stage:", error);
      toast({
        title: "Error",
        description: "Failed to update visa stage",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Success",
      description: `Visa stage updated to ${newStatus}`,
    });
    
    // Create notification for the worker
    addNotification({
      user_id: workerId,
      title: "Visa Application Update",
      message: `Your visa application stage has been updated to: ${newStatus}`,
      type: newStatus === "completed" ? "success" : 
            newStatus === "failed" ? "error" : "info",
      related_to: "visa",
      related_id: visaId,
    });
    
    // Refresh visa data
    fetchVisa();
  };
  
  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "in_progress":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "pending":
        return <Clock className="h-5 w-5 text-gray-500" />;
      case "failed":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };
  
  if (loading) {
    return <div>Loading visa application...</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Visa Application</h2>
        <Badge variant={
          visa?.status === "approved" ? "success" :
          visa?.status === "rejected" ? "destructive" :
          visa?.status === "processing" ? "warning" : "default"
        }>
          {visa?.status || "Unknown"}
        </Badge>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Application Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{progressValue}%</span>
            </div>
            <Progress value={progressValue} />
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-500">Submitted:</span>
              <span className="text-sm font-medium">
                {new Date(visa?.created_at).toLocaleDateString()}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-500">Expected Completion:</span>
              <span className="text-sm font-medium">
                {visa?.expected_completion_date ? 
                  new Date(visa.expected_completion_date).toLocaleDateString() : 
                  "Not set"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="stages">
        <TabsList>
          <TabsTrigger value="stages">Processing Stages</TabsTrigger>
          <TabsTrigger value="documents">Required Documents</TabsTrigger>
          <TabsTrigger value="details">Application Details</TabsTrigger>
        </TabsList>
        
        <TabsContent value="stages">
          <Card>
            <CardHeader>
              <CardTitle>Visa Processing Stages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {visa?.stages?.map((stage, index) => (
                  <div key={stage.id} className="flex items-start gap-4 p-3 border rounded-lg">
                    <div className="mt-1">
                      {getStatusIcon(stage.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{stage.name}</h4>
                        <Badge variant={
                          stage.status === "completed" ? "success" :
                          stage.status === "in_progress" ? "outline" :
                          stage.status === "failed" ? "destructive" : "secondary"
                        }>
                          {stage.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{stage.description}</p>
                      
                      {stage.completed_at && (
                        <p className="text-xs text-gray-400 mt-2">
                          Completed on: {new Date(stage.completed_at).toLocaleString()}
                        </p>
                      )}
                      
                      {stage.status !== "completed" && stage.status !== "failed" && (
                        <div className="mt-2 flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleStageUpdate(stage.id, "in_progress")}
                            disabled={stage.status === "in_progress"}
                          >
                            Mark In Progress
                          </Button>
                          <Button 
                            size="sm" 
                            variant="success"
                            onClick={() => handleStageUpdate(stage.id, "completed")}
                          >
                            Complete
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleStageUpdate(stage.id, "failed")}
                          >
                            Mark Failed
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Required Documents</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Document requirements and upload functionality */}
              <p>Document requirements will be implemented here</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Application Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Visa Type</h4>
                  <p>{visa?.visa_type?.name || "Unknown"}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Applicant</h4>
                  <p>{visa?.worker?.name || "Unknown"}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Purpose</h4>
                  <p>{visa?.purpose || "Not specified"}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Duration</h4>
                  <p>{visa?.duration || "Not specified"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}