'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Loader2, Brain, BookOpen, FileText, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { api, type MCQuestion, type Flashcard, type Document } from '@/lib/api'
import { QuizMode } from '@/components/study/QuizMode'
import { FlashcardMode } from '@/components/study/FlashcardMode'

type StudyMode = 'select' | 'quiz' | 'flashcards'
type StudyType = 'mcq' | 'flashcard'

export default function StudyPage() {
    const [documents, setDocuments] = useState<Document[]>([])
    const [selectedDocId, setSelectedDocId] = useState<string | null>(null)
    const [questions, setQuestions] = useState<MCQuestion[]>([])
    const [flashcards, setFlashcards] = useState<Flashcard[]>([])
    const [loading, setLoading] = useState(false)
    const [mode, setMode] = useState<StudyMode>('select')
    const [studyType, setStudyType] = useState<StudyType>('mcq')

    useEffect(() => {
        const fetchDocs = async () => {
            try {
                const data = await api.getDocuments()
                setDocuments(data.documents.filter(d => d.status === 'ready'))
            } catch (error) {
                console.error('Failed to fetch documents:', error)
            }
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
            alert('Failed to generate quiz. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleGenerateFlashcards = async (numCards: number) => {
        if (!selectedDocId) return

        setLoading(true)
        try {
            const data = await api.generateFlashcards(selectedDocId, numCards)
            setFlashcards(data.flashcards)
            setMode('flashcards')
        } catch (error) {
            console.error('Failed to generate flashcards:', error)
            alert('Failed to generate flashcards. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleReset = () => {
        setMode('select')
        setQuestions([])
        setFlashcards([])
        setSelectedDocId(null)
    }

    return (
        <div className="min-h-screen bg-slate-950">
            <header className="border-b border-slate-800 p-4">
                <Link href="/app">
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-200">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Chat
                    </Button>
                </Link>
            </header>

            <main className="container mx-auto p-8">
                {mode === 'select' ? (
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-8">
                            <h1 className="text-4xl font-bold text-slate-100 mb-3">Study Mode</h1>
                            <p className="text-slate-400 text-lg">
                                Generate quizzes and flashcards from your documents
                            </p>
                        </div>

                        {documents.length === 0 ? (
                            <Card className="p-8 text-center bg-slate-900 border-slate-800">
                                <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                                <p className="text-slate-400 mb-4">
                                    No documents available. Upload some documents first.
                                </p>
                                <Link href="/app">
                                    <Button>Go to Chat</Button>
                                </Link>
                            </Card>
                        ) : (
                            <div className="space-y-8">
                                {/* Document Selection */}
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-blue-400" />
                                        Select a Document
                                    </h2>
                                    <div className="grid gap-3">
                                        {documents.map((doc) => (
                                            <Card
                                                key={doc.doc_id}
                                                className={`p-4 cursor-pointer transition-all bg-slate-900 border-slate-800 hover:border-blue-500/50 ${
                                                    selectedDocId === doc.doc_id
                                                        ? 'ring-2 ring-blue-500 border-blue-500'
                                                        : ''
                                                }`}
                                                onClick={() => setSelectedDocId(doc.doc_id)}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-medium text-slate-200">{doc.filename}</p>
                                                        <p className="text-sm text-slate-500">
                                                            {doc.chunk_count} chunks • {doc.page_count || 1} pages
                                                        </p>
                                                    </div>
                                                    {selectedDocId === doc.doc_id && (
                                                        <div className="w-3 h-3 bg-blue-500 rounded-full" />
                                                    )}
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                </div>

                                {/* Study Type Selection */}
                                {selectedDocId && (
                                    <div className="space-y-6">
                                        <h2 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                                            <Sparkles className="w-5 h-5 text-yellow-400" />
                                            Choose Study Mode
                                        </h2>
                                        
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {/* MCQ Option */}
                                            <Card 
                                                className={`p-6 cursor-pointer transition-all bg-slate-900 border-slate-800 hover:border-purple-500/50 ${
                                                    studyType === 'mcq' ? 'ring-2 ring-purple-500 border-purple-500' : ''
                                                }`}
                                                onClick={() => setStudyType('mcq')}
                                            >
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="p-2 bg-purple-500/10 rounded-lg">
                                                        <Brain className="w-6 h-6 text-purple-400" />
                                                    </div>
                                                    <h3 className="font-semibold text-slate-200">Multiple Choice Quiz</h3>
                                                </div>
                                                <p className="text-sm text-slate-400">
                                                    Test your knowledge with auto-generated MCQs with explanations
                                                </p>
                                            </Card>

                                            {/* Flashcard Option */}
                                            <Card 
                                                className={`p-6 cursor-pointer transition-all bg-slate-900 border-slate-800 hover:border-green-500/50 ${
                                                    studyType === 'flashcard' ? 'ring-2 ring-green-500 border-green-500' : ''
                                                }`}
                                                onClick={() => setStudyType('flashcard')}
                                            >
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="p-2 bg-green-500/10 rounded-lg">
                                                        <BookOpen className="w-6 h-6 text-green-400" />
                                                    </div>
                                                    <h3 className="font-semibold text-slate-200">Flashcards</h3>
                                                </div>
                                                <p className="text-sm text-slate-400">
                                                    Review key concepts with flip cards for active recall
                                                </p>
                                            </Card>
                                        </div>

                                        {/* Generation Options */}
                                        <div className="mt-6">
                                            <p className="font-medium text-slate-300 mb-3">
                                                {studyType === 'mcq' ? 'How many questions?' : 'How many flashcards?'}
                                            </p>
                                            <div className="grid grid-cols-4 gap-3">
                                                {(studyType === 'mcq' ? [5, 10, 15, 20] : [10, 15, 20, 30]).map((num) => (
                                                    <Button
                                                        key={num}
                                                        variant="outline"
                                                        onClick={() => studyType === 'mcq' 
                                                            ? handleGenerateQuiz(num) 
                                                            : handleGenerateFlashcards(num)
                                                        }
                                                        disabled={loading}
                                                        className="border-slate-700 hover:border-blue-500 hover:bg-blue-500/10"
                                                    >
                                                        {loading ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            num
                                                        )}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ) : mode === 'quiz' ? (
                    <div>
                        <Button
                            variant="outline"
                            onClick={handleReset}
                            className="mb-6 text-slate-400 border-slate-700"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            New Study Session
                        </Button>
                        <QuizMode questions={questions} />
                    </div>
                ) : (
                    <div>
                        <Button
                            variant="outline"
                            onClick={handleReset}
                            className="mb-6 text-slate-400 border-slate-700"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            New Study Session
                        </Button>
                        <FlashcardMode flashcards={flashcards} onReset={handleReset} />
                    </div>
                )}
            </main>
        </div>
    )
}
