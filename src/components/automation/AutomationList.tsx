
import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AutomationForm from './AutomationForm';

interface AutomationListProps {
  projectId: string;
}

const AutomationList: React.FC<AutomationListProps> = ({ projectId }) => {
  const { automations, projects } = useApp();
  const [openDialog, setOpenDialog] = useState(false);
  
  const projectAutomations = automations.filter(a => a.projectId === projectId);
  const project = projects.find(p => p.id === projectId);
  
  // Function to get humanized descriptions of automations
  const getAutomationDescription = (automation: typeof automations[0]) => {
    const trigger = automation.trigger;
    const action = automation.action;
    
    let triggerText = '';
    let actionText = '';
    
    // Generate trigger text
    if (trigger.type === 'task_moved') {
      const status = trigger.condition.status;
      triggerText = `Task is moved to ${status === 'todo' ? 'To Do' : status === 'inprogress' ? 'In Progress' : 'Done'}`;
    } else if (trigger.type === 'task_assigned') {
      const assignee = project?.members.find(m => m.id === trigger.condition.assigneeId);
      triggerText = `Task is assigned to ${assignee?.name || 'someone'}`;
    }
    
    // Generate action text
    if (action.type === 'move_task') {
      const status = action.data.status;
      actionText = `Move task to ${status === 'todo' ? 'To Do' : status === 'inprogress' ? 'In Progress' : 'Done'}`;
    } else if (action.type === 'assign_task') {
      const assignee = project?.members.find(m => m.id === action.data.assigneeId);
      actionText = `Assign task to ${assignee?.name || 'someone'}`;
    }
    
    return `When ${triggerText} → ${actionText}`;
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Automations</h2>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Automation
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create Automation</DialogTitle>
            </DialogHeader>
            <AutomationForm 
              projectId={projectId} 
              onComplete={() => setOpenDialog(false)} 
            />
          </DialogContent>
        </Dialog>
      </div>
      
      {projectAutomations.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed rounded-lg">
          <p className="text-gray-500">No automations created yet</p>
          <Button 
            variant="link" 
            className="mt-2"
            onClick={() => setOpenDialog(true)}
          >
            Create your first automation
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {projectAutomations.map(automation => (
            <Card key={automation.id} className="bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{automation.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  {getAutomationDescription(automation)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AutomationList;
