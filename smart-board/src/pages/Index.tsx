import { useState, useEffect, useCallback } from 'react';
import { Task } from '@/types/kanban';
import { AppSidebar } from '@/components/AppSidebar';
import { KanbanBoard } from '@/components/KanbanBoard';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { AIChatPanel } from '@/components/AIChatPanel';
import { fetchTasks } from '@/lib/api';
import { Bot } from 'lucide-react';

const Index = () => {
  const [userName, setUserName] = useState(() => localStorage.getItem('planpilot_user') || '');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sort, setSort] = useState('createdAt_desc');
  const [filterPriority, setFilterPriority] = useState('all');
  const [search, setSearch] = useState('');

  const loadTasks = useCallback(async () => {
    try {
      const data = await fetchTasks({ sort, priority: filterPriority, search });
      setTasks(data);
    } catch (err) {
      console.error('Failed to load tasks', err);
    }
  }, [sort, filterPriority, search]);

  useEffect(() => {
    if (!userName) return;
    loadTasks();
    const interval = setInterval(loadTasks, 15000);
    return () => clearInterval(interval);
  }, [userName, loadTasks]);

  const handleWelcomeComplete = (name: string) => {
    localStorage.setItem('planpilot_user', name);
    setUserName(name);
  };

  const [aiOpen, setAiOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('planpilot_user');
    localStorage.removeItem('planpilot_status');
    setUserName('');
  };

  if (!userName) {
    return <WelcomeScreen onComplete={handleWelcomeComplete} />;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <AppSidebar />
      <div className="flex-1 overflow-hidden">
        <KanbanBoard
          tasks={tasks}
          onRefresh={loadTasks}
          sort={sort}
          onSortChange={setSort}
          filterPriority={filterPriority}
          onFilterChange={setFilterPriority}
          search={search}
          onSearchChange={setSearch}
          userName={userName}
          onLogout={handleLogout}
        />
      </div>

      {/* Floating AI Chat Button */}
      {!aiOpen && (
        <button
          onClick={() => setAiOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-110"
          style={{ background: 'var(--gradient-ai)', boxShadow: 'var(--shadow-neon-purple)' }}
          title="AI Assistant"
        >
          <Bot className="h-5 w-5 text-primary-foreground" />
        </button>
      )}

      <AIChatPanel open={aiOpen} onClose={() => setAiOpen(false)} tasks={tasks} />
    </div>
  );
};

export default Index;
