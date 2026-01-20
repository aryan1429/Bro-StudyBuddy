import React from 'react';
import { BookOpen, X, ExternalLink, ChevronRight, FileTezt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function SourcePanel() {
    return (
        <div className="w-[300px] bg-slate-50 border-l border-slate-200 h-screen flex flex-col flex-shrink-0">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    Sources
                </h3>
                <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-slate-600">
                        <ExternalLink className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-slate-600">
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Source Card 1 */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md">
                                <BookOpen className="w-3 h-3" />
                            </div>
                            <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">Page 4</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <h4 className="text-sm font-semibold text-slate-800 mb-1 leading-snug">Biology Notes - Mitosis</h4>
                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                        "Mitosis consists of several stages: prophase, metaphase, anaphase, and telophase. During prophase, the chromatin condenses..."
                    </p>
                </div>

                {/* Source Card 2 */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md">
                                <BookOpen className="w-3 h-3" />
                            </div>
                            <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">Page 12</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <h4 className="text-sm font-semibold text-slate-800 mb-1 leading-snug">Biology Notes - Cell Cycle</h4>
                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                        "The cell cycle is the series of events that take place in a cell leading to its division and duplication..."
                    </p>
                </div>
            </div>
        </div>
    );
}
