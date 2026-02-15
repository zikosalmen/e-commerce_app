'use client';

import React, { useState, useRef, KeyboardEvent } from 'react';
import { cn } from '@/lib/utils';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ onSendMessage, disabled = false, placeholder = "Écrivez votre message..." }: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmedInput = input.trim();
    if (trimmedInput && !disabled) {
      onSendMessage(trimmedInput);
      setInput('');
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter without Shift = send message
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  };

  return (
    <div className="sticky bottom-0 w-full bg-background border-t border-border p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-end gap-2 bg-muted rounded-2xl p-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className={cn(
              "flex-1 bg-transparent resize-none outline-none px-3 py-2",
              "text-sm md:text-base text-foreground placeholder:text-muted-foreground",
              "max-h-[150px] overflow-y-auto",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          />
          <Button
            onClick={handleSend}
            disabled={disabled || !input.trim()}
            size="sm"
            className="rounded-xl flex-shrink-0 aspect-square w-10 h-10 p-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">
          <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Enter</kbd> pour envoyer, 
          <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs ml-1">Shift + Enter</kbd> pour une nouvelle ligne
        </p>
      </div>
    </div>
  );
}
