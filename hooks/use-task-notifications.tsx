import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useNotification } from "@/hooks/use-notification";

export function useTaskNotifications() {
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();
  const { addNotification } = useNotification();
  
  // Check for upcoming deadlines and send notifications
  const checkDeadlines = async () => {
    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const threeDays = new Date(now);
      threeDays.setDate(threeDays.getDate() + 3);
      
      const oneWeek = new Date(now);
      oneWeek.setDate(oneWeek.getDate() + 7);
      
      // Format dates for Supabase query
      const tomorrowStr = tomorrow.toISOString().split('T')[0];
      const threeDaysStr = threeDays.toISOString().split('T')[0];
      const oneWeekStr = oneWeek.toISOString().split('T')[0];
      const todayStr = now.toISOString().split('T')[0];
      
      // Get tasks assigned to the user with upcoming deadlines
      const { data: tasks, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("assigned_to", user.id)
        .eq("status", "in_progress")
        .or(`deadline.eq.${tomorrowStr},deadline.eq.${threeDaysStr},deadline.eq.${oneWeekStr}`);
        
      if (error) {
        console.error("Error fetching tasks:", error);
        return;
      }
      
      // Get tasks that are already notified to avoid duplicate notifications
      const { data: notifiedTasks } = await supabase
        .from("notifications")
        .select("related_id")
        .eq("user_id", user.id)
        .eq("related_to", "task")
        .gte("created_at", new Date(now.setHours(0, 0, 0, 0)).toISOString());
        
      const notifiedTaskIds = notifiedTasks?.map(n => n.related_id) || [];
      
      // Process each task and send notifications if needed
      for (const task of tasks) {
        if (notifiedTaskIds.includes(task.id)) continue;
        
        const taskDeadline = new Date(task.deadline);
        const daysUntilDeadline = Math.ceil(
          (taskDeadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );
        
        let notificationType = "";
        let message = "";
        
        if (daysUntilDeadline <= 1) {
          notificationType = "error";
          message = `Task "${task.title}" is due tomorrow!`;
        } else if (daysUntilDeadline <= 3) {
          notificationType = "warning";
          message = `Task "${task.title}" is due in ${daysUntilDeadline} days.`;
        } else if (daysUntilDeadline <= 7) {
          notificationType = "info";
          message = `Task "${task.title}" is due in ${daysUntilDeadline} days.`;
        }
        
        if (message) {
          // Add notification
          addNotification({
            user_id: user.id,
            title: "Task Deadline Reminder",
            message,
            type: notificationType,
            related_to: "task",
            related_id: task.id,
          });
        }
      }
      
      // Check for overdue tasks
      const { data: overdueTasks, error: overdueError } = await supabase
        .from("tasks")
        .select("*")
        .eq("assigned_to", user.id)
        .eq("status", "in_progress")
        .lt("deadline", todayStr);
        
      if (overdueError) {
        console.error("Error fetching overdue tasks:", overdueError);
        return;
      }
      
      // Send notifications for overdue tasks
      for (const task of overdueTasks) {
        if (notifiedTaskIds.includes(task.id)) continue;
        
        addNotification({
          user_id: user.id,
          title: "Task Overdue",
          message: `Task "${task.title}" is overdue! It was due on ${new Date(task.deadline).toLocaleDateString()}.`,
          type: "error",
          related_to: "task",
          related_id: task.id,
        });
      }
    } catch (error) {
      console.error("Error in task notifications:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Run deadline check on component mount and set up interval
  useEffect(() => {
    checkDeadlines();
    
    // Check deadlines every hour
    const interval = setInterval(checkDeadlines, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return { loading, checkDeadlines };
}