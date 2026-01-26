'use client'

import { useState } from 'react'
import { FileText, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { type Citation } from '@/lib/api'

interface CitationBadgeProps {
    citation: Citation
    index: number
}

export function CitationBadge({ citation, index }: CitationBadgeProps) {
    const [isExpanded, setIsExpanded] = useState(false)
    const relevancePercent = Math.round(citation.similarity_score * 100)
    
    // Color based on relevance
    const getBadgeColor = () => {
        if (relevancePercent >= 85) return 'bg-green-500/10 text-green-400 border-green-500/30'
        if (relevancePercent >= 70) return 'bg-blue-500/10 text-blue-400 border-blue-500/30'
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30'
    }

    return (
        <div className="inline-block">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border transition-all hover:scale-105 ${getBadgeColor()}`}
            >
                <FileText className="w-3 h-3" />
                <span>[{index + 1}]</span>
                {citation.page_number && <span>p.{citation.page_number}</span>}
                {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 overflow-hidden"
                    >
                        <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 text-sm">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-slate-200">{citation.doc_name}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${getBadgeColor()}`}>
                                    {relevancePercent}% match
                                </span>
                            </div>
                            <p className="text-slate-400 text-xs leading-relaxed">
                                "{citation.chunk_text}"
                            </p>
                            {citation.page_number && (
                                <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                                    <FileText className="w-3 h-3" />
                                    Page {citation.page_number}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

interface CitationsListProps {
    citations: Citation[]
}

export function CitationsList({ citations }: CitationsListProps) {
    if (!citations || citations.length === 0) return null

    return (
        <div className="mt-3 pt-3 border-t border-slate-700/50">
            <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-slate-400">Sources:</span>
                <div className="flex flex-wrap gap-2">
                    {citations.map((citation, index) => (
                        <CitationBadge key={index} citation={citation} index={index} />
                    ))}
                </div>
            </div>
        </div>
    )
}
