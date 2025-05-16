
import React, { useState } from 'react';
import { Task, TaskStatus } from '@/types';
import { useApp } from '@/contexts/AppContext';
import TaskCard from './TaskCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import TaskForm from './TaskForm';

interface KanbanBoardProps {
  projectId: string;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ projectId }) => {
  const { tasks, moveTask } = useApp();
  const [openDialog, setOpenDialog] = useState(false);
  
  // Filter tasks for the current project
  const projectTasks = tasks.filter(task => task.projectId === projectId);
  
  // Group tasks by status
  const todoTasks = projectTasks.filter(task => task.status === 'todo');
  const inProgressTasks = projectTasks.filter(task => task.status === 'inprogress');
  const doneTasks = projectTasks.filter(task => task.status === 'done');
  
  // Drag and drop functionality
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  
  const handleDragStart = (taskId: string) => {
    setDraggedTaskId(taskId);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    // Add some visual feedback for the drop target
    if (e.currentTarget.classList.contains('kanban-column')) {
      e.currentTarget.classList.add('drag-over');
    }
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    // Remove visual feedback
    if (e.currentTarget.classList.contains('kanban-column')) {
      e.currentTarget.classList.remove('drag-over');
    }
  };
  
  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    
    // Remove visual feedback
    if (e.currentTarget.classList.contains('kanban-column')) {
      e.currentTarget.classList.remove('drag-over');
    }
    
    // Move the task if we have a valid task ID
    if (draggedTaskId) {
      moveTask(draggedTaskId, status);
      setDraggedTaskId(null);
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Tasks</h2>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <TaskForm projectId={projectId} onComplete={() => setOpenDialog(false)} />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* To Do Column */}
        <div 
          className="kanban-column bg-gray-100 rounded-md p-3 min-h-[300px]"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, 'todo')}
        >
          <h3 className="text-sm font-medium mb-2 flex items-center">
            <span className="h-2 w-2 rounded-full bg-status-todo mr-2"></span>
            To Do
            <span className="text-xs text-gray-500 ml-2">{todoTasks.length}</span>
          </h3>
          <div className="space-y-2">
            {todoTasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onDragStart={() => handleDragStart(task.id)}
              />
            ))}
          </div>
        </div>
        
        {/* In Progress Column */}
        <div 
          className="kanban-column"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, 'inprogress')}
        >
          <h3 className="text-sm font-medium mb-2 flex items-center">
            <span className="h-2 w-2 rounded-full bg-status-inprogress mr-2"></span>
            In Progress
            <span className="text-xs text-gray-500 ml-2">{inProgressTasks.length}</span>
          </h3>
          <div className="space-y-2">
            {inProgressTasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onDragStart={() => handleDragStart(task.id)}
              />
            ))}
          </div>
        </div>
        
        {/* Done Column */}
        <div 
          className="kanban-column"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, 'done')}
        >
          <h3 className="text-sm font-medium mb-2 flex items-center">
            <span className="h-2 w-2 rounded-full bg-status-done mr-2"></span>
            Done
            <span className="text-xs text-gray-500 ml-2">{doneTasks.length}</span>
          </h3>
          <div className="space-y-2">
            {doneTasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onDragStart={() => handleDragStart(task.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;
