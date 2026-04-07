import { useState, useEffect } from 'react';
import {
  CalendarCheck,
  ChevronDown,
  ChevronRight,
  CalendarDays,
  CalendarRange,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ListTodo,
  Eye,
  Clock,
  ExternalLink,
  X,
  BarChart3,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { fetchSummary, ReportSummary } from '@/lib/api';

type SnapshotPeriod = 'daily' | 'weekly' | 'monthly';

export function AppSidebar() {
  const [report, setReport] = useState<ReportSummary | null>(null);
  const [openSection, setOpenSection] = useState<SnapshotPeriod | null>('daily');
  const [showFullReport, setShowFullReport] = useState(false);

  useEffect(() => {
    const load = () => fetchSummary().then(setReport).catch(console.error);
    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, []);

  const toggleSection = (section: SnapshotPeriod) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  return (
    <>
      <motion.div
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-[280px] min-w-[280px] flex flex-col h-screen relative overflow-hidden border-r border-[hsl(30,18%,76%)]"
        style={{ background: 'var(--gradient-sidebar)' }}
      >
        <div className="absolute top-20 -left-10 w-32 h-32 rounded-full blur-3xl pointer-events-none" style={{ background: 'hsl(30 50% 60% / 0.08)' }} />
        <div className="absolute bottom-32 -right-8 w-24 h-24 rounded-full blur-3xl pointer-events-none" style={{ background: 'hsl(20 50% 55% / 0.06)' }} />

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center px-5 py-5"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.3 }}
            className="h-12 w-12 rounded-2xl flex items-center justify-center ring-2 ring-neon-purple/30 mb-2 relative"
            style={{ background: 'var(--gradient-ai)', boxShadow: 'var(--shadow-neon-purple)' }}
          >
            <CalendarCheck className="h-6 w-6 text-white" />
          </motion.div>
          <span className="font-display font-extrabold text-xl text-foreground tracking-tight">
            PlanPilot <span className="text-[10px] font-semibold text-muted-foreground/50 align-super">v1.0</span>
          </span>
          <p className="text-[10px] text-muted-foreground font-semibold tracking-widest uppercase mt-0.5">Plan it. Do it. Own it.</p>
        </motion.div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">

          {!report ? (
            <div className="text-[10px] text-muted-foreground text-center py-6">Loading...</div>
          ) : (
            <>
              {/* ── Task Overview ── */}
              <SidebarLabel>Task Overview</SidebarLabel>
              <div className="rounded-lg bg-secondary/40 border border-border p-2.5 space-y-1">
                <StatRow icon={ListTodo} label="To Do" value={report.columns.todo} color="text-[hsl(280,50%,60%)]" />
                <StatRow icon={Clock} label="In Progress" value={report.columns['in-progress']} color="text-[hsl(210,70%,55%)]" />
                <StatRow icon={Eye} label="Review" value={report.columns.review} color="text-[hsl(36,80%,55%)]" />
                <StatRow icon={CheckCircle2} label="Done" value={report.columns.done} color="text-[hsl(145,45%,48%)]" />
                {report.overdue > 0 && (
                  <StatRow icon={AlertTriangle} label="Overdue" value={report.overdue} color="text-destructive" />
                )}
              </div>

              {/* ── Snapshots (dropdown menus) ── */}
              <SidebarLabel>Snapshots</SidebarLabel>

              <SnapshotDropdown
                label="Today"
                icon={CalendarDays}
                iconColor="text-[hsl(280,50%,60%)]"
                isOpen={openSection === 'daily'}
                onToggle={() => toggleSection('daily')}
              >
                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  <MiniCard label="To Do" value={report.daily.todo} colorClass="text-[hsl(280,50%,60%)]" bgClass="bg-[hsl(280,50%,60%)]/10 ring-1 ring-[hsl(280,50%,60%)]/20" />
                  <MiniCard label="In Progress" value={report.daily.inProgress} colorClass="text-[hsl(210,70%,55%)]" bgClass="bg-[hsl(210,70%,55%)]/10 ring-1 ring-[hsl(210,70%,55%)]/20" />
                  <MiniCard label="Review" value={report.daily.review} colorClass="text-[hsl(36,80%,55%)]" bgClass="bg-[hsl(36,80%,55%)]/10 ring-1 ring-[hsl(36,80%,55%)]/20" />
                  <MiniCard label="Done" value={report.daily.done} colorClass="text-[hsl(145,45%,48%)]" bgClass="bg-[hsl(145,45%,48%)]/10 ring-1 ring-[hsl(145,45%,48%)]/20" />
                </div>
              </SnapshotDropdown>

              <SnapshotDropdown
                label="This Week"
                icon={CalendarRange}
                iconColor="text-[hsl(210,70%,55%)]"
                isOpen={openSection === 'weekly'}
                onToggle={() => toggleSection('weekly')}
              >
                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  <MiniCard label="To Do" value={report.weekly.todo} colorClass="text-[hsl(280,50%,60%)]" bgClass="bg-[hsl(280,50%,60%)]/10 ring-1 ring-[hsl(280,50%,60%)]/20" />
                  <MiniCard label="In Progress" value={report.weekly.inProgress} colorClass="text-[hsl(210,70%,55%)]" bgClass="bg-[hsl(210,70%,55%)]/10 ring-1 ring-[hsl(210,70%,55%)]/20" />
                  <MiniCard label="Review" value={report.weekly.review} colorClass="text-[hsl(36,80%,55%)]" bgClass="bg-[hsl(36,80%,55%)]/10 ring-1 ring-[hsl(36,80%,55%)]/20" />
                  <MiniCard label="Done" value={report.weekly.done} colorClass="text-[hsl(145,45%,48%)]" bgClass="bg-[hsl(145,45%,48%)]/10 ring-1 ring-[hsl(145,45%,48%)]/20" />
                </div>
              </SnapshotDropdown>

              <SnapshotDropdown
                label="This Month"
                icon={Calendar}
                iconColor="text-[hsl(36,80%,55%)]"
                isOpen={openSection === 'monthly'}
                onToggle={() => toggleSection('monthly')}
              >
                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  <MiniCard label="To Do" value={report.monthly.todo} colorClass="text-[hsl(280,50%,60%)]" bgClass="bg-[hsl(280,50%,60%)]/10 ring-1 ring-[hsl(280,50%,60%)]/20" />
                  <MiniCard label="In Progress" value={report.monthly.inProgress} colorClass="text-[hsl(210,70%,55%)]" bgClass="bg-[hsl(210,70%,55%)]/10 ring-1 ring-[hsl(210,70%,55%)]/20" />
                  <MiniCard label="Review" value={report.monthly.review} colorClass="text-[hsl(36,80%,55%)]" bgClass="bg-[hsl(36,80%,55%)]/10 ring-1 ring-[hsl(36,80%,55%)]/20" />
                  <MiniCard label="Done" value={report.monthly.done} colorClass="text-[hsl(145,45%,48%)]" bgClass="bg-[hsl(145,45%,48%)]/10 ring-1 ring-[hsl(145,45%,48%)]/20" />
                </div>
              </SnapshotDropdown>

              {/* ── Progress ── */}
              <SidebarLabel>Progress</SidebarLabel>
              <div className="rounded-lg bg-secondary/40 border border-border p-2.5">
                <div className="flex items-center gap-1.5 mb-2">
                  <TrendingUp className="h-4 w-4 text-[hsl(145,45%,48%)]" />
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">7-Day Trend</span>
                </div>
                <div className="h-[110px] -mx-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={report.progressData} margin={{ top: 2, right: 2, left: -22, bottom: 0 }}>
                      <defs>
                        <linearGradient id="gradDone" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(145,45%,48%)" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="hsl(145,45%,48%)" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gradReview" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(36,80%,55%)" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="hsl(36,80%,55%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="day" tick={{ fontSize: 8, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} tickFormatter={(v) => v.split(' ')[0]} />
                      <YAxis tick={{ fontSize: 8, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} allowDecimals={false} />
                      <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '0.5rem', fontSize: '10px' }} />
                      <Area type="monotone" dataKey="done" stroke="hsl(145,45%,48%)" fill="url(#gradDone)" strokeWidth={1.5} name="Done" />
                      <Area type="monotone" dataKey="review" stroke="hsl(36,80%,55%)" fill="url(#gradReview)" strokeWidth={1.5} name="Review" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* ── Priority ── */}
              <SidebarLabel>Priority Breakdown</SidebarLabel>
              <div className="rounded-lg bg-secondary/40 border border-border p-2.5 space-y-1.5">
                <PriorityBar label="High" count={report.priorities.high} total={report.total} color="bg-priority-high" />
                <PriorityBar label="Medium" count={report.priorities.medium} total={report.total} color="bg-priority-medium" />
                <PriorityBar label="Low" count={report.priorities.low} total={report.total} color="bg-priority-low" />
                <PriorityBar label="None" count={report.priorities.none} total={report.total} color="bg-muted-foreground/40" />
              </div>

              {/* View full report button */}
              <button
                onClick={() => setShowFullReport(true)}
                className="w-full flex items-center justify-center gap-2 mt-2 px-3 py-2 rounded-lg text-xs font-semibold text-primary-foreground transition-all hover:opacity-90"
                style={{ background: 'var(--gradient-ai)' }}
              >
                <ExternalLink className="h-3.5 w-3.5" />
                View Full Summary
              </button>
            </>
          )}
        </div>

        {/* Company signature */}
        <div className="px-4 py-2 border-t border-[hsl(30,18%,76%)] text-center" style={{ background: 'hsl(var(--neon-purple) / 0.05)' }}>
          <p className="text-[9px] text-muted-foreground/60 leading-none">
            A product of <a href="https://saffronyx.ai" target="_blank" rel="noopener noreferrer" className="font-bold text-[10px] text-foreground/60 tracking-wide hover:text-neon-purple transition-colors">Saffronyx.ai</a>
          </p>
          <p className="text-[7px] text-muted-foreground/40 mt-1">
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </motion.div>

      {/* Full Report Overlay */}
      <AnimatePresence>
        {showFullReport && report && (
          <FullReportModal report={report} onClose={() => setShowFullReport(false)} />
        )}
      </AnimatePresence>
    </>
  );
}

/* ── Sidebar section label ── */
function SidebarLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="pt-3 pb-1 px-1">
      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{children}</span>
    </div>
  );
}

/* ── Collapsible snapshot dropdown ── */
function SnapshotDropdown({
  label,
  icon: Icon,
  iconColor,
  isOpen,
  onToggle,
  children,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor?: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg bg-secondary/40 border border-border overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-foreground hover:bg-secondary/60 transition-colors"
      >
        <Icon className={`h-4 w-4 ${iconColor || 'text-muted-foreground'}`} />
        <span className="flex-1 text-left">{label}</span>
        {isOpen
          ? <ChevronDown className="h-4 w-4 text-muted-foreground" />
          : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-2.5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Stat row ── */
function StatRow({ icon: Icon, label, value, color }: { icon: React.ComponentType<{ className?: string }>; label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-2 py-0.5">
      <Icon className={`h-4 w-4 ${color}`} />
      <span className="text-[11px] text-foreground flex-1">{label}</span>
      <span className={`text-[11px] font-bold ${color}`}>{value}</span>
    </div>
  );
}

/* ── Mini card ── */
function MiniCard({ label, value, accent, colorClass, bgClass }: { label: string; value: number; accent?: boolean; colorClass?: string; bgClass?: string }) {
  const bg = bgClass || (accent ? 'bg-[hsl(145,45%,48%)]/10 ring-1 ring-[hsl(145,45%,48%)]/20' : 'bg-secondary/60');
  const text = colorClass || (accent ? 'text-[hsl(145,45%,48%)]' : 'text-foreground');
  return (
    <div className={`rounded-md px-1 py-0.5 text-center ${bg}`}>
      <div className={`text-base font-extrabold font-display ${text}`}>{value}</div>
      <div className="text-[9px] text-muted-foreground font-bold">{label}</div>
    </div>
  );
}

/* ── Priority bar ── */
function PriorityBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between mb-0.5">
        <span className="text-[10px] text-muted-foreground">{label}</span>
        <span className="text-[10px] font-bold text-foreground">{pct}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  );
}

/* ── Full Report Modal ── */
const PIE_COLORS = ['hsl(280,50%,60%)', 'hsl(210,70%,55%)', 'hsl(36,80%,55%)', 'hsl(145,45%,48%)'];
const PRIORITY_COLORS = ['hsl(4,70%,55%)', 'hsl(36,80%,55%)', 'hsl(145,45%,48%)', 'hsl(220,10%,60%)'];

type ReportTab = 'day' | 'week' | 'month';

const TAB_META: Record<ReportTab, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  day: { label: 'Today', icon: CalendarDays },
  week: { label: 'This Week', icon: CalendarRange },
  month: { label: 'This Month', icon: Calendar },
};

function FullReportModal({ report, onClose }: { report: ReportSummary; onClose: () => void }) {
  const [tab, setTab] = useState<ReportTab>('day');

  const periodStats: Record<ReportTab, { created: number; todo: number; inProgress: number; review: number; done: number; title: string }> = {
    day: { ...report.daily, title: "Today's Summary" },
    week: { ...report.weekly, title: "This Week's Summary" },
    month: { ...report.monthly, title: "This Month's Summary" },
  };

  const current = periodStats[tab];

  const columnData = [
    { name: 'To Do', value: report.columns.todo },
    { name: 'In Progress', value: report.columns['in-progress'] },
    { name: 'Review', value: report.columns.review },
    { name: 'Done', value: report.columns.done },
  ];

  const priorityData = [
    { name: 'High', value: report.priorities.high },
    { name: 'Medium', value: report.priorities.medium },
    { name: 'Low', value: report.priorities.low },
    { name: 'None', value: report.priorities.none },
  ];

  const completionRate = report.total > 0 ? Math.round((report.columns.done / report.total) * 100) : 0;

  const tooltipStyle = {
    background: 'hsl(var(--card))',
    border: '1px solid hsl(var(--border))',
    borderRadius: '0.5rem',
    fontSize: '11px',
  };

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
        className="w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl bg-card border border-border shadow-2xl"
      >
        {/* Header with tabs */}
        <div className="sticky top-0 bg-card z-10 border-b border-border">
          <div className="flex items-center justify-between px-6 pt-4 pb-2">
            <div className="flex items-center gap-2.5">
              <BarChart3 className="h-5 w-5 text-neon-purple" />
              <h2 className="font-display font-bold text-lg text-foreground">Summary Report</h2>
            </div>
            <button onClick={onClose} className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          {/* Tab bar */}
          <div className="flex gap-1 px-6 pb-3">
            {(['day', 'week', 'month'] as ReportTab[]).map((t) => {
              const meta = TAB_META[t];
              const active = tab === t;
              return (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                    active
                      ? 'bg-neon-purple/15 text-neon-purple ring-1 ring-neon-purple/20'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  <meta.icon className="h-3.5 w-3.5" />
                  {meta.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Period title */}
          <h3 className="font-display font-bold text-base text-foreground">{current.title}</h3>

          {/* Top stats row */}
          <div className="grid grid-cols-4 gap-3">
            <BigStat label="Total Tasks" value={report.total} />
            <BigStat label="Created" value={current.created} />
            <BigStat label="Completed" value={current.done} accent />
            <BigStat label="Overdue" value={report.overdue} warn={report.overdue > 0} />
          </div>

          {/* Completion rate bar */}
          <div className="rounded-xl bg-secondary/30 border border-border p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Overall Completion</span>
              <span className="text-sm font-bold text-foreground">{completionRate}%</span>
            </div>
            <div className="h-3 rounded-full bg-secondary overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionRate}%` }}
                transition={{ duration: 1 }}
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, hsl(210,70%,55%), hsl(145,45%,48%))' }}
              />
            </div>
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-secondary/30 border border-border p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Task Distribution</h3>
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={columnData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                      {columnData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-xl bg-secondary/30 border border-border p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Priority Breakdown</h3>
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={priorityData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                      {priorityData.map((_, i) => <Cell key={i} fill={PRIORITY_COLORS[i]} />)}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Period breakdown by column */}
          <div className="rounded-xl bg-secondary/30 border border-border p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Column Breakdown — {TAB_META[tab].label}</h3>
            <div className="grid grid-cols-4 gap-3">
              <div className="rounded-lg bg-[hsl(280,50%,60%)]/8 border border-[hsl(280,50%,60%)]/15 p-3 text-center">
                <div className="text-2xl font-bold font-display text-[hsl(280,50%,60%)]">{current.todo}</div>
                <div className="text-[10px] text-muted-foreground mt-1 font-medium">To Do</div>
              </div>
              <div className="rounded-lg bg-[hsl(210,70%,55%)]/8 border border-[hsl(210,70%,55%)]/15 p-3 text-center">
                <div className="text-2xl font-bold font-display text-[hsl(210,70%,55%)]">{current.inProgress}</div>
                <div className="text-[10px] text-muted-foreground mt-1 font-medium">In Progress</div>
              </div>
              <div className="rounded-lg bg-[hsl(36,80%,55%)]/8 border border-[hsl(36,80%,55%)]/15 p-3 text-center">
                <div className="text-2xl font-bold font-display text-[hsl(36,80%,55%)]">{current.review}</div>
                <div className="text-[10px] text-muted-foreground mt-1 font-medium">Review</div>
              </div>
              <div className="rounded-lg bg-[hsl(145,45%,48%)]/8 border border-[hsl(145,45%,48%)]/15 p-3 text-center">
                <div className="text-2xl font-bold font-display text-[hsl(145,45%,48%)]">{current.done}</div>
                <div className="text-[10px] text-muted-foreground mt-1 font-medium">Done</div>
              </div>
            </div>
          </div>

          {/* 7-day progress trend */}
          <div className="rounded-xl bg-secondary/30 border border-border p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">7-Day Progress Trend</h3>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={report.progressData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="modalGradDone" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(145,45%,48%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(145,45%,48%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="modalGradReview" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(36,80%,55%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(36,80%,55%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} tickFormatter={(v) => v.split(' ')[0]} />
                  <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="done" stroke="hsl(145,45%,48%)" fill="url(#modalGradDone)" strokeWidth={2} name="Done" />
                  <Area type="monotone" dataKey="review" stroke="hsl(36,80%,55%)" fill="url(#modalGradReview)" strokeWidth={2} name="Review" />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function BigStat({ label, value, accent, warn }: { label: string; value: number | string; accent?: boolean; warn?: boolean }) {
  return (
    <div className={`rounded-xl p-4 text-center border ${warn ? 'bg-destructive/8 border-destructive/20' : accent ? 'bg-[hsl(145,45%,48%)]/8 border-[hsl(145,45%,48%)]/20' : 'bg-secondary/40 border-border'}`}>
      <div className={`text-2xl font-bold font-display ${warn ? 'text-destructive' : accent ? 'text-[hsl(145,45%,48%)]' : 'text-foreground'}`}>{value}</div>
      <div className="text-[10px] text-muted-foreground font-medium mt-1">{label}</div>
    </div>
  );
}
