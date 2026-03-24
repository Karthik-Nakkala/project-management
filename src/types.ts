export type Priority = 'Critical' | 'High' | 'Medium' | 'Low';
export type Status = 'To Do' | 'In Progress' | 'In Review' | 'Done';

export interface User {
  id: string;
  name: string;
  initials: string;
}

export interface Task {
  id: string;
  title: string;
  status: Status;
  priority: Priority;
  assignee: User;
  startDate: string | null;   
  dueDate: string;            
}