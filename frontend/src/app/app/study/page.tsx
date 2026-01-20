'use client'

import { useState } from 'react'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { api, type MCQuestion, type Document } from '@/lib/api'
import { QuizMode } from '@/components/study/QuizMode'
import { useEffect } from 'react'

export default function StudyPage() {
    const [documents, setDocuments] = useState<Document[]>([])
    const [selectedDocId, setSelectedDocId] = useState<string | null>(null)
    const [questions, setQuestions] = useState<MCQuestion[]>([])
    const [loading, setLoading] = useState(false)
    const [mode, setMode] = useState<'select' | 'quiz'>('select')

    useEffect(() => {
        const fetchDocs = async () => {
            const data = await api.getDocuments()
            setDocuments(data.documents.filter(d => d.status === 'ready'))
        }
        fetchDocs()
    }, [])

    const handleGenerateQuiz = async (numQuestions: number) => {
        if (!selectedDocId) return

        setLoading(true)
        try {
            const data = await api.generateMCQs(selectedDocId, numQuestions)
            setQuestions(data.questions)
            setMode('quiz')
        } catch (error) {
            console.error('Failed to generate quiz:', error)
            alert('Failed to generate quiz')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b p-4">
                <Link href="/app">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Chat
                    </Button>
                </Link>
            </header>

            <main className="container mx-auto p-8">
                {mode === 'select' ? (
                    <div className="max-w-2xl mx-auto">
                        <h1 className="text-3xl font-bold mb-6">Study Mode</h1>
                        <p className="text-gray-500 mb-6">
                            Select a document and generate a quiz to test your knowledge
                        </p>

                        {documents.length === 0 ? (
                            <Card className="p-8 text-center">
                                <p className="text-gray-500">
                                    No documents available. Upload some documents first.
                                </p>
                            </Card>
                        ) : (
                            <>
                                <div className="space-y-3 mb-6">
                                    {documents.map((doc) => (
                                        <Card
                                            key={doc.doc_id}
                                            className={`p-4 cursor-pointer transition-all ${selectedDocId === doc.doc_id
                                                    ? 'ring-2 ring-primary'
                                                    : 'hover:shadow-md'
                                                }`}
                                            onClick={() => setSelectedDocId(doc.doc_id)}
                                        >
                                            <p className="font-medium">{doc.filename}</p>
                                            <p className="text-sm text-gray-500">
                                                {doc.chunk_count} chunks
                                            </p>
                                        </Card>
                                    ))}
                                </div>

                                {selectedDocId && (
                                    <div className="space-y-3">
                                        <p className="font-medium">How many questions?</p>
                                        <div className="grid grid-cols-3 gap-3">
                                            {[10, 15, 20].map((num) => (
                                                <Button
                                                    key={num}
                                                    onClick={() => handleGenerateQuiz(num)}
                                                    disabled={loading}
                                                >
                                                    {loading ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        `${num} Questions`
                                                    )}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                ) : (
                    <div>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setMode('select')
                                setQuestions([])
                            }}
                            className="mb-6"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            New Quiz
                        </Button>
                        <QuizMode questions={questions} />
                    </div>
                )}
            </main>
        </div>
    )
}
