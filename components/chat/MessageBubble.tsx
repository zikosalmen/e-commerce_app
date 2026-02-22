'use client';

import React from 'react';
import { cn } from '@/front/lib/utils';
import { Bot } from 'lucide-react';

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
}

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        "flex w-full animate-fade-in",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "flex gap-3 max-w-[85%] md:max-w-[75%]",
          isUser && "flex-row-reverse"
        )}
      >
        {/* Avatar - only for assistant */}
        {!isUser && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
        )}

        {/* Message bubble */}
        <div
          className={cn(
            "rounded-2xl px-4 py-3 shadow-sm",
            isUser
              ? "bg-primary-600 text-white"
              : "bg-muted text-foreground"
          )}
        >
          <p className="text-sm md:text-base whitespace-pre-wrap break-words">
            {message.content}
          </p>
        </div>
      </div>
    </div>
  );
}
