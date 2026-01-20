/**
 * Chat store using Zustand.
 */
import { create } from "zustand";
import type { Message, Conversation, ApiError } from "../types";
import { chatApi } from "../services/api";
import { AxiosError } from "axios";

interface ChatState {
  conversations: Conversation[];
  currentConversationId: number | null;
  messages: Message[];
  isLoading: boolean;
  isSending: boolean;
  error: string | null;

  // Actions
  loadConversations: () => Promise<void>;
  loadConversation: (id: number) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  setCurrentConversation: (id: number | null) => void;
  createNewConversation: () => void;
  clearError: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  currentConversationId: null,
  messages: [],
  isLoading: false,
  isSending: false,
  error: null,

  loadConversations: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await chatApi.getConversations();
      set({ conversations: response.data, isLoading: false });
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      set({
        error: error.response?.data?.detail || "Error al cargar conversaciones",
        isLoading: false,
      });
    }
  },

  loadConversation: async (id: number) => {
    set({ isLoading: true, error: null, currentConversationId: id });
    try {
      const response = await chatApi.getConversation(id);
      set({
        messages: response.data.messages,
        isLoading: false,
      });
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      set({
        error: error.response?.data?.detail || "Error al cargar conversación",
        isLoading: false,
      });
    }
  },

  sendMessage: async (content: string) => {
    const { currentConversationId, messages } = get();

    // Optimistic update - add user message immediately
    const tempUserMessage: Message = {
      id: Date.now(),
      conversation_id: currentConversationId || 0,
      role: "user",
      content,
      created_at: new Date().toISOString(),
    };

    set({
      messages: [...messages, tempUserMessage],
      isSending: true,
      error: null,
    });

    try {
      const response = await chatApi.sendMessage(
        content,
        currentConversationId || undefined,
      );
      const { conversation_id, user_message, assistant_message } =
        response.data;

      // Update with actual messages
      set((state) => ({
        messages: [
          ...state.messages.filter((m) => m.id !== tempUserMessage.id),
          user_message,
          assistant_message,
        ],
        currentConversationId: conversation_id,
        isSending: false,
      }));

      // Refresh conversations list
      get().loadConversations();
    } catch (err) {
      // Remove optimistic message on error
      const error = err as AxiosError<ApiError>;
      set((state) => ({
        messages: state.messages.filter((m) => m.id !== tempUserMessage.id),
        error: error.response?.data?.detail || "Error al enviar mensaje",
        isSending: false,
      }));
    }
  },

  setCurrentConversation: (id: number | null) => {
    set({ currentConversationId: id, messages: [] });
    if (id) {
      get().loadConversation(id);
    }
  },

  createNewConversation: () => {
    set({ currentConversationId: null, messages: [] });
  },

  clearError: () => set({ error: null }),
}));
