import React from 'react';
import Link from 'next/link';
import { Home, RotateCcw, MoreVertical, Paperclip, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { motion } from 'framer-motion';

export interface Message {
    id: number;
    role: 'user' | 'assistant';
    content: string;
    time: string;
}

interface ChatBoxProps {
    messages: Message[];
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    handleReload: () => void;
}

export function ChatBox({ messages, setMessages, handleReload }: ChatBoxProps) {
    return (
        <div className="flex-1 flex flex-col h-full relative bg-slate-950">
            {/* Chat Header */}
            <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-violet-600/20 flex items-center justify-center text-xl ring-1 ring-violet-500/30">🤖</div>
                    <div>
                        <h2 className="font-bold text-slate-100 text-sm">Chat with Bro</h2>
                        <p className="text-xs text-slate-400">Always here to help</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Link href="/">
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-violet-400 hover:bg-violet-500/10 gap-2">
                            <Home className="w-4 h-4" />
                            <span className="text-sm font-medium">Home</span>
                        </Button>
                    </Link>
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-violet-400 hover:bg-violet-500/10" onClick={handleReload}>
                        <RotateCcw className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-violet-400 hover:bg-violet-500/10">
                        <MoreVertical className="w-4 h-4" />
                    </Button>
                </div>
            </header>

            {/* Messages Container - Chatbox */}
            <div className="flex-1 overflow-hidden p-4 md:p-6 bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
                <div className="h-full max-w-4xl mx-auto glass-card rounded-2xl overflow-hidden flex flex-col relative">

                    {/* Background decoration */}
                    <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(to_bottom,transparent,black)] pointer-events-none"></div>

                    {/* Messages List */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 relative z-10 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        {messages.map((msg) => (
                            <ChatMessage key={msg.id} message={msg} />
                        ))}
                    </div>

                    {/* Suggested Questions - Inside Chatbox */}
                    {messages.length <= 1 && (
                        <div className="px-4 md:px-6 pb-4 relative z-10">
                            <p className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wider">💡 Suggested questions:</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <button className="text-left px-4 py-3 bg-white/5 border border-white/5 rounded-xl hover:border-violet-500/50 hover:bg-violet-500/5 transition-all text-sm text-slate-400 hover:text-violet-300 group">
                                    <span className="mr-2">📚</span> Summarize my uploaded Document
                                </button>
                                <button className="text-left px-4 py-3 bg-white/5 border border-white/5 rounded-xl hover:border-violet-500/50 hover:bg-violet-500/5 transition-all text-sm text-slate-400 hover:text-violet-300 group">
                                    <span className="mr-2">❓</span> Create a Quiz from my Notes
                                </button>
                                <button className="text-left px-4 py-3 bg-white/5 border border-white/5 rounded-xl hover:border-violet-500/50 hover:bg-violet-500/5 transition-all text-sm text-slate-400 hover:text-violet-300 group">
                                    <span className="mr-2">🔍</span> Explain key concepts in detail
                                </button>
                                <button className="text-left px-4 py-3 bg-white/5 border border-white/5 rounded-xl hover:border-violet-500/50 hover:bg-violet-500/5 transition-all text-sm text-slate-400 hover:text-violet-300 group">
                                    <span className="mr-2">📝</span> Generate flashcards for studying
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Input Area - Inside Chatbox */}
                    <div className="p-4 md:px-6 border-t border-white/5 bg-slate-900/50 relative z-10">
                        <div className="relative">
                            <div className="absolute left-3 top-3 flex gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-violet-400 hover:bg-violet-500/10 rounded-full">
                                    <Paperclip className="w-4 h-4" />
                                </Button>
                            </div>
                            <input
                                type="text"
                                placeholder="Type a message..."
                                className="w-full bg-slate-950/50 border border-white/10 rounded-xl pl-12 pr-12 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all placeholder:text-slate-600 text-slate-200"
                            />
                            <div className="absolute right-3 top-2.5 flex gap-1">
                                <Button size="icon" className="h-9 w-9 bg-violet-600 hover:bg-violet-700 text-white rounded-lg shadow-lg shadow-violet-600/20 transition-all">
                                    <Send className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="text-center mt-2">
                            <p className="text-[10px] text-slate-600">Bro can make mistakes. Check important info.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
