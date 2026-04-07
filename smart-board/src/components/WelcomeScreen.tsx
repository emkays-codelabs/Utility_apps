import { useState } from 'react';
import { CalendarCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface WelcomeScreenProps {
  onComplete: (name: string) => void;
}

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [name, setName] = useState('');
  const [step, setStep] = useState<'intro' | 'name'>('intro');

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onComplete(trimmed);
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px] pointer-events-none" style={{ background: 'hsl(var(--neon-purple) / 0.08)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-[100px] pointer-events-none" style={{ background: 'hsl(var(--neon-cyan) / 0.06)' }} />


      {step === 'intro' ? (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-lg px-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="mx-auto mb-8 h-20 w-20 rounded-2xl flex items-center justify-center"
            style={{ background: 'hsl(var(--neon-purple) / 0.10)' }}
          >
            <CalendarCheck className="h-10 w-10 text-neon-purple" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-display text-4xl font-bold text-foreground mb-3"
          >
            Welcome to PlanPilot <span className="text-sm font-semibold text-muted-foreground/50 align-super">v1.0</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground text-base mb-2"
          >
            Plan it. Do it. Own it.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-muted-foreground/70 text-sm mb-8"
          >
            Your tasks. Your pace. Your way.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setStep('name')}
            className="inline-flex items-center gap-2 h-12 px-8 rounded-xl text-sm font-semibold text-primary-foreground transition-shadow"
            style={{ background: 'var(--gradient-ai)', boxShadow: 'var(--shadow-neon-purple)' }}
          >
            Get Started
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md px-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.1 }}
            className="mx-auto mb-6 h-16 w-16 rounded-2xl flex items-center justify-center"
            style={{ background: 'hsl(var(--neon-purple) / 0.10)' }}
          >
            <CalendarCheck className="h-8 w-8 text-neon-purple" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="font-display text-2xl font-bold text-foreground mb-2"
          >
            What should we call you?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-muted-foreground text-sm mb-6"
          >
            Enter your name to personalize your experience.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="space-y-3"
          >
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Your name..."
              className="w-full h-12 rounded-xl border border-border bg-card px-4 text-base text-foreground text-center placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-neon-purple/30 focus:border-neon-purple/40 transition-all"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={!name.trim()}
              className="w-full h-12 rounded-xl text-sm font-semibold text-primary-foreground disabled:opacity-40 transition-all flex items-center justify-center gap-2"
              style={{ background: 'var(--gradient-ai)', boxShadow: name.trim() ? 'var(--shadow-neon-purple)' : 'none' }}
            >
              Let's Go
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </motion.div>
        </motion.div>
      )}

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-0 left-0 right-0 py-3 px-6 flex items-center justify-between"
        style={{ background: 'hsl(var(--neon-purple) / 0.05)' }}
      >
        <p className="text-[10px] text-muted-foreground/50 tracking-wider">
          A product of <a href="https://saffronyx.ai" target="_blank" rel="noopener noreferrer" className="font-display font-extrabold text-[10px] text-foreground/60 tracking-tight hover:text-neon-purple transition-colors">Saffronyx.ai</a>
          <span className="mx-1.5 text-muted-foreground/20">·</span>
          <span className="text-[8px] text-muted-foreground/30">© 2026 Registered</span>
        </p>

        <div className="flex items-center gap-1.5">
          <span className="text-[8px] font-semibold text-muted-foreground/40 uppercase tracking-widest mr-1.5">Connect With Us</span>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground/40 hover:text-[hsl(330,70%,55%)] transition-colors" title="Instagram">
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground/40 hover:text-[hsl(0,80%,50%)] transition-colors" title="YouTube">
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.13C5.12 19.56 12 19.56 12 19.56s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" stroke="none"/></svg>
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground/40 hover:text-[hsl(210,80%,45%)] transition-colors" title="LinkedIn">
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
          </a>
          <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground/40 hover:text-foreground/70 transition-colors" title="X">
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
          <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground/40 hover:text-[hsl(142,70%,45%)] transition-colors" title="WhatsApp">
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
          </a>
        </div>
      </motion.div>
    </div>
  );
}
