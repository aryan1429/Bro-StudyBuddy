"use client";
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/Sidebar';
import { SourcePanel } from '@/components/sources/SourcePanel';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { Mic, Send, Paperclip, MoreVertical, RotateCcw, Home, Loader2, Upload, Bell, Share, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';

export default function AppPage() {
    type Message = { id: number; role: 'user' | 'assistant'; content: string; time: string };

    const [messages, setMessages] = useState<Message[]>([]);
    const [isHydrated, setIsHydrated] = useState(false);
    const [latestAssistantId, setLatestAssistantId] = useState<number | null>(null);

    // Set initial greeting message
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
        event.target.value = '';
        setIsUploading(true);
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
            {/* 1. Sidebar (Full Height) */}
            <Sidebar />

            {/* 2. Main Content Area */}
            <div className="flex-1 flex flex-col h-full relative">

                {/* Header */}
                <header className="h-16 flex items-center justify-between px-6 bg-slate-950 border-b border-slate-800/50 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm shadow-lg shadow-blue-500/20">
                            🤖
                        </div>
                        <h2 className="font-semibold text-slate-100 text-sm">Chat with Bro</h2>
                    </div>
                    <div className="flex gap-4 text-slate-400">
                        <Bell className="w-4 h-4 hover:text-white cursor-pointer transition-colors" />
                        <Share className="w-4 h-4 hover:text-white cursor-pointer transition-colors" />
                        <Lock className="w-4 h-4 hover:text-white cursor-pointer transition-colors" />
                    </div>
                </header>

                <div className="flex flex-1 overflow-hidden">
                    {/* Chat Feed */}
                    <div className="flex-1 flex flex-col relative">
                        {/* Messages List */}
                        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                            {isHydrated && messages.map((msg) => (
                                <ChatMessage
                                    key={msg.id}
                                    message={msg}
                                    isNew={msg.role === 'assistant' && msg.id === latestAssistantId}
                                />
                            ))}
                            {isLoading && (
                                <div className="flex items-center gap-3 text-slate-500 animate-pulse px-4">
                                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                                        <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                                    </div>
                                    <span className="text-sm font-medium">Bro is thinking...</span>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 md:px-6 pb-6">
                            <div className="relative bg-slate-900 rounded-xl border border-slate-800 focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/20 transition-all shadow-lg">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    accept=".pdf,.doc,.docx,.txt,.md"
                                />
                                <div className="flex items-center px-4 py-3 gap-3">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-slate-500 hover:text-blue-400 hover:bg-slate-800/50 rounded-full flex-shrink-0"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isUploading}
                                    >
                                        {isUploading ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Paperclip className="w-4 h-4" />
                                        )}
                                    </Button>

                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Type message..."
                                        disabled={isLoading}
                                        className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-slate-200 placeholder:text-slate-500"
                                    />

                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-slate-500 hover:text-white"
                                        >
                                            <Mic className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            className="h-8 w-8 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-sm"
                                            onClick={handleSendMessage}
                                            disabled={isLoading || !inputValue.trim()}
                                        >
                                            <Send className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className="text-center mt-2.5">
                                <p className="text-[10px] text-slate-600 font-medium tracking-wide">AI can make mistakes. Check important info.</p>
                            </div>
                        </div>
                    </div>

                    {/* 3. Sources Panel (Right Column) */}
                    <div className="hidden lg:block border-l border-slate-800/50 bg-slate-950/50">
                        <SourcePanel />
                    </div>
                </div>
            </div>
        </div>
    );
}
