export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export interface TodoList {
  id: string;
  title: string;
  label: 'Personal' | 'Work' | 'Finance' | 'Other';
  description?: string;
  todos: TodoItem[];
  pinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type LabelType = 'Personal' | 'Work' | 'Finance' | 'Other';