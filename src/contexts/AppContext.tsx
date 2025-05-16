
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Project, Task, User, Automation, TaskStatus } from '../types';
import { projects as mockProjects, tasks as mockTasks, currentUser as mockUser, automations as mockAutomations } from '../mockData';
import { toast } from '@/components/ui/use-toast';

interface AppContextType {
  currentUser: User | null;
  projects: Project[];
  tasks: Task[];
  automations: Automation[];
  selectedProject: Project | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  selectProject: (projectId: string) => void;
  createProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'ownerId' | 'members'>) => void;
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  moveTask: (taskId: string, newStatus: TaskStatus) => void;
  deleteTask: (taskId: string) => void;
  createAutomation: (automation: Omit<Automation, 'id'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  // Simulate loading data from API
  useEffect(() => {
    // Simulate API delay
    setTimeout(() => {
      setCurrentUser(mockUser);
      setProjects(mockProjects);
      setTasks(mockTasks);
      setAutomations(mockAutomations);
      setLoading(false);
    }, 1000);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate login API call
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email && password.length >= 6) {
      setCurrentUser(mockUser);
      toast({
        title: "Logged in successfully",
        description: `Welcome back, ${mockUser.name}!`,
      });
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const logout = () => {
    setCurrentUser(null);
    setSelectedProject(null);
    toast({
      title: "Logged out successfully",
    });
  };

  const selectProject = (projectId: string) => {
    const project = projects.find(p => p.id === projectId) || null;
    setSelectedProject(project);
  };

  const createProject = (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'ownerId' | 'members'>) => {
    if (!currentUser) return;
    
    const newProject: Project = {
      id: `project-${Date.now()}`,
      ...project,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ownerId: currentUser.id,
      members: [currentUser]
    };
    
    setProjects(prev => [...prev, newProject]);
    setSelectedProject(newProject);
    
    toast({
      title: "Project created",
      description: `Project "${newProject.title}" has been created.`,
    });
  };

  const createTask = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newTask: Task = {
      id: `task-${Date.now()}`,
      ...task,
      createdAt: now,
      updatedAt: now
    };
    
    setTasks(prev => [...prev, newTask]);
    
    toast({
      title: "Task created",
      description: `Task "${newTask.title}" has been created.`,
    });
    
    // Check automations
    checkAutomationsForTask(newTask);
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const updatedTask = { ...task, ...updates, updatedAt: new Date().toISOString() };
        
        // Check automations when task is updated
        if (updates.assigneeId !== undefined || updates.status !== undefined) {
          checkAutomationsForTask(updatedTask);
        }
        
        return updatedTask;
      }
      return task;
    }));
  };

  const moveTask = (taskId: string, newStatus: TaskStatus) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const updatedTask = { 
          ...task, 
          status: newStatus, 
          updatedAt: new Date().toISOString() 
        };
        
        // Check automations when task status changes
        checkAutomationsForTask(updatedTask);
        
        return updatedTask;
      }
      return task;
    }));
    
    const taskTitle = tasks.find(t => t.id === taskId)?.title;
    if (taskTitle) {
      toast({
        title: "Task moved",
        description: `"${taskTitle}" moved to ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`,
      });
    }
  };

  const deleteTask = (taskId: string) => {
    const taskToDelete = tasks.find(t => t.id === taskId);
    if (!taskToDelete) return;
    
    setTasks(prev => prev.filter(task => task.id !== taskId));
    
    toast({
      title: "Task deleted",
      description: `"${taskToDelete.title}" has been deleted.`,
    });
  };

  const createAutomation = (automation: Omit<Automation, 'id'>) => {
    const newAutomation: Automation = {
      id: `automation-${Date.now()}`,
      ...automation
    };
    
    setAutomations(prev => [...prev, newAutomation]);
    
    toast({
      title: "Automation created",
      description: `Automation "${newAutomation.name}" has been created.`,
    });
  };

  // Check if any automations should be triggered for a task
  const checkAutomationsForTask = (task: Task) => {
    const projectAutomations = automations.filter(a => a.projectId === task.projectId);
    
    for (const automation of projectAutomations) {
      // Check if trigger conditions match
      let shouldTrigger = false;
      
      if (automation.trigger.type === 'task_moved' && 
          automation.trigger.condition.status === task.status) {
        shouldTrigger = true;
      } else if (automation.trigger.type === 'task_assigned' && 
                task.assigneeId && 
                automation.trigger.condition.assigneeId === task.assigneeId) {
        shouldTrigger = true;
      }
      
      // Apply automation action if triggered
      if (shouldTrigger) {
        if (automation.action.type === 'move_task') {
          const newStatus = automation.action.data.status as TaskStatus;
          if (task.status !== newStatus) {
            updateTask(task.id, { status: newStatus });
            
            toast({
              title: "Automation triggered",
              description: `"${automation.name}" moved task to ${newStatus}.`,
            });
          }
        } else if (automation.action.type === 'assign_task') {
          const assigneeId = automation.action.data.assigneeId;
          if (task.assigneeId !== assigneeId) {
            updateTask(task.id, { assigneeId });
            
            const assigneeName = mockProjects.find(p => p.members.some(m => m.id === assigneeId))
              ?.members.find(m => m.id === assigneeId)?.name || 'User';
            
            toast({
              title: "Automation triggered",
              description: `"${automation.name}" assigned task to ${assigneeName}.`,
            });
          }
        }
      }
    }
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      projects,
      tasks,
      automations,
      selectedProject,
      loading,
      login,
      logout,
      selectProject,
      createProject,
      createTask,
      updateTask,
      moveTask,
      deleteTask,
      createAutomation
    }}>
      {children}
    </AppContext.Provider>
  );
};
