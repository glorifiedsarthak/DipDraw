
import React from 'react';
import { ChatMessage } from '../types';

interface MessageBubbleProps {
  message: ChatMessage;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-4 md:gap-6 animate-fade-in ${isUser ? 'justify-end' : 'justify-start'} max-w-full`}>
      {!isUser && (
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/10">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      )}

      <div className={`flex flex-col gap-3 max-w-[85%] lg:max-w-[70%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`rounded-2xl px-4 py-3 leading-relaxed whitespace-pre-wrap ${
          isUser 
            ? 'bg-indigo-600 text-white rounded-tr-none shadow-xl shadow-indigo-600/10' 
            : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
        }`}>
          {message.parts.map((part, idx) => (
            <div key={idx} className="space-y-4">
              {part.text && <p className="text-sm md:text-base">{part.text}</p>}
              
              {part.image && (
                <div className="rounded-xl overflow-hidden border border-white/10 shadow-2xl mt-2 group relative">
                  <img src={part.image} alt="Generated" className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => window.open(part.image, '_blank')}
                      className="p-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-colors"
                    >
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {part.video && (
                <div className="rounded-xl overflow-hidden border border-white/10 shadow-2xl mt-2 bg-black aspect-video">
                  <video 
                    src={part.video} 
                    controls 
                    className="w-full h-full"
                    autoPlay
                    loop
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        
        <span className="text-[10px] text-slate-500 font-medium px-1">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {isUser && (
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
           <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
