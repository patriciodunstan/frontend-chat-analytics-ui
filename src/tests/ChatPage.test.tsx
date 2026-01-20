import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ChatPage from '../pages/ChatPage';
import { useAuthStore } from '../stores/authStore';
import { useChatStore } from '../stores/chatStore';

// Mocks
vi.mock('../stores/authStore');
vi.mock('../stores/chatStore');

describe('ChatPage', () => {
  const mockLogout = vi.fn();
  const mockSendMessage = vi.fn();
  const mockLoadConversations = vi.fn();
  
  const mockUser = {
    full_name: 'Test User',
    role: 'analyst',
  };

  const mockConversations = [
    { id: 1, title: 'Conversation 1' },
    { id: 2, title: 'Conversation 2' },
  ];

  const mockMessages = [
    { id: 1, role: 'user', content: 'Hello' },
    { id: 2, role: 'assistant', content: 'Hi there!' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    
    (useAuthStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: mockUser,
      logout: mockLogout,
    });

    (useChatStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      conversations: mockConversations,
      currentConversationId: 1,
      messages: mockMessages,
      isLoading: false,
      isSending: false,
      loadConversations: mockLoadConversations,
      setCurrentConversation: vi.fn(),
      sendMessage: mockSendMessage,
      createNewConversation: vi.fn(),
    });
  });

  it('renders chat interface', () => {
    render(
      <BrowserRouter>
        <ChatPage />
      </BrowserRouter>
    );

    expect(screen.getByText('Chat Analytics')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('displays messages', () => {
    render(
      <BrowserRouter>
        <ChatPage />
      </BrowserRouter>
    );

    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('Hi there!')).toBeInTheDocument();
  });
});
