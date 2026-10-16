import React from 'react';
import { Mail } from 'lucide-react';
import { Button } from './ui/Button';

interface ContactSectionProps {
  email?: string;
  className?: string;
}

export default function ContactSection({
  email = 'dzirinsky+feedback@gmail.com',
  className = '',
}: ContactSectionProps) {
  return (
    <section id="contact-section" className={`py-20 bg-gray-900 text-white border-t border-gray-800 ${className}`}>
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white mb-4">Contact Us</h2>
        <p className="text-xl text-gray-400 mb-8">
          We&apos;d love to hear your feedback.
        </p>
        <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 shadow-lg shadow-red-900/30">
          <a href={`mailto:${email}`}>
            <Mail className="w-5 h-5 mr-2" />
            Send Feedback
          </a>
        </Button>
      </div>
    </section>
  );
}
