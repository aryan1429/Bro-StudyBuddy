"use client";
import React from "react";
import Link from 'next/link';
import { motion } from "framer-motion";
import { Upload, MessageSquare, BookOpen, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900 flex flex-col items-center justify-center p-4">

      {/* Hero Section */}
      <div className="max-w-4xl w-full text-center space-y-8 mt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 mb-4">
            <span className="text-blue-600">Bro</span> — Your Study Buddy
          </h1>
          <p className="text-xl text-slate-500 font-medium">
            Chat with your notes. Learn faster with Bro.
          </p>
        </motion.div>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 text-sm font-semibold text-slate-600 mb-12"
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100 shadow-sm">
            <div className="p-1 bg-green-100 rounded text-green-600"><Upload className="w-4 h-4" /></div>
            Upload Your Notes
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100 shadow-sm">
            <div className="p-1 bg-blue-100 rounded text-blue-600"><MessageSquare className="w-4 h-4" /></div>
            Ask Questions & Get Answers
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100 shadow-sm">
            <div className="p-1 bg-yellow-100 rounded text-yellow-600"><BookOpen className="w-4 h-4" /></div>
            Quiz & Flashcards
          </div>
        </motion.div>

        {/* Mascot Image Placeholder */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5, delay: 0.5 }}
          className="relative mx-auto w-64 h-64 md:w-80 md:h-80 mb-8 flex items-center justify-center"
        >
          {/* Fallback SVG Mascot in case image gen fails, ensuring UI still looks good */}
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
            <circle cx="100" cy="100" r="90" fill="#2563EB" className="animate-pulse opacity-10" />
            <circle cx="100" cy="100" r="70" fill="white" stroke="#2563EB" strokeWidth="4" />
            <path d="M70 90 Q100 120 130 90" fill="none" stroke="#2563EB" strokeWidth="4" strokeLinecap="round" />
            <circle cx="80" cy="80" r="8" fill="#2563EB" />
            <circle cx="120" cy="80" r="8" fill="#2563EB" />
            <rect x="60" y="40" width="80" height="120" rx="40" fill="none" stroke="#2563EB" strokeWidth="4" opacity="0.1" />
          </svg>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <Link href="/app">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-12 py-6 rounded-xl shadow-xl shadow-blue-200 transition-all hover:scale-105 active:scale-95"
            >
              Get Started
            </Button>
          </Link>
          <p className="mt-4 text-slate-400 text-sm">
            Upload PDFs and quiz with your own study buddy!
          </p>
        </motion.div>
      </div>

    </main>
  );
}
