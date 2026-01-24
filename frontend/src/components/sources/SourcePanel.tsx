import React from 'react';
import { BookOpen, ChevronRight, ExternalLink, X, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function SourcePanel() {
    return (
        <div className="w-[320px] bg-slate-950 border-l border-slate-800/50 h-screen flex flex-col flex-shrink-0">
            <div className="p-4 border-b border-slate-800/50 flex items-center justify-between">
                <h3 className="font-semibold text-slate-200 flex items-center gap-2">
                    Sources
                </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">

                {/* Source Card 1 - Active/Verified */}
                <div className="bg-slate-900/50 p-4 rounded-xl border border-blue-500/20 shadow-sm transition-all cursor-pointer group hover:bg-slate-900 hover:border-blue-500/40 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-1.5">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 bg-blue-500/10 text-blue-400 rounded-md">
                            <FileText className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-semibold text-blue-100/70 bg-blue-500/10 px-2 py-0.5 rounded-full">Page 2</span>
                    </div>

                    <h4 className="text-sm font-semibold text-slate-200 mb-2">Biology Notes</h4>
                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mb-2 font-medium">
                        "Mitosis consists of several stages: prophase, metaphase, anaphase, and telophase..."
                    </p>
                    <div className="flex items-center text-xs text-slate-600 gap-1 mt-auto">
                        <span className="font-mono bg-slate-800 px-1.5 rounded">98% match</span>
                    </div>
                </div>

                {/* Source Card 2 - Standard */}
                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 shadow-sm transition-all cursor-pointer group hover:bg-slate-900 hover:border-slate-700">
                    <div className="absolute top-0 right-0 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 bg-slate-800 text-slate-400 rounded-md">
                            <FileText className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-semibold text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">Page 12</span>
                    </div>

                    <h4 className="text-sm font-semibold text-slate-300 mb-2">Physics Summary</h4>
                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mb-2 font-medium">
                        "Newton's second law aligns force, mass, and acceleration in a linear relationship..."
                    </p>
                    <div className="flex items-center text-xs text-slate-600 gap-1 mt-auto">
                        <span className="font-mono bg-slate-800 px-1.5 rounded">85% match</span>
                    </div>
                </div>

                {/* Source Card 3 - Warning/Low Match */}
                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 shadow-sm transition-all cursor-pointer group hover:bg-slate-900 hover:border-slate-700 opacity-70 hover:opacity-100">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 bg-slate-800 text-slate-400 rounded-md">
                            <FileText className="w-3.5 h-3.5" />
                        </div>
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500 ml-auto" />
                    </div>

                    <h4 className="text-sm font-semibold text-slate-300 mb-2">External Reference</h4>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-2 font-medium">
                        General context from knowledge base.
                    </p>
                </div>
            </div>

            {/* Source Footer/Pagination */}
            <div className="p-4 border-t border-slate-800/50">
                <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>3 sources found</span>
                    <button className="hover:text-slate-300">View all</button>
                </div>
            </div>
        </div>
    );
}
