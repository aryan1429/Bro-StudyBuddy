'use client'

import { useState } from 'react'
import { ChevronRight, FileText, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { type Citation } from '@/lib/api'
import { Button } from '../ui/button'
import { Card } from '../ui/card'

export function SourcesPanel({ citations }: { citations: Citation[] }) {
    const [isOpen, setIsOpen] = useState(true)
    const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null)

    if (citations.length === 0 && !isOpen) return null

    return (
        <>
            {/* Toggle Button */}
            {!isOpen && citations.length > 0 && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsOpen(true)}
                    className="fixed right-4 top-20"
                >
                    <ChevronRight className="w-4 h-4 mr-1" />
                    Sources ({citations.length})
                </Button>
            )}

            {/* Sources Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ x: 300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 300, opacity: 0 }}
                        className="w-80 border-l bg-background p-4 overflow-y-auto"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold">Sources</h3>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsOpen(false)}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>

                        {citations.length === 0 ? (
                            <p className="text-sm text-gray-500">No sources yet. Start a chat to see citations.</p>
                        ) : (
                            <div className="space-y-2">
                                {citations.map((citation, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <Card
                                            className="p-3 cursor-pointer hover:shadow-md transition-shadow"
                                            onClick={() => setSelectedCitation(citation)}
                                        >
                                            <div className="flex items-start space-x-2">
                                                <FileText className="w-4 h-4 text-primary mt-0.5" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium truncate">
                                                        {citation.doc_name}
                                                    </p>
                                                    {citation.page_number && (
                                                        <p className="text-xs text-gray-500">
                                                            Page {citation.page_number}
                                                        </p>
                                                    )}
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        Relevance: {(citation.similarity_score * 100).toFixed(0)}%
                                                    </p>
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Expanded Citation Modal */}
            <AnimatePresence>
                {selectedCitation && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                        onClick={() => setSelectedCitation(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-background rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="font-semibold text-lg">
                                        {selectedCitation.doc_name}
                                    </h3>
                                    {selectedCitation.page_number && (
                                        <p className="text-sm text-gray-500">
                                            Page {selectedCitation.page_number}
                                        </p>
                                    )}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setSelectedCitation(null)}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                                <p className="text-sm whitespace-pre-wrap">
                                    {selectedCitation.chunk_text}
                                </p>
                            </div>

                            <div className="mt-4">
                                <p className="text-xs text-gray-500">
                                    Similarity Score: {(selectedCitation.similarity_score * 100).toFixed(1)}%
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
