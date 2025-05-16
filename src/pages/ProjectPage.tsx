
import React, { useEffect, useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useParams, Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import KanbanBoard from '@/components/task/KanbanBoard';
import { Button } from '@/components/ui/button';
import { UserPlus, Settings } from 'lucide-react';
import AutomationList from '@/components/automation/AutomationList';

const ProjectPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { projects, selectProject, selectedProject } = useApp();
  const [activeTab, setActiveTab] = useState("tasks");
  
  // Select the project when the component mounts or projectId changes
  useEffect(() => {
    if (projectId) {
      selectProject(projectId);
    }
  }, [projectId, selectProject]);
  
  // If project ID is invalid, redirect to projects page
  if (projectId && !projects.some(p => p.id === projectId)) {
    return <Navigate to="/projects" replace />;
  }
  
  // Show loading state while project is being fetched
  if (!selectedProject) {
    return (
      <div className="container py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
          <div className="h-[300px] bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">{selectedProject.title}</h1>
          <p className="text-gray-500 mt-1">{selectedProject.description}</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Invite
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Team:</span>
          <div className="flex -space-x-2">
            {selectedProject.members.map(member => (
              <img 
                key={member.id}
                src={member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}`} 
                alt={member.name}
                title={member.name}
                className="h-8 w-8 rounded-full border-2 border-white"
              />
            ))}
          </div>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="automations">Automations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tasks">
          <KanbanBoard projectId={selectedProject.id} />
        </TabsContent>
        
        <TabsContent value="automations">
          <AutomationList projectId={selectedProject.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectPage;
