'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, Lightbulb } from 'lucide-react'
import { motion } from 'framer-motion'
import { type MCQuestion } from '@/lib/api'
import { Button } from '../ui/button'
import { Card } from '../ui/card'

export function QuizMode({ questions }: { questions: MCQuestion[] }) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
    const [showExplanation, setShowExplanation] = useState(false)
    const [score, setScore] = useState(0)
    const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set())

    const currentQuestion = questions[currentIndex]
    const isCorrect = selectedAnswer === currentQuestion.correct_answer
    const isAnswered = answeredQuestions.has(currentIndex)

    const handleAnswer = (answer: string) => {
        if (isAnswered) return

        setSelectedAnswer(answer)
        setShowExplanation(true)

        if (answer === currentQuestion.correct_answer) {
            setScore(score + 1)
        }

        setAnsweredQuestions(new Set([...answeredQuestions, currentIndex]))
    }

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1)
            setSelectedAnswer(null)
            setShowExplanation(false)
        }
    }

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1)
            setSelectedAnswer(null)
            setShowExplanation(false)
        }
    }

    return (
        <div className="max-w-3xl mx-auto p-6">
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-bold">Quiz Mode</h2>
                    <div className="text-sm text-gray-500">
                        Score: {score} / {answeredQuestions.size}
                    </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <motion.div
                        className="bg-primary h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                    />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                    Question {currentIndex + 1} of {questions.length}
                </p>
            </div>

            <Card className="p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">
                    {currentQuestion.question}
                </h3>

                <div className="space-y-3">
                    {currentQuestion.options.map((option) => (
                        <motion.button
                            key={option.label}
                            onClick={() => handleAnswer(option.label)}
                            disabled={isAnswered}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full p-4 rounded-lg border-2 text-left transition-all ${selectedAnswer === option.label
                                    ? isCorrect
                                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                        : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                                    : 'border-gray-300 hover:border-primary'
                                } ${isAnswered ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                            <div className="flex items-center space-x-3">
                                <span className="font-bold text-primary">{option.label}</span>
                                <span className="flex-1">{option.text}</span>
                                {selectedAnswer === option.label && (
                                    <span>
                                        {isCorrect ? (
                                            <CheckCircle className="w-5 h-5 text-green-600" />
                                        ) : (
                                            <XCircle className="w-5 h-5 text-red-600" />
                                        )}
                                    </span>
                                )}
                            </div>
                        </motion.button>
                    ))}
                </div>
            </Card>

            {showExplanation && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200">
                        <div className="flex items-start space-x-3">
                            <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div>
                                <p className="font-medium text-blue-900 dark:text-blue-100">
                                    Explanation
                                </p>
                                <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                                    {currentQuestion.explanation}
                                </p>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            )}

            <div className="flex items-center justify-between mt-6">
                <Button
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                    variant="outline"
                >
                    Previous
                </Button>

                {currentIndex < questions.length - 1 ? (
                    <Button onClick={handleNext} disabled={!isAnswered}>
                        Next Question
                    </Button>
                ) : (
                    <div className="text-center">
                        <p className="text-lg font-semibold">
                            Final Score: {score} / {questions.length}
                        </p>
                        <p className="text-sm text-gray-500">
                            {((score / questions.length) * 100).toFixed(0)}%
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
