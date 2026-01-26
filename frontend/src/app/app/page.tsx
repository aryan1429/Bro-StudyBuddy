"use client";
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/Sidebar';
import { DynamicSourcePanel } from '@/components/sources/DynamicSourcePanel';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { Mic, Send, Paperclip, MoreVertical, RotateCcw, Home, Loader2, Upload, Bell, Share, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { api, type Citation, type Document } from '@/lib/api';

export default function AppPage() {
    type Message = { 
        id: number; 
        role: 'user' | 'assistant'; 
        content: string; 
        time: string;
        citations?: Citation[];
        confidence?: number;
    };

    const [messages, setMessages] = useState<Message[]>([]);
    const [isHydrated, setIsHydrated] = useState(false);
    const [latestAssistantId, setLatestAssistantId] = useState<number | null>(null);
    const [currentCitations, setCurrentCitations] = useState<Citation[]>([]);
    const [documents, setDocuments] = useState<Document[]>([]);

    // Fetch documents on mount
    useEffect(() => {
        const fetchDocs = async () => {
            try {
                const data = await api.getDocuments();
                setDocuments(data.documents);
            } catch (error) {
                console.error('Failed to fetch documents:', error);
            }
        };
        fetchDocs();
    }, []);

    // Set initial greeting message
    useEffect(() => {
        if (!isHydrated) {
            setIsHydrated(true);
            setMessages([
                {
                    id: Date.now(),
                    role: 'assistant' as const,
                    content: "👋 Hey there! I'm **Bro**, your AI study buddy.\n\nI'm here to help you learn faster and understand your materials better. Upload your notes, and I can:\n\n✨ Answer questions about your documents with **citations**\n📝 Generate quizzes and flashcards\n🔍 Find relevant information instantly\n\nWhat would you like to study today?",
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

    // Refresh documents after upload
    const refreshDocuments = async () => {
        try {
            const data = await api.getDocuments();
            setDocuments(data.documents);
        } catch (error) {
            console.error('Failed to refresh documents:', error);
        }
    };

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
            // Refresh document list
            await refreshDocuments();
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
                content: '👋 Hey there! I\'m **Bro**, your AI study buddy.\n\nI\'m here to help you learn faster and understand your materials better. Upload your notes, and I can:\n\n✨ Answer questions about your documents with **citations**\n📝 Generate quizzes and flashcards\n🔍 Find relevant information instantly\n\nWhat would you like to study today?',
                time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
            }
        ]);
        setInputValue('');
        setCurrentCitations([]);
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
            // Pass all ready document IDs to the chat API
            const readyDocIds = documents
                .filter(doc => doc.status === 'ready')
                .map(doc => doc.doc_id);
            
            const response = await api.chat(userMessage.content, readyDocIds);
            const assistantMessage: Message = {
                id: Date.now() + 1,
                role: 'assistant',
                content: response.answer,
                time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                citations: response.citations,
                confidence: response.confidence
            };
            setMessages(prev => [...prev, assistantMessage]);
            setLatestAssistantId(assistantMessage.id);
            // Update current citations for the source panel
            if (response.citations && response.citations.length > 0) {
                setCurrentCitations(response.citations);
            }
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
        <div className="flex h-screen bg-slate-950 font-sans text-slate-100 overflow-hidden">
            {/* 1. Sidebar (Full Height) */}
            <Sidebar documents={documents} onRefresh={refreshDocuments} />

            {/* 2. Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">

                {/* Header */}
                <header className="h-16 flex items-center justify-between px-6 bg-slate-950 border-b border-slate-800/50 shrink-0">
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
                        {/* Messages List - scrollable area */}
                        <div className="absolute top-0 left-0 right-0 bottom-[140px] overflow-y-auto p-4 md:p-6 pt-6">
                            <div className="space-y-6 pt-14">
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
                        </div>

                        {/* Input Area - fixed at bottom */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 md:px-6 pb-6 bg-slate-950">
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
                        <DynamicSourcePanel citations={currentCitations} />
                    </div>
                </div>
            </div>
        </div>
    );
}
