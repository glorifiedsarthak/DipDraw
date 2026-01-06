
import React, { useState, KeyboardEvent } from 'react';

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 md:p-6 border-t border-slate-800 bg-slate-900/50 backdrop-blur-xl">
      <div className="max-w-4xl mx-auto relative group">
        <div className="absolute inset-0 bg-indigo-500/10 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity rounded-2xl pointer-events-none"></div>
        <div className="relative flex items-end gap-2 bg-slate-800 border border-slate-700 rounded-2xl p-2 transition-all focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/10">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message or use 'generate image...' / 'generate video...'"
            rows={1}
            disabled={disabled}
            className="flex-1 bg-transparent border-none focus:ring-0 text-slate-100 placeholder:text-slate-500 py-3 px-3 min-h-[52px] max-h-48 resize-none scrollbar-hide"
            style={{ height: 'auto' }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = `${target.scrollHeight}px`;
            }}
          />
          <div className="flex gap-2 p-1.5 shrink-0">
             <button
              onClick={handleSend}
              disabled={disabled || !input.trim()}
              className={`p-2.5 rounded-xl transition-all shadow-lg ${
                !input.trim() || disabled
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20'
              }`}
            >
              <svg className="w-5 h-5 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-3 px-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
           <span className="flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-slate-500"></span> Gemini 3 Pro</span>
           <span className="flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-slate-500"></span> Imagen 3</span>
           <span className="flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-slate-500"></span> Veo 3.1</span>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
