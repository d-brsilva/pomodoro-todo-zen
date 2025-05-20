
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Play, Pause, RotateCcw } from 'lucide-react';

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

const defaultTimes = {
  work: 25 * 60, // 25 minutes in seconds
  shortBreak: 5 * 60, // 5 minutes
  longBreak: 15 * 60, // 15 minutes
};

const PomodoroTimer: React.FC = () => {
  const [mode, setMode] = useState<TimerMode>('work');
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(defaultTimes.work);
  const [customTime, setCustomTime] = useState<Record<TimerMode, number>>({
    work: defaultTimes.work,
    shortBreak: defaultTimes.shortBreak,
    longBreak: defaultTimes.longBreak,
  });
  
  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize audio on first render
  useEffect(() => {
    audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    
    // Cleanup function to stop timer when component unmounts
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Effect to handle timer countdown
  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning]);

  // Function to handle timer completion
  const handleTimerComplete = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(err => console.log('Error playing audio:', err));
    }
    setIsRunning(false);
    toast({
      title: "Timer Complete!",
      description: mode === "work" ? "Take a break!" : "Back to work!",
      duration: 5000,
    });
  };

  // Function to toggle timer start/pause
  const toggleTimer = () => {
    setIsRunning(prev => !prev);
  };

  // Function to reset timer
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(customTime[mode]);
  };

  // Function to switch timer mode
  const switchMode = (newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(customTime[newMode]);
  };

  // Function to format time for display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Function to handle custom time input
  const handleMinutesInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const minutes = parseInt(e.target.value) || 0;
    // Limit maximum minutes based on mode
    const maxMinutes = mode === 'work' ? 60 : 30;
    const validMinutes = Math.min(Math.max(1, minutes), maxMinutes);
    
    const newTimeInSeconds = validMinutes * 60;
    setCustomTime(prev => ({
      ...prev,
      [mode]: newTimeInSeconds
    }));
    
    // If we're not running, update the current timer
    if (!isRunning) {
      setTimeLeft(newTimeInSeconds);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">Pomodoro Timer</CardTitle>
        <CardDescription className="text-center">Stay focused and productive</CardDescription>
      </CardHeader>
      
      <Tabs value={mode} onValueChange={switchMode as (value: string) => void} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4 mx-4">
          <TabsTrigger value="work">Work</TabsTrigger>
          <TabsTrigger value="shortBreak">Short Break</TabsTrigger>
          <TabsTrigger value="longBreak">Long Break</TabsTrigger>
        </TabsList>

        <CardContent className="pb-0">
          <div className="relative flex flex-col items-center justify-center">
            {/* Timer display */}
            <div className="w-full my-8 flex justify-center">
              <div className={`text-5xl font-bold ${isRunning ? 'pulse' : ''}`} aria-live="polite">
                {formatTime(timeLeft)}
              </div>
            </div>
            
            <div className="flex gap-4 mb-6 w-full justify-center">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTimer}
                className="h-12 w-12 rounded-full"
              >
                {isRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={resetTimer}
                className="h-12 w-12 rounded-full"
              >
                <RotateCcw className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="w-full mb-4">
              <p className="text-sm text-muted-foreground mb-2">
                Customize {mode === 'work' ? 'Work' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'} Time (minutes):
              </p>
              <div className="flex items-center gap-4">
                <Input 
                  type="number"
                  ref={inputRef}
                  value={Math.floor(customTime[mode] / 60)}
                  onChange={handleMinutesInput}
                  className="w-20"
                  min={1}
                  max={mode === 'work' ? 60 : 30}
                  disabled={isRunning}
                />
                <span className="text-sm">minutes</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Tabs>
      
      <CardFooter className="pt-0 pb-4 flex justify-center">
        <div className="text-xs text-muted-foreground">
          {mode === 'work' 
            ? "Focus on your task until the timer ends" 
            : mode === 'shortBreak'
            ? "Take a short break to refresh"
            : "Take a longer break to recharge"}
        </div>
      </CardFooter>
    </Card>
  );
};

export default PomodoroTimer;
