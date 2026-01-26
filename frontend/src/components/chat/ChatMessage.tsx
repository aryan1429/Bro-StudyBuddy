import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp, ThumbsDown, Copy, Bot, User, FileText, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';
import { useTypewriter } from '@/hooks/useTypewriter';
import { type Citation } from '@/lib/api';

interface ChatMessageProps {
    message: {
        id: number;
        role: 'user' | 'assistant';
        content: string;
        time: string;
        citations?: Citation[];
        confidence?: number;
    };
    isNew?: boolean;
}

// Simple markdown renderer for bold titles and inline bold
function renderMarkdown(text: string) {
    const lines = text.split('\n');
    
    return lines.map((line, lineIndex) => {
        // Check if line is a standalone bold title (line that's just **text**)
        const titleMatch = line.match(/^\*\*([^*]+)\*\*$/);
        if (titleMatch) {
            return (
                <div key={lineIndex} className="text-lg font-bold text-slate-100 mt-4 mb-2 first:mt-0">
                    {titleMatch[1]}
                </div>
            );
        }
        
        // For other lines, render inline bold and other formatting
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        const renderedParts = parts.map((part, partIndex) => {
            // Check for inline bold
            const boldMatch = part.match(/^\*\*([^*]+)\*\*$/);
            if (boldMatch) {
                return (
                    <strong key={partIndex} className="font-semibold text-slate-100">
                        {boldMatch[1]}
                    </strong>
                );
            }
            return <span key={partIndex}>{part}</span>;
        });
        
        // Return line with line break
        return (
            <React.Fragment key={lineIndex}>
                {renderedParts}
                {lineIndex < lines.length - 1 && <br />}
            </React.Fragment>
        );
    });
}

const ClientTime = ({ time }: { time: string }) => {
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);
    if (!mounted) return null;
    return <span className="text-xs text-slate-600 ml-auto">{time}</span>;
}

const ClientTimeUser = ({ time }: { time: string }) => {
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);
    if (!mounted) return null;
    return <span className="text-xs text-slate-600 ml-auto">{time}</span>;
}


export function ChatMessage({ message, isNew = false }: ChatMessageProps) {
    const shouldAnimate = message.role === 'assistant' && isNew;
    const { displayedText, isTyping } = useTypewriter(message.content, shouldAnimate);
    const [showCitations, setShowCitations] = useState(false);
    const [copiedText, setCopiedText] = useState(false);

    const hasCitations = message.citations && message.citations.length > 0;

    const handleCopy = () => {
        navigator.clipboard.writeText(message.content);
        setCopiedText(true);
        setTimeout(() => setCopiedText(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={message.id}
            className="flex gap-4 max-w-4xl"
        >
            {/* Avatar - Always Left */}
            <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-lg shadow-sm border ${message.role === 'assistant'
                    ? 'bg-blue-600/10 text-blue-500 border-blue-500/20'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                {message.role === 'assistant' ? '🤖' : '👤'}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pt-1">
                {/* Name Label */}
                <div className="flex items-center gap-2 mb-2">
                    <span className={`text-sm font-semibold ${message.role === 'assistant' ? 'text-blue-400' : 'text-slate-200'}`}>
                        {message.role === 'assistant' ? 'Bro' : 'You'}
                    </span>
                    <span className="text-[10px] text-slate-600 uppercase tracking-widest font-medium">
                        {message.time}
                    </span>
                    {hasCitations && (
                        <span className="text-[10px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {message.citations!.length} sources
                        </span>
                    )}
                </div>

                {/* Message Body */}
                <div className={`text-sm leading-relaxed ${message.role === 'assistant'
                        ? 'bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm text-slate-300 max-h-[60vh] overflow-y-auto'
                        : 'text-slate-400 pl-0 py-1 font-medium' // User: Minimalist text
                    }`}>
                    <div className="markdown-content">
                        {message.role === 'assistant' ? renderMarkdown(displayedText) : message.content}
                        {isTyping && (
                            <span className="inline-block w-0.5 h-4 bg-blue-500 ml-0.5 animate-pulse" />
                        )}
                    </div>

                    {/* Assistant Actions */}
                    {message.role === 'assistant' && !isTyping && (
                        <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-slate-800/50">
                            {/* Citations Toggle */}
                            {hasCitations && (
                                <>
                                    <button 
                                        onClick={() => setShowCitations(!showCitations)}
                                        className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 transition-colors w-fit"
                                    >
                                        <FileText className="w-3.5 h-3.5" />
                                        <span>{showCitations ? 'Hide' : 'View'} {message.citations!.length} source{message.citations!.length > 1 ? 's' : ''}</span>
                                        {showCitations ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                    </button>
                                    
                                    <AnimatePresence>
                                        {showCitations && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="space-y-2 overflow-hidden"
                                            >
                                                {message.citations!.map((citation, idx) => (
                                                    <div 
                                                        key={idx}
                                                        className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 text-xs"
                                                    >
                                                        <div className="flex items-center justify-between mb-2">
                                                            <div className="flex items-center gap-2">
                                                                <FileText className="w-3.5 h-3.5 text-blue-400" />
                                                                <span className="font-medium text-slate-200">{citation.doc_name}</span>
                                                                {citation.page_number && (
                                                                    <span className="bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded">
                                                                        Page {citation.page_number}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <span className={`px-2 py-0.5 rounded ${
                                                                citation.similarity_score >= 0.85 
                                                                    ? 'bg-green-500/10 text-green-400' 
                                                                    : citation.similarity_score >= 0.7 
                                                                    ? 'bg-blue-500/10 text-blue-400'
                                                                    : 'bg-amber-500/10 text-amber-400'
                                                            }`}>
                                                                {Math.round(citation.similarity_score * 100)}% match
                                                            </span>
                                                        </div>
                                                        <p className="text-slate-400 italic leading-relaxed">
                                                            "{citation.chunk_text}"
                                                        </p>
                                                    </div>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </>
                            )}
                            
                            {/* Action Buttons */}
                            <div className="flex items-center gap-4">
                                <button className="text-xs flex items-center gap-1.5 text-slate-500 hover:text-blue-400 transition-colors">
                                    <ThumbsUp className="w-3.5 h-3.5" />
                                    <span>Helpful</span>
                                </button>
                                <button className="text-xs flex items-center gap-1.5 text-slate-500 hover:text-blue-400 transition-colors">
                                    <ThumbsDown className="w-3.5 h-3.5" />
                                    <span>Report</span>
                                </button>
                                <button 
                                    onClick={handleCopy}
                                    className="text-xs flex items-center gap-1.5 text-slate-500 hover:text-blue-400 transition-colors ml-auto"
                                >
                                    {copiedText ? (
                                        <>
                                            <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                                            <span className="text-green-400">Copied!</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-3.5 h-3.5" />
                                            <span>Copy Answer</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
