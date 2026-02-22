'use client';

import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { cn } from '@/front/lib/utils';

interface FloatingChatButtonProps {
  className?: string;
}

export function FloatingChatButton({ className }: FloatingChatButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <div className={cn("fixed bottom-6 right-6 z-50", className)}>
        <div className="relative">
          {/* Tooltip */}
          {showTooltip && !isOpen && (
            <div className="absolute bottom-full right-0 mb-2 animate-fade-in">
              <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg">
                Besoin d'aide ?
                <div className="absolute top-full right-4 -mt-1">
                  <div className="border-8 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
                </div>
              </div>
            </div>
          )}

          {/* Notification Badge (pulse) */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />

          {/* Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className={cn(
              "w-14 h-14 rounded-full shadow-xl flex items-center justify-center",
              "bg-primary-600 text-white hover:bg-primary-700",
              "transition-all duration-300 hover:scale-110",
              "focus:outline-none focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-800",
              "cursor-pointer animate-bounce-once"
            )}
            aria-label="Ouvrir le chat"
          >
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <MessageCircle className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>
    </>
  );
}
