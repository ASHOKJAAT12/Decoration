'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Balloon, ArrowRight } from 'lucide-react'

interface ServiceCardProps {
  title: string
  desc: string
  image: string
  href: string
}

export default function ServiceCard({ title, desc, image, href }: ServiceCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05, y: -10 }}
      className="group bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer"
    >
      <div className="h-48 bg-linear-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
        <Balloon className="w-24 h-24 text-primary opacity-75" />
      </div>
      <div className="p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">{title}</h3>
        <p className="text-gray-600 mb-6 leading-relaxed">{desc}</p>
        <div className="flex items-center justify-between mb-6">
          <Link href={href} className="flex items-center text-primary font-semibold hover:text-secondary group-hover:translate-x-2 transition-transform">
            View Details <ArrowRight className="ml-1 w-5 h-5" />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
