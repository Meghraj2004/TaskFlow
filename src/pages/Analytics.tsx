
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getTaskStatistics, TaskStatistics } from '@/services/analyticsService';
import { useToast } from '@/components/ui/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Button } from '@/components/ui/button';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip,
  PieChart, Pie, Cell, Legend, LineChart, Line, Area, AreaChart
} from 'recharts';
import { 
  CheckCircle2, Circle, Activity, PieChart as PieChartIcon, BarChart as BarChartIcon, 
  TrendingUp, Loader2, ArrowLeftCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Custom colors for charts
const COLORS = ['#4f46e5', '#16a34a', '#f59e0b', '#ef4444'];
const PRIORITY_COLORS = {
  low: '#16a34a',
  medium: '#f59e0b',
  high: '#ef4444'
};

const Analytics = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<TaskStatistics | null>(null);
  
  useEffect(() => {
    const fetchStatistics = async () => {
      if (currentUser) {
        try {
          const taskStats = await getTaskStatistics(currentUser.uid);
          setStatistics(taskStats);
        } catch (error) {
          console.error('Error fetching task statistics:', error);
          toast({
            title: 'Error',
            description: 'Failed to load analytics. Please try again later.',
            variant: 'destructive',
          });
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchStatistics();
  }, [currentUser, toast]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
        <span className="ml-2">Loading analytics...</span>
      </div>
    );
  }
  
  // Prepare data for the pie chart
  const priorityData = statistics ? [
    { name: 'Low', value: statistics.byPriority.low, color: PRIORITY_COLORS.low },
    { name: 'Medium', value: statistics.byPriority.medium, color: PRIORITY_COLORS.medium },
    { name: 'High', value: statistics.byPriority.high, color: PRIORITY_COLORS.high },
  ] : [];
  
  // Prepare status data
  const statusData = statistics ? [
    { name: 'Completed', value: statistics.completed, color: '#16a34a' },
    { name: 'Active', value: statistics.active, color: '#4f46e5' },
  ] : [];
  
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-foreground">Task Analytics</h1>
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard')}
              className="flex items-center"
            >
              <ArrowLeftCircle className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {statistics ? (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
                      <h3 className="text-2xl font-bold mt-1">{statistics.total}</h3>
                    </div>
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Activity className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Completed</p>
                      <h3 className="text-2xl font-bold mt-1">{statistics.completed}</h3>
                    </div>
                    <div className="h-12 w-12 bg-green-500/10 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active</p>
                      <h3 className="text-2xl font-bold mt-1">{statistics.active}</h3>
                    </div>
                    <div className="h-12 w-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                      <Circle className="h-6 w-6 text-blue-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                      <h3 className="text-2xl font-bold mt-1">
                        {(statistics.completionRate * 100).toFixed(0)}%
                      </h3>
                    </div>
                    <div className="h-12 w-12 bg-purple-500/10 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-purple-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center">
                    <BarChartIcon className="h-5 w-5 mr-2 text-primary" />
                    <CardTitle>Monthly Tasks</CardTitle>
                  </div>
                  <CardDescription>Number of tasks created and completed by month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={statistics.byMonth}
                        margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="created" name="Created Tasks" fill="#4f46e5" />
                        <Bar dataKey="completed" name="Completed Tasks" fill="#16a34a" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center">
                    <PieChartIcon className="h-5 w-5 mr-2 text-primary" />
                    <CardTitle>Tasks by Priority</CardTitle>
                  </div>
                  <CardDescription>Distribution of tasks across priority levels</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={priorityData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {priorityData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-primary" />
                    <CardTitle>Task Status</CardTitle>
                  </div>
                  <CardDescription>Completed vs Active tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                    <CardTitle>Completion Trend</CardTitle>
                  </div>
                  <CardDescription>Task completion trend over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={statistics.byMonth}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Area 
                          type="monotone" 
                          dataKey="completed" 
                          name="Completed Tasks"
                          stroke="#16a34a" 
                          fill="#16a34a" 
                          fillOpacity={0.3} 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="created" 
                          name="Created Tasks"
                          stroke="#4f46e5" 
                          fill="#4f46e5" 
                          fillOpacity={0.3} 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <Activity className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Analytics Available</h2>
            <p className="text-muted-foreground mb-6">
              Start creating tasks to generate analytics data.
            </p>
            <Button onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Analytics;
