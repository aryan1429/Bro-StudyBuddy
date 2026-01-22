import React from 'react';
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
}

export function ChatMessage({ message }: ChatMessageProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={message.id}
            className={`flex gap-4 max-w-3xl mx-auto ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
        >
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${message.role === 'assistant' ? 'bg-blue-600 text-white' : 'bg-slate-200'
                }`}>
                {message.role === 'assistant' ? '🤖' : '👤'}
            </div>

            {/* Bubble */}
            <div className={`flex flex-col gap-1 max-w-[80%] ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${message.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-white border border-slate-100 text-slate-700 rounded-bl-none'
                    }`}>
                    <p className="whitespace-pre-line">{message.content}</p>
                </div>

                {/* Message Actions (Assistant Only) */}
                {message.role === 'assistant' && (
                    <div className="flex items-center gap-2 mt-1 ml-2">
                        <button className="p-1 text-slate-300 hover:text-slate-500 transition-colors">
                            <ThumbsUp className="w-3 h-3" />
                        </button>
                        <button className="p-1 text-slate-300 hover:text-slate-500 transition-colors">
                            <ThumbsDown className="w-3 h-3" />
                        </button>
                        <button className="p-1 text-slate-300 hover:text-slate-500 transition-colors">
                            <Copy className="w-3 h-3" />
                        </button>
                        <span className="text-[10px] text-slate-300 ml-2" suppressHydrationWarning>{message.time}</span>
                    </div>
                )}
                {message.role === 'user' && (
                    <span className="text-[10px] text-slate-300 mr-2" suppressHydrationWarning>{message.time}</span>
                )}
            </div>
        </motion.div>
    );
}
