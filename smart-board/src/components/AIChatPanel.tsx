import { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Task } from '@/types/kanban';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface AIChatPanelProps {
  open: boolean;
  onClose: () => void;
  tasks: Task[];
}

async function callChatAPI(messages: { role: 'user' | 'assistant'; content: string }[], tasks: Task[]): Promise<string> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, tasks }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'AI request failed');
  }
  const data = await res.json();
  return data.content;
}

const QUICK_ACTIONS = [
  { label: '📊 Summary', prompt: 'Give me a board summary' },
  { label: '🔴 Urgent', prompt: 'Show high priority tasks' },
  { label: '📅 Deadlines', prompt: "What's due soon?" },
  { label: '💡 Suggest', prompt: 'What should I work on?' },
];

export function AIChatPanel({ open, onClose, tasks }: AIChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', role: 'assistant', content: "Hey! 👋 I'm your AI assistant. Ask me about your tasks, priorities, or anything!\n\n_Try the quick actions below to get started._" },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const msgText = text || input.trim();
    if (!msgText || isTyping) return;
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: msgText };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    try {
      const history = [...messages, userMsg]
        .filter(m => m.id !== '0')
        .map(m => ({ role: m.role, content: m.content }));
      const response = await callChatAPI(history, tasks);
      setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'assistant', content: response }]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong';
      setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'assistant', content: `⚠️ ${msg}` }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 390, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="h-screen border-l border-border bg-card flex flex-col overflow-hidden relative"
        >
          {/* Neon gradient blob */}
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-20 blur-3xl pointer-events-none"
            style={{ background: 'var(--gradient-ai)' }} />
          <div className="absolute bottom-20 left-0 w-32 h-32 rounded-full opacity-10 blur-3xl pointer-events-none"
            style={{ background: 'hsl(var(--neon-cyan))' }} />

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border relative z-10">
            <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, hsl(var(--neon-cyan) / 0.3), transparent)' }} />
            <div className="flex items-center gap-2.5">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="h-9 w-9 rounded-xl flex items-center justify-center"
                style={{ background: 'var(--gradient-ai)', boxShadow: 'var(--shadow-neon-purple)' }}
              >
                <Sparkles className="h-4 w-4 text-white" />
              </motion.div>
              <div>
                <h3 className="font-display font-semibold text-sm text-card-foreground">AI Assistant</h3>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-neon-green animate-pulse"
                    style={{ boxShadow: '0 0 6px hsl(var(--neon-green) / 0.8)' }} />
                  <p className="text-[10px] text-muted-foreground">Online · Ready to help</p>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4 relative z-10">
            {messages.map((msg, i) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: i === 0 ? 0 : 0.05 }}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === 'assistant' ? '' : 'bg-secondary'
                }`}
                  style={msg.role === 'assistant' ? { background: 'var(--gradient-ai)', boxShadow: '0 0 10px hsl(var(--neon-purple) / 0.3)' } : undefined}
                >
                  {msg.role === 'assistant' ? (
                    <Bot className="h-3.5 w-3.5 text-white" />
                  ) : (
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                </div>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === 'assistant'
                    ? 'bg-secondary/80 text-foreground border border-border'
                    : 'text-primary-foreground'
                }`}
                  style={msg.role === 'user' ? { background: 'var(--gradient-ai)', boxShadow: 'var(--shadow-neon-purple)' } : undefined}
                >
                  {msg.role === 'assistant' ? (
                    <div className="prose prose-sm prose-invert max-w-none [&_table]:text-xs [&_h2]:text-sm [&_h2]:mt-0 [&_h2]:mb-2 [&_p]:my-1 [&_ul]:my-1 [&_li]:my-0 [&_blockquote]:border-neon-purple/30 [&_blockquote]:text-neon-purple [&_em]:text-muted-foreground [&_strong]:text-foreground">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
              </motion.div>
            ))}

            {messages.length === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-2 pl-10"
              >
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => handleSend(action.prompt)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-secondary text-muted-foreground hover:bg-neon-purple/15 hover:text-neon-purple transition-all ring-1 ring-border hover:ring-neon-purple/30"
                  >
                    {action.label}
                  </button>
                ))}
              </motion.div>
            )}

            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2.5">
                <div className="h-7 w-7 rounded-full flex items-center justify-center"
                  style={{ background: 'var(--gradient-ai)' }}>
                  <Bot className="h-3.5 w-3.5 text-white" />
                </div>
                <div className="bg-secondary/80 border border-border rounded-2xl px-4 py-3 flex gap-1.5">
                  <motion.span animate={{ y: [0, -6, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} className="h-2 w-2 rounded-full bg-neon-purple/50" />
                  <motion.span animate={{ y: [0, -6, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }} className="h-2 w-2 rounded-full bg-neon-purple/50" />
                  <motion.span animate={{ y: [0, -6, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }} className="h-2 w-2 rounded-full bg-neon-purple/50" />
                </div>
              </motion.div>
            )}
          </div>

          {/* Input */}
          <div className="px-4 pb-4 relative z-10">
            <div className="flex items-center gap-2 rounded-xl border border-border bg-secondary/50 p-1.5 focus-within:ring-2 focus-within:ring-neon-purple/20 focus-within:border-neon-purple/30 transition-all">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about your tasks..."
                className="flex-1 h-9 px-3 text-sm bg-transparent text-foreground focus:outline-none placeholder:text-muted-foreground"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
                className="h-9 w-9 rounded-lg flex items-center justify-center text-primary-foreground disabled:opacity-30 transition-all"
                style={{ background: 'var(--gradient-ai)', boxShadow: '0 0 10px hsl(var(--neon-purple) / 0.3)' }}
              >
                <Send className="h-4 w-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
