'use client'

import Link from 'next/link'
import { ArrowRight, Brain, MessageSquare, BookOpen, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block p-4 rounded-full bg-white/10 mb-6"
          >
            <Brain className="w-16 h-16 text-white" />
          </motion.div>

          <h1 className="text-6xl font-bold text-white mb-6">
            Study Buddy
          </h1>
          <p className="text-2xl text-white/80 mb-8 max-w-2xl mx-auto">
            Chat with your notes using AI. Get answers with citations, generate quizzes, and ace your studies.
          </p>

          <Link href="/app">
            <Button size="lg" className="text-lg px-8 py-6">
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: MessageSquare,
              title: 'Smart Chat',
              description: 'Ask questions about your documents and get AI-powered answers with source citations',
              delay: 0
            },
            {
              icon: BookOpen,
              title: 'Auto-Citations',
              description: 'Every answer includes references to specific pages and passages from your documents',
              delay: 0.1
            },
            {
              icon: Zap,
              title: 'Quiz Generation',
              description: 'Automatically generate MCQs and flashcards from your notes to test your knowledge',
              delay: 0.2
            }
          ].map((feature) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: feature.delay }}
            >
              <Card className="p-6 bg-white/10 border-white/20 backdrop-blur-lg">
                <feature.icon className="w-12 h-12 text-white mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-white/70">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to transform your study sessions?
          </h2>
          <p className="text-white/80 mb-8">
            Upload your notes and start chatting in seconds
          </p>
          <Link href="/app">
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-white text-purple-900">
              Try It Now
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  )
}
