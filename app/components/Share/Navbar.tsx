'use client'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown, Balloon } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hoverService, setHoverService] = useState(false)
  
  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Contact us', href: '/Contact' }
  ]

  const services = [
    { name: 'Birthday Decoration', href: '/services/birthday' },
    { name: 'Anniversary Setup', href: '/services/anniversary' },
    { name: 'Kids Party', href: '/services/kids' },
    { name: 'Newborn Welcome', href: '/services/newborn' },
    { name: 'Engagement Party', href: '/services/engagement' }
  ]

  return (
    <nav className="bg-white/80 backdrop-blur-xl shadow-xl sticky top-0 z-50 border-b border-white/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="p-3 bg-linear-to-br from-primary to-secondary rounded-2xl shadow-lg group-hover:scale-110 transition-all duration-300">
              <Balloon className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
              Balloon Bazar
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-8">
            {navItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className="px-4 py-2 text-lg font-medium text-gray-700 hover:text-primary transition-colors duration-200 rounded-xl hover:bg-primary/10"
              >
                {item.name}
              </Link>
            ))}

            {/* Services Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={() => setHoverService(true)}
              onMouseLeave={() => setHoverService(false)}
            >
              <button className="flex items-center gap-2 px-4 py-2 text-lg font-semibold text-gray-800 hover:text-pink-500 rounded-xl hover:bg-pink-500/10 transition-all duration-200">
                Services 
                <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {hoverService && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute top-full left-0 mt-2 w-80 bg-white/95 backdrop-blur-xl shadow-2xl border border-white/50 rounded-3xl py-4"
                  >
                    <div className="space-y-2 px-4">
                      {services.map((service, index) => (
                        <Link 
                          key={service.href}
                          href={service.href}
                          className="group flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-500/10 transition-all cursor-pointer"
                        >
                          <div>
                            <div className="font-bold text-gray-800  transition-colors">
                              {service.name}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>

                    {/* All Services Button */}
                    <div className="px-4 pt-3 border-t border-gray-100">
                      <Link 
                        href="/services" 
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-2xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
                      >
                        <span>All Services</span>
                        <ChevronDown className="w-4 h-4" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {/* CTA Button */}
            <Link 
              href="/contact"
              className="px-6 py-3 bg-linear-to-r from-primary to-secondary text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Book Now
            </Link>
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 rounded-xl hover:bg-primary/10 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden"
          >
            <div className="px-4 pt-4 pb-8 space-y-4 bg-white/50 backdrop-blur-xl border-t border-white/50">
              {navItems.map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className="block px-4 py-3 text-lg font-medium text-gray-700 hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
