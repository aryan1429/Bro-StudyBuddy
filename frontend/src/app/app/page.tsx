"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/Sidebar';
import { SourcePanel } from '@/components/sources/SourcePanel';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { Mic, Send, Paperclip, MoreVertical, RotateCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export default function AppPage() {
    type Message = { id: number; role: 'user' | 'assistant'; content: string; time: string };

    const [messages, setMessages] = useState<Message[]>([
        {
            id: Date.now(),
            role: 'assistant' as const,
            content: "👋 Hey there! I'm **Bro**, your AI study buddy.\n\nI'm here to help you learn faster and understand your materials better. Upload your notes, and I can:\n\n✨ Answer questions about your documents\n📝 Generate quizzes and flashcards\n🔍 Find relevant information instantly\n\nWhat would you like to study today?",
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        }
    ]);

    const handleReload = () => {
        setMessages([
            {
                id: Date.now(),
                role: 'assistant' as const,
                content: '👋 Hey there! I\'m **Bro**, your AI study buddy.\n\nI\'m here to help you learn faster and understand your materials better. Upload your notes, and I can:\n\n✨ Answer questions about your documents\n📝 Generate quizzes and flashcards\n🔍 Find relevant information instantly\n\nWhat would you like to study today?',
                time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
            }
        ]);
    };

    return (
        <div className="flex h-screen bg-white overflow-hidden font-sans text-slate-900">
            {/* 1. Sidebar */}
            <Sidebar />

            {/* 2. Main Chat Area */}
            <div className="flex-1 flex flex-col h-full relative">
                {/* Chat Header */}
                <header className="h-16 border-b border-slate-100 flex items-center justify-between px-6 bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xl">
                            🤖
                        </div>
                        <div>
                            <h2 className="font-bold text-slate-800 text-sm">Chat with Bro</h2>
                            <p className="text-xs text-slate-400">Always here to help</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/">
                            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-blue-600 hover:bg-blue-50 gap-2">
                                <Home className="w-4 h-4" />
                                <span className="text-sm font-medium">Home</span>
                            </Button>
                        </Link>
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-blue-600" onClick={handleReload}>
                            <RotateCcw className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-blue-600">
                            <MoreVertical className="w-4 h-4" />
                        </Button>
                    </div>
                </header>

                {/* Messages Container - Chatbox */}
                <div className="flex-1 overflow-hidden p-4 md:p-6 bg-slate-50">
                    <div className="h-full max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                        {/* Messages List */}
                        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                            {messages.map((msg) => (
                                <ChatMessage key={msg.id} message={msg} />
                            ))}
                        </div>

                        {/* Suggested Questions (shown when no messages or only greeting) */}
                        {messages.length <= 1 && (
                            <div className="px-4 md:px-6 pb-4 md:pb-6 pt-0">
                                <p className="text-xs font-semibold text-slate-500 mb-3">💡 Suggested questions:</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <button className="text-left px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all text-sm text-slate-600 hover:text-blue-600">
                                        📚 Summarize my uploaded document
                                    </button>
                                    <button className="text-left px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all text-sm text-slate-600 hover:text-blue-600">
                                        ❓ Create a quiz from my notes
                                    </button>
                                    <button className="text-left px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all text-sm text-slate-600 hover:text-blue-600">
                                        🔍 Explain key concepts in detail
                                    </button>
                                    <button className="text-left px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all text-sm text-slate-600 hover:text-blue-600">
                                        📝 Generate flashcards for studying
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>



                {/* Input Area */}
                <div className="p-4 bg-white border-t border-slate-100">
                    <div className="max-w-3xl mx-auto relative">
                        <div className="absolute left-3 top-3 flex gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full">
                                <Paperclip className="w-4 h-4" />
                            </Button>
                        </div>
                        <input
                            type="text"
                            placeholder="Type a message..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-12 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 text-slate-700"
                        />
                        <div className="absolute right-3 top-2.5 flex gap-1">
                            <Button size="icon" className="h-9 w-9 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all">
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                    <div className="text-center mt-2">
                        <p className="text-[10px] text-slate-300">Bro can make mistakes. Check important info.</p>
                    </div>
                </div>
            </div>

            {/* 3. Sources Panel */}
            <SourcePanel />
        </div>
    );
}
