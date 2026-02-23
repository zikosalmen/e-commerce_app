'use client';

import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatWindow } from './ChatWindow';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatModal({ isOpen, onClose }: ChatModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 backdrop-blur-sm z-40",
          "animate-fade-in"
        )}
        onClick={onClose}
      />

      {/* Modal Container - Slide Panel from Right */}
      <div
        ref={modalRef}
        className={cn(
          "fixed right-0 top-0 h-full w-full md:w-[450px] lg:w-[500px]",
          "bg-background shadow-2xl z-50",
          "transform transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full",
          "flex flex-col animate-slide-in-right"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
          <div>
            <h2 className="text-xl font-bold text-foreground">Assistant Chat</h2>
            <p className="text-sm text-muted-foreground">Nous sommes là pour vous aider</p>
          </div>
          <button
            onClick={onClose}
            className={cn(
              "p-2 rounded-full hover:bg-muted transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-primary-500"
            )}
            aria-label="Fermer le chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Content - Full ChatWindow */}
        <div className="flex-1 overflow-hidden">
          <ChatWindow />
        </div>
      </div>
    </>
  );
}
