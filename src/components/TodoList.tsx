
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

const TodoList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    // Try to load tasks from localStorage
    const savedTasks = localStorage.getItem('pomodoro-tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [newTaskText, setNewTaskText] = useState('');
  
  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('pomodoro-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newTaskText.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        text: newTaskText.trim(),
        completed: false
      };
      
      setTasks([...tasks, newTask]);
      setNewTaskText('');
      toast({
        description: "Task added successfully",
        duration: 2000,
      });
    }
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast({
      description: "Task removed",
      duration: 2000,
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Task List</CardTitle>
        <CardDescription>Add tasks to work on during your pomodoro sessions</CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={addTask} className="flex gap-2 mb-4">
          <Input
            type="text"
            placeholder="Add a new task..."
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">Add</Button>
        </form>
        
        <div className="divide-y">
          {tasks.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No tasks yet. Add some tasks to get started!
            </div>
          ) : (
            tasks.map(task => (
              <div key={task.id} className="task-item group">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={`task-${task.id}`}
                    checked={task.completed}
                    onCheckedChange={() => toggleTaskCompletion(task.id)}
                  />
                  <label
                    htmlFor={`task-${task.id}`}
                    className={`flex-1 cursor-pointer ${task.completed ? 'task-complete' : ''}`}
                  >
                    {task.text}
                  </label>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between text-xs text-muted-foreground">
        <div>{tasks.filter(t => t.completed).length} completed</div>
        <div>{tasks.filter(t => !t.completed).length} remaining</div>
      </CardFooter>
    </Card>
  );
};

export default TodoList;
