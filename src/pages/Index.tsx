
import React, { useState, useEffect } from 'react';
import PomodoroTimer from '@/components/PomodoroTimer';
import TodoList from '@/components/TodoList';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

const Index = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check for saved theme preference or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Toggle dark/light mode
  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-gradient-to-b from-gray-900 to-gray-800' : 'bg-gradient-to-b from-background to-secondary/30'} py-8 px-4`}>
      <div className="container max-w-4xl mx-auto">
        <header className="text-center mb-8 relative">
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute right-0 top-0 rounded-full"
            onClick={toggleDarkMode}
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <h1 className={`text-3xl md:text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-foreground'} mb-2`}>Pomodoro Focus</h1>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-muted-foreground'}`}>Boost your productivity with time management</p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex flex-col">
            <PomodoroTimer />
          </div>
          
          <div className="flex flex-col">
            <TodoList />
          </div>
        </div>
        
        <footer className={`mt-12 text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
          <p>Built with the Pomodoro Technique - Stay focused and manage your time effectively.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
