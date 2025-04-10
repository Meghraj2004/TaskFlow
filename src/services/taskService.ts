
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  getDocs,
  onSnapshot,
  orderBy,
  Timestamp,
  DocumentData,
  QuerySnapshot,
  FirestoreError
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from '@/components/ui/use-toast';

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate: Date | null;
  createdAt: Date;
  userId: string;
}

export type NewTask = Omit<Task, 'id' | 'createdAt' | 'userId'>;

const tasksCollection = collection(db, 'tasks');

export const addTask = async (userId: string, task: NewTask) => {
  const taskData = {
    ...task,
    userId,
    createdAt: Timestamp.now(),
    completed: false,
    // Convert Date object to Firestore Timestamp if it exists
    dueDate: task.dueDate ? Timestamp.fromDate(task.dueDate) : null
  };
  
  return await addDoc(tasksCollection, taskData);
};

export const updateTask = async (taskId: string, updates: Partial<Task>) => {
  const taskRef = doc(db, 'tasks', taskId);
  const updateData: any = { ...updates };
  
  // Convert Date object to Firestore Timestamp if it exists
  if (updates.dueDate && updates.dueDate instanceof Date) {
    updateData.dueDate = Timestamp.fromDate(updates.dueDate);
  }
  
  await updateDoc(taskRef, {
    ...updateData,
    updatedAt: Timestamp.now()
  });
};

export const deleteTask = async (taskId: string) => {
  const taskRef = doc(db, 'tasks', taskId);
  await deleteDoc(taskRef);
};

export const toggleTaskCompletion = async (taskId: string, completed: boolean) => {
  const taskRef = doc(db, 'tasks', taskId);
  await updateDoc(taskRef, { 
    completed,
    updatedAt: Timestamp.now()
  });
};

export const subscribeTasks = (
  userId: string, 
  callback: (tasks: Task[]) => void,
  onError?: (error: Error) => void
) => {
  // Fix the query to use only userId filter, without the orderBy that requires a special index
  const q = query(
    tasksCollection, 
    where('userId', '==', userId)
  );
  
  return onSnapshot(
    q, 
    (snapshot: QuerySnapshot<DocumentData>) => {
      // Sort the tasks in memory after fetching them
      const tasks = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          description: data.description,
          completed: data.completed,
          priority: data.priority,
          dueDate: data.dueDate ? data.dueDate.toDate() : null,
          createdAt: data.createdAt.toDate(),
          userId: data.userId
        } as Task;
      });
      
      // Sort tasks by createdAt descending (newest first)
      tasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      
      callback(tasks);
    },
    (error: FirestoreError) => {
      console.error("Error fetching tasks:", error);
      if (onError) {
        onError(error);
      } else {
        // Show a toast if no error handler is provided
        toast({
          title: "Error loading tasks",
          description: "There was a problem loading your tasks. Please try again later.",
          variant: "destructive"
        });
      }
    }
  );
};
