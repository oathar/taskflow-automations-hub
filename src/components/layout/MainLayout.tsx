
import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppSidebar } from './Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useApp } from '@/contexts/AppContext';
import LoginPage from '@/pages/LoginPage';

const MainLayout: React.FC = () => {
  const { currentUser, loading } = useApp();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!currentUser) {
    return <LoginPage />;
  }
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
