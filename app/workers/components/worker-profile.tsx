"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { useNotification } from "@/hooks/use-notification";

export function WorkerProfile({ workerId }) {
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    nationality: "",
    passport_number: "",
    passport_expiry: "",
    // Add more fields as needed
  });
  
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { toast } = useToast();
  const { addNotification } = useNotification();
  
  useEffect(() => {
    const fetchWorker = async () => {
      setLoading(true);
      
      const { data, error } = await supabase
        .from("workers")
        .select("*")
        .eq("id", workerId)
        .single();
        
      if (error) {
        console.error("Error fetching worker:", error);
        toast({
          title: "Error",
          description: "Failed to load worker profile",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
      setWorker(data);
      setFormData({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        nationality: data.nationality || "",
        passport_number: data.passport_number || "",
        passport_expiry: data.passport_expiry || "",
        // Set more fields as needed
      });
      
      setLoading(false);
    };
    
    if (workerId) {
      fetchWorker();
    }
  }, [workerId]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { data, error } = await supabase
      .from("workers")
      .update(formData)
      .eq("id", workerId);
      
    if (error) {
      console.error("Error updating worker:", error);
      toast({
        title: "Error",
        description: "Failed to update worker profile",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Success",
      description: "Worker profile updated successfully",
    });
    
    // Create notification for the worker
    addNotification({
      user_id: workerId,
      title: "Profile Updated",
      message: "Your profile information has been updated successfully.",
      type: "success",
      related_to: "worker",
      related_id: workerId,
    });
    
    // Refresh worker data
    router.refresh();
  };
  
  const handleStatusChange = async (newStatus) => {
    const { data, error } = await supabase
      .from("workers")
      .update({ status: newStatus })
      .eq("id", workerId);
      
    if (error) {
      console.error("Error updating worker status:", error);
      toast({
        title: "Error",
        description: "Failed to update worker status",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Success",
      description: `Worker status updated to ${newStatus}`,
    });
    
    // Create notification for the worker
    addNotification({
      user_id: workerId,
      title: "Status Changed",
      message: `Your registration status has been updated to: ${newStatus}`,
      type: newStatus === "approved" ? "success" : 
            newStatus === "rejected" ? "error" : "info",
      related_to: "worker",
      related_id: workerId,
    });
    
    // Refresh worker data
    router.refresh();
  };
  
  if (loading) {
    return <div>Loading worker profile...</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Worker Profile</h2>
        <Badge variant={
          worker?.status === "approved" ? "success" :
          worker?.status === "rejected" ? "destructive" :
          worker?.status === "pending" ? "warning" : "default"
        }>
          {worker?.status || "Unknown"}
        </Badge>
      </div>
      
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="nationality">Nationality</Label>
                    <Input
                      id="nationality"
                      name="nationality"
                      value={formData.nationality}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="passport_number">Passport Number</Label>
                    <Input
                      id="passport_number"
                      name="passport_number"
                      value={formData.passport_number}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="passport_expiry">Passport Expiry</Label>
                    <Input
                      id="passport_expiry"
                      name="passport_expiry"
                      type="date"
                      value={formData.passport_expiry}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Status Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => handleStatusChange("pending")}
                  disabled={worker?.status === "pending"}
                >
                  Mark as Pending
                </Button>
                <Button 
                  variant="success" 
                  onClick={() => handleStatusChange("approved")}
                  disabled={worker?.status === "approved"}
                >
                  Approve
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => handleStatusChange("rejected")}
                  disabled={worker?.status === "rejected"}
                >
                  Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents">
          {/* Document list and upload functionality */}
          <Card>
            <CardHeader>
              <CardTitle>Worker Documents</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Document list component */}
              <p>Document management will be implemented here</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          {/* Worker history and activity log */}
          <Card>
            <CardHeader>
              <CardTitle>Activity History</CardTitle>
            </CardHeader>
            <CardContent>
              {/* History component */}
              <p>Worker activity history will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}