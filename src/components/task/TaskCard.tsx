
import React, { useState } from 'react';
import { Task, User } from '@/types';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import TaskForm from './TaskForm';

interface TaskCardProps {
  task: Task;
  onDragStart: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onDragStart }) => {
  const { projects } = useApp();
  const [openDialog, setOpenDialog] = useState(false);
  
  // Find the project this task belongs to
  const project = projects.find(p => p.id === task.projectId);
  
  // Find the assignee if there is one
  const assignee = project?.members.find(m => m.id === task.assigneeId);
  
  // Format the due date if there is one
  const formattedDueDate = task.dueDate 
    ? formatDistanceToNow(new Date(task.dueDate), { addSuffix: true }) 
    : null;
    
  const isDueToday = task.dueDate ? new Date(task.dueDate).toDateString() === new Date().toDateString() : false;
  const isPastDue = task.dueDate ? new Date(task.dueDate) < new Date() : false;
  
  return (
    <>
      <Card 
        className="task-card"
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData('text/plain', task.id);
          onDragStart();
        }}
        onClick={() => setOpenDialog(true)}
      >
        <CardContent className="p-0">
          <div className="flex flex-col">
            <h3 className="font-medium text-sm">{task.title}</h3>
            
            {task.description && (
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{task.description}</p>
            )}
            
            <div className="flex justify-between items-center mt-2">
              {assignee ? (
                <div className="flex items-center">
                  <img 
                    src={assignee.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(assignee.name)}`} 
                    alt={assignee.name}
                    className="h-5 w-5 rounded-full" 
                  />
                </div>
              ) : (
                <span className="text-xs text-gray-400">Unassigned</span>
              )}
              
              {formattedDueDate && (
                <span 
                  className={`text-xs ${
                    isPastDue && task.status !== 'done' 
                      ? 'text-red-500 font-medium' 
                      : isDueToday 
                        ? 'text-orange-500' 
                        : 'text-gray-500'
                  }`}
                >
                  {formattedDueDate}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <TaskForm 
            projectId={task.projectId} 
            task={task} 
            onComplete={() => setOpenDialog(false)} 
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TaskCard;
