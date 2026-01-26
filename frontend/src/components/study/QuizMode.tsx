'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, Lightbulb, Trophy, Target, Clock, RotateCcw, ArrowLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { type MCQuestion } from '@/lib/api'
import { Button } from '../ui/button'
import { Card } from '../ui/card'

interface QuizModeProps {
    questions: MCQuestion[]
    onReset?: () => void
}

export function QuizMode({ questions, onReset }: QuizModeProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
    const [showExplanation, setShowExplanation] = useState(false)
    const [score, setScore] = useState(0)
    const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set())
    const [answers, setAnswers] = useState<{index: number, correct: boolean, selected: string}[]>([])
    const [showResults, setShowResults] = useState(false)
    const [startTime] = useState(Date.now())

    const currentQuestion = questions[currentIndex]
    const isCorrect = selectedAnswer === currentQuestion?.correct_answer
    const isAnswered = answeredQuestions.has(currentIndex)
    const isComplete = answeredQuestions.size === questions.length

    const handleAnswer = (answer: string) => {
        if (isAnswered) return

        setSelectedAnswer(answer)
        setShowExplanation(true)

        const correct = answer === currentQuestion.correct_answer
        if (correct) {
            setScore(score + 1)
        }

        setAnsweredQuestions(new Set([...answeredQuestions, currentIndex]))
        setAnswers([...answers, { index: currentIndex, correct, selected: answer }])
    }

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1)
            setSelectedAnswer(null)
            setShowExplanation(false)
        } else if (isComplete) {
            setShowResults(true)
        }
    }

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1)
            setSelectedAnswer(null)
            setShowExplanation(false)
        }
    }

    const handleRestart = () => {
        setCurrentIndex(0)
        setSelectedAnswer(null)
        setShowExplanation(false)
        setScore(0)
        setAnsweredQuestions(new Set())
        setAnswers([])
        setShowResults(false)
    }

    const getPercentage = () => Math.round((score / questions.length) * 100)
    
    const getResultFeedback = () => {
        const pct = getPercentage()
        if (pct === 100) return {
            grade: 'A+',
            color: 'text-emerald-400',
            emoji: '🎉',
            title: 'PERFECT SCORE!',
            message: 'Absolutely incredible! You nailed every single question!',
            subtext: 'You\'re a master of this material. Time to tackle something harder!'
        }
        if (pct >= 90) return {
            grade: 'A',
            color: 'text-green-400',
            emoji: '🌟',
            title: 'Outstanding!',
            message: 'Wow, you crushed it! Almost perfect!',
            subtext: 'You really know your stuff. Keep up the amazing work!'
        }
        if (pct >= 80) return {
            grade: 'B',
            color: 'text-blue-400',
            emoji: '💪',
            title: 'Great Job!',
            message: 'Solid performance! You\'ve got a strong grasp!',
            subtext: 'Just a few more concepts to review and you\'ll be perfect!'
        }
        if (pct >= 70) return {
            grade: 'C',
            color: 'text-yellow-400',
            emoji: '👍',
            title: 'Good Effort!',
            message: 'You\'re on the right track!',
            subtext: 'Review the missed questions and you\'ll improve quickly!'
        }
        if (pct >= 50) return {
            grade: 'D',
            color: 'text-orange-400',
            emoji: '📚',
            title: 'Nice Try!',
            message: 'You\'re getting there, keep at it!',
            subtext: 'Focus on the concepts you missed and try again!'
        }
        return {
            grade: 'F',
            color: 'text-red-400',
            emoji: '💭',
            title: 'Keep Learning!',
            message: 'It\'s okay, everyone starts somewhere!',
            subtext: 'Review the material and come back stronger. You got this!'
        }
    }

    const getTimeSpent = () => {
        const seconds = Math.floor((Date.now() - startTime) / 1000)
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    // Results Screen
    if (showResults) {
        const feedback = getResultFeedback()
        const isPerfect = getPercentage() === 100
        return (
            <div className="max-w-2xl mx-auto p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center"
                >
                    {/* Emoji Animation */}
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="mb-4"
                    >
                        <span className="text-6xl">{feedback.emoji}</span>
                    </motion.div>

                    {/* Trophy for good scores */}
                    {getPercentage() >= 70 && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className="mb-4"
                        >
                            <Trophy className={`w-16 h-16 mx-auto ${feedback.color}`} />
                        </motion.div>
                    )}

                    <motion.h2 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className={`text-3xl font-bold mb-2 ${isPerfect ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-emerald-400 to-cyan-400' : 'text-slate-100'}`}
                    >
                        {feedback.title}
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className={`text-lg ${feedback.color} font-medium mb-2`}
                    >
                        {feedback.message}
                    </motion.p>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-sm text-slate-400 mb-6"
                    >
                        {feedback.subtext}
                    </motion.p>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                        >
                            <Card className="p-4 bg-slate-900 border-slate-800 text-center">
                                <Target className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-slate-100">{score}/{questions.length}</div>
                                <div className="text-xs text-slate-500">Correct Answers</div>
                            </Card>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                        >
                            <Card className="p-4 bg-slate-900 border-slate-800 text-center">
                                <div className={`text-4xl font-bold ${feedback.color} mb-1`}>{feedback.grade}</div>
                                <div className="text-xs text-slate-500">{getPercentage()}% Score</div>
                            </Card>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9 }}
                        >
                            <Card className="p-4 bg-slate-900 border-slate-800 text-center">
                                <Clock className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-slate-100">{getTimeSpent()}</div>
                                <div className="text-xs text-slate-500">Time Spent</div>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Question Review */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.0 }}
                    >
                        <Card className="p-4 bg-slate-900 border-slate-800 mb-6 text-left">
                            <h3 className="font-semibold text-slate-200 mb-3">Question Review</h3>
                            <div className="grid grid-cols-5 gap-2">
                                {answers.map((ans, idx) => (
                                    <div
                                        key={idx}
                                        className={`p-2 rounded-lg text-center text-sm font-medium ${
                                            ans.correct 
                                                ? 'bg-green-500/10 text-green-400 border border-green-500/30' 
                                                : 'bg-red-500/10 text-red-400 border border-red-500/30'
                                        }`}
                                    >
                                        Q{idx + 1}
                                        {ans.correct ? (
                                            <CheckCircle className="w-3 h-3 inline ml-1" />
                                        ) : (
                                            <XCircle className="w-3 h-3 inline ml-1" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </motion.div>

                    {/* Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.1 }}
                        className="flex gap-3 justify-center"
                    >
                        <Button variant="outline" onClick={handleRestart} className="border-slate-700">
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Retry Quiz
                        </Button>
                        {onReset && (
                            <Button onClick={onReset}>
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                New Quiz
                            </Button>
                        )}
                    </motion.div>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto p-6">
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-bold text-slate-100">Quiz Mode</h2>
                    <div className="text-sm text-slate-400 bg-slate-800 px-3 py-1 rounded-full">
                        Score: <span className="text-green-400 font-semibold">{score}</span> / {answeredQuestions.size}
                    </div>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                    <motion.div
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                    />
                </div>
                <p className="text-sm text-slate-500 mt-1">
                    Question {currentIndex + 1} of {questions.length}
                </p>
            </div>

            <Card className="p-6 mb-6 bg-slate-900 border-slate-800">
                <h3 className="text-lg font-semibold mb-4 text-slate-100">
                    {currentQuestion.question}
                </h3>

                <div className="space-y-3">
                    {currentQuestion.options.map((option) => {
                        const isSelected = selectedAnswer === option.label
                        const isCorrectOption = option.label === currentQuestion.correct_answer
                        
                        return (
                            <motion.button
                                key={option.label}
                                onClick={() => handleAnswer(option.label)}
                                disabled={isAnswered}
                                whileHover={!isAnswered ? { scale: 1.02 } : {}}
                                whileTap={!isAnswered ? { scale: 0.98 } : {}}
                                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                                    isAnswered
                                        ? isCorrectOption
                                            ? 'border-green-500 bg-green-500/10'
                                            : isSelected
                                            ? 'border-red-500 bg-red-500/10'
                                            : 'border-slate-700 bg-slate-800/50'
                                        : 'border-slate-700 hover:border-blue-500 bg-slate-800/50 cursor-pointer'
                                } ${isAnswered ? 'cursor-not-allowed' : ''}`}
                            >
                                <div className="flex items-center space-x-3">
                                    <span className={`font-bold ${
                                        isAnswered && isCorrectOption ? 'text-green-400' : 'text-blue-400'
                                    }`}>
                                        {option.label}
                                    </span>
                                    <span className="flex-1 text-slate-200">{option.text}</span>
                                    {isAnswered && isSelected && (
                                        <span>
                                            {isCorrect ? (
                                                <CheckCircle className="w-5 h-5 text-green-500" />
                                            ) : (
                                                <XCircle className="w-5 h-5 text-red-500" />
                                            )}
                                        </span>
                                    )}
                                    {isAnswered && isCorrectOption && !isSelected && (
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                    )}
                                </div>
                            </motion.button>
                        )
                    })}
                </div>
            </Card>

            <AnimatePresence>
                {showExplanation && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Card className="p-4 bg-blue-500/10 border-blue-500/30 mb-6">
                            <div className="flex items-start space-x-3">
                                <Lightbulb className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="font-medium text-blue-300">
                                        Explanation
                                    </p>
                                    <p className="text-sm text-blue-200/80 mt-1">
                                        {currentQuestion.explanation}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex items-center justify-between">
                <Button
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                    variant="outline"
                    className="border-slate-700 text-slate-400"
                >
                    Previous
                </Button>

                {currentIndex < questions.length - 1 ? (
                    <Button 
                        onClick={handleNext} 
                        disabled={!isAnswered}
                        className="bg-blue-600 hover:bg-blue-500"
                    >
                        Next Question
                    </Button>
                ) : isComplete ? (
                    <Button 
                        onClick={() => setShowResults(true)}
                        className="bg-green-600 hover:bg-green-500"
                    >
                        <Trophy className="w-4 h-4 mr-2" />
                        View Results
                    </Button>
                ) : (
                    <Button disabled className="bg-slate-700">
                        Answer to Continue
                    </Button>
                )}
            </div>
        </div>
    )
}
