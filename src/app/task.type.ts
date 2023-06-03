import { User } from './user.type';

export type Task = {
  id: number;
  description: string;
  assigneeId: number;
  completed: boolean;
  assignee?: User;
};

export type UpdateTaskPayload = Omit<Task, 'id' | 'assignee'>;

export type TaskViewFilter = {
  [key in keyof Omit<Task, 'id' | 'description' | 'assignee'>]:
    | string
    | boolean;
};
