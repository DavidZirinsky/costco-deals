import React from 'react';
import { Mail } from 'lucide-react';

interface FloatingFeedbackButtonProps {
  email?: string;
}

export default function FloatingFeedbackButton({
  email = 'dzirinsky+feedback@gmail.com',
}: FloatingFeedbackButtonProps) {
  return (
    <aside aria-label="Feedback">
      <a
        href={`mailto:${email}`}
        className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 px-5 py-3 rounded-full font-semibold text-white bg-red-600 hover:bg-red-700 shadow-2xl hover:shadow-red-700/40 hover:scale-105 active:scale-95 transition-all duration-200 text-sm sm:text-base border border-white/20 group"
        title="Send Feedback"
      >
        <Mail className="w-5 h-5 transition-transform group-hover:scale-110" />
        <span>Send Feedback</span>
      </a>
    </aside>
  );
}
