
import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { Automation, TaskStatus } from '@/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { DialogFooter } from '@/components/ui/dialog';

interface AutomationFormProps {
  projectId: string;
  onComplete: () => void;
}

const triggerTypeOptions = [
  { label: 'When task is moved to status', value: 'task_moved' },
  { label: 'When task is assigned to someone', value: 'task_assigned' }
];

const actionTypeOptions = [
  { label: 'Move task to status', value: 'move_task' },
  { label: 'Assign task to member', value: 'assign_task' }
];

const statusOptions: { label: string; value: TaskStatus }[] = [
  { label: 'To Do', value: 'todo' },
  { label: 'In Progress', value: 'inprogress' },
  { label: 'Done', value: 'done' }
];

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  triggerType: z.enum(['task_moved', 'task_assigned']),
  triggerStatus: z.enum(['todo', 'inprogress', 'done']).optional(),
  triggerAssigneeId: z.string().optional(),
  actionType: z.enum(['move_task', 'assign_task']),
  actionStatus: z.enum(['todo', 'inprogress', 'done']).optional(),
  actionAssigneeId: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

const AutomationForm: React.FC<AutomationFormProps> = ({ projectId, onComplete }) => {
  const { createAutomation, projects } = useApp();
  
  // Find the current project
  const project = projects.find(p => p.id === projectId);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      triggerType: 'task_moved',
      triggerStatus: 'todo',
      actionType: 'move_task',
      actionStatus: 'inprogress',
    }
  });
  
  const watchTriggerType = form.watch('triggerType');
  const watchActionType = form.watch('actionType');
  
  const onSubmit = (values: FormValues) => {
    // Create automation object from form values
    const automation: Omit<Automation, 'id'> = {
      projectId,
      name: values.name,
      trigger: {
        type: values.triggerType,
        condition: values.triggerType === 'task_moved' 
          ? { status: values.triggerStatus }
          : { assigneeId: values.triggerAssigneeId }
      },
      action: {
        type: values.actionType,
        data: values.actionType === 'move_task'
          ? { status: values.actionStatus }
          : { assigneeId: values.actionAssigneeId }
      }
    };
    
    createAutomation(automation);
    onComplete();
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Automation Name</FormLabel>
              <FormControl>
                <Input placeholder="Name this automation" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-4 border-t border-b py-4">
          <h3 className="font-medium">When this happens...</h3>
          
          <FormField
            control={form.control}
            name="triggerType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trigger</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select trigger" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {triggerTypeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {watchTriggerType === 'task_moved' && (
            <FormField
              control={form.control}
              name="triggerStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {statusOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          {watchTriggerType === 'task_assigned' && (
            <FormField
              control={form.control}
              name="triggerAssigneeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assignee</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value || 'any_member'}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select assignee" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="any_member">Any Team Member</SelectItem>
                      {project?.members.map(member => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
        
        <div className="space-y-4">
          <h3 className="font-medium">Then do this...</h3>
          
          <FormField
            control={form.control}
            name="actionType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Action</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select action" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {actionTypeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {watchActionType === 'move_task' && (
            <FormField
              control={form.control}
              name="actionStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {statusOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          {watchActionType === 'assign_task' && (
            <FormField
              control={form.control}
              name="actionAssigneeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assignee</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value || 'specific_member'}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select assignee" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="specific_member">Select a Team Member</SelectItem>
                      {project?.members.map(member => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onComplete}>
            Cancel
          </Button>
          <Button type="submit">Create Automation</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default AutomationForm;
