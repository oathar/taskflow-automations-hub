
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectForm from '@/components/project/ProjectForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const NewProjectPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container py-8">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)} 
        className="mb-6 flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
      
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Create New Project</CardTitle>
          </CardHeader>
          <CardContent>
            <ProjectForm onComplete={() => navigate('/projects')} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewProjectPage;
