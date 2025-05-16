
import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import ProjectCard from '@/components/project/ProjectCard';

const DashboardPage: React.FC = () => {
  const { projects, tasks, currentUser } = useApp();
  const navigate = useNavigate();
  
  // Get tasks assigned to current user
  const myTasks = tasks.filter(task => task.assigneeId === currentUser?.id);
  const todoTasks = myTasks.filter(task => task.status === 'todo');
  const inProgressTasks = myTasks.filter(task => task.status === 'inprogress');
  const doneTasks = myTasks.filter(task => task.status === 'done');
  
  // Get tasks due soon (in the next 7 days)
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  
  const tasksDueSoon = myTasks.filter(task => {
    if (!task.dueDate) return false;
    const dueDate = new Date(task.dueDate);
    return dueDate >= today && dueDate <= nextWeek && task.status !== 'done';
  });
  
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button onClick={() => navigate('/projects/new')}>New Project</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex justify-between items-center">
              <span>My Tasks</span>
              <Badge variant="outline" className="font-normal">{myTasks.length}</Badge>
            </CardTitle>
            <CardDescription>Your assigned tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">To Do</span>
                <Badge variant="secondary">{todoTasks.length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">In Progress</span>
                <Badge variant="secondary">{inProgressTasks.length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Done</span>
                <Badge variant="secondary">{doneTasks.length}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex justify-between items-center">
              <span>Due Soon</span>
              <Badge variant="outline" className="font-normal">{tasksDueSoon.length}</Badge>
            </CardTitle>
            <CardDescription>Tasks due in the next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            {tasksDueSoon.length > 0 ? (
              <div className="space-y-2">
                {tasksDueSoon.slice(0, 3).map(task => (
                  <div key={task.id} className="text-sm">
                    <div className="font-medium line-clamp-1">{task.title}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(task.dueDate!).toLocaleDateString()}
                    </div>
                  </div>
                ))}
                {tasksDueSoon.length > 3 && (
                  <div className="text-xs text-gray-500 mt-1">
                    +{tasksDueSoon.length - 3} more tasks
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-gray-500">No tasks due soon</div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex justify-between items-center">
              <span>My Projects</span>
              <Badge variant="outline" className="font-normal">{projects.length}</Badge>
            </CardTitle>
            <CardDescription>Projects you're part of</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => navigate('/projects')}
              >
                View All
              </Button>
              <Button 
                className="flex-1"
                onClick={() => navigate('/projects/new')}
              >
                New Project
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <h2 className="text-2xl font-bold mb-4">Recent Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {projects.slice(0, 3).map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
        {projects.length === 0 && (
          <div className="col-span-3 text-center py-8 border-2 border-dashed rounded-lg">
            <p className="text-gray-500">No projects yet</p>
            <Button 
              variant="link" 
              className="mt-2"
              onClick={() => navigate('/projects/new')}
            >
              Create your first project
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
