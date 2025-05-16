
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import { Home, LogOut, Plus, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function AppSidebar() {
  const { projects, selectedProject, selectProject, logout, currentUser } = useApp();
  const navigate = useNavigate();
  
  return (
    <Sidebar>
      <SidebarHeader className="flex flex-col gap-2 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-sidebar-primary flex items-center justify-center text-white font-bold">
              TP
            </div>
            <h1 className="text-lg font-semibold">TaskBoard Pro</h1>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-2">
        <div className="py-2">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-2 mb-1 text-sidebar-foreground" 
            onClick={() => navigate('/')}
          >
            <Home className="h-4 w-4" />
            <span>Dashboard</span>
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-2 mb-3 text-sidebar-foreground" 
            onClick={() => navigate('/settings')}
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Button>
          
          <div className="flex items-center justify-between mb-2 px-3">
            <h2 className="text-sm font-medium text-sidebar-foreground/70">Projects</h2>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-5 w-5 text-sidebar-foreground/70"
              onClick={() => navigate('/projects/new')}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-1">
            {projects.map((project) => (
              <Button
                key={project.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-sidebar-foreground/90 font-normal h-8",
                  selectedProject?.id === project.id && "bg-sidebar-accent text-sidebar-foreground font-medium"
                )}
                onClick={() => {
                  selectProject(project.id);
                  navigate(`/projects/${project.id}`);
                }}
              >
                {project.title}
              </Button>
            ))}
          </div>
        </div>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t border-sidebar-border">
        {currentUser && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img 
                src={currentUser.avatar || 'https://github.com/shadcn.png'} 
                alt={currentUser.name || 'User'}
                className="h-8 w-8 rounded-full" 
              />
              <div className="flex flex-col text-sm">
                <span className="font-medium">{currentUser.name}</span>
                <span className="text-xs text-sidebar-foreground/70">{currentUser.email}</span>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={logout} className="text-sidebar-foreground/70">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
