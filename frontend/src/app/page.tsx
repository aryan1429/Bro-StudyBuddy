'use client'

import Link from 'next/link'
import { ArrowRight, Brain, MessageSquare, BookOpen, Zap, Sparkles } from 'lucide-react'
import { motion, useInView, useMotionValue, useTransform } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useRef, useEffect, useState } from 'react'

// Floating particle component
function FloatingParticle({ delay = 0 }: { delay?: number }) {
  const [position, setPosition] = useState({ left: '50%', top: '50%' })

  useEffect(() => {
    // Set random position only on client side after mount
    setPosition({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
    })
  }, [])

  return (
    <motion.div
      className="absolute w-2 h-2 bg-white/30 rounded-full blur-sm"
      initial={{ opacity: 0, y: 100 }}
      animate={{
        opacity: [0, 1, 0],
        y: -100,
        x: [0, 20, -20, 0],
      }}
      transition={{
        duration: 8,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      style={position}
    />
  )
}

// Feature card with 3D tilt effect
function FeatureCard({ feature, index }: { feature: any, index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useTransform(y, [-100, 100], [10, -10])
  const rotateY = useTransform(x, [-100, 100], [-10, 10])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set(e.clientX - centerX)
    y.set(e.clientY - centerY)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    x.set(0)
    y.set(0)
  }

  const cardRef = useRef(null)
  const isInView = useInView(cardRef, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.2, duration: 0.6 }}
    >
      <motion.div
        ref={ref}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.05, z: 50 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Card className="relative p-8 bg-white/5 border-white/10 backdrop-blur-xl overflow-hidden group cursor-pointer h-full">
          {/* Animated border glow */}
          <motion.div
            className="absolute inset-0 rounded-lg"
            style={{
              background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)',
            }}
            animate={{
              backgroundPosition: isHovered ? ['0% 0%', '100% 100%'] : '0% 0%',
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />

          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
            }}
            animate={{
              x: isHovered ? [-1000, 1000] : -1000,
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />

          {/* Icon with animation */}
          <motion.div
            className="relative z-10"
            animate={isHovered ? {
              y: [-5, 5, -5],
              rotate: [0, 5, -5, 0]
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <feature.icon className="w-14 h-14 text-white mb-4" />
          </motion.div>

          <h3 className="text-2xl font-semibold text-white mb-3 relative z-10">
            {feature.title}
          </h3>
          <p className="text-white/70 text-lg relative z-10">
            {feature.description}
          </p>

          {/* Inner glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </Card>
      </motion.div>
    </motion.div>
  )
}

export default function LandingPage() {
  const heroRef = useRef(null)
  const isHeroInView = useInView(heroRef, { once: true })

  // Parallax effect for hero
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const [windowSize, setWindowSize] = useState({ width: 1920, height: 1080 })

  useEffect(() => {
    // Set initial window size
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    })

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const features = [
    {
      icon: MessageSquare,
      title: 'Smart Chat',
      description: 'Ask questions about your documents and get AI-powered answers with source citations',
    },
    {
      icon: BookOpen,
      title: 'Auto-Citations',
      description: 'Every answer includes references to specific pages and passages from your documents',
    },
    {
      icon: Zap,
      title: 'Quiz Generation',
      description: 'Automatically generate MCQs and flashcards from your notes to test your knowledge',
    }
  ]

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle at 0% 0%, #1e3a8a 0%, #581c87 50%, #831843 100%)',
              'radial-gradient(circle at 100% 100%, #1e3a8a 0%, #581c87 50%, #831843 100%)',
              'radial-gradient(circle at 0% 100%, #1e3a8a 0%, #581c87 50%, #831843 100%)',
              'radial-gradient(circle at 100% 0%, #1e3a8a 0%, #581c87 50%, #831843 100%)',
              'radial-gradient(circle at 0% 0%, #1e3a8a 0%, #581c87 50%, #831843 100%)',
            ],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />

        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <FloatingParticle key={i} delay={i * 0.5} />
        ))}

        {/* Spotlight effect following cursor */}
        <motion.div
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
            x: useTransform(mouseX, [0, windowSize.width], [-100, 100]),
            y: useTransform(mouseY, [0, windowSize.height], [-100, 100]),
          }}
        />
      </div>

      {/* Hero Section */}
      <section ref={heroRef} className="container mx-auto px-4 pt-20 pb-32 relative">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isHeroInView ? { opacity: 1 } : {}}
          className="text-center"
        >
          {/* Animated icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={isHeroInView ? {
              scale: 1,
              rotate: 0,
            } : {}}
            transition={{
              type: "spring",
              stiffness: 200,
              delay: 0.2
            }}
            className="inline-block relative mb-8"
          >
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 20px rgba(147, 51, 234, 0.5)',
                  '0 0 40px rgba(147, 51, 234, 0.8)',
                  '0 0 20px rgba(147, 51, 234, 0.5)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="p-6 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-white/20"
            >
              <Brain className="w-20 h-20 text-white" />
            </motion.div>

            {/* Floating sparkles */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: [0, (i - 1) * 40],
                  y: [0, -30],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.3,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
                style={{
                  top: '50%',
                  left: '50%',
                }}
              >
                <Sparkles className="w-6 h-6 text-yellow-300" />
              </motion.div>
            ))}
          </motion.div>

          {/* Animated title with gradient */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent"
            style={{
              textShadow: '0 0 40px rgba(255,255,255,0.5)',
            }}
          >
            Study Buddy
          </motion.h1>

          {/* Typing animation effect for subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6 }}
            className="text-2xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed font-light"
          >
            Chat with your notes using AI. Get answers with citations, generate quizzes, and ace your studies.
          </motion.p>

          {/* Enhanced CTA button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
          >
            <Link href="/app">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="text-lg px-10 py-7 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-2xl shadow-purple-500/50 relative overflow-hidden group"
                >
                  {/* Ripple effect layer */}
                  <span className="absolute inset-0 bg-white/20 transform scale-0 group-hover:scale-100 rounded-md transition-transform duration-500" />

                  <span className="relative z-10 flex items-center gap-2">
                    Get Started
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                  </span>
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 pb-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          {/* Glass card container */}
          <div className="max-w-3xl mx-auto p-12 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 relative overflow-hidden">
            {/* Animated gradient overlay */}
            <motion.div
              className="absolute inset-0 opacity-30"
              animate={{
                background: [
                  'linear-gradient(45deg, transparent, rgba(147, 51, 234, 0.3), transparent)',
                  'linear-gradient(135deg, transparent, rgba(236, 72, 153, 0.3), transparent)',
                  'linear-gradient(225deg, transparent, rgba(147, 51, 234, 0.3), transparent)',
                  'linear-gradient(315deg, transparent, rgba(236, 72, 153, 0.3), transparent)',
                ],
              }}
              transition={{ duration: 8, repeat: Infinity }}
            />

            <h2 className="text-5xl font-bold text-white mb-6 relative z-10">
              Ready to transform your study sessions?
            </h2>
            <p className="text-white/80 mb-10 text-xl relative z-10">
              Upload your notes and start chatting in seconds
            </p>
            <Link href="/app">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-10 py-7 bg-white text-purple-900 hover:bg-white/90 shadow-xl relative z-10 border-0"
                >
                  Try It Now
                </Button>
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
