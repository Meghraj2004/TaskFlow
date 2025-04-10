import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Task, NewTask, addTask, subscribeTasks } from '@/services/taskService';
import TaskForm from '@/components/TaskForm';
import TaskItem from '@/components/TaskItem';
import ThemeToggle from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Plus, CheckCircle2, LogOut, Filter, User, LineChart,
  BarChart, PieChart, RefreshCw
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTaskDialogOpen, setNewTaskDialogOpen] = useState(false);
  
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    if (!currentUser) return;
    
    setLoading(true);
    setError(null);
    
    const unsubscribe = subscribeTasks(
      currentUser.uid, 
      (newTasks) => {
        setTasks(newTasks);
        setLoading(false);
        setError(null);
      },
      (error) => {
        console.error('Error loading tasks:', error);
        setLoading(false);
        setError('Failed to load tasks. Please try again.');
        toast({
          title: 'Error',
          description: 'Failed to load tasks: ' + error.message,
          variant: 'destructive',
        });
      }
    );
    
    return () => unsubscribe();
  }, [currentUser, toast]);
  
  useEffect(() => {
    let result = [...tasks];
    
    // Apply status filter
    if (filter === 'active') {
      result = result.filter(task => !task.completed);
    } else if (filter === 'completed') {
      result = result.filter(task => task.completed);
    }
    
    // Apply priority filter
    if (priorityFilter !== 'all') {
      result = result.filter(task => task.priority === priorityFilter);
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(task => 
        task.title.toLowerCase().includes(query) || 
        (task.description && task.description.toLowerCase().includes(query))
      );
    }
    
    setFilteredTasks(result);
  }, [tasks, filter, priorityFilter, searchQuery]);
  
  const handleAddTask = async (newTask: NewTask) => {
    if (!currentUser) return;
    
    try {
      await addTask(currentUser.uid, newTask);
      setNewTaskDialogOpen(false);
      toast({
        title: 'Task created',
        description: 'Your new task has been added successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to create task: ${error.message}`,
        variant: 'destructive',
      });
    }
  };
  
  const handleRefresh = () => {
    if (!currentUser) return;
    
    setLoading(true);
    setError(null);
    
    // Re-fetch tasks
    const unsubscribe = subscribeTasks(
      currentUser.uid, 
      (newTasks) => {
        setTasks(newTasks);
        setLoading(false);
      },
      (error) => {
        setLoading(false);
        setError('Failed to refresh tasks. Please try again.');
      }
    );
    
    // Clean up in case component unmounts during refresh
    setTimeout(() => unsubscribe(), 1000);
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };
  
  const goToProfile = () => {
    navigate('/profile');
  };
  
  const goToAnalytics = () => {
    navigate('/analytics');
  };
  
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-foreground">TaskFlow</h1>
            {currentUser && (
              <div className="flex items-center space-x-4">
                <ThemeToggle />
                <span className="text-sm text-muted-foreground">{currentUser.email}</span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Task</CardTitle>
                <CardDescription>Create a new task for your list</CardDescription>
              </CardHeader>
              <CardContent>
                <Dialog open={newTaskDialogOpen} onOpenChange={setNewTaskDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      New Task
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create a new task</DialogTitle>
                    </DialogHeader>
                    <TaskForm onSubmit={handleAddTask} />
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Navigation</CardTitle>
                <CardDescription>Access your account features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={goToProfile}>
                  <User className="h-4 w-4 mr-2" />
                  Profile Settings
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={goToAnalytics}>
                  <BarChart className="h-4 w-4 mr-2" />
                  Analytics
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Filters</CardTitle>
                <CardDescription>Refine your task list</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select defaultValue="all" onValueChange={(value: any) => setFilter(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tasks</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Priority</label>
                  <Select defaultValue="all" onValueChange={(value: any) => setPriorityFilter(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search</label>
                  <Input 
                    placeholder="Search tasks..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Tasks:</span>
                  <span className="font-medium">{tasks.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Completed:</span>
                  <span className="font-medium">{tasks.filter(t => t.completed).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Active:</span>
                  <span className="font-medium">{tasks.filter(t => !t.completed).length}</span>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-2 justify-start"
                  onClick={goToAnalytics}
                >
                  <PieChart className="h-4 w-4 mr-2" />
                  View Full Analytics
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-card p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold flex items-center">
                <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
                {filter === 'all' ? 'All Tasks' : filter === 'active' ? 'Active Tasks' : 'Completed Tasks'}
                {priorityFilter !== 'all' && ` - ${priorityFilter.charAt(0).toUpperCase() + priorityFilter.slice(1)} Priority`}
              </h2>
              
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRefresh}
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
                <div className="text-sm text-muted-foreground">
                  Showing {filteredTasks.length} of {tasks.length} tasks
                </div>
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center p-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">Loading tasks...</p>
                </div>
              </div>
            ) : error ? (
              <div className="bg-card rounded-lg shadow p-8 text-center">
                <div className="flex justify-center mb-4 text-red-500">
                  <div className="h-10 w-10">⚠️</div>
                </div>
                <h3 className="text-lg font-medium text-foreground">Error loading tasks</h3>
                <p className="mt-1 text-muted-foreground">{error}</p>
                <Button className="mt-4" onClick={handleRefresh}>
                  Try Again
                </Button>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="bg-card rounded-lg shadow p-8 text-center">
                <div className="flex justify-center mb-4">
                  <Filter className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground">No tasks found</h3>
                <p className="mt-1 text-muted-foreground">
                  {tasks.length === 0
                    ? "You don't have any tasks yet. Create your first task to get started!"
                    : "Try changing your filters to see more tasks."}
                </p>
                {tasks.length === 0 && (
                  <Button className="mt-4" onClick={() => setNewTaskDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add your first task
                  </Button>
                )}
              </div>
            ) : (
              <ScrollArea className="h-[calc(100vh-230px)]">
                <div className="space-y-4 pr-4">
                  {filteredTasks.map(task => (
                    <TaskItem key={task.id} task={task} />
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
