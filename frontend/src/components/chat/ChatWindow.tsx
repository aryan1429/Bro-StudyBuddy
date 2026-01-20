'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Loader2, Copy, RotateCcw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { api, type ChatResponse, type Citation } from '@/lib/api'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

interface Message {
    id: string
    type: 'user' | 'assistant'
    content: string
    citations?: Citation[]
    timestamp: Date
}

export function ChatWindow({
    selectedDocIds,
    onCitationsChange
}: {
    selectedDocIds?: string[]
    onCitationsChange?: (citations: Citation[]) => void
}) {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSend = async () => {
        if (!input.trim() || isLoading) return

        const userMessage: Message = {
            id: Date.now().toString(),
            type: 'user',
            content: input,
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMessage])
        setInput('')
        setIsLoading(true)

        try {
            const response = await api.chat(input, selectedDocIds || [])

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                type: 'assistant',
                content: response.answer,
                citations: response.citations,
                timestamp: new Date()
            }

            setMessages(prev => [...prev, assistantMessage])
            onCitationsChange?.(response.citations)
        } catch (error: any) {
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                type: 'assistant',
                content: `Error: ${error.message}`,
                timestamp: new Date()
            }
            setMessages(prev => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    const copyMessage = (content: string) => {
        navigator.clipboard.writeText(content)
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                    <div className="text-center text-gray-500 mt-8">
                        <p className="text-lg font-medium">Start a conversation</p>
                        <p className="text-sm mt-1">Ask questions about your uploaded documents</p>
                    </div>
                )}

                <AnimatePresence>
                    {messages.map((message) => (
                        <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[80%] rounded-lg p-4 ${message.type === 'user'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-card border'
                                    }`}
                            >
                                <p className="whitespace-pre-wrap">{message.content}</p>

                                {message.citations && message.citations.length > 0 && (
                                    <div className="mt-2 pt-2 border-t text-xs opacity-70">
                                        {message.citations.length} source{message.citations.length > 1 ? 's' : ''} cited
                                    </div>
                                )}

                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-xs opacity-60">
                                        {message.timestamp.toLocaleTimeString()}
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6"
                                        onClick={() => copyMessage(message.content)}
                                    >
                                        <Copy className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start"
                    >
                        <div className="bg-card border rounded-lg p-4">
                            <div className="flex items-center space-x-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span className="text-sm">Thinking...</span>
                            </div>
                        </div>
                    </motion.div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <div className="border-t p-4">
                <div className="flex space-x-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask a question about your documents..."
                        disabled={isLoading}
                        className="flex-1"
                    />
                    <Button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        size="icon"
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
