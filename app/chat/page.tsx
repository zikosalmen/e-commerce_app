import { ChatWindow } from '@/components/chat/ChatWindow';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chat - Assistant IA',
  description: 'Discutez avec notre assistant IA intelligent',
};

export default function ChatPage() {
  return <ChatWindow />;
}
