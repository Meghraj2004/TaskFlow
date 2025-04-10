
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, Shield, Clock, List, Instagram, Linkedin, Facebook, Globe } from 'lucide-react';

const Homepage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">TaskFlow</h1>
            </div>
            <div className="flex space-x-4">
              <Button variant="ghost" onClick={() => navigate('/login')}>Login</Button>
              <Button onClick={() => navigate('/register')}>Sign Up</Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Organize your tasks with ease
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Stay on top of your day with our intuitive task management application.
              Create, organize, and complete tasks efficiently.
            </p>
            <div className="mt-8 flex justify-center">
              <Button size="lg" onClick={() => navigate('/register')} className="px-8 py-6 text-lg">
                Get Started - It's Free
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 mt-16">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="flex justify-center mb-4">
                <List className="h-12 w-12 text-green-500" />
              </div>
              <h3 className="text-xl font-medium text-gray-900">Organize Everything</h3>
              <p className="mt-2 text-gray-500">
                Create, manage, and organize all your tasks in one place with an intuitive interface.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="flex justify-center mb-4">
                <Clock className="h-12 w-12 text-green-500" />
              </div>
              <h3 className="text-xl font-medium text-gray-900">Real-time Updates</h3>
              <p className="mt-2 text-gray-500">
                All your changes sync instantly across all your devices, keeping you up to date.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="flex justify-center mb-4">
                <Shield className="h-12 w-12 text-green-500" />
              </div>
              <h3 className="text-xl font-medium text-gray-900">Secure & Private</h3>
              <p className="mt-2 text-gray-500">
                Your tasks are securely stored with Firebase. Only you can access your data.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg shadow-md p-8 mt-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900">Ready to get organized?</h3>
              <p className="mt-2 text-gray-500">Join thousands of users who have simplified their task management.</p>
            </div>
            <div className="flex justify-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/login')}>Login</Button>
              <Button onClick={() => navigate('/register')}>Create Free Account</Button>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-100 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
              <span className="text-xl font-semibold text-gray-900">TaskFlow</span>
            </div>
            <div className="text-gray-600 text-center md:text-left mb-4 md:mb-0">
              <p>Developed by Megharaj Dandgavhal</p>
            </div>
            <div className="flex space-x-4">
              <a href="https://meghportfolio.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700 transition-colors">
                <Globe className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/megharaj_2004/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://www.linkedin.com/in/megharaj-dandgavhal-832683259" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://www.facebook.com/megharaj.dandgavhal" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div className="text-center text-sm text-gray-500 mt-4">
            <p>© 2025 TaskFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
