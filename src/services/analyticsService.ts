
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Task } from "./taskService";

export interface TaskStatistics {
  completed: number;
  active: number;
  total: number;
  byPriority: {
    low: number;
    medium: number;
    high: number;
  };
  byMonth: {
    month: string;
    completed: number;
    created: number;
  }[];
  completionRate: number;
}

export const getTaskStatistics = async (userId: string): Promise<TaskStatistics> => {
  try {
    const tasksRef = collection(db, "tasks");
    const userTasksQuery = query(tasksRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(userTasksQuery);
    
    const tasks: Task[] = [];
    querySnapshot.forEach((doc) => {
      tasks.push({ id: doc.id, ...(doc.data() as Omit<Task, 'id'>) });
    });
    
    // Initialize the statistics
    const statistics: TaskStatistics = {
      completed: 0,
      active: 0,
      total: tasks.length,
      byPriority: {
        low: 0,
        medium: 0,
        high: 0
      },
      byMonth: [],
      completionRate: 0
    };
    
    // Process tasks
    if (tasks.length > 0) {
      // Count completed and active tasks
      statistics.completed = tasks.filter(task => task.completed).length;
      statistics.active = tasks.length - statistics.completed;
      
      // Count by priority
      tasks.forEach(task => {
        statistics.byPriority[task.priority]++;
      });
      
      // Calculate completion rate
      statistics.completionRate = statistics.completed / tasks.length;
      
      // Process by month
      const monthlyData = new Map<string, { completed: number, created: number }>();
      
      // Get the last 6 months
      const today = new Date();
      for (let i = 0; i < 6; i++) {
        const date = new Date(today);
        date.setMonth(today.getMonth() - i);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const monthName = date.toLocaleString('default', { month: 'short' });
        monthlyData.set(monthKey, { completed: 0, created: 0 });
      }
      
      // Fill in the data
      tasks.forEach(task => {
        const createdDate = task.createdAt ? new Date(task.createdAt) : new Date();
        const createdMonthKey = `${createdDate.getFullYear()}-${String(createdDate.getMonth() + 1).padStart(2, '0')}`;
        
        if (monthlyData.has(createdMonthKey)) {
          const data = monthlyData.get(createdMonthKey);
          if (data) {
            data.created++;
            if (task.completed) {
              data.completed++;
            }
          }
        }
      });
      
      // Convert to array for the chart
      statistics.byMonth = Array.from(monthlyData.entries()).map(([month, data]) => {
        const [year, monthNum] = month.split('-');
        const date = new Date(parseInt(year), parseInt(monthNum) - 1);
        return {
          month: date.toLocaleString('default', { month: 'short' }),
          completed: data.completed,
          created: data.created
        };
      }).reverse();
    }
    
    return statistics;
  } catch (error) {
    console.error("Error getting task statistics:", error);
    throw error;
  }
};
