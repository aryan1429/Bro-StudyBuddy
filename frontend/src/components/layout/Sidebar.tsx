'use client'

import React from 'react';
import Link from 'next/link';
import { FileText, MessageSquare, Plus, Settings, Brain, BookOpen, ChevronDown, Trash2, Loader2, RefreshCw, X, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { type Document, api } from '@/lib/api';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
    documents?: Document[];
    onRefresh?: () => void;
    isOpen?: boolean;
    onClose?: () => void;
    onLogout?: () => void;
}

export function Sidebar({ documents = [], onRefresh, isOpen = false, onClose, onLogout }: SidebarProps) {
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async (docId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this document?')) return;

        setDeletingId(docId);
        try {
            await api.deleteDocument(docId);
            onRefresh?.();
        } catch (error) {
            console.error('Failed to delete document:', error);
            alert('Failed to delete document');
        } finally {
            setDeletingId(null);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ready': return 'bg-green-500';
            case 'processing': return 'bg-yellow-500 animate-pulse';
            case 'failed': return 'bg-red-500';
            default: return 'bg-slate-500';
        }
    };

    const sidebarContent = (
        <div className="h-full flex flex-col text-slate-300">
            {/* Header */}
            <div className="p-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer group">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="font-bold text-lg text-white">🤖</span>
                    </div>
                    <span className="font-semibold text-lg text-slate-100">Bro</span>
                    <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors ml-1" />
                </Link>
                {/* Close button - only on mobile */}
                {onClose && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden h-8 w-8 text-slate-400 hover:text-white"
                        onClick={onClose}
                    >
                        <X className="w-5 h-5" />
                    </Button>
                )}
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">

                {/* Documents Section */}
                <div>
                    <div className="flex items-center justify-between px-2 mb-2">
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Documents</h3>
                        <div className="flex items-center gap-1">
                            {onRefresh && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-5 w-5 text-slate-500 hover:text-blue-400"
                                    onClick={onRefresh}
                                >
                                    <RefreshCw className="w-3 h-3" />
                                </Button>
                            )}
                        </div>
                    </div>
                    <div className="space-y-0.5">
                        {documents.length === 0 ? (
                            <div className="px-3 py-4 text-center">
                                <FileText className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                                <p className="text-xs text-slate-500">No documents yet</p>
                                <p className="text-xs text-slate-600 mt-1">Upload a PDF or document to get started</p>
                            </div>
                        ) : (
                            documents.map((doc) => (
                                <div
                                    key={doc.doc_id}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 rounded-md transition-colors group"
                                >
                                    <FileText className="w-4 h-4 text-slate-600 group-hover:text-slate-500 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <span className="text-sm font-medium truncate block">{doc.filename}</span>
                                        <span className="text-xs text-slate-600">
                                            {doc.chunk_count || 0} chunks
                                            {doc.page_count && ` • ${doc.page_count} pages`}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${getStatusColor(doc.status)}`}
                                            title={doc.status} />
                                        <button
                                            onClick={(e) => handleDelete(doc.doc_id, e)}
                                            className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all"
                                            disabled={deletingId === doc.doc_id}
                                        >
                                            {deletingId === doc.doc_id ? (
                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            ) : (
                                                <Trash2 className="w-3.5 h-3.5" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Study Mode Section */}
                <div>
                    <div className="flex items-center justify-between px-2 mb-2">
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Study Tools</h3>
                    </div>
                    <div className="space-y-0.5">
                        <Link href="/app/study" onClick={onClose}>
                            <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 rounded-md transition-colors group">
                                <Brain className="w-4 h-4 text-purple-500" />
                                <span className="text-sm font-medium">Quiz Mode</span>
                            </button>
                        </Link>
                        <Link href="/app/study" onClick={onClose}>
                            <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 rounded-md transition-colors group">
                                <BookOpen className="w-4 h-4 text-green-500" />
                                <span className="text-sm font-medium">Flashcards</span>
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Sessions Section */}
                <div>
                    <div className="flex items-center justify-between px-2 mb-2">
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sessions</h3>
                    </div>
                    <div className="space-y-0.5">
                        <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 rounded-md transition-colors">
                            <MessageSquare className="w-4 h-4 text-slate-600 group-hover:text-slate-500" />
                            <span className="text-sm font-medium">Current Chat</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* User Footer */}
            <div className="p-3 mt-auto space-y-1">
                <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 rounded-md transition-colors">
                    <Settings className="w-4 h-4" />
                    <span className="text-sm font-medium">All settings</span>
                </button>
                {onLogout && (
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-md transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-medium">Logout</span>
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar - Always visible on md+ */}
            <div className="hidden md:block w-[260px] bg-slate-950 border-r border-slate-800/50 h-screen flex-shrink-0">
                {sidebarContent}
            </div>

            {/* Mobile Sidebar - Overlay drawer */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                            onClick={onClose}
                        />
                        {/* Drawer */}
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="fixed left-0 top-0 bottom-0 w-[280px] bg-slate-950 border-r border-slate-800/50 z-50 md:hidden"
                        >
                            {sidebarContent}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
