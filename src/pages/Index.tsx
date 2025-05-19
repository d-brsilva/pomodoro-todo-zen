
import React from 'react';
import PomodoroTimer from '@/components/PomodoroTimer';
import TodoList from '@/components/TodoList';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 py-8 px-4">
      <div className="container max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Pomodoro Focus</h1>
          <p className="text-muted-foreground">Boost your productivity with time management</p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex flex-col">
            <PomodoroTimer />
          </div>
          
          <div className="flex flex-col">
            <TodoList />
          </div>
        </div>
        
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>Built with the Pomodoro Technique - Stay focused and manage your time effectively.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
