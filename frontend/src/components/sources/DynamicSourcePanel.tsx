'use client'

import { FileText, CheckCircle2, AlertTriangle, BookOpen, ExternalLink } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { type Citation } from '@/lib/api'
import { useState } from 'react'

interface DynamicSourcePanelProps {
    citations: Citation[]
}

export function DynamicSourcePanel({ citations }: DynamicSourcePanelProps) {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

    const getMatchColor = (score: number) => {
        const percent = score * 100
        if (percent >= 85) return { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400' }
        if (percent >= 70) return { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400' }
        return { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400' }
    }

    const getMatchIcon = (score: number) => {
        const percent = score * 100
        if (percent >= 85) return <CheckCircle2 className="w-4 h-4 text-green-500" />
        if (percent >= 70) return <CheckCircle2 className="w-4 h-4 text-blue-500" />
        return <AlertTriangle className="w-4 h-4 text-amber-500" />
    }

    return (
        <div className="w-[320px] bg-slate-950 h-full flex flex-col flex-shrink-0">
            <div className="p-4 border-b border-slate-800/50 flex items-center justify-between">
                <h3 className="font-semibold text-slate-200 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-400" />
                    Sources
                </h3>
                {citations.length > 0 && (
                    <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded-full">
                        {citations.length} found
                    </span>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {citations.length === 0 ? (
                    <div className="text-center py-8">
                        <FileText className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                        <p className="text-sm text-slate-500 font-medium">No sources yet</p>
                        <p className="text-xs text-slate-600 mt-1">
                            Ask a question to see relevant sources
                        </p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {citations.map((citation, index) => {
                            const colors = getMatchColor(citation.similarity_score)
                            const isExpanded = expandedIndex === index

                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`${colors.bg} p-4 rounded-xl border ${colors.border} shadow-sm transition-all cursor-pointer group hover:scale-[1.02] relative overflow-hidden`}
                                    onClick={() => setExpandedIndex(isExpanded ? null : index)}
                                >
                                    {/* Match indicator */}
                                    <div className="absolute top-2 right-2">
                                        {getMatchIcon(citation.similarity_score)}
                                    </div>

                                    {/* Header */}
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className={`p-1.5 ${colors.bg} ${colors.text} rounded-md`}>
                                            <FileText className="w-3.5 h-3.5" />
                                        </div>
                                        {citation.page_number && (
                                            <span className={`text-xs font-semibold ${colors.text} ${colors.bg} px-2 py-0.5 rounded-full`}>
                                                Page {citation.page_number}
                                            </span>
                                        )}
                                    </div>

                                    {/* Document name */}
                                    <h4 className="text-sm font-semibold text-slate-200 mb-2 pr-6">
                                        {citation.doc_name}
                                    </h4>

                                    {/* Snippet */}
                                    <p className={`text-xs text-slate-400 leading-relaxed mb-2 font-medium ${isExpanded ? '' : 'line-clamp-3'}`}>
                                        "{citation.chunk_text}"
                                    </p>

                                    {/* Match score */}
                                    <div className="flex items-center justify-between text-xs text-slate-500 mt-auto">
                                        <span className={`font-mono ${colors.bg} ${colors.text} px-2 py-0.5 rounded`}>
                                            {Math.round(citation.similarity_score * 100)}% match
                                        </span>
                                        <span className="text-slate-600 group-hover:text-slate-400 transition-colors">
                                            {isExpanded ? 'Click to collapse' : 'Click to expand'}
                                        </span>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                )}
            </div>

            {/* Footer */}
            {citations.length > 0 && (
                <div className="p-4 border-t border-slate-800/50">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>
                            Avg. relevance: {Math.round((citations.reduce((acc, c) => acc + c.similarity_score, 0) / citations.length) * 100)}%
                        </span>
                        <button className="hover:text-slate-300 transition-colors">
                            View all
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
