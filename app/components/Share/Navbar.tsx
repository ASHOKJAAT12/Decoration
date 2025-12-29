'use client'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'About us', href: '/About us' },
    { name: 'Contact us', href: '/contact' }
  ]

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <Link href="/" className="flex items-center font-bold text-2xl text-gray-700">
            🎈 Decoration
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map(item => (
              <Link key={item.href} href={item.href} className="text-gray-700 hover:text-primary font-medium">
                {item.name}
              </Link>
            ))}
          </div>
          <button className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  )
}
