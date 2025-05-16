
export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  members: User[];
};

export type TaskStatus = 'todo' | 'inprogress' | 'done';

export type Task = {
  id: string;
  title: string;
  description: string;
  projectId: string;
  status: TaskStatus;
  assigneeId?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
};

export type Automation = {
  id: string;
  projectId: string;
  name: string;
  trigger: {
    type: 'task_moved' | 'task_assigned' | 'due_date_passed';
    condition: any;
  };
  action: {
    type: 'move_task' | 'assign_task' | 'send_notification';
    data: any;
  };
};
