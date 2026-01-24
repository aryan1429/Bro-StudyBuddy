"use client";
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/Sidebar';
import { SourcePanel } from '@/components/sources/SourcePanel';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { Mic, Send, Paperclip, MoreVertical, RotateCcw, Home, Loader2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';

export default function AppPage() {
    type Message = { id: number; role: 'user' | 'assistant'; content: string; time: string };

    const [messages, setMessages] = useState<Message[]>([]);
    const [isHydrated, setIsHydrated] = useState(false);
    const [latestAssistantId, setLatestAssistantId] = useState<number | null>(null);

    // Set initial greeting message after hydration to avoid server/client time mismatch
    useEffect(() => {
        if (!isHydrated) {
            setIsHydrated(true);
            setMessages([
                {
                    id: Date.now(),
                    role: 'assistant' as const,
                    content: "👋 Hey there! I'm **Bro**, your AI study buddy.\n\nI'm here to help you learn faster and understand your materials better. Upload your notes, and I can:\n\n✨ Answer questions about your documents\n📝 Generate quizzes and flashcards\n🔍 Find relevant information instantly\n\nWhat would you like to study today?",
                    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                }
            ]);
        }
    }, [isHydrated]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Handle file upload
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Reset the input so the same file can be selected again
        event.target.value = '';

        setIsUploading(true);

        // Add a user message showing the file being uploaded
        const uploadingMessage: Message = {
            id: Date.now(),
            role: 'user',
            content: `📎 Uploading: ${file.name}`,
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, uploadingMessage]);

        try {
            const result = await api.uploadDocument(file);

            const successMessage: Message = {
                id: Date.now() + 1,
                role: 'assistant',
                content: `✅ **File uploaded successfully!**\n\n📄 **${result.filename}**\n\nYour document is now being processed. Once ready, you can ask me questions about it, generate quizzes, or create flashcards!`,
                time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, successMessage]);
        } catch (error) {
            const errorMessage: Message = {
                id: Date.now() + 1,
                role: 'assistant',
                content: `❌ **Upload failed**\n\n${error instanceof Error ? error.message : 'Something went wrong. Please try again.'}`,
                time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsUploading(false);
        }
    };

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleReload = () => {
        setMessages([
            {
                id: Date.now(),
                role: 'assistant' as const,
                content: '👋 Hey there! I\'m **Bro**, your AI study buddy.\n\nI\'m here to help you learn faster and understand your materials better. Upload your notes, and I can:\n\n✨ Answer questions about your documents\n📝 Generate quizzes and flashcards\n🔍 Find relevant information instantly\n\nWhat would you like to study today?',
                time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
            }
        ]);
        setInputValue('');
    };

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now(),
            role: 'user',
            content: inputValue.trim(),
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await api.chat(userMessage.content);

            const assistantMessage: Message = {
                id: Date.now() + 1,
                role: 'assistant',
                content: response.answer,
                time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
            };

            setMessages(prev => [...prev, assistantMessage]);
            setLatestAssistantId(assistantMessage.id);
        } catch (error) {
            const errorMessage: Message = {
                id: Date.now() + 1,
                role: 'assistant',
                content: "❌ Sorry, I couldn't process your request. Please make sure you have uploaded a document first, or try again later.",
                time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="flex h-screen bg-slate-950 overflow-hidden font-sans text-slate-100">
            {/* 1. Sidebar */}
            <Sidebar />

            {/* 2. Main Chat Area */}
            <div className="flex-1 flex flex-col h-full relative">
                {/* Chat Header */}
                <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-violet-600/20 flex items-center justify-center text-xl ring-1 ring-violet-500/30">
                            🤖
                        </div>
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
                <div className="flex-1 overflow-hidden p-4 md:p-6 bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black relative">

                    {/* Background decoration */}
                    <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(to_bottom,transparent,black)] pointer-events-none"></div>

                    <div className="h-full max-w-4xl mx-auto glass-card rounded-2xl overflow-hidden flex flex-col relative z-20">
                        {/* Messages List */}
                        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                            {isHydrated && messages.map((msg) => (
                                <ChatMessage
                                    key={msg.id}
                                    message={msg}
                                    isNew={msg.role === 'assistant' && msg.id === latestAssistantId}
                                />
                            ))}
                            {isLoading && (
                                <div className="flex items-center gap-3 text-slate-500 animate-pulse">
                                    <div className="w-8 h-8 rounded-full bg-violet-600/20 flex items-center justify-center ring-1 ring-violet-500/30">
                                        <Loader2 className="w-4 h-4 animate-spin text-violet-400" />
                                    </div>
                                    <span className="text-sm text-slate-400">Bro is thinking...</span>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Suggested Questions (shown when no messages or only greeting) */}
                        {messages.length <= 1 && (
                            <div className="px-4 md:px-6 pb-4 md:pb-6 pt-0">
                                <p className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wider">💡 Suggested questions:</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <button
                                        onClick={() => setInputValue('Summarize my uploaded document')}
                                        className="text-left px-4 py-3 bg-white/5 border border-white/5 rounded-xl hover:border-violet-500/50 hover:bg-violet-500/5 transition-all text-sm text-slate-400 hover:text-violet-300 group"
                                    >
                                        <span className="mr-2">📚</span> Summarize my uploaded document
                                    </button>
                                    <button
                                        onClick={() => setInputValue('Create a quiz from my notes')}
                                        className="text-left px-4 py-3 bg-white/5 border border-white/5 rounded-xl hover:border-violet-500/50 hover:bg-violet-500/5 transition-all text-sm text-slate-400 hover:text-violet-300 group"
                                    >
                                        <span className="mr-2">❓</span> Create a quiz from my notes
                                    </button>
                                    <button
                                        onClick={() => setInputValue('Explain key concepts in detail')}
                                        className="text-left px-4 py-3 bg-white/5 border border-white/5 rounded-xl hover:border-violet-500/50 hover:bg-violet-500/5 transition-all text-sm text-slate-400 hover:text-violet-300 group"
                                    >
                                        <span className="mr-2">🔍</span> Explain key concepts in detail
                                    </button>
                                    <button
                                        onClick={() => setInputValue('Generate flashcards for studying')}
                                        className="text-left px-4 py-3 bg-white/5 border border-white/5 rounded-xl hover:border-violet-500/50 hover:bg-violet-500/5 transition-all text-sm text-slate-400 hover:text-violet-300 group"
                                    >
                                        <span className="mr-2">📝</span> Generate flashcards for studying
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Input Area - Inside Chatbox */}
                        <div className="p-4 md:px-6 border-t border-white/5 bg-slate-900/50 backdrop-blur-md">
                            <div className="relative">
                                <div className="absolute left-3 top-3 flex gap-1">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileUpload}
                                        className="hidden"
                                        accept=".pdf,.doc,.docx,.txt,.md"
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-slate-500 hover:text-violet-400 hover:bg-violet-500/10 rounded-full"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isUploading}
                                    >
                                        {isUploading ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Paperclip className="w-4 h-4" />
                                        )}
                                    </Button>
                                </div>
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Type a message..."
                                    disabled={isLoading}
                                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl pl-12 pr-12 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all placeholder:text-slate-600 text-slate-200 disabled:opacity-50"
                                />
                                <div className="absolute right-3 top-2.5 flex gap-1">
                                    <Button
                                        size="icon"
                                        className="h-9 w-9 bg-violet-600 hover:bg-violet-700 text-white rounded-lg shadow-lg shadow-violet-600/20 transition-all disabled:opacity-50"
                                        onClick={handleSendMessage}
                                        disabled={isLoading || !inputValue.trim()}
                                    >
                                        {isLoading ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Send className="w-4 h-4" />
                                        )}
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

            {/* 3. Sources Panel */}
            <SourcePanel />
        </div>
    );
}
