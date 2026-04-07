import { useState, useMemo, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Search, Plus, Sparkles, Filter, ArrowUpDown, HelpCircle, X, GripVertical, Trash2, ChevronRight, ChevronLeft, PenLine, Pencil, BarChart3, LogOut, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task, ColumnId, COLUMNS } from '@/types/kanban';
import { KanbanColumn } from './KanbanColumn';
import { AddTaskDialog } from './AddTaskDialog';
import { EditTaskDialog } from './EditTaskDialog';
import { createTask, updateTask, deleteTask } from '@/lib/api';

interface KanbanBoardProps {
  tasks: Task[];
  onRefresh: () => void;
  sort: string;
  onSortChange: (sort: string) => void;
  filterPriority: string;
  onFilterChange: (priority: string) => void;
  search: string;
  onSearchChange: (search: string) => void;
  userName: string;
  onLogout: () => void;
}

export function KanbanBoard({
  tasks,
  onRefresh,
  sort,
  onSortChange,
  filterPriority,
  onFilterChange,
  search,
  onSearchChange,
  userName,
  onLogout,
}: KanbanBoardProps) {
  const { theme, setTheme } = useTheme();
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [addingToColumn, setAddingToColumn] = useState<ColumnId | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = async (_e: React.DragEvent, columnId: string) => {
    if (!draggedTaskId) return;
    try {
      await updateTask(draggedTaskId, { columnId: columnId as ColumnId });
      onRefresh();
    } catch (err) {
      console.error('Failed to move task', err);
    }
    setDraggedTaskId(null);
  };

  const handleAddTask = async (
    task: Pick<Task, 'title' | 'description' | 'priority' | 'columnId'> & { dueDate?: string },
  ) => {
    try {
      await createTask(task);
      onRefresh();
    } catch (err) {
      console.error('Failed to create task', err);
    }
    setAddingToColumn(null);
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      onRefresh();
    } catch (err) {
      console.error('Failed to delete task', err);
    }
  };

  const handleEditTask = async (id: string, updates: Partial<Task>) => {
    try {
      await updateTask(id, updates);
      onRefresh();
    } catch (err) {
      console.error('Failed to edit task', err);
    }
    setEditingTask(null);
  };

  const MOTIVATIONAL_QUOTES = [
    "🚀 Small steps every day lead to big results.",
    "💪 You're doing better than you think.",
    "🎯 Progress, not perfection.",
    "🔥 Stay focused and never give up.",
    "🏆 Every task completed is a win.",
    "✨ One thing at a time, you've got this.",
    "🧠 Believe in your ability to figure it out.",
    "⚡ Discipline is choosing what you want most over what you want now.",
    "🌟 Your future self will thank you.",
    "📅 Don't count the days, make the days count.",
    "💥 Keep going — momentum is everything.",
    "🌈 Great things never come from comfort zones.",
    "🎉 You are one task away from a great day.",
    "✅ Turn your to-dos into ta-das!",
    "🔁 Success is the sum of small efforts repeated daily.",
  ];

  const quote = useMemo(
    () => MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)],
    [],
  );

  const [statusMsg, setStatusMsg] = useState(
    () => localStorage.getItem('planpilot_status') || `Hey ${userName}, let's crush it today!`,
  );
  const [editingStatus, setEditingStatus] = useState(false);
  const [statusInput, setStatusInput] = useState(statusMsg);

  const saveStatus = () => {
    const trimmed = statusInput.trim();
    if (!trimmed) return;
    localStorage.setItem('planpilot_status', trimmed);
    setStatusMsg(trimmed);
    setEditingStatus(false);
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem('planpilot_status', statusMsg);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [statusMsg]);

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.columnId === 'done').length;
  const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-[hsl(30,20%,78%)] backdrop-blur-md relative"
        style={{ background: 'linear-gradient(135deg, hsl(35 30% 92%), hsl(30 25% 88%), hsl(28 20% 90%))' }}
      >
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background:
              'linear-gradient(90deg, transparent, hsl(var(--neon-purple) / 0.3), hsl(var(--neon-cyan) / 0.2), transparent)',
          }}
        />

        {/* Row 1: Status message + Actions */}
        <div className="flex items-center justify-between px-6 pt-4 pb-2">
          <div className="flex items-center gap-2 min-w-0">
            {editingStatus ? (
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  value={statusInput}
                  onChange={(e) => setStatusInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveStatus();
                    if (e.key === 'Escape') { setEditingStatus(false); setStatusInput(statusMsg); }
                  }}
                  className="h-8 w-72 rounded-lg border border-border bg-secondary px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-neon-purple/30"
                  placeholder="Write a status message..."
                />
                <button
                  onClick={saveStatus}
                  className="h-8 px-3 rounded-lg text-xs font-semibold text-primary-foreground shrink-0"
                  style={{ background: 'var(--gradient-ai)' }}
                >
                  Save
                </button>
                <button
                  onClick={() => { setEditingStatus(false); setStatusInput(statusMsg); }}
                  className="h-8 px-2 rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditingStatus(true)}
                className="flex items-center gap-2 group min-w-0"
                title="Click to edit"
              >
                <h1 className="font-display text-xl font-bold text-foreground truncate group-hover:text-neon-purple transition-colors">
                  {statusMsg}
                </h1>
                <Sparkles className="h-4 w-4 text-neon-purple shrink-0" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="h-9 w-9 rounded-lg border border-border bg-secondary text-foreground hover:bg-secondary/70 transition-colors flex items-center justify-center"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowTutorial(true)}
              className="h-9 px-4 rounded-lg text-sm font-medium border border-border bg-secondary text-foreground hover:bg-secondary/70 transition-colors flex items-center gap-2"
            >
              <HelpCircle className="h-4 w-4" />
              How to Use
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onLogout}
              className="h-9 px-4 rounded-lg text-sm font-medium border border-destructive/30 bg-destructive/5 text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-2"
              title="Save & return to welcome screen"
            >
              <LogOut className="h-4 w-4" />
              Break & Restart
            </motion.button>
          </div>
        </div>

        {/* Row 2: Quote + Progress + Controls */}
        <div className="flex items-center justify-between px-6 pb-3">
          {/* Left: quote + progress */}
          <div className="flex items-center gap-4">
            <AnimatePresence mode="wait">
              <motion.p
                key={quote}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-xs italic text-foreground/70 max-w-[320px] truncate"
              >
                {quote}
              </motion.p>
            </AnimatePresence>

            <div className="h-4 w-px bg-border" />

            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {doneTasks}/{totalTasks} done
              </span>
              <div className="h-1.5 w-20 rounded-full bg-secondary overflow-hidden ring-1 ring-border">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="h-full rounded-full"
                  style={{ background: 'var(--gradient-neon)' }}
                />
              </div>
              <span className="text-[10px] font-bold text-neon-purple">{progress}%</span>
            </div>
          </div>

          {/* Right: Search + Filter + Sort */}
          <div className="flex items-center gap-2">
            <div className="relative group">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-neon-purple transition-colors" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="h-8 w-40 rounded-lg border border-border bg-secondary pl-8 pr-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-neon-purple/30 focus:border-neon-purple/40 transition-all"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
              <select
                value={filterPriority}
                onChange={(e) => onFilterChange(e.target.value)}
                className="h-8 rounded-lg border border-border bg-secondary pl-8 pr-6 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-neon-purple/30 transition-all appearance-none cursor-pointer"
              >
                <option value="all">All</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
                <option value="none">None</option>
              </select>
            </div>

            <div className="relative">
              <ArrowUpDown className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
              <select
                value={sort}
                onChange={(e) => onSortChange(e.target.value)}
                className="h-8 rounded-lg border border-border bg-secondary pl-8 pr-6 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-neon-purple/30 transition-all appearance-none cursor-pointer"
              >
                <option value="createdAt_desc">Newest</option>
                <option value="createdAt_asc">Oldest</option>
                <option value="priority">Priority</option>
                <option value="title">A–Z</option>
                <option value="comments_desc">Comments</option>
              </select>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setAddingToColumn('todo')}
              className="h-8 px-3 rounded-lg text-xs font-semibold text-primary-foreground flex items-center gap-1.5 transition-shadow"
              style={{ background: 'var(--gradient-ai)', boxShadow: 'var(--shadow-neon-purple)' }}
            >
              <Plus className="h-3.5 w-3.5" />
              New Task
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Board */}
      <div className="flex-1 overflow-x-auto overflow-y-auto p-6 shimmer-bg">
        <div className="flex gap-6 min-w-max min-h-full">
          {COLUMNS.map((col, i) => (
            <motion.div
              key={col.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, type: 'spring', damping: 20 }}
            >
              <KanbanColumn
                column={col}
                tasks={tasks.filter((t) => t.columnId === col.id)}
                onDragStart={handleDragStart}
                onDrop={handleDrop}
                onAddTask={(colId) => setAddingToColumn(colId as ColumnId)}
                onDeleteTask={handleDeleteTask}
                onEditTask={setEditingTask}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {addingToColumn && (
        <AddTaskDialog
          columnId={addingToColumn}
          onAdd={handleAddTask}
          onClose={() => setAddingToColumn(null)}
        />
      )}

      {editingTask && (
        <EditTaskDialog
          task={editingTask}
          onSave={handleEditTask}
          onClose={() => setEditingTask(null)}
        />
      )}

      <AnimatePresence>
        {showTutorial && <TutorialModal onClose={() => setShowTutorial(false)} />}
      </AnimatePresence>
    </div>
  );
}

/* ── Tutorial Modal ── */
const TUTORIAL_STEPS = [
  {
    title: 'Your Status Message',
    icon: PenLine,
    color: 'text-[hsl(280,50%,60%)]',
    bg: 'bg-[hsl(280,50%,60%)]/10',
    description: 'Click the bold text at the top of the header to edit your personal status message. Type anything — a goal, mood, or focus for the day. It saves automatically and persists across sessions.',
  },
  {
    title: 'Create a Task',
    icon: Plus,
    color: 'text-[hsl(210,70%,55%)]',
    bg: 'bg-[hsl(210,70%,55%)]/10',
    description: 'Click "New Task" in the toolbar (next to the sort dropdown) or the + icon on any column header. Fill in the title, description, priority, and optional due date.',
  },
  {
    title: 'Edit a Task',
    icon: Pencil,
    color: 'text-[hsl(260,60%,55%)]',
    bg: 'bg-[hsl(260,60%,55%)]/10',
    description: 'Hover over any task card — a pencil icon appears in the top-right corner. Click it to open the edit dialog where you can change the title, description, priority, status (column), and due date.',
  },
  {
    title: 'Drag & Drop',
    icon: GripVertical,
    color: 'text-[hsl(36,80%,55%)]',
    bg: 'bg-[hsl(36,80%,55%)]/10',
    description: 'Grab any task card and drag it to a different column to update its status. Move tasks through: To Do → In Progress → Review → Done.',
  },
  {
    title: 'Delete a Task',
    icon: Trash2,
    color: 'text-[hsl(4,70%,55%)]',
    bg: 'bg-[hsl(4,70%,55%)]/10',
    description: 'Hover over any task card — a trash icon appears in the top-right corner. Click it to delete the task permanently.',
  },
  {
    title: 'Search, Filter & Sort',
    icon: Search,
    color: 'text-[hsl(145,45%,48%)]',
    bg: 'bg-[hsl(145,45%,48%)]/10',
    description: 'Use the search bar to find tasks by title or description. Filter by priority (All/High/Medium/Low/None). Sort by newest, oldest, priority, title A–Z, or most comments.',
  },
  {
    title: 'Motivational Quote',
    icon: Sparkles,
    color: 'text-neon-purple',
    bg: 'bg-neon-purple/10',
    description: 'A fresh motivational quote appears in the header every time you open the app. Let it set the tone for your day!',
  },
  {
    title: 'Sidebar Reports',
    icon: BarChart3,
    color: 'text-[hsl(210,70%,55%)]',
    bg: 'bg-[hsl(210,70%,55%)]/10',
    description: 'The left sidebar shows live task overview, daily/weekly/monthly snapshots (click to expand), a 7-day progress chart, and priority breakdown. Data refreshes every 15 seconds.',
  },
  {
    title: 'Full Summary Report',
    icon: HelpCircle,
    color: 'text-[hsl(36,80%,55%)]',
    bg: 'bg-[hsl(36,80%,55%)]/10',
    description: 'Click "View Full Summary" at the bottom of the sidebar to open a detailed report window. Switch between Day, Week, and Month tabs for pie charts, bar charts, and trend graphs.',
  },
];

function TutorialModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const current = TUTORIAL_STEPS[step];
  const Icon = current.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-card border border-border shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-neon-purple" />
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Quick Guide</span>
          </div>
          <button onClick={onClose} className="h-7 w-7 rounded-md flex items-center justify-center hover:bg-muted transition-colors">
            <X className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex gap-1 px-5 pb-3">
          {TUTORIAL_STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all ${i === step ? 'bg-neon-purple' : i < step ? 'bg-neon-purple/40' : 'bg-secondary'}`}
            />
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="px-5 pb-4"
          >
            <div className={`h-14 w-14 rounded-2xl ${current.bg} flex items-center justify-center mb-4`}>
              <Icon className={`h-7 w-7 ${current.color}`} />
            </div>
            <h3 className="font-display font-bold text-lg text-foreground mb-2">{current.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{current.description}</p>
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-secondary/30">
          <span className="text-[11px] text-muted-foreground font-medium">
            {step + 1} of {TUTORIAL_STEPS.length}
          </span>
          <div className="flex items-center gap-2">
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="h-8 px-3 rounded-lg text-xs font-medium border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors flex items-center gap-1"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Back
              </button>
            )}
            {step < TUTORIAL_STEPS.length - 1 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="h-8 px-4 rounded-lg text-xs font-semibold text-primary-foreground flex items-center gap-1 transition-all"
                style={{ background: 'var(--gradient-ai)' }}
              >
                Next
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="h-8 px-4 rounded-lg text-xs font-semibold text-primary-foreground flex items-center gap-1 transition-all"
                style={{ background: 'var(--gradient-ai)' }}
              >
                Got it!
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
