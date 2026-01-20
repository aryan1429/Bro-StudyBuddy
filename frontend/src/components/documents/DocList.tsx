'use client'

import { useEffect, useState } from 'react'
import { FileText, Trash2, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { api, type Document } from '@/lib/api'
import { Button } from '../ui/button'
import { Card } from '../ui/card'

export function DocList({ onDocSelect, refreshTrigger }: {
    onDocSelect?: (docId: string) => void
    refreshTrigger?: number
}) {
    const [documents, setDocuments] = useState<Document[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedDocId, setSelectedDocId] = useState<string | null>(null)

    const fetchDocuments = async () => {
        try {
            const data = await api.getDocuments()
            setDocuments(data.documents)
        } catch (error) {
            console.error('Failed to fetch documents:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDocuments()
    }, [refreshTrigger])

    const handleDelete = async (docId: string) => {
        if (!confirm('Delete this document?')) return

        try {
            await api.deleteDocument(docId)
            setDocuments(documents.filter(d => d.doc_id !== docId))
        } catch (error) {
            console.error('Failed to delete:', error)
        }
    }

    const handleSelect = (docId: string) => {
        setSelectedDocId(docId)
        onDocSelect?.(docId)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
        )
    }

    if (documents.length === 0) {
        return (
            <div className="text-center p-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No documents uploaded yet</p>
                <p className="text-sm mt-1">Upload a PDF or TXT file to get started</p>
            </div>
        )
    }

    return (
        <div className="space-y-2">
            {documents.map((doc, index) => (
                <motion.div
                    key={doc.doc_id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                >
                    <Card
                        className={`p-4 cursor-pointer transition-all hover:shadow-md ${selectedDocId === doc.doc_id ? 'ring-2 ring-primary' : ''
                            }`}
                        onClick={() => handleSelect(doc.doc_id)}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3 flex-1">
                                <FileText className="w-5 h-5 text-primary mt-0.5" />
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">{doc.filename}</p>
                                    <div className="flex items-center space-x-2 mt-1">
                                        {doc.status === 'ready' && (
                                            <span className="flex items-center text-xs text-green-600">
                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                Ready
                                            </span>
                                        )}
                                        {doc.status === 'processing' && (
                                            <span className="flex items-center text-xs text-blue-600">
                                                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                                Processing
                                            </span>
                                        )}
                                        {doc.status === 'failed' && (
                                            <span className="flex items-center text-xs text-red-600">
                                                <AlertCircle className="w-3 h-3 mr-1" />
                                                Failed
                                            </span>
                                        )}
                                        {doc.chunk_count && (
                                            <span className="text-xs text-gray-500">
                                                {doc.chunk_count} chunks
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {(doc.file_size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>
                            </div>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleDelete(doc.doc_id)
                                }}
                                className="ml-2"
                            >
                                <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                        </div>
                    </Card>
                </motion.div>
            ))}
        </div>
    )
}
