import React from 'react';
import { FileText, MessageSquare, Plus, Settings, MoreHorizontal, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Sidebar() {
    return (
        <div className="w-[280px] bg-blue-600 h-screen flex flex-col text-white flex-shrink-0">
            {/* Header */}
            <div className="p-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <span className="font-bold text-xl">🤖</span>
                </div>
                <span className="font-bold text-lg tracking-wide">Bro ~</span>
                <Button variant="ghost" size="icon" className="ml-auto text-white/70 hover:text-white hover:bg-white/10 h-8 w-8">
                    <span className="sr-only">Menu</span>
                    <svg width="16" height="16" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.13523 6.15803C3.3241 5.96916 3.3241 5.66297 3.13523 5.4741L2.18544 4.52431C1.99657 4.33544 1.99657 4.02925 2.18544 3.84038L3.84038 2.18544C4.02925 1.99657 4.33544 1.99657 4.52431 2.18544L5.4741 3.13523C5.66297 3.3241 5.96916 3.3241 6.15803 3.13523L9.65803 0.635232C10.0486 0.356247 10.5927 0.635232 10.5927 1.11467V13.8853C10.5927 14.3648 10.0486 14.6438 9.65803 14.3648L6.15803 11.8648C5.96916 11.6759 5.66297 11.6759 5.4741 11.8648L4.52431 12.8146C4.33544 13.0034 4.02925 13.0034 3.84038 12.8146L2.18544 11.1596C1.99657 10.9708 1.99657 10.6646 2.18544 10.4757L3.13523 9.5259C3.3241 9.33703 3.3241 9.03084 3.13523 8.84197L0.635232 5.34197C0.356247 4.95143 0.635232 4.40729 1.11467 4.40729H13.8853C14.3648 4.40729 14.6438 4.95143 14.3648 5.34197L11.8648 8.84197Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                </Button>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-2">

                {/* Documents Section */}
                <div className="px-4 mb-8">
                    <h3 className="text-xs font-semibold text-blue-200/60 uppercase tracking-wider mb-3 px-2">Documents</h3>
                    <div className="space-y-1">
                        {/* Active Item */}
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 bg-white/10 text-white rounded-lg transition-colors group">
                            <FileText className="w-4 h-4 text-blue-200" />
                            <span className="text-sm font-medium">Biology Notes</span>
                            <div className="ml-auto w-1.5 h-1.5 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.5)]"></div>
                        </button>

                        {/* Inactive Items */}
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-blue-100/60 hover:bg-white/5 hover:text-white rounded-lg transition-colors group">
                            <FileText className="w-4 h-4" />
                            <span className="text-sm font-medium">History Report</span>
                        </button>
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-blue-100/60 hover:bg-white/5 hover:text-white rounded-lg transition-colors group">
                            <FileText className="w-4 h-4" />
                            <span className="text-sm font-medium">Physics Summary</span>
                        </button>
                    </div>

                    <button className="mt-3 w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-blue-200/50 hover:text-white transition-colors">
                        <Plus className="w-3.5 h-3.5" />
                        Add Document
                    </button>
                </div>

                {/* Sessions Section */}
                <div className="px-4">
                    <h3 className="text-xs font-semibold text-blue-200/60 uppercase tracking-wider mb-3 px-2">Sessions</h3>
                    <div className="space-y-1">
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-blue-100/60 hover:bg-white/5 hover:text-white rounded-lg transition-colors">
                            <MessageSquare className="w-4 h-4" />
                            <span className="text-sm font-medium">Starter</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* User Footer */}
            <div className="p-4 border-t border-white/10">
                <div className="flex items-center gap-3 px-2 py-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center border border-white/20">
                        <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium text-white truncate">Robodogs</p>
                        <p className="text-xs text-blue-200/60 truncate">Free Plan</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-white/50 hover:text-white hover:bg-white/10">
                        <Settings className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
