'use client';

import { useState } from 'react';
import type { ContactMessage } from '@/app/actions/contact';
import { markMessageStatus } from '@/app/actions/contact';
import { formatDistanceToNow } from 'date-fns';
import { Mail, CheckCircle2, Circle } from 'lucide-react';

export default function AdminMessageList({ messages: initialMessages }: { messages: ContactMessage[] }) {
  const [messages, setMessages] = useState(initialMessages);

  async function handleMark(id: string, newStatus: 'read' | 'unread' | 'replied') {
    // Optimistic UI
    setMessages(prev =>
      prev.map(m => (m.id === id ? { ...m, status: newStatus } : m))
    );
    await markMessageStatus(id, newStatus);
  }

  if (messages.length === 0) {
    return (
      <div className="rounded-xl border border-white/5 bg-ink p-12 text-center">
        <Mail className="mx-auto h-8 w-8 text-cream/20 mb-3" />
        <p className="text-cream/50 text-sm">No messages yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map(msg => {
        const isUnread = msg.status === 'unread';

        return (
          <div
            key={msg.id}
            className={`relative overflow-hidden rounded-xl border p-5 md:p-6 transition-all ${
              isUnread 
                ? 'border-accent/40 bg-accent/[0.03]' 
                : 'border-white/5 bg-white/[0.01] opacity-75 grayscale-[0.3]'
            }`}
          >
            {isUnread && (
              <div className="absolute top-0 right-0 p-4">
                <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
              </div>
            )}

            <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
              {/* Header Info */}
              <div className="min-w-[200px] space-y-3">
                <div>
                  <h3 className={`font-medium ${isUnread ? 'text-cream' : 'text-cream/70'}`}>
                    {msg.name}
                  </h3>
                  <p className="text-[10px] text-cream/40 uppercase tracking-wider mt-0.5">
                    {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                  </p>
                </div>
                
                <div className="space-y-1 text-xs">
                  {msg.phone && (
                    <a href={`tel:${msg.phone}`} className="block text-cream/60 hover:text-accent transition-colors">
                      {msg.phone}
                    </a>
                  )}
                  {msg.email && (
                    <a href={`mailto:${msg.email}`} className="block text-cream/60 hover:text-accent transition-colors">
                      {msg.email}
                    </a>
                  )}
                </div>

                {msg.topic && (
                  <span className="inline-flex rounded-md bg-white/5 px-2.5 py-1 text-[10px] font-medium text-cream/50 border border-white/5">
                    {msg.topic}
                  </span>
                )}
              </div>

              {/* Message Body */}
              <div className="flex-1 mt-2 md:mt-0">
                <p className={`text-sm leading-relaxed whitespace-pre-wrap ${isUnread ? 'text-cream/90' : 'text-cream/60'}`}>
                  {msg.message}
                </p>

                {/* Actions */}
                <div className="mt-6 pt-4 border-t border-white/5 flex gap-3">
                  {isUnread ? (
                    <button
                      onClick={() => handleMark(msg.id, 'read')}
                      className="flex items-center gap-1.5 text-[11px] text-cream/50 hover:text-cream transition-colors uppercase tracking-widest font-semibold"
                    >
                      <Circle className="w-3.5 h-3.5" /> Mark as Read
                    </button>
                  ) : (
                    <button
                      onClick={() => handleMark(msg.id, 'unread')}
                      className="flex items-center gap-1.5 text-[11px] text-cream/30 hover:text-cream/60 transition-colors uppercase tracking-widest"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Read
                    </button>
                  )}
                  
                  <a
                    href={`https://wa.me/${msg.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-[11px] text-accent hover:text-accent/80 transition-colors uppercase tracking-widest font-semibold ml-auto"
                    onClick={() => {
                      if (isUnread) handleMark(msg.id, 'replied');
                    }}
                  >
                    Reply via WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
