"use client";
import React from "react";
import Link from 'next/link';
import { motion } from "framer-motion";
import { Upload, MessageSquare, BookOpen, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <main className="h-screen bg-slate-950 text-slate-100 flex flex-col items-center p-2 pt-4 relative overflow-hidden">

      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <div className="max-w-4xl w-full text-center space-y-1 mt-0 relative z-10 flex-1 flex flex-col justify-between py-2">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
          >
            <motion.span 
              className="text-blue-500 inline-block"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
            >
              Bro
            </motion.span>
            <motion.span
              className="inline-block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1], delay: 0.4 }}
            >
              {" "}—{" "}
            </motion.span>
            <motion.span
              className="inline-block"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay: 0.5 }}
            >
              Your Study Buddy
            </motion.span>
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-slate-400 font-medium max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.7 }}
          >
            Chat with your Notes. Learn faster with Bro.
          </motion.p>
        </motion.div>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 text-sm font-semibold text-slate-300"
        >
          <motion.div 
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900/50 rounded-full border border-slate-800 backdrop-blur-sm hover:bg-slate-800/50 hover:border-green-500/30 transition-all duration-300 cursor-default"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1], delay: 0.9 }}
            whileHover={{ scale: 1.05, y: -2 }}
          >
            <div className="p-1 bg-green-500/10 rounded text-green-400"><Upload className="w-4 h-4" /></div>
            Upload Your Notes
          </motion.div>
          <motion.div 
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900/50 rounded-full border border-slate-800 backdrop-blur-sm hover:bg-slate-800/50 hover:border-blue-500/30 transition-all duration-300 cursor-default"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1], delay: 1.0 }}
            whileHover={{ scale: 1.05, y: -2 }}
          >
            <div className="p-1 bg-blue-500/10 rounded text-blue-400"><MessageSquare className="w-4 h-4" /></div>
            Ask Questions & Get Answers
          </motion.div>
          <motion.div 
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900/50 rounded-full border border-slate-800 backdrop-blur-sm hover:bg-slate-800/50 hover:border-yellow-500/30 transition-all duration-300 cursor-default"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1], delay: 1.1 }}
            whileHover={{ scale: 1.05, y: -2 }}
          >
            <div className="p-1 bg-yellow-500/10 rounded text-yellow-400"><BookOpen className="w-4 h-4" /></div>
            Quiz & Flashcards
          </motion.div>
        </motion.div>

        {/* Mascot Image Placeholder */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5, delay: 0.5 }}
          className="relative mx-auto w-64 h-64 md:w-80 md:h-80 flex items-center justify-center p-6"
        >
          {/* Fallback SVG Mascot for Dark Mode */}
          <div className="relative w-full h-full">
            <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full animate-pulse"></div>
            <svg viewBox="0 0 200 200" className="w-full h-full relative z-10 drop-shadow-2xl">
              {/* Robot Body */}
              <rect x="60" y="90" width="80" height="70" rx="20" fill="#1e293b" stroke="#3b82f6" strokeWidth="3" />
              <rect x="85" y="110" width="30" height="30" rx="5" fill="#0f172a" />
              <circle cx="100" cy="125" r="8" fill="#3b82f6" className="animate-pulse" />

              {/* Robot Head */}
              <rect x="50" y="40" width="100" height="80" rx="25" fill="#fff" stroke="#3b82f6" strokeWidth="3" />
              <path d="M40 70 L50 70" stroke="#3b82f6" strokeWidth="6" strokeLinecap="round" />
              <path d="M150 70 L160 70" stroke="#3b82f6" strokeWidth="6" strokeLinecap="round" />

              {/* Face */}
              <rect x="65" y="60" width="70" height="50" rx="10" fill="#0f172a" />

              {/* Eyes */}
              <circle cx="85" cy="80" r="6" fill="#60a5fa">
                <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx="115" cy="80" r="6" fill="#60a5fa">
                <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
              </circle>

              {/* Mouth */}
              <path d="M90 95 Q100 100 110 95" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" />

              {/* Antenna */}
              <line x1="100" y1="40" x2="100" y2="20" stroke="#3b82f6" strokeWidth="3" />
              <circle cx="100" cy="15" r="5" fill="#f43f5e" />
            </svg>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="pb-0"
        >
          <Link href="/app" className="cursor-pointer">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-500/40 text-white font-bold text-lg px-12 py-7 rounded-2xl shadow-lg shadow-blue-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              Get Started
            </Button>
          </Link>
          <p className="mt-1 text-slate-500 text-sm">
            Upload PDF's and quiz with your own Study Buddy!
          </p>
        </motion.div>
      </div>

    </main>
  );
}
