import type { Task } from '@/types/kanban';

const BASE = '/api';

export interface FetchTasksParams {
  sort?: string;
  priority?: string;
  search?: string;
  column?: string;
  assignee?: string;
  dueFrom?: string;
  dueTo?: string;
}

export async function fetchTasks(params: FetchTasksParams = {}): Promise<Task[]> {
  const qs = new URLSearchParams();
  if (params.sort) qs.set('sort', params.sort);
  if (params.priority && params.priority !== 'all') qs.set('priority', params.priority);
  if (params.search) qs.set('search', params.search);
  if (params.column) qs.set('column', params.column);
  if (params.assignee) qs.set('assignee', params.assignee);
  if (params.dueFrom) qs.set('dueFrom', params.dueFrom);
  if (params.dueTo) qs.set('dueTo', params.dueTo);

  const res = await fetch(`${BASE}/tasks?${qs.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch tasks');
  return res.json();
}

export async function createTask(
  data: Pick<Task, 'title' | 'description' | 'priority' | 'columnId'> & { dueDate?: string },
): Promise<Task> {
  const res = await fetch(`${BASE}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create task');
  return res.json();
}

export async function updateTask(id: string, data: Partial<Task>): Promise<Task> {
  const res = await fetch(`${BASE}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update task');
  return res.json();
}

export async function deleteTask(id: string): Promise<void> {
  const res = await fetch(`${BASE}/tasks/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete task');
}

export interface ReportSummary {
  total: number;
  columns: { todo: number; 'in-progress': number; review: number; done: number };
  priorities: { high: number; medium: number; low: number; none: number };
  daily: { created: number; todo: number; inProgress: number; review: number; done: number };
  weekly: { created: number; todo: number; inProgress: number; review: number; done: number };
  monthly: { created: number; todo: number; inProgress: number; review: number; done: number };
  progressData: { day: string; total: number; done: number; review: number }[];
  overdue: number;
}

export async function fetchSummary(): Promise<ReportSummary> {
  const res = await fetch(`${BASE}/reports/summary`);
  if (!res.ok) throw new Error('Failed to fetch summary');
  return res.json();
}
