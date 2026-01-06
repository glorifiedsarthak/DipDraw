
import React from 'react';
import { ChatHistory } from '../types';

interface ChatSidebarProps {
  histories: ChatHistory[];
  activeId: string;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ histories, activeId, onSelectChat, onNewChat }) => {
  return (
    <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col hidden lg:flex">
      <div className="p-4">
        <button 
          onClick={onNewChat}
          className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-lg border border-slate-700 flex items-center justify-center gap-2 transition-colors font-medium text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        <div className="px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Recent</div>
        {histories.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all flex items-center gap-3 group ${
              activeId === chat.id 
                ? 'bg-slate-800 text-white border border-slate-700' 
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <svg className={`w-4 h-4 ${activeId === chat.id ? 'text-indigo-400' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span className="truncate flex-1">{chat.title}</span>
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-slate-800 bg-slate-900/80">
        <div className="flex items-center gap-3 px-1">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
             <span className="text-xs font-bold">JD</span>
          </div>
          <div className="flex-1 overflow-hidden">
             <div className="text-sm font-medium truncate">User Account</div>
             <div className="text-xs text-slate-500">Free Tier</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ChatSidebar;
