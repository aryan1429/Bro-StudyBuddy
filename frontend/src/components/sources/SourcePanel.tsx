import React from 'react';
import { BookOpen, X, ExternalLink, ChevronRight, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function SourcePanel() {
    return (
        <div className="w-[300px] bg-slate-950 border-l border-white/10 h-screen flex flex-col flex-shrink-0">
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-slate-900/50 backdrop-blur-md">
                <h3 className="font-semibold text-slate-200 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-violet-500" />
                    Sources
                </h3>
                <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-slate-300">
                        <ExternalLink className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-slate-300">
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Source Card 1 */}
                <div className="bg-slate-900/40 p-3 rounded-xl border border-white/5 shadow-sm hover:shadow-md hover:bg-slate-800/60 hover:border-violet-500/30 transition-all cursor-pointer group">
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-violet-500/10 text-violet-400 rounded-md">
                                <BookOpen className="w-3 h-3" />
                            </div>
                            <span className="text-xs font-semibold text-violet-300 bg-violet-500/10 px-2 py-0.5 rounded-full border border-violet-500/20">Page 4</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-violet-400 transition-colors" />
                    </div>
                    <h4 className="text-sm font-semibold text-slate-200 mb-1 leading-snug">Biology Notes - Mitosis</h4>
                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed group-hover:text-slate-400 transition-colors">
                        "Mitosis consists of several stages: prophase, metaphase, anaphase, and telophase. During prophase, the chromatin condenses..."
                    </p>
                </div>

                {/* Source Card 2 */}
                <div className="bg-slate-900/40 p-3 rounded-xl border border-white/5 shadow-sm hover:shadow-md hover:bg-slate-800/60 hover:border-violet-500/30 transition-all cursor-pointer group">
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-violet-500/10 text-violet-400 rounded-md">
                                <BookOpen className="w-3 h-3" />
                            </div>
                            <span className="text-xs font-semibold text-violet-300 bg-violet-500/10 px-2 py-0.5 rounded-full border border-violet-500/20">Page 12</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-violet-400 transition-colors" />
                    </div>
                    <h4 className="text-sm font-semibold text-slate-200 mb-1 leading-snug">Biology Notes - Cell Cycle</h4>
                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed group-hover:text-slate-400 transition-colors">
                        "The cell cycle is the series of events that take place in a cell leading to its division and duplication..."
                    </p>
                </div>
            </div>
        </div>
    );
}
