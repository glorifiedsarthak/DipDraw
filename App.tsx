
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage, ChatHistory, MessageRole } from './types';
import { generateText, generateImage, generateVideo, detectIntent } from './services/gemini';
import ChatSidebar from './components/ChatSidebar';
import ChatInput from './components/ChatInput';
import MessageBubble from './components/MessageBubble';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [histories, setHistories] = useState<ChatHistory[]>([
    { id: '1', title: 'New Conversation', lastUpdated: Date.now() }
  ]);
  const [activeHistoryId, setActiveHistoryId] = useState('1');
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, statusMessage]);

  const addMessage = useCallback((role: MessageRole, parts: any[]) => {
    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      role,
      parts,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage.id;
  }, []);

  const handleSend = async (input: string) => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    addMessage('user', [{ text: userMessage }]);
    setIsLoading(true);
    setStatusMessage("Analyzing prompt...");

    const intent = detectIntent(userMessage);

    try {
      if (intent.type === 'image') {
        setStatusMessage("Imagining your vision...");
        const images = await generateImage(intent.prompt);
        addMessage('assistant', images.map(img => ({ image: img })));
      } else if (intent.type === 'video') {
        setStatusMessage("Directing your video...");
        const videoUrl = await generateVideo(intent.prompt, (msg) => setStatusMessage(msg));
        addMessage('assistant', [{ video: videoUrl }]);
      } else {
        setStatusMessage("Thinking...");
        const text = await generateText(intent.prompt);
        addMessage('assistant', [{ text }]);
      }
    } catch (error: any) {
      console.error(error);
      addMessage('assistant', [{ text: `Error: ${error.message || "Failed to process request."}` }]);
    } finally {
      setIsLoading(false);
      setStatusMessage(null);
    }
  };

  const createNewChat = () => {
    const id = Math.random().toString(36).substr(2, 9);
    setHistories(prev => [{ id, title: 'New Conversation', lastUpdated: Date.now() }, ...prev]);
    setActiveHistoryId(id);
    setMessages([]);
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100">
      <ChatSidebar 
        histories={histories} 
        activeId={activeHistoryId} 
        onSelectChat={setActiveHistoryId}
        onNewChat={createNewChat}
      />
      
      <main className="flex-1 flex flex-col relative h-full">
        {/* Header */}
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="font-bold text-xs">G</span>
            </div>
            <h1 className="font-semibold text-lg tracking-tight">Gemini Omni-Chat</h1>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              API Ready
            </span>
          </div>
        </header>

        {/* Chat Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scroll-smooth"
        >
          {messages.length === 0 && !isLoading && (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto space-y-6 opacity-80">
              <div className="p-4 rounded-full bg-slate-900 border border-slate-800 mb-4">
                 <svg className="w-12 h-12 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                 </svg>
              </div>
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">What can I create for you?</h2>
              <p className="text-slate-400 text-lg">I can chat with you, generate stunning images, and create high-quality videos using simple text commands.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-8">
                {[
                  { label: "Chat", cmd: "Write a poem about neon cities", icon: "✍️" },
                  { label: "Image", cmd: "Generate image of a cybernetic owl", icon: "🖼️" },
                  { label: "Video", cmd: "Generate video of a red car speeding through Tokyo", icon: "🎬" }
                ].map((item, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleSend(item.cmd)}
                    className="p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-indigo-500/50 hover:bg-slate-800/50 transition-all text-left group"
                  >
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <div className="text-xs font-bold text-indigo-400 uppercase mb-1">{item.label}</div>
                    <div className="text-sm text-slate-300 group-hover:text-white line-clamp-2">"{item.cmd}"</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}

          {isLoading && (
            <div className="flex gap-4 items-start animate-fade-in max-w-3xl">
              <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center shrink-0">
                 <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div className="flex-1 space-y-4">
                <div className="h-4 bg-slate-800 rounded w-3/4 animate-pulse"></div>
                <div className="text-sm font-medium text-slate-500 italic">
                  {statusMessage || "Processing..."}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input area */}
        <ChatInput onSend={handleSend} disabled={isLoading} />
      </main>
    </div>
  );
};

export default App;
