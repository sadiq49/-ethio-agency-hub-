"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useNotification } from "@/hooks/use-notification";
import { useTaskNotifications } from "@/hooks/use-task-notifications";
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Calendar,
  Plus
} from "lucide-react";

export function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTaskOpen, setNewTaskOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    deadline: "",
    priority: "medium",
    assigned_to: "",
  });
  
  const supabase = createClientComponentClient();
  const { toast } = useToast();
  const { addNotification } = useNotification();
  const { checkDeadlines } = useTaskNotifications();
  
  useEffect(() => {
    fetchTasks();
  }, []);
  
  const fetchTasks = async () => {
    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data, error } = await supabase
        .from("tasks")
        .select(`
          *,
          assigned_user:users(name)
        `)
        .or(`assigned_to.eq.${user.id},created_by.eq.${user.id}`)
        .order("deadline", { ascending: true });
        
      if (error) {
        console.error("Error fetching tasks:", error);
        toast({
          title: "Error",
          description: "Failed to load tasks",
          variant: "destructive",
        });
        return;
      }
      
      setTasks(data || []);
    } catch (error) {
      console.error("Error in fetchTasks:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleNewTaskChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSelectChange = (name, value) => {
    setNewTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleCreateTask = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      // Validate required fields
      if (!newTask.title || !newTask.deadline || !newTask.assigned_to) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",