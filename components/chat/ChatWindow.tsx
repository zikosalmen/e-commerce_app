'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageBubble, type Message } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { cn } from '@/lib/utils';
import { parseJSON } from '@/lib/utils';

const STORAGE_KEY = 'chat-messages';

interface ChatWindowProps {
  showHeader?: boolean;
}

export function ChatWindow({ showHeader = true }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Load messages from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedMessages = parseJSON<Message[]>(stored, []);
        setMessages(parsedMessages);
      }
    } catch (err) {
      console.error('Error loading messages from localStorage:', err);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (!isLoaded) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (err) {
      console.error('Error saving messages to localStorage:', err);
    }
  }, [messages, isLoaded]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (content: string) => {
    // Clear any previous errors
    setError(null);

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content,
      role: 'user',
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: content }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle rate limiting or other errors
        if (response.status === 429) {
          setError(data.error || 'Vous envoyez trop de messages. Réessayez dans quelques secondes.');
        } else {
          setError(data.error || 'Une erreur est survenue');
        }
        return;
      }

      // Add assistant message
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        content: data.reply,
        role: 'assistant',
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      {showHeader && (
        <div className="border-b border-border bg-card">
          <div className="max-w-3xl mx-auto px-4 py-4">
            <h1 className="text-xl md:text-2xl font-bold text-foreground">Assistant Chat</h1>
            <p className="text-sm text-muted-foreground">Posez-moi vos questions</p>
          </div>
        </div>
      )}

      {/* Messages area */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-4 py-6"
      >
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground py-12">
              <p className="text-lg">Commencez une conversation</p>
              <p className="text-sm mt-2">Envoyez un message pour démarrer</p>
            </div>
          )}

          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <TypingIndicator />
            </div>
          )}

          {error && (
            <div className="flex justify-center">
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-2xl max-w-md text-center">
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <ChatInput 
        onSendMessage={handleSendMessage} 
        disabled={isLoading}
      />
    </div>
  );
}
