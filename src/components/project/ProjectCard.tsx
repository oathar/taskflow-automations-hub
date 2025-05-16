
import React from 'react';
import { Project } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { format } from 'date-fns';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const navigate = useNavigate();
  const { selectProject } = useApp();
  
  const handleClick = () => {
    selectProject(project.id);
    navigate(`/projects/${project.id}`);
  };
  
  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-all duration-200"
      onClick={handleClick}
    >
      <CardHeader className="pb-2">
        <CardTitle>{project.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 line-clamp-2">{project.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between pt-2 text-xs text-gray-500 border-t">
        <div>Created {format(new Date(project.createdAt), 'MMM d, yyyy')}</div>
        <div className="flex items-center">
          {project.members.slice(0, 3).map((member, i) => (
            <img
              key={member.id}
              src={member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}`}
              alt={member.name}
              className="h-6 w-6 rounded-full border-2 border-white"
              style={{ marginLeft: i > 0 ? '-8px' : '0' }}
            />
          ))}
          {project.members.length > 3 && (
            <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs ml-[-8px] border-2 border-white">
              +{project.members.length - 3}
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
