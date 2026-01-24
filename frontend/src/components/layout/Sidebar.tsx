import React from 'react';
import Link from 'next/link';
import { FileText, MessageSquare, Plus, Settings, MoreHorizontal, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Sidebar() {
    return (
        <div className="w-[280px] bg-slate-900 border-r border-slate-800 h-screen flex flex-col text-slate-200 flex-shrink-0">
            {/* Header */}
            <div className="p-6 flex items-center gap-3">
                <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="font-bold text-xl text-white">🤖</span>
                    </div>
                    <span className="font-bold text-lg tracking-wide">Bro</span>
                </Link>
                <Button variant="ghost" size="icon" className="ml-auto text-slate-400 hover:text-white hover:bg-slate-800 h-8 w-8">
                    <span className="sr-only">Menu</span>
                    <MoreHorizontal className="w-4 h-4" />
                </Button>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-2">

                {/* Documents Section */}
                <div className="px-4 mb-8">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">Documents</h3>
                    <div className="space-y-1">
                        {/* Active Item */}
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 bg-slate-800 text-white rounded-lg transition-colors group">
                            <FileText className="w-4 h-4 text-blue-500" />
                            <span className="text-sm font-medium">Biology Notes</span>
                            <div className="ml-auto w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        </button>

                        {/* Inactive Items */}
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100 rounded-lg transition-colors group">
                            <FileText className="w-4 h-4 text-slate-500 group-hover:text-slate-400" />
                            <span className="text-sm font-medium">History Report</span>
                        </button>
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100 rounded-lg transition-colors group">
                            <FileText className="w-4 h-4 text-slate-500 group-hover:text-slate-400" />
                            <span className="text-sm font-medium">Physics Summary</span>
                        </button>
                    </div>

                    <button className="mt-3 w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-500 hover:text-blue-400 transition-colors group">
                        <Plus className="w-3.5 h-3.5" />
                        Add Document
                    </button>
                </div>

                {/* Sessions Section */}
                <div className="px-4">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">Sessions</h3>
                    <div className="space-y-1">
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100 rounded-lg transition-colors">
                            <MessageSquare className="w-4 h-4 text-slate-500" />
                            <span className="text-sm font-medium">Starter</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* User Footer */}
            <div className="p-4 border-t border-slate-800">
                <div className="flex items-center gap-3 px-2 py-2">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium text-slate-200 truncate">Robodogs</p>
                        <p className="text-xs text-slate-500 truncate">Free Plan</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-white hover:bg-slate-800">
                        <Settings className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
