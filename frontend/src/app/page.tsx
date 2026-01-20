"use client";
import React from "react";
import Link from 'next/link';
import { ArrowRight, Brain, MessageSquare, BookOpen, Zap, Sparkles, LayoutGrid, FileText, Search } from 'lucide-react';
import { motion } from "framer-motion";
import { Button } from '@/components/ui/button';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import { ButtonBorder } from '@/components/ui/moving-border';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';

// Floating Navbar Component
const FloatingNav = () => {
  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-6 inset-x-0 max-w-2xl mx-auto z-50 flex items-center justify-between p-4 rounded-full border border-white/10 bg-black/50 backdrop-blur-md shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]"
    >
      <div className="flex items-center gap-2 px-2">
        <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 flex items-center justify-center">
          <Brain className="h-3 w-3 text-white" />
        </div>
        <span className="font-bold text-white text-sm tracking-tight">StudyBuddy</span>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/app" className="text-xs font-medium text-zinc-400 hover:text-white transition-colors">Login</Link>
        <Link href="/app">
          <button className="bg-zinc-100 text-black px-4 py-1.5 rounded-full text-xs font-bold hover:bg-white transition-colors">
            Get Started
          </button>
        </Link>
      </div>
    </motion.div>
  )
}

// Geometric Background
const GridBackground = () => {
  return (
    <div className="fixed inset-0 z-0 w-full h-full bg-black flex items-center justify-center">
      {/* Radial Gradient for fade */}
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div className="absolute inset-0 bg-grid-white/10 bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,white,transparent_75%)] opacity-20" />

      {/* Ambient Beams (Simulated) */}
      <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-violet-500/50 to-transparent opacity-20 blur-sm" />
      <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent opacity-20 blur-sm" />
    </div>
  )
}

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden selection:bg-violet-500/30">
      <GridBackground />
      <FloatingNav />

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 md:pt-48 md:pb-32 px-4 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 text-xs font-medium mb-6"
        >
          <Sparkles className="w-3 h-3" />
          <span>v2.0 Now Available</span>
        </motion.div>

        <TextGenerateEffect
          words="Master Your Studies with AI-Powered Intelligence"
          className="text-4xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 pb-4 max-w-4xl mx-auto leading-tight"
        />

        <p className="mt-4 text-zinc-400 max-w-xl mx-auto text-base md:text-lg">
          Upload your notes, generate quizzes, and chat with your documents using our advanced RAG engine. The smartest way to study.
        </p>

        <div className="mt-10 flex flex-col md:flex-row items-center gap-4">
          <Link href="/app">
            <ButtonBorder
              borderRadius="1.75rem"
              className="bg-black text-white border-neutral-800"
            >
              Start Studying
            </ButtonBorder>
          </Link>

          <Link href="#features">
            <Button variant="ghost" className="text-zinc-400 hover:text-white">
              Learn More <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section id="features" className="relative z-10 px-4 pb-24 max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-2">Everything you need</h2>
          <p className="text-zinc-400">Power-packed features for serious students.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[300px]">

          {/* Large Featured Card (2 Cols) */}
          <SpotlightCard className="md:col-span-2 relative group md:row-span-2">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="p-8 h-full flex flex-col justify-between relative z-10">
              <div>
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center mb-4 border border-violet-500/20">
                  <MessageSquare className="w-6 h-6 text-violet-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Context-Aware Chat</h3>
                <p className="text-zinc-400 max-w-md">Our RAG engine understands the nuance of your documents. Ask complex questions and get cited, accurate answers instantly.</p>
              </div>

              {/* Fake UI Preview */}
              <div className="w-full mt-8 rounded-t-xl border-t border-l border-r border-white/10 bg-zinc-900/50 p-4 backdrop-blur-sm shadow-2xl translate-y-4 group-hover:translate-y-2 transition-transform duration-500">
                <div className="flex gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-red-500/50" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                  <div className="w-2 h-2 rounded-full bg-green-500/50" />
                </div>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-zinc-800/50 w-3/4">
                    <div className="h-2 w-full bg-white/10 rounded mb-2"></div>
                    <div className="h-2 w-2/3 bg-white/10 rounded"></div>
                  </div>
                  <div className="p-3 rounded-lg bg-violet-500/10 w-3/4 ml-auto border border-violet-500/20">
                    <div className="h-2 w-full bg-violet-500/20 rounded mb-2"></div>
                    <div className="h-2 w-1/2 bg-violet-500/20 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </SpotlightCard>

          {/* Vertical Card */}
          <SpotlightCard className="md:row-span-2 relative group">
            <div className="p-8 h-full flex flex-col relative z-10">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4 border border-cyan-500/20">
                <Zap className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Instant Quizzes</h3>
              <p className="text-zinc-400 text-sm mb-6">Turn your notes into active recall sessions automatically.</p>

              <div className="flex-1 rounded-xl bg-zinc-900/50 border border-white/5 p-4 relative overflow-hidden group-hover:border-cyan-500/30 transition-colors">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-cyan-500/20 blur-[60px] rounded-full pointer-events-none group-hover:opacity-100 opacity-50 transition-opacity" />
                <div className="relative z-10 space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-black/40 border border-white/5">
                      <div className={`w-4 h-4 rounded-full border ${i === 1 ? 'border-cyan-400 bg-cyan-400' : 'border-zinc-700'}`} />
                      <div className="h-2 w-16 bg-zinc-700 rounded-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SpotlightCard>

          {/* Small Card 1 */}
          <SpotlightCard className="group">
            <div className="p-6 h-full flex flex-col justify-center relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-pink-500/10 border border-pink-500/20">
                  <BookOpen className="w-5 h-5 text-pink-400" />
                </div>
                <h3 className="font-bold text-white">Auto Citations</h3>
              </div>
              <p className="text-zinc-400 text-sm">Every answer is linked back to the source PDF.</p>
            </div>
          </SpotlightCard>

          {/* Small Card 2 */}
          <SpotlightCard className="group">
            <div className="p-6 h-full flex flex-col justify-center relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <FileText className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="font-bold text-white">Multi-Format</h3>
              </div>
              <p className="text-zinc-400 text-sm">Support for PDF, TXT, and MD files.</p>
            </div>
          </SpotlightCard>

        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative z-10 py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-600 mb-6">
            Ready to ace your exams?
          </h2>
          <Link href="/app">
            <Button size="lg" className="bg-white text-black hover:bg-zinc-200 rounded-full px-8 h-12 font-medium text-lg">
              Get Started for Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-8 text-center text-zinc-600 text-sm">
        <p>&copy; 2024 StudyBuddy. All rights reserved.</p>
      </footer>

    </main>
  );
}
