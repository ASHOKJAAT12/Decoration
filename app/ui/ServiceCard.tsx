'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface ServiceCardProps {
  title: string
  desc: string
  image: string
  href: string
}

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23fce7f3'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23ec4899' font-size='48'%3E%F0%9F%8E%88%3C/text%3E%3C/svg%3E"

export default function ServiceCard({ title, desc, image, href }: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05, y: -10 }}
      className="group bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer"
    >
      <div className="h-48 bg-linear-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 overflow-hidden">
        <img
          src={image || PLACEHOLDER}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = PLACEHOLDER;
          }}
        />
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
