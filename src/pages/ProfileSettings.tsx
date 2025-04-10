
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserProfile, updateUserProfile, updateUserEmail, updateUserPassword, UserProfile } from '@/services/profileService';
import { useToast } from '@/components/ui/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, User, Mail, KeyRound } from 'lucide-react';

const profileSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters'),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional(),
});

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Password must be at least 6 characters'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const ProfileSettings = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  
  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: '',
      phoneNumber: '',
      address: '',
      bio: '',
    },
  });
  
  const emailForm = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
  });
  
  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });
  
  useEffect(() => {
    const fetchProfile = async () => {
      if (currentUser) {
        try {
          const userProfile = await getUserProfile(currentUser.uid);
          setProfile(userProfile);
          if (userProfile) {
            profileForm.reset({
              displayName: userProfile.displayName || '',
              phoneNumber: userProfile.phoneNumber || '',
              address: userProfile.address || '',
              bio: userProfile.bio || '',
            });
            
            emailForm.reset({
              email: userProfile.email || '',
            });
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
          toast({
            title: 'Error',
            description: 'Failed to load profile. Please try again later.',
            variant: 'destructive',
          });
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchProfile();
  }, [currentUser, toast]);
  
  const onProfileSubmit = async (data: z.infer<typeof profileSchema>) => {
    if (!currentUser) return;
    
    try {
      await updateUserProfile(currentUser.uid, data);
      setProfile(prev => prev ? { ...prev, ...data } : null);
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully.',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again later.',
        variant: 'destructive',
      });
    }
  };
  
  const onEmailSubmit = async (data: z.infer<typeof emailSchema>) => {
    if (!currentUser) return;
    
    try {
      await updateUserEmail(data.email);
      setProfile(prev => prev ? { ...prev, email: data.email } : null);
      toast({
        title: 'Email Updated',
        description: 'Your email has been updated successfully.',
      });
    } catch (error: any) {
      console.error('Error updating email:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update email. You may need to re-authenticate.',
        variant: 'destructive',
      });
    }
  };
  
  const onPasswordSubmit = async (data: z.infer<typeof passwordSchema>) => {
    if (!currentUser) return;
    
    try {
      await updateUserPassword(data.newPassword);
      passwordForm.reset();
      toast({
        title: 'Password Updated',
        description: 'Your password has been updated successfully.',
      });
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update password. You may need to re-authenticate.',
        variant: 'destructive',
      });
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
        <span className="ml-2">Loading profile...</span>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-foreground">Profile Settings</h1>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6 flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={profile?.photoURL || undefined} alt={profile?.displayName || 'User'} />
                  <AvatarFallback className="text-2xl">
                    {profile?.displayName ? profile.displayName[0].toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold">{profile?.displayName || 'User'}</h2>
                <p className="text-muted-foreground">{profile?.email}</p>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Tabs defaultValue="profile">
              <TabsList className="mb-6">
                <TabsTrigger value="profile" className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="email" className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </TabsTrigger>
                <TabsTrigger value="password" className="flex items-center">
                  <KeyRound className="h-4 w-4 mr-2" />
                  Password
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Update your personal details here.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...profileForm}>
                      <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                        <FormField
                          control={profileForm.control}
                          name="displayName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Your name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="phoneNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input placeholder="Your phone number" {...field} />
                              </FormControl>
                              <FormDescription>Optional</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address</FormLabel>
                              <FormControl>
                                <Input placeholder="Your address" {...field} />
                              </FormControl>
                              <FormDescription>Optional</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="bio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bio</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Tell us about yourself" 
                                  {...field} 
                                  className="min-h-[120px]" 
                                />
                              </FormControl>
                              <FormDescription>
                                A brief description about yourself (max 500 characters)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button type="submit" className="w-full">
                          Save Profile
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="email">
                <Card>
                  <CardHeader>
                    <CardTitle>Email Address</CardTitle>
                    <CardDescription>
                      Change your email address. You'll need to verify the new email.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...emailForm}>
                      <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-6">
                        <FormField
                          control={emailForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input 
                                  type="email" 
                                  placeholder="your-email@example.com" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button type="submit" className="w-full">
                          Update Email
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="password">
                <Card>
                  <CardHeader>
                    <CardTitle>Password</CardTitle>
                    <CardDescription>
                      Change your password to secure your account.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...passwordForm}>
                      <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                        <FormField
                          control={passwordForm.control}
                          name="currentPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Current Password</FormLabel>
                              <FormControl>
                                <Input 
                                  type="password" 
                                  placeholder="••••••••" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={passwordForm.control}
                          name="newPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>New Password</FormLabel>
                              <FormControl>
                                <Input 
                                  type="password" 
                                  placeholder="••••••••" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={passwordForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm New Password</FormLabel>
                              <FormControl>
                                <Input 
                                  type="password" 
                                  placeholder="••••••••" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button type="submit" className="w-full">
                          Update Password
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfileSettings;
