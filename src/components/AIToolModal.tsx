'use client';

import { useState, useEffect } from 'react';
import { X, Sparkles, Copy, Check, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://prop.deals/v1';

// Map UI tool names to API promptType keys
const toolKeyMap: Record<string, string> = {
  // Research & Insights
  'Score Explained': 'explainSellingScore',
  'Property Highlights': 'propertyHighlights',
  'Similar Properties': 'similarPropertyComparison',
  'Price Prediction': 'aiPricePredictions',
  
  // Outreach Scripts
  'SMS Script': 'smsEmailAppraisalScript',
  'Email Introduction': 'smsEmailAppraisalScript',
  'Phone Call Script': 'getHomeownerInterestedASAP',
  'Door Knock Opener': 'uniqueProspectingMethods',
  
  // Win the Listing
  'Personalised Pitch': 'howToWinTheListing',
  'Objection Handling': 'objectionHandling',
  'Commission Script': 'commissionCalculator',
  'Pricing Strategy': 'pricingStrategy',
  
  // Marketing Generator
  'Facebook/Insta Ad': 'facebookAdGenerator',
  'Social Media Post': 'createMarketingMaterial',
  'Property Description': 'createMarketingMaterial',
  'Staging Ideas': 'virtualStagingSuggestions',
};

interface AIToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  toolName: string;
  leadId: string;
  propertyAddress: string;
}

export function AIToolModal({ isOpen, onClose, toolName, leadId, propertyAddress }: AIToolModalProps) {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && toolName && leadId) {
      fetchAIResponse();
    }
  }, [isOpen, toolName, leadId]);

  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      setResponse(null);
      setError(null);
      setCopied(false);
    }
  }, [isOpen]);

  const fetchAIResponse = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    const promptType = toolKeyMap[toolName];
    if (!promptType) {
      setError(`Unknown tool: ${toolName}`);
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('propdeals_jwt') || localStorage.getItem('propdeals_token');
      if (!token) {
        setError('Please log in to use AI tools');
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_URL}/chat-gpt/single-prompt-trigger/${leadId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ promptType }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to get AI response (${res.status})`);
      }

      const data = await res.json();
      setResponse(data.proposal || data.content || JSON.stringify(data, null, 2));
    } catch (err) {
      console.error('AI Tool error:', err);
      setError(err instanceof Error ? err.message : 'Failed to get AI response');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (response) {
      await navigator.clipboard.writeText(response);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl border border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{toolName}</h2>
              <p className="text-xs text-white/50 truncate max-w-md">{propertyAddress}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white/60" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {loading && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 animate-pulse">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div className="flex items-center space-x-2 text-white/70">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generating personalised response...</span>
              </div>
              <p className="text-white/40 text-sm mt-2">This may take 10-30 seconds</p>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400">
              <p className="font-medium">Error</p>
              <p className="text-sm mt-1">{error}</p>
              <button
                onClick={fetchAIResponse}
                className="mt-3 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-sm transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {response && !loading && (
            <div className="prose prose-invert prose-sm max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => <h1 className="text-xl font-bold text-white mb-3">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-lg font-semibold text-white mt-5 mb-2">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-base font-semibold text-white/90 mt-4 mb-2">{children}</h3>,
                  p: ({ children }) => <p className="text-white/80 leading-relaxed mb-3">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-3 text-white/80">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-3 text-white/80">{children}</ol>,
                  li: ({ children }) => <li className="text-white/80">{children}</li>,
                  strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-purple-500 pl-4 italic text-white/70 my-4">
                      {children}
                    </blockquote>
                  ),
                  code: ({ children }) => (
                    <code className="bg-white/10 px-1.5 py-0.5 rounded text-purple-300 text-sm">
                      {children}
                    </code>
                  ),
                }}
              >
                {response}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Footer */}
        {response && !loading && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-white/5">
            <p className="text-xs text-white/40">
              Powered by GPT-4o • Personalised for you
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={fetchAIResponse}
                className="px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                Regenerate
              </button>
              <button
                onClick={handleCopy}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium rounded-lg transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy to Clipboard</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
