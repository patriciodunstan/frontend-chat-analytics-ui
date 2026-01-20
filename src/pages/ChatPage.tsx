/**
 * Chat component.
 */
import React, { useEffect, useRef, useState } from 'react';
import {
  Send,
  Bot,
  User,
  Loader2,
  Sparkles
} from 'lucide-react';
import { useChatStore } from '../stores/chatStore';

export default function ChatPage() {
  const {
    messages,
    isSending,
    loadConversations,
    sendMessage,
    createNewConversation,
    currentConversationId
  } = useChatStore();
  
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial load
  useEffect(() => {
    loadConversations();
  }, []);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const handleSend = async () => {
    if (!input.trim() || isSending) return;
    const message = input;
    setInput('');
    // Auto-create conversation if none selected (handled by backend or store logic usually, 
    // but here we just send. Store handles optimistic update)
    if (!currentConversationId) {
        // Optional: ensure we are in a conversation context or create one?
        // The current store implementation handles "null" ID by creating one.
    }
    await sendMessage(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto">
      {/* Chat Header or Empty State */}
      {messages.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 animate-fade-in">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center mb-6 shadow-[0_0_30px_var(--primary-glow)]">
            <Sparkles size={40} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-3 text-gradient">How can I help you today?</h2>
          <p className="text-[var(--text-muted)] max-w-md mb-8">
            Ask me about your data, generate insights, or request detailed analysis reports.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg">
            {[
              "Analyze equipment failures in Jan 2024",
              "Show me maintenance costs trends",
              "Calculate customer satisfaction average",
              "Compare Q1 vs Q2 expenses"
            ].map((text, i) => (
              <button
                key={i}
                onClick={() => setInput(text)}
                className="glass-button p-4 text-left text-sm hover:bg-[rgba(255,255,255,0.05)]"
              >
                {text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message List */}
      {messages.length > 0 && (
        <div className="flex-1 overflow-y-auto pr-2 space-y-6 pb-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-fade-in`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'user' 
                  ? 'bg-[var(--primary)] text-white' 
                  : 'glass-panel bg-[var(--glass-bg)] text-[var(--secondary)]'
              }`}>
                {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
              </div>
              
              <div className={`max-w-[80%] p-4 rounded-2xl leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-[var(--primary)] text-white rounded-tr-none'
                  : 'glass-panel rounded-tl-none border-[rgba(255,255,255,0.05)]'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          
          {isSending && (
            <div className="flex gap-4 animate-fade-in">
              <div className="w-10 h-10 rounded-full glass-panel flex items-center justify-center shrink-0">
                <Bot size={18} className="text-[var(--secondary)]" />
              </div>
              <div className="glass-panel px-6 py-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                <span className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Input Area */}
      <div className="mt-4 relative z-20">
        <div className="glass-panel p-2 flex items-end gap-2 rounded-xl">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about your data..."
            className="flex-1 bg-transparent border-0 focus:ring-0 text-[var(--text-main)] placeholder-[var(--text-muted)] p-3 min-h-[50px] max-h-[150px] resize-none focus:outline-none"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isSending}
            className={`p-3 rounded-lg mb-1 transition-all ${
              input.trim() && !isSending
                ? 'bg-[var(--primary)] text-white hover:bg-[var(--primary)] hover:opacity-90 shadow-[0_0_10px_var(--primary-glow)]'
                : 'bg-[rgba(255,255,255,0.05)] text-[var(--text-muted)] cursor-not-allowed'
            }`}
          >
            {isSending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>
        <p className="text-center text-xs text-[var(--text-muted)] mt-2">
          AI generated responses may vary. Check important info.
        </p>
      </div>
    </div>
  );
}
