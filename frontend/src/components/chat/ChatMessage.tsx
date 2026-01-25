import React from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, ThumbsDown, Copy, Bot, User } from 'lucide-react';
import { useTypewriter } from '@/hooks/useTypewriter';

interface ChatMessageProps {
    message: {
        id: number;
        role: 'user' | 'assistant';
        content: string;
        time: string;
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
                </div>

                {/* Message Body */}
                <div className={`text-sm leading-relaxed ${message.role === 'assistant'
                        ? 'bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm text-slate-300'
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
                        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-800/50">
                            <button className="text-xs flex items-center gap-1.5 text-slate-500 hover:text-blue-400 transition-colors">
                                <ThumbsUp className="w-3.5 h-3.5" />
                                <span>Helpful</span>
                            </button>
                            <button className="text-xs flex items-center gap-1.5 text-slate-500 hover:text-blue-400 transition-colors">
                                <ThumbsDown className="w-3.5 h-3.5" />
                                <span>Report</span>
                            </button>
                            <button className="text-xs flex items-center gap-1.5 text-slate-500 hover:text-blue-400 transition-colors ml-auto">
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Answer</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
