import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, ThumbsDown, Copy } from 'lucide-react';

interface Message {
    id: number;
    role: 'user' | 'assistant';
    content: string;
    time: string;
}

interface ChatMessageProps {
    message: Message;
    isNew?: boolean; // Flag to enable typewriter for new messages
}

// Typewriter hook for fast text animation
function useTypewriter(text: string, enabled: boolean, speed: number = 15) {
    const [displayedText, setDisplayedText] = useState(enabled ? '' : text);
    const [isTyping, setIsTyping] = useState(enabled);
    const indexRef = useRef(0);

    useEffect(() => {
        if (!enabled) {
            setDisplayedText(text);
            setIsTyping(false);
            return;
        }

        setDisplayedText('');
        indexRef.current = 0;
        setIsTyping(true);

        const interval = setInterval(() => {
            if (indexRef.current < text.length) {
                setDisplayedText(text.slice(0, indexRef.current + 1));
                indexRef.current++;
            } else {
                setIsTyping(false);
                clearInterval(interval);
            }
        }, speed);

        return () => clearInterval(interval);
    }, [text, enabled, speed]);

    return { displayedText, isTyping };
}

// Client-only time display to prevent hydration mismatch
function ClientTime({ time }: { time: string }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <span className="text-[10px] text-slate-300 ml-2">&nbsp;</span>;
    }

    return <span className="text-[10px] text-slate-300 ml-2">{time}</span>;
}

function ClientTimeUser({ time }: { time: string }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <span className="text-[10px] text-slate-300 mr-2">&nbsp;</span>;
    }

    return <span className="text-[10px] text-slate-300 mr-2">{time}</span>;
}

export function ChatMessage({ message, isNew = false }: ChatMessageProps) {
    // Only animate assistant messages that are new
    const shouldAnimate = message.role === 'assistant' && isNew;
    const { displayedText, isTyping } = useTypewriter(message.content, shouldAnimate);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={message.id}
            className={`flex gap-4 max-w-3xl mx-auto ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
        >
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center shadow-lg ${message.role === 'assistant' ? 'bg-violet-600/20 text-xl ring-1 ring-violet-500/30' : 'bg-slate-800 text-slate-200 ring-1 ring-white/10'
                }`}>
                {message.role === 'assistant' ? '🤖' : '👤'}
            </div>

            {/* Bubble */}
            <div className={`flex flex-col gap-1 max-w-[80%] ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`p-4 rounded-2xl shadow-lg text-sm leading-relaxed backdrop-blur-sm ${message.role === 'user'
                    ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-br-none border border-violet-500/20'
                    : 'bg-slate-900/40 border border-white/5 text-slate-200 rounded-bl-none hover:bg-slate-900/60 transition-colors'
                    }`}>
                    <p className="whitespace-pre-line leading-relaxed">
                        {message.role === 'assistant' ? displayedText : message.content}
                        {isTyping && (
                            <span className="inline-block w-0.5 h-4 bg-violet-400 ml-0.5 animate-pulse" />
                        )}
                    </p>
                </div>

                {/* Message Actions (Assistant Only) */}
                {message.role === 'assistant' && (
                    <div className="flex items-center gap-2 mt-1 ml-2">
                        <button className="p-1 text-slate-500 hover:text-violet-400 transition-colors">
                            <ThumbsUp className="w-3 h-3" />
                        </button>
                        <button className="p-1 text-slate-500 hover:text-violet-400 transition-colors">
                            <ThumbsDown className="w-3 h-3" />
                        </button>
                        <button className="p-1 text-slate-500 hover:text-violet-400 transition-colors">
                            <Copy className="w-3 h-3" />
                        </button>
                        <ClientTime time={message.time} />
                    </div>
                )}
                {message.role === 'user' && (
                    <ClientTimeUser time={message.time} />
                )}
            </div>
        </motion.div>
    );
}
