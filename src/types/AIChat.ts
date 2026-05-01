export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  actions?: QuickAction[];
}

export interface QuickAction {
  id: string;
  label: string;
  actionType: string;
  icon?: string;
}
