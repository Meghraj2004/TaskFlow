
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Check, Edit, Trash2, Calendar, AlertCircle } from 'lucide-react';
import { Task, toggleTaskCompletion, updateTask, deleteTask } from '@/services/taskService';
import TaskForm from './TaskForm';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const handleToggleCompletion = async () => {
    await toggleTaskCompletion(task.id, !task.completed);
  };
  
  const handleUpdateTask = async (updatedTask: Partial<Task>) => {
    await updateTask(task.id, updatedTask);
    setEditDialogOpen(false);
  };
  
  const handleDeleteTask = async () => {
    await deleteTask(task.id);
    setDeleteDialogOpen(false);
  };
  
  const priorityColors = {
    low: "bg-blue-100 text-blue-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800"
  };
  
  const priorityIcons = {
    low: <AlertCircle className="h-4 w-4 mr-1" />,
    medium: <AlertCircle className="h-4 w-4 mr-1" />,
    high: <AlertCircle className="h-4 w-4 mr-1" />
  };

  return (
    <Card className={cn(
      "transition-all duration-200",
      task.completed && "opacity-75"
    )}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-2">
            <Checkbox 
              checked={task.completed} 
              onCheckedChange={handleToggleCompletion}
              className="mt-1"
            />
            <div>
              <CardTitle className={cn(
                "text-lg transition-all duration-200",
                task.completed && "line-through text-gray-500"
              )}>
                {task.title}
              </CardTitle>
              {task.description && (
                <p className={cn(
                  "text-sm text-gray-500 mt-1",
                  task.completed && "line-through opacity-75"
                )}>
                  {task.description}
                </p>
              )}
            </div>
          </div>
          
          <Badge className={priorityColors[task.priority]}>
            {priorityIcons[task.priority]}
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      
      {task.dueDate && (
        <CardContent className="pb-2 pt-0">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-1" />
            Due: {format(task.dueDate, 'PPP')}
          </div>
        </CardContent>
      )}
      
      <CardFooter className="flex justify-between pt-2">
        <div className="text-xs text-gray-400">
          Created: {format(task.createdAt, 'PP')}
        </div>
        
        <div className="flex space-x-2">
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Task</DialogTitle>
              </DialogHeader>
              <TaskForm 
                onSubmit={handleUpdateTask} 
                initialData={task}
                submitLabel="Update Task"
                isEditing={true}
              />
            </DialogContent>
          </Dialog>
          
          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the task "{task.title}".
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteTask}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TaskItem;
