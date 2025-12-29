'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative overflow-hidden h-screen flex items-center justify-center bg-linear-to-r from-primary to-secondary text-white">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-white/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-white/10 rounded-full blur-2xl animate-bounce" />
      </div>
      
      <div className="text-center max-w-4xl mx-auto px-4 z-10">
        <motion.h1 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-bold mb-6"
        >
          Transform Your 
          <span className="block bg-linear-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Celebrations
          </span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl md:text-2xl mb-8 opacity-90"
        >
          Professional Decoration Services for Every Occasion
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          {/* <Link 
            href="/services" 
            className="px-8 py-4 bg-white text-primary font-bold rounded-full text-lg shadow-2xl hover:shadow-3xl transition-all duration-300"
          >
            View Services
          </Link> */}
          <Link 
            href="/services"
            className="px-8 py-4 border-2 hover:text-black border-white text-white font-bold rounded-full text-lg hover:bg-white hover:text-primary transition-all duration-300"
          >
            View Services
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
