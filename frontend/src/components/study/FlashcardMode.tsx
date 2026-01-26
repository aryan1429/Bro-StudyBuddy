'use client'

import { useState } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight, Shuffle, CheckCircle, BookOpen } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { type Flashcard } from '@/lib/api'
import { Button } from '../ui/button'
import { Card } from '../ui/card'

interface FlashcardModeProps {
    flashcards: Flashcard[]
    onReset?: () => void
}

export function FlashcardMode({ flashcards, onReset }: FlashcardModeProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isFlipped, setIsFlipped] = useState(false)
    const [knownCards, setKnownCards] = useState<Set<number>>(new Set())
    const [cards, setCards] = useState(flashcards)

    const currentCard = cards[currentIndex]
    const progress = ((currentIndex + 1) / cards.length) * 100
    const knownCount = knownCards.size

    const handleFlip = () => {
        setIsFlipped(!isFlipped)
    }

    const handleNext = () => {
        if (currentIndex < cards.length - 1) {
            setCurrentIndex(currentIndex + 1)
            setIsFlipped(false)
        }
    }

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1)
            setIsFlipped(false)
        }
    }

    const handleMarkKnown = () => {
        setKnownCards(new Set([...knownCards, currentIndex]))
        if (currentIndex < cards.length - 1) {
            handleNext()
        }
    }

    const handleShuffle = () => {
        const shuffled = [...cards].sort(() => Math.random() - 0.5)
        setCards(shuffled)
        setCurrentIndex(0)
        setIsFlipped(false)
        setKnownCards(new Set())
    }

    const handleRestart = () => {
        setCurrentIndex(0)
        setIsFlipped(false)
        setKnownCards(new Set())
    }

    const isComplete = currentIndex === cards.length - 1 && knownCards.has(currentIndex)

    return (
        <div className="max-w-2xl mx-auto p-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <BookOpen className="w-6 h-6 text-blue-500" />
                        <h2 className="text-2xl font-bold text-slate-100">Flashcards</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleShuffle}
                            className="text-slate-400 hover:text-slate-200"
                        >
                            <Shuffle className="w-4 h-4 mr-2" />
                            Shuffle
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRestart}
                            className="text-slate-400 hover:text-slate-200"
                        >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Restart
                        </Button>
                    </div>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm text-slate-400">
                        <span>Card {currentIndex + 1} of {cards.length}</span>
                        <span className="text-green-400">{knownCount} mastered</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                        <motion.div
                            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>
            </div>

            {/* Flashcard */}
            <div className="perspective-1000 mb-6">
                <motion.div
                    className="relative w-full h-72 cursor-pointer"
                    onClick={handleFlip}
                    style={{ transformStyle: 'preserve-3d' }}
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
                >
                    {/* Front */}
                    <Card className="absolute inset-0 p-8 bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 backface-hidden flex flex-col items-center justify-center">
                        <div className="text-xs text-blue-400 font-medium mb-4 uppercase tracking-wider">
                            Question
                        </div>
                        <p className="text-xl text-center text-slate-100 font-medium leading-relaxed">
                            {currentCard.question}
                        </p>
                        <p className="text-sm text-slate-500 mt-6">Click to reveal answer</p>
                    </Card>

                    {/* Back */}
                    <Card 
                        className="absolute inset-0 p-8 bg-gradient-to-br from-blue-900/30 to-slate-900 border-blue-500/30 flex flex-col items-center justify-center"
                        style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
                    >
                        <div className="text-xs text-green-400 font-medium mb-4 uppercase tracking-wider">
                            Answer
                        </div>
                        <p className="text-lg text-center text-slate-100 leading-relaxed">
                            {currentCard.answer}
                        </p>
                    </Card>
                </motion.div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
                <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                    className="text-slate-400"
                >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                </Button>

                <Button
                    onClick={handleMarkKnown}
                    disabled={knownCards.has(currentIndex)}
                    className={`${knownCards.has(currentIndex) 
                        ? 'bg-green-600 text-white' 
                        : 'bg-green-600 hover:bg-green-500 text-white'}`}
                >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {knownCards.has(currentIndex) ? 'Mastered!' : 'I Know This'}
                </Button>

                <Button
                    variant="outline"
                    onClick={handleNext}
                    disabled={currentIndex === cards.length - 1}
                    className="text-slate-400"
                >
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
            </div>

            {/* Completion */}
            {isComplete && knownCount === cards.length && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-8 p-6 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl border border-green-500/30 text-center"
                >
                    <div className="text-4xl mb-3">🎉</div>
                    <h3 className="text-xl font-bold text-slate-100 mb-2">Congratulations!</h3>
                    <p className="text-slate-400">
                        You've mastered all {cards.length} flashcards!
                    </p>
                    <div className="flex gap-3 justify-center mt-4">
                        <Button variant="outline" onClick={handleShuffle}>
                            Practice Again
                        </Button>
                        {onReset && (
                            <Button onClick={onReset}>
                                New Deck
                            </Button>
                        )}
                    </div>
                </motion.div>
            )}
        </div>
    )
}
