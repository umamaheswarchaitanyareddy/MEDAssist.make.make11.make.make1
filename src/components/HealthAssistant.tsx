import { useState, useRef, useEffect } from 'react';
import { sendChat, ChatMessage } from '../lib/api';
import EducationalBanner from './EducationalBanner';

export default function HealthAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Good morning, Alex. I’m here to help with medication questions, interactions, and general health information. What would you like to know?",
    },
    {
      role: 'user',
      content: 'Can I take my Metformin with breakfast?',
    },
    {
      role: 'assistant',
      content: 'Metformin is commonly taken with or just after a meal to reduce stomach upset, so breakfast is generally an appropriate time for a morning dose. Follow the schedule on your prescription, and check with your pharmacist if your label gives different instructions.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function send() {
    const content = input.trim();
    if (!content || loading) return;
    setInput('');
    const userMessage: ChatMessage = { role: 'user', content };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setLoading(true);
    try {
      const { reply } = await sendChat(newMessages);
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sorry, I encountered an error. Please try again.';
      setMessages(prev => [...prev, { role: 'assistant', content: message }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  const suggestions = [
    'What are common drug interactions I should know about?',
    'How should I take antibiotics properly?',
    'What foods should I avoid with blood pressure medication?',
  ];

  return (
    <div className="flex flex-col h-full max-h-screen">
      <div className="px-6 pt-6 pb-4 border-b border-[#1e293b]">
        <h1 className="font-['DM_Serif_Display'] text-2xl text-[#f1f5f9]">Health Assistant</h1>
        <p className="text-[#64748b] text-xs mt-0.5">Powered by OpenAI · web search enabled</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-[#06b6d4] flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
            )}
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-[#06b6d4] text-white rounded-tr-sm'
                  : 'bg-[#0f172a] text-[#e2e8f0] border border-[#1e293b] rounded-tl-sm'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#06b6d4] flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="bg-[#0f172a] border border-[#1e293b] px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1 items-center">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-1.5 h-1.5 bg-[#06b6d4] rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
              ))}
            </div>
          </div>
        )}

        {messages.length === 1 && !loading && (
          <div className="space-y-2 pt-2">
            <p className="text-xs text-[#64748b] text-center">Example questions:</p>
            {suggestions.map(s => (
              <button
                key={s}
                onClick={() => { setInput(s); textareaRef.current?.focus(); }}
                className="w-full text-left px-4 py-3 rounded-xl bg-[#0f172a] border border-[#1e293b] text-[#94a3b8] text-sm hover:border-[#06b6d4]/40 hover:text-[#f1f5f9] transition-all duration-150"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="px-4 pb-3 border-t border-[#1e293b] pt-3 space-y-2">
        <div className="flex gap-2 items-end">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about medications, health, interactions…"
            className="flex-1 resize-none bg-[#0f172a] border border-[#1e293b] rounded-xl px-4 py-3 text-sm text-[#f1f5f9] placeholder-[#475569] focus:outline-none focus:border-[#06b6d4]/60 transition-colors max-h-32 overflow-y-auto"
            style={{ lineHeight: '1.5' }}
          />
          <button
            onClick={send}
            disabled={!input.trim() || loading}
            className="p-3 rounded-xl bg-[#06b6d4] text-white hover:bg-[#0891b2] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <EducationalBanner />
      </div>
    </div>
  );
}
