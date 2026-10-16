"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare, X } from "lucide-react";
import { track } from "@vercel/analytics";
import { site } from "@/data/site";
import { useLanguage } from "./LanguageProvider";
import { useConsent } from "./ConsentProvider";
import { MailIcon } from "./icons";

interface Msg {
  id: number;
  from: "bot" | "user";
  text: string;
}

const WA_NUMBER = site.whatsapp.replace(/[^0-9]/g, "");

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.27-1.38a9.9 9.9 0 0 0 4.77 1.22h.004c5.46 0 9.9-4.44 9.9-9.9 0-2.64-1.03-5.13-2.9-7A9.82 9.82 0 0 0 12.04 2Zm0 1.8c2.16 0 4.19.84 5.72 2.37a8.04 8.04 0 0 1 2.37 5.73c0 4.47-3.64 8.1-8.11 8.1a8.1 8.1 0 0 1-4.12-1.13l-.3-.18-3.06.8.82-2.98-.2-.31a8.03 8.03 0 0 1-1.25-4.3c0-4.47 3.64-8.1 8.11-8.1Zm-2.9 4.3c-.14 0-.37.05-.56.26-.19.21-.73.72-.73 1.74s.75 2.02.85 2.16c.1.14 1.47 2.37 3.66 3.23 1.82.72 2.19.58 2.58.54.4-.04 1.27-.52 1.45-1.02.18-.5.18-.94.13-1.03-.05-.09-.19-.14-.4-.25-.21-.1-1.27-.63-1.46-.7-.2-.07-.34-.1-.48.11-.14.21-.55.7-.68.84-.12.14-.25.16-.46.05-.21-.1-.9-.33-1.72-1.06-.63-.57-1.06-1.27-1.19-1.48-.12-.21-.01-.33.09-.43.09-.09.21-.25.31-.37.1-.12.14-.21.21-.35.07-.14.03-.26-.02-.37-.05-.1-.47-1.17-.65-1.6-.17-.42-.34-.36-.47-.37h-.4Z" />
    </svg>
  );
}

export function ChatAssistant() {
  const { t } = useLanguage();
  const { consent, ready } = useConsent();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [asked, setAsked] = useState<Set<number>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  const a = t.assistant;

  // Seed the greeting when first opened.
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ id: idRef.current++, from: "bot", text: a.greeting }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const toggle = () => {
    setOpen((v) => {
      if (!v) track("chat_open");
      return !v;
    });
  };

  const askQuestion = (index: number) => {
    const item = t.faq.items[index];
    if (!item) return;
    track("chat_question", { q: item.q });
    setAsked((prev) => new Set(prev).add(index));
    setMessages((prev) => [
      ...prev,
      { id: idRef.current++, from: "user", text: item.q },
    ]);
    window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: idRef.current++, from: "bot", text: item.a },
      ]);
    }, 450);
  };

  const waHref = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
    t.whatsapp.message,
  )}`;

  // Hide while the cookie banner is open so they don't overlap.
  if (ready && consent === "unset") return null;

  const remaining = t.faq.items
    .map((item, i) => ({ item, i }))
    .filter(({ i }) => !asked.has(i));

  return (
    <>
      {/* Launcher */}
      <motion.button
        type="button"
        onClick={toggle}
        aria-label={a.aria}
        aria-expanded={open}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="fixed bottom-5 right-5 z-[61] flex h-14 w-14 items-center justify-center rounded-full bg-accent text-[#080808] shadow-[0_14px_40px_-10px_rgba(226,98,5,0.7)] transition-colors duration-300 hover:bg-accent-hover sm:bottom-6 sm:right-6"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="x"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-6 w-6" />
            </motion.span>
          ) : (
            <motion.span
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageSquare className="h-6 w-6" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="glass fixed bottom-24 right-4 z-[61] flex max-h-[72vh] w-[min(92vw,380px)] flex-col overflow-hidden rounded-3xl shadow-soft sm:right-6"
            role="dialog"
            aria-label={a.title}
          >
            {/* header */}
            <div className="flex items-center gap-3 border-b border-line bg-surface/60 p-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent font-display text-sm font-bold text-[#080808]">
                FN
              </span>
              <div className="flex-1">
                <div className="font-display text-sm font-semibold text-foreground">
                  {a.title}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                  {a.subtitle}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={a.close}
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-white/5 hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* messages */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={
                    m.from === "user" ? "flex justify-end" : "flex justify-start"
                  }
                >
                  <div
                    className={
                      m.from === "user"
                        ? "max-w-[85%] rounded-2xl rounded-br-md bg-accent px-3.5 py-2.5 text-sm text-[#080808]"
                        : "max-w-[85%] rounded-2xl rounded-bl-md border border-line bg-surface px-3.5 py-2.5 text-sm text-foreground/90"
                    }
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))}

              {/* quick questions */}
              {remaining.length > 0 && (
                <div className="pt-1">
                  <p className="mb-2 text-xs uppercase tracking-[0.18em] text-muted">
                    {a.quick}
                  </p>
                  <div className="flex flex-col gap-2">
                    {remaining.map(({ item, i }) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => askQuestion(i)}
                        className="rounded-2xl border border-line bg-background px-3.5 py-2.5 text-left text-sm text-foreground transition-colors hover:border-accent/40 hover:text-accent"
                      >
                        {item.q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* actions */}
            <div className="grid grid-cols-2 gap-2 border-t border-line bg-surface/60 p-3">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("chat_whatsapp")}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-3 py-2.5 text-xs font-semibold text-[#0a0a0a] transition-opacity hover:opacity-90"
              >
                <WhatsAppGlyph className="h-4 w-4" />
                {a.whatsapp}
              </a>
              <a
                href={`mailto:${site.email}`}
                onClick={() => track("chat_email")}
                className="flex items-center justify-center gap-2 rounded-xl border border-line bg-background px-3 py-2.5 text-xs font-semibold text-foreground transition-colors hover:border-white/25"
              >
                <MailIcon className="h-4 w-4" />
                {a.email}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
