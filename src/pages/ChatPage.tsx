/**
 * Chat page component.
 */
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Send,
  Plus,
  MessageSquare,
  User,
  Bot,
  LogOut,
  FileText,
  Loader2,
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useChatStore } from '../stores/chatStore';

export default function ChatPage() {
  const { user, logout } = useAuthStore();
  const {
    conversations,
    currentConversationId,
    messages,
    isLoading,
    isSending,
    loadConversations,
    setCurrentConversation,
    sendMessage,
    createNewConversation,
  } = useChatStore();
  
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isSending) return;
    const message = input;
    setInput('');
    await sendMessage(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <h2 style={styles.sidebarTitle}>Chat Analytics</h2>
          <button
            onClick={createNewConversation}
            className="btn btn-primary"
            style={styles.newChatBtn}
          >
            <Plus size={18} />
            Nueva conversación
          </button>
        </div>

        <nav style={styles.conversationsList}>
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setCurrentConversation(conv.id)}
              style={{
                ...styles.conversationItem,
                background: conv.id === currentConversationId ? 'var(--accent)' : 'transparent',
              }}
            >
              <MessageSquare size={18} />
              <span style={styles.conversationTitle}>{conv.title}</span>
            </button>
          ))}
        </nav>

        <div style={styles.sidebarFooter}>
          <div style={styles.userInfo}>
            <div style={styles.avatar}>
              <User size={18} />
            </div>
            <div style={styles.userDetails}>
              <span style={styles.userName}>{user?.full_name}</span>
              <span style={styles.userRole}>{user?.role}</span>
            </div>
          </div>
          <button onClick={handleLogout} className="btn btn-ghost" style={styles.logoutBtn}>
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* Main chat area */}
      <main style={styles.main}>
        {/* Messages */}
        <div style={styles.messagesContainer}>
          {messages.length === 0 && !isLoading && (
            <div style={styles.emptyState}>
              <Bot size={48} color="#94a3b8" />
              <h3 style={styles.emptyTitle}>¿En qué puedo ayudarte?</h3>
              <p style={styles.emptyText}>
                Puedo analizar datos, generar reportes de costo vs gasto,
                y darte recomendaciones basadas en tus datos.
              </p>
              <div style={styles.suggestions}>
                <button 
                  className="btn btn-secondary"
                  onClick={() => setInput('Genera un análisis de costo vs gasto para todos los servicios')}
                >
                  <FileText size={16} />
                  Análisis de costos
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => setInput('¿Cuáles son los servicios más costosos?')}
                >
                  <MessageSquare size={16} />
                  Servicios costosos
                </button>
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                ...styles.message,
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
              }}
              className="animate-slide-up"
            >
              <div
                style={{
                  ...styles.messageAvatar,
                  background: msg.role === 'user' ? 'var(--primary)' : 'var(--secondary)',
                }}
              >
                {msg.role === 'user' ? (
                  <User size={18} color="white" />
                ) : (
                  <Bot size={18} color="var(--secondary-foreground)" />
                )}
              </div>
              <div
                style={{
                  ...styles.messageBubble,
                  background: msg.role === 'user' ? 'var(--primary)' : 'var(--secondary)',
                  color: msg.role === 'user' ? 'white' : 'var(--foreground)',
                }}
              >
                <p style={styles.messageContent}>{msg.content}</p>
              </div>
            </div>
          ))}

          {isSending && (
            <div style={styles.message} className="animate-fade-in">
              <div style={{ ...styles.messageAvatar, background: 'var(--secondary)' }}>
                <Bot size={18} color="var(--secondary-foreground)" />
              </div>
              <div style={{ ...styles.messageBubble, background: 'var(--secondary)' }}>
                <div style={styles.typing}>
                  <span style={styles.typingDot} className="animate-pulse" />
                  <span style={{ ...styles.typingDot, animationDelay: '0.2s' }} className="animate-pulse" />
                  <span style={{ ...styles.typingDot, animationDelay: '0.4s' }} className="animate-pulse" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div style={styles.inputArea}>
          <div style={styles.inputContainer}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu mensaje..."
              style={styles.textarea}
              rows={1}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isSending}
              className="btn btn-primary"
              style={styles.sendBtn}
            >
              {isSending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    height: '100vh',
    background: 'var(--background)',
  },
  sidebar: {
    width: '280px',
    background: 'var(--muted)',
    borderRight: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
  },
  sidebarHeader: {
    padding: '1.25rem',
    borderBottom: '1px solid var(--border)',
  },
  sidebarTitle: {
    fontSize: '1.125rem',
    fontWeight: 600,
    marginBottom: '1rem',
    color: 'var(--foreground)',
  },
  newChatBtn: {
    width: '100%',
    gap: '0.5rem',
  },
  conversationsList: {
    flex: 1,
    overflow: 'auto',
    padding: '0.5rem',
  },
  conversationItem: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    color: 'var(--foreground)',
    fontSize: '0.875rem',
    textAlign: 'left',
    transition: 'background 0.2s',
  },
  conversationTitle: {
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  sidebarFooter: {
    padding: '1rem',
    borderTop: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  userInfo: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'var(--primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
  },
  userDetails: {
    display: 'flex',
    flexDirection: 'column',
  },
  userName: {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: 'var(--foreground)',
  },
  userRole: {
    fontSize: '0.75rem',
    color: 'var(--muted-foreground)',
    textTransform: 'capitalize',
  },
  logoutBtn: {
    padding: '0.5rem',
    color: 'var(--muted-foreground)',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  messagesContainer: {
    flex: 1,
    overflow: 'auto',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  emptyState: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    gap: '1rem',
  },
  emptyTitle: {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: 'var(--foreground)',
  },
  emptyText: {
    color: 'var(--muted-foreground)',
    maxWidth: '400px',
    lineHeight: 1.6,
  },
  suggestions: {
    display: 'flex',
    gap: '0.75rem',
    marginTop: '1rem',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  message: {
    display: 'flex',
    gap: '0.75rem',
    maxWidth: '80%',
  },
  messageAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  messageBubble: {
    padding: '0.875rem 1rem',
    borderRadius: '1rem',
    maxWidth: '100%',
  },
  messageContent: {
    whiteSpace: 'pre-wrap',
    lineHeight: 1.5,
    fontSize: '0.95rem',
  },
  typing: {
    display: 'flex',
    gap: '4px',
    padding: '0.25rem 0',
  },
  typingDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: 'var(--muted-foreground)',
  },
  inputArea: {
    padding: '1rem 1.5rem 1.5rem',
    borderTop: '1px solid var(--border)',
    background: 'var(--background)',
  },
  inputContainer: {
    display: 'flex',
    gap: '0.75rem',
    maxWidth: '800px',
    margin: '0 auto',
  },
  textarea: {
    flex: 1,
    padding: '0.875rem 1rem',
    border: '1px solid var(--border)',
    borderRadius: '1rem',
    resize: 'none',
    fontSize: '0.95rem',
    fontFamily: 'inherit',
    background: 'var(--muted)',
    color: 'var(--foreground)',
    outline: 'none',
  },
  sendBtn: {
    padding: '0.875rem 1rem',
    borderRadius: '1rem',
  },
};
