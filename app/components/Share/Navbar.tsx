'use client'
import Link from 'next/link'
import { Menu, X, ChevronDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getAccessToken, authAPI, publicAPI } from '@/lib/api'
import { useRouter, usePathname } from 'next/navigation'

interface ServiceItem {
  name: string;
  href: string;
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const [hoverService, setHoverService] = useState(false)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)
  const [services, setServices] = useState<ServiceItem[]>([])
  const [servicesLoading, setServicesLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    setIsAdminLoggedIn(!!getAccessToken())

    const controller = new AbortController()
    publicAPI.getAllEvents()
      .then((data) => {
        if (!controller.signal.aborted) {
          setServices(
            (data.events || []).map((e: { eventName: string; slug: string }) => ({
              name: e.eventName,
              href: `/services/${e.slug}`,
            }))
          )
        }
      })
      .catch(() => { })
      .finally(() => {
        if (!controller.signal.aborted) setServicesLoading(false)
      })

    return () => controller.abort()
  }, [pathname])

  const handleLogout = async () => {
    await authAPI.logout()
    setIsAdminLoggedIn(false)
    router.push('/')
  }

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Contact us', href: '/Contact' }
  ]

  return (
    <nav className="bg-white/80 backdrop-blur-xl shadow-xl sticky top-0 z-50 border-b border-white/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className='flex items-center'>
              <img src="/decoraforyou-logo.svg" alt="Logo" className="w-12 h-12 text-white" />
            </div>
            <span className="text-2xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
              DECORATION FOR YOU
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

            {/* Services Dropdown — pure CSS transition, no framer-motion */}
            <div
              className="relative group"
              onMouseEnter={() => setHoverService(true)}
              onMouseLeave={() => setHoverService(false)}
            >
              <button
                aria-expanded={hoverService}
                aria-haspopup="true"
                className="flex items-center gap-2 px-4 py-2 text-lg font-semibold text-gray-800 hover:text-pink-500 rounded-xl hover:bg-pink-500/10 transition-all duration-200"
              >
                Services
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${hoverService ? 'rotate-180' : ''}`} />
              </button>

              {/* CSS-only dropdown — visible when hoverService=true */}
              <div
                className={`absolute top-full left-0 mt-2 w-80 bg-white/95 backdrop-blur-xl shadow-2xl border border-white/50 rounded-3xl py-4 max-h-96 overflow-y-auto transition-all duration-200 origin-top ${hoverService ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
                  }`}
              >
                <div className="space-y-1 px-4">
                  {servicesLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="h-11 rounded-2xl bg-gray-100 animate-pulse" />
                    ))
                  ) : services.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-4">No services available</p>
                  ) : (
                    services.map((service) => (
                      <Link
                        key={service.href}
                        href={service.href}
                        className="group flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-500/10 transition-all cursor-pointer"
                        onClick={() => setHoverService(false)}
                      >
                        <div className="font-bold text-gray-800 transition-colors">
                          {service.name}
                        </div>
                      </Link>
                    ))
                  )}
                </div>

                {/* All Services Button */}
                <div className="px-4 pt-3 border-t border-gray-100 mt-2">
                  <Link
                    href="/services"
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-2xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
                    onClick={() => setHoverService(false)}
                  >
                    <span>All Services</span>
                    <ChevronDown className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Admin Controls */}
            {isAdminLoggedIn ? (
              <div className="flex flex-col md:flex-row items-center gap-2">
                <Link
                  href="/admin/dashboard"
                  className="px-4 py-2 font-medium text-violet-600 bg-violet-50 rounded-xl hover:bg-violet-100 transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/admin/login"
                className="px-4 py-2 font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Admin Login
              </Link>
            )}

            {/* CTA Button */}
            <Link
              href="/Contact"
              className="px-6 py-3 bg-linear-to-r from-primary to-secondary text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 ml-2"
            >
              Book Now
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            className="md:hidden p-2 rounded-xl hover:bg-primary/10 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu — CSS height transition */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}
      >
        <div className="px-4 pt-4 pb-8 space-y-2 bg-white/50 backdrop-blur-xl border-t border-white/50">
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

          {/* Mobile Services Accordion */}
          <div>
            <button
              onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
              className="w-full flex items-center justify-between px-4 py-3 text-lg font-medium text-gray-700 hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
            >
              Services
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileServicesOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${mobileServicesOpen ? 'max-h-screen' : 'max-h-0'}`}>
              <div className="pl-4 space-y-1 pb-2">
                {servicesLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-10 rounded-xl bg-gray-100 animate-pulse" />
                  ))
                ) : services.length === 0 ? (
                  <p className="text-sm text-gray-400 px-4 py-2">No services available</p>
                ) : (
                  services.map((service) => (
                    <Link
                      key={service.href}
                      href={service.href}
                      className="block px-4 py-2.5 text-base text-gray-600 hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                      onClick={() => { setMobileOpen(false); setMobileServicesOpen(false); }}
                    >
                      {service.name}
                    </Link>
                  ))
                )}
                <Link
                  href="/services"
                  className="block px-4 py-2.5 text-base font-semibold text-pink-600 hover:bg-pink-50 rounded-xl transition-all"
                  onClick={() => { setMobileOpen(false); setMobileServicesOpen(false); }}
                >
                  View All Services →
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile Admin Controls */}
          <div className="pt-4 border-t border-gray-200">
            {isAdminLoggedIn ? (
              <div className="space-y-2">
                <Link
                  href="/admin/dashboard"
                  className="block px-4 py-3 text-lg font-medium text-violet-600 hover:bg-violet-50 rounded-xl transition-all"
                  onClick={() => setMobileOpen(false)}
                >
                  Admin Dashboard
                </Link>
                <button
                  onClick={() => { setMobileOpen(false); handleLogout(); }}
                  className="block w-full text-left px-4 py-3 text-lg font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/admin/login"
                className="block px-4 py-3 text-lg font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
                onClick={() => setMobileOpen(false)}
              >
                Admin Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
