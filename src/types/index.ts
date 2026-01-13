/**
 * TypeScript type definitions for the application.
 */

// User & Auth types
export interface User {
    id: number;
    email: string;
    full_name: string;
    role: 'viewer' | 'analyst' | 'admin';
    is_active: boolean;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    full_name: string;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
    user: User;
}

// Chat types
export interface Message {
    id: number;
    conversation_id: number;
    role: 'user' | 'assistant' | 'system';
    content: string;
    created_at: string;
}

export interface Conversation {
    id: number;
    title: string;
    created_at: string;
    updated_at: string;
    message_count: number;
}

export interface ConversationWithMessages extends Conversation {
    messages: Message[];
}

export interface ChatRequest {
    message: string;
    conversation_id?: number;
}

export interface ChatResponse {
    conversation_id: number;
    user_message: Message;
    assistant_message: Message;
}

// Report types
export type ReportType = 'cost_vs_expense' | 'monthly_summary' | 'service_analysis' | 'custom';
export type ReportStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface Report {
    id: number;
    title: string;
    report_type: ReportType;
    status: ReportStatus;
    file_path?: string;
    analysis_summary?: string;
    created_at: string;
}

export interface ReportRequest {
    report_type: ReportType;
    service_id: number;
    title?: string;
    period_start?: string;
    period_end?: string;
}

// Data types
export interface Service {
    id: number;
    name: string;
    description?: string;
    category: string;
    created_at: string;
}

export interface Cost {
    id: number;
    service_id: number;
    amount: number;
    category: string;
    description?: string;
    date: string;
    created_at: string;
}

export interface Expense {
    id: number;
    service_id: number;
    amount: number;
    category: string;
    description?: string;
    date: string;
    created_at: string;
}

// API error
export interface ApiError {
    detail: string;
}
