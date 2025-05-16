
import { Project, Task, User, Automation } from './types';

export const currentUser: User = {
  id: 'user-1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=6366F1&color=fff'
};

export const users: User[] = [
  currentUser,
  {
    id: 'user-2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=22C55E&color=fff'
  },
  {
    id: 'user-3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Bob+Johnson&background=F97316&color=fff'
  }
];

export const projects: Project[] = [
  {
    id: 'project-1',
    title: 'Website Redesign',
    description: 'Redesigning the company website with a new modern look',
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2023-01-15T10:00:00Z',
    ownerId: 'user-1',
    members: [users[0], users[1]]
  },
  {
    id: 'project-2',
    title: 'Mobile App Development',
    description: 'Building a new mobile app for customer engagement',
    createdAt: '2023-02-01T10:00:00Z',
    updatedAt: '2023-02-01T10:00:00Z',
    ownerId: 'user-1',
    members: users
  },
  {
    id: 'project-3',
    title: 'Marketing Campaign',
    description: 'Q2 marketing campaign planning and execution',
    createdAt: '2023-03-10T10:00:00Z',
    updatedAt: '2023-03-10T10:00:00Z',
    ownerId: 'user-2',
    members: [users[0], users[2]]
  }
];

export const tasks: Task[] = [
  {
    id: 'task-1',
    title: 'Create wireframes',
    description: 'Design wireframes for homepage and product pages',
    projectId: 'project-1',
    status: 'done',
    assigneeId: 'user-1',
    dueDate: '2023-01-20T00:00:00Z',
    createdAt: '2023-01-16T10:00:00Z',
    updatedAt: '2023-01-18T14:00:00Z'
  },
  {
    id: 'task-2',
    title: 'Implement design',
    description: 'Convert the design into HTML/CSS templates',
    projectId: 'project-1',
    status: 'inprogress',
    assigneeId: 'user-2',
    dueDate: '2023-01-25T00:00:00Z',
    createdAt: '2023-01-18T10:00:00Z',
    updatedAt: '2023-01-19T11:00:00Z'
  },
  {
    id: 'task-3',
    title: 'Database integration',
    description: 'Integrate the front-end with the database',
    projectId: 'project-1',
    status: 'todo',
    assigneeId: undefined,
    dueDate: '2023-01-30T00:00:00Z',
    createdAt: '2023-01-19T10:00:00Z',
    updatedAt: '2023-01-19T10:00:00Z'
  },
  {
    id: 'task-4',
    title: 'Define app features',
    description: 'List and prioritize features for the MVP',
    projectId: 'project-2',
    status: 'done',
    assigneeId: 'user-1',
    dueDate: '2023-02-05T00:00:00Z',
    createdAt: '2023-02-01T10:00:00Z',
    updatedAt: '2023-02-04T16:00:00Z'
  },
  {
    id: 'task-5',
    title: 'Design user flows',
    description: 'Create user flow diagrams for main functionalities',
    projectId: 'project-2',
    status: 'inprogress',
    assigneeId: 'user-3',
    dueDate: '2023-02-10T00:00:00Z',
    createdAt: '2023-02-04T10:00:00Z',
    updatedAt: '2023-02-06T11:00:00Z'
  },
  {
    id: 'task-6',
    title: 'Set up development environment',
    description: 'Configure development tools and environments',
    projectId: 'project-2',
    status: 'todo',
    assigneeId: 'user-2',
    dueDate: '2023-02-15T00:00:00Z',
    createdAt: '2023-02-06T10:00:00Z',
    updatedAt: '2023-02-06T10:00:00Z'
  },
  {
    id: 'task-7',
    title: 'Define target audience',
    description: 'Research and define target audience segments',
    projectId: 'project-3',
    status: 'done',
    assigneeId: 'user-3',
    dueDate: '2023-03-15T00:00:00Z',
    createdAt: '2023-03-10T10:00:00Z',
    updatedAt: '2023-03-14T16:00:00Z'
  }
];

export const automations: Automation[] = [
  {
    id: 'automation-1',
    projectId: 'project-1',
    name: 'Auto-assign tasks to me',
    trigger: {
      type: 'task_moved',
      condition: { status: 'todo' }
    },
    action: {
      type: 'assign_task',
      data: { assigneeId: 'user-1' }
    }
  },
  {
    id: 'automation-2',
    projectId: 'project-2',
    name: 'Move assigned tasks to In Progress',
    trigger: {
      type: 'task_assigned',
      condition: { assigneeId: 'user-2' }
    },
    action: {
      type: 'move_task',
      data: { status: 'inprogress' }
    }
  }
];
