import { useState } from 'react';
import { Plus } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Task, Column } from '@/types/kanban';
import { KanbanCard } from './KanbanCard';

const COLUMN_STYLES: Record<string, {
  dot: string;
  glow: string;
  headerBg: string;
  columnBg: string;
  columnBorder: string;
  accentBar: string;
  countBg: string;
  countBorder: string;
}> = {
  'kanban-todo': {
    dot: 'bg-[hsl(280,50%,60%)]',
    glow: '--priority-none',
    headerBg: 'bg-[hsl(280,40%,95%)]',
    columnBg: 'bg-[hsl(280,35%,97%)]',
    columnBorder: 'border-[hsl(280,30%,88%)]',
    accentBar: 'bg-[hsl(280,50%,60%)]',
    countBg: 'bg-[hsl(280,35%,90%)]',
    countBorder: 'border-[hsl(280,30%,82%)]',
  },
  'kanban-progress': {
    dot: 'bg-[hsl(210,70%,55%)]',
    glow: '--neon-purple',
    headerBg: 'bg-[hsl(210,60%,95%)]',
    columnBg: 'bg-[hsl(210,55%,97%)]',
    columnBorder: 'border-[hsl(210,50%,88%)]',
    accentBar: 'bg-[hsl(210,70%,55%)]',
    countBg: 'bg-[hsl(210,55%,90%)]',
    countBorder: 'border-[hsl(210,50%,82%)]',
  },
  'kanban-review': {
    dot: 'bg-[hsl(36,80%,55%)]',
    glow: '--kanban-review',
    headerBg: 'bg-[hsl(38,70%,95%)]',
    columnBg: 'bg-[hsl(38,60%,97%)]',
    columnBorder: 'border-[hsl(38,50%,86%)]',
    accentBar: 'bg-[hsl(36,80%,55%)]',
    countBg: 'bg-[hsl(38,60%,90%)]',
    countBorder: 'border-[hsl(38,50%,80%)]',
  },
  'kanban-done': {
    dot: 'bg-[hsl(145,45%,48%)]',
    glow: '--neon-green',
    headerBg: 'bg-[hsl(140,35%,94%)]',
    columnBg: 'bg-[hsl(140,30%,96%)]',
    columnBorder: 'border-[hsl(140,28%,86%)]',
    accentBar: 'bg-[hsl(145,45%,48%)]',
    countBg: 'bg-[hsl(140,30%,89%)]',
    countBorder: 'border-[hsl(140,28%,80%)]',
  },
};

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDrop: (e: React.DragEvent, columnId: string) => void;
  onAddTask: (columnId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
}

export function KanbanColumn({ column, tasks, onDragStart, onDrop, onAddTask, onDeleteTask, onEditTask }: KanbanColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const style = COLUMN_STYLES[column.color] || COLUMN_STYLES['kanban-todo'];

  return (
    <div className={`flex flex-col w-[320px] min-w-[320px] shrink-0 rounded-2xl border ${style.columnBorder} ${style.columnBg} overflow-hidden shadow-sm`}>
      {/* Color accent bar at top */}
      <div className={`h-1 w-full ${style.accentBar}`} />

      {/* Column header */}
      <div className={`flex items-center justify-between px-4 py-3 ${style.headerBg}`}>
        <div className="flex items-center gap-2.5">
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
            className={`h-2.5 w-2.5 rounded-full ${style.dot}`}
            style={{ boxShadow: `0 0 8px hsl(var(${style.glow}) / 0.6)` }}
          />
          <h3 className="font-display font-semibold text-sm text-foreground">{column.title}</h3>
          <span className={`flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full text-[11px] font-bold ${style.countBg} ${style.countBorder} border text-muted-foreground`}>
            {tasks.length}
          </span>
        </div>
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onAddTask(column.id)}
          className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
        >
          <Plus className="h-4 w-4" />
        </motion.button>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragOver(false); onDrop(e, column.id); }}
        className={`flex-1 flex flex-col gap-3 p-3 transition-all duration-300 min-h-[200px] ${
          isDragOver
            ? 'bg-neon-purple/8 ring-2 ring-neon-purple/30'
            : ''
        }`}
        style={isDragOver ? { boxShadow: 'var(--shadow-glow)' } : undefined}
      >
        <AnimatePresence mode="popLayout">
          {tasks.map((task) => (
            <KanbanCard key={task.id} task={task} onDragStart={onDragStart} onDelete={onDeleteTask} onEdit={onEditTask} />
          ))}
        </AnimatePresence>
        {tasks.length === 0 && !isDragOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex items-center justify-center text-xs text-muted-foreground/40 italic"
          >
            Drop tasks here
          </motion.div>
        )}
      </div>
    </div>
  );
}
