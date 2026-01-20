"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/Sidebar';
import { SourcePanel } from '@/components/sources/SourcePanel';
import { Mic, Send, Paperclip, MoreVertical, ThumbsUp, ThumbsDown, Copy, RotateCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export default function AppPage() {
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: 'user',
            content: 'What are the phases of mitosis?',
            time: '12:40 PM'
        },
        {
            id: 2,
            role: 'assistant',
            content: 'The phases of mitosis are:\n\n1. **Prophase**: Chromatin condenses into chromosomes, and the nuclear envelope breaks down.\n2. **Metaphase**: Chromosomes align at the cell\'s equator.\n3. **Anaphase**: Sister chromatids separate and move to opposite poles.\n4. **Telophase**: Nuclear envelopes reform around new nuclei.',
            time: '12:41 PM'
        }
    ]);

    const handleReload = () => {
        setMessages([]);
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

                {/* Messages List */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 bg-[#F8FAFC]">
                    {messages.map((msg) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={msg.id}
                            className={`flex gap-4 max-w-3xl mx-auto ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                        >
                            {/* Avatar */}
                            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === 'assistant' ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}>
                                {msg.role === 'assistant' ? '🤖' : '👤'}
                            </div>

                            {/* Bubble */}
                            <div className={`flex flex-col gap-1 max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${msg.role === 'user'
                                    ? 'bg-blue-600 text-white rounded-br-none'
                                    : 'bg-white border border-slate-100 text-slate-700 rounded-bl-none'
                                    }`}>
                                    <p className="whitespace-pre-line">{msg.content}</p>
                                </div>

                                {/* Message Actions (Assistant Only) */}
                                {msg.role === 'assistant' && (
                                    <div className="flex items-center gap-2 mt-1 ml-2">
                                        <button className="p-1 text-slate-300 hover:text-slate-500 transition-colors"><ThumbsUp className="w-3 h-3" /></button>
                                        <button className="p-1 text-slate-300 hover:text-slate-500 transition-colors"><ThumbsDown className="w-3 h-3" /></button>
                                        <button className="p-1 text-slate-300 hover:text-slate-500 transition-colors"><Copy className="w-3 h-3" /></button>
                                        <span className="text-[10px] text-slate-300 ml-2">{msg.time}</span>
                                    </div>
                                )}
                                {msg.role === 'user' && (
                                    <span className="text-[10px] text-slate-300 mr-2">{msg.time}</span>
                                )}
                            </div>
                        </motion.div>
                    ))}
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
