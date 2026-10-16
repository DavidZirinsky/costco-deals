import React from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import { Button } from './ui/Button';

interface ContactPageProps {
  onBack: () => void;
  warehouseName?: string;
}

export default function ContactPage({ onBack, warehouseName }: ContactPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col justify-between font-sans">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 hover:text-costco-blue transition-colors border border-gray-200 shadow-sm cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Deals</span>
            </button>
            <h1 className="text-lg sm:text-xl font-bold text-costco-blue tracking-tight leading-tight">
              Dave&apos;s Dank Costco Discoveries
            </h1>
          </div>
          {warehouseName && (
            <div className="hidden sm:flex items-center text-xs sm:text-sm text-gray-500 font-medium">
              📍 Shopping: {warehouseName}
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-xl mx-auto">
          {/* Contact Section */}
          <section id="contact-section" className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 sm:p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-costco-red mb-6 shadow-sm border border-red-100">
              <Mail className="w-8 h-8" />
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 tracking-tight">
              Contact Us
            </h2>
            
            <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
              We&apos;d love to hear your feedback, deal findings, or feature requests.
            </p>
            
            <Button asChild size="lg" className="bg-costco-red hover:bg-red-700 text-white font-semibold shadow-md px-8 py-3 rounded-xl transition-all hover:scale-105 active:scale-95">
              <a href="mailto:dzirinsky+feedback@gmail.com">
                <Mail className="w-5 h-5 mr-2" />
                Send Feedback
              </a>
            </Button>

            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-center gap-1.5 text-xs sm:text-sm text-gray-500">
              <span>Direct email:</span>
              <a
                href="mailto:dzirinsky+feedback@gmail.com"
                className="font-medium text-costco-blue hover:underline"
              >
                dzirinsky+feedback@gmail.com
              </a>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-gray-200 bg-white text-center text-xs text-gray-500">
        Dave&apos;s Dank Costco Discoveries &bull; Deals &amp; Live Inventory
      </footer>
    </div>
  );
}
