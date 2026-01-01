'use client'
import { MessageCircleMore } from 'lucide-react'

export default function WhatsAppButton() {
  const handleClick = () => {
    window.open('https://wa.me/917727956570?text=Hi! I want to book decoration.', '_blank')
  }

  return (
    <button 
      onClick={handleClick}
      className="fixed bottom-6 right-6 w-16 h-16 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 z-50 flex items-center justify-center animate-bounce"
    >
      <MessageCircleMore size={24} />
    </button>
  )
}
