import React from 'react';
import Link from 'next/link';
import { FileText, MessageSquare, Plus, Settings, MoreHorizontal, User, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Sidebar() {
    return (
        <div className="w-[260px] bg-slate-950 border-r border-slate-800/50 h-screen flex flex-col text-slate-300 flex-shrink-0">
            {/* Header */}
            <div className="p-4 flex items-center gap-2">
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer group">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="font-bold text-lg text-white">🤖</span>
                    </div>
                    <span className="font-semibold text-lg text-slate-100">Bro</span>
                    <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors ml-1" />
                </Link>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">

                {/* Documents Section */}
                <div>
                    <div className="flex items-center justify-between px-2 mb-2">
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Documents</h3>
                        <Button variant="ghost" size="icon" className="h-4 w-4 text-slate-500 hover:text-blue-400">
                            <Plus className="w-3 h-3" />
                        </Button>
                    </div>
                    <div className="space-y-0.5">
                        {/* Active Item */}
                        <button className="w-full flex items-center gap-3 px-3 py-2 bg-slate-800/60 text-blue-400 rounded-md transition-all group border border-slate-700/50">
                            <FileText className="w-4 h-4" />
                            <span className="text-sm font-medium text-slate-200">Biology Notes</span>
                            <div className="ml-auto w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_6px_rgba(59,130,246,0.5)]"></div>
                        </button>

                        {/* Inactive Items */}
                        <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 rounded-md transition-colors group">
                            <FileText className="w-4 h-4 text-slate-600 group-hover:text-slate-500" />
                            <span className="text-sm font-medium">History Report</span>
                        </button>
                        <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 rounded-md transition-colors group">
                            <FileText className="w-4 h-4 text-slate-600 group-hover:text-slate-500" />
                            <span className="text-sm font-medium">Physics Summary</span>
                        </button>
                    </div>
                </div>

                {/* Sessions Section */}
                <div>
                    <div className="flex items-center justify-between px-2 mb-2">
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sessions</h3>
                    </div>
                    <div className="space-y-0.5">
                        <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 rounded-md transition-colors">
                            <MessageSquare className="w-4 h-4 text-slate-600 group-hover:text-slate-500" />
                            <span className="text-sm font-medium">Starter</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* User Footer */}
            <div className="p-3 mt-auto">
                <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 rounded-md transition-colors">
                    <Settings className="w-4 h-4" />
                    <span className="text-sm font-medium">All settings</span>
                </button>
            </div>
        </div>
    );
}
