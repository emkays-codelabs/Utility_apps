export type Priority = 'high' | 'medium' | 'low' | 'none';
export type ColumnId = 'todo' | 'in-progress' | 'review' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  columnId: ColumnId;
  dueDate?: string;
  assignees: string[];
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: ColumnId;
  title: string;
  color: string;
}

export const COLUMNS: Column[] = [
  { id: 'todo', title: 'To Do', color: 'kanban-todo' },
  { id: 'in-progress', title: 'In Progress', color: 'kanban-progress' },
  { id: 'review', title: 'Review', color: 'kanban-review' },
  { id: 'done', title: 'Done', color: 'kanban-done' },
];

export const PRIORITY_LABELS: Record<Priority, string> = {
  high: 'High Priority',
  medium: 'Medium',
  low: 'Low Priority',
  none: 'No Priority',
};

