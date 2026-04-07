import { motion } from 'framer-motion';
import { Calendar, GripVertical, Clock, Trash2, Pencil } from 'lucide-react';
import { Task, PRIORITY_LABELS } from '@/types/kanban';

const PRIORITY_STYLES: Record<string, { badge: string; bar: string }> = {
  high: { badge: 'bg-priority-high/15 text-priority-high ring-1 ring-priority-high/25', bar: 'bg-priority-high' },
  medium: { badge: 'bg-priority-medium/15 text-priority-medium ring-1 ring-priority-medium/25', bar: 'bg-priority-medium' },
  low: { badge: 'bg-priority-low/15 text-priority-low ring-1 ring-priority-low/25', bar: 'bg-priority-low' },
  none: { badge: 'bg-secondary text-muted-foreground', bar: 'bg-muted-foreground/30' },
};

interface KanbanCardProps {
  task: Task;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
}

export function KanbanCard({ task, onDragStart, onDelete, onEdit }: KanbanCardProps) {
  const style = PRIORITY_STYLES[task.priority];
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
      whileHover={{ y: -3, boxShadow: 'var(--shadow-card-hover)' }}
      whileTap={{ scale: 0.98 }}
      draggable
      onDragStart={(e) => onDragStart(e as unknown as React.DragEvent, task.id)}
      className="group cursor-grab active:cursor-grabbing rounded-xl bg-card p-4 shadow-[var(--shadow-card)] transition-all duration-200 relative overflow-hidden border border-border hover:border-neon-purple/20"
    >
      {/* Priority accent bar */}
      <div className={`absolute top-0 left-0 w-full h-0.5 ${style.bar}`}
        style={task.priority !== 'none' ? { boxShadow: `0 0 8px hsl(var(--priority-${task.priority}) / 0.5)` } : undefined} />

      {/* Action buttons */}
      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(task); }}
          className="h-6 w-6 rounded-md flex items-center justify-center text-muted-foreground hover:text-neon-purple hover:bg-neon-purple/10 transition-all"
          title="Edit task"
        >
          <Pencil className="h-3 w-3" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
          className="h-6 w-6 rounded-md flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
          title="Delete task"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="flex items-start gap-2">
        <GripVertical className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="flex-1 min-w-0">
          <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider mb-2 ${style.badge}`}>
            {PRIORITY_LABELS[task.priority]}
          </span>

          <h4 className="font-display font-semibold text-sm text-card-foreground leading-snug mb-1.5 line-clamp-2 group-hover:text-neon-purple transition-colors">
            {task.title}
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-3">
            {task.description}
          </p>

          <div className="flex items-center justify-end">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {task.dueDate && (
                <span className={`flex items-center gap-1 ${isOverdue ? 'text-priority-high font-semibold' : ''}`}>
                  {isOverdue ? <Clock className="h-3 w-3" /> : <Calendar className="h-3 w-3" />}
                  {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
