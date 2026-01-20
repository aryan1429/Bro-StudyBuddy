'use client'

import { useState } from 'react'
import { FileText, MessageSquare, GraduationCap, Upload, Settings } from 'lucide-react'
import { motion } from 'framer-motion'
import { type Citation } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { UploadDropzone } from '@/components/upload/UploadDropzone'
import { DocList } from '@/components/documents/DocList'
import { ChatWindow } from '@/components/chat/ChatWindow'
import { SourcesPanel } from '@/components/sources/SourcesPanel'
import Link from 'next/link'

export default function AppPage() {
    const [refreshTrigger, setRefreshTrigger] = useState(0)
    const [selectedDocId, setSelectedDocId] = useState<string | null>(null)
    const [citations, setCitations] = useState<Citation[]>([])
    const [activeTab, setActiveTab] = useState<'upload' | 'docs'>('docs')

    return (
        <div className="h-screen flex flex-col">
            {/* Header */}
            <header className="border-b bg-card p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <GraduationCap className="w-6 h-6 text-primary" />
                        <h1 className="text-xl font-bold">Study Buddy</h1>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Link href="/app/study">
                            <Button variant="outline" size="sm">
                                <GraduationCap className="w-4 h-4 mr-2" />
                                Study Mode
                            </Button>
                        </Link>
                        <Link href="/">
                            <Button variant="ghost" size="sm">
                                Home
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar - Documents */}
                <motion.aside
                    initial={{ x: -300 }}
                    animate={{ x: 0 }}
                    className="w-80 border-r bg-card p-4 overflow-y-auto"
                >
                    <div className="space-y-4">
                        <div className="flex space-x-2 mb-4">
                            <Button
                                variant={activeTab === 'docs' ? 'default' : 'outline'}
                                size="sm"
                                className="flex-1"
                                onClick={() => setActiveTab('docs')}
                            >
                                <FileText className="w-4 h-4 mr-2" />
                                Documents
                            </Button>
                            <Button
                                variant={activeTab === 'upload' ? 'default' : 'outline'}
                                size="sm"
                                className="flex-1"
                                onClick={() => setActiveTab('upload')}
                            >
                                <Upload className="w-4 h-4 mr-2" />
                                Upload
                            </Button>
                        </div>

                        {activeTab === 'upload' ? (
                            <UploadDropzone
                                onUploadComplete={() => {
                                    setRefreshTrigger(prev => prev + 1)
                                    setActiveTab('docs')
                                }}
                            />
                        ) : (
                            <DocList
                                refreshTrigger={refreshTrigger}
                                onDocSelect={setSelectedDocId}
                            />
                        )}
                    </div>
                </motion.aside>

                {/* Center - Chat */}
                <main className="flex-1 flex flex-col">
                    <div className="border-b p-4 bg-card">
                        <div className="flex items-center space-x-2">
                            <MessageSquare className="w-5 h-5 text-primary" />
                            <h2 className="font-semibold">Chat with Your Documents</h2>
                        </div>
                        {selectedDocId && (
                            <p className="text-sm text-gray-500 mt-1">
                                Filtering by selected document
                            </p>
                        )}
                    </div>
                    <ChatWindow
                        selectedDocIds={selectedDocId ? [selectedDocId] : []}
                        onCitationsChange={setCitations}
                    />
                </main>

                {/* Right Sidebar - Citations */}
                <SourcesPanel citations={citations} />
            </div>
        </div>
    )
}
