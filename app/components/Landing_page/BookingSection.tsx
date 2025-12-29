'use client'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Cake } from 'lucide-react'

interface FormData {
  name: string
  event: string
  date: string
  location: string
  guests: string
  phone: string
}

export default function BookingSection() {
  const { register, handleSubmit, reset } = useForm<FormData>()

  const onSubmit = (data: FormData) => {
    const message = `🎈 NEW BOOKING REQUEST\n\n👤 Name: ${data.name}\n🎉 Event: ${data.event}\n📅 Date: ${data.date}\n📍 Location: ${data.location}\n👥 Guests: ${data.guests}\n📞 Phone: ${data.phone}`
    window.open(`https://wa.me/919928xxxxxx?text=${encodeURIComponent(message)}`, '_blank')
    reset()
  }

  return (
    <motion.section 
      id="booking"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      className="py-20 bg-white"
    >
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent mb-6">
          Ready to Book?
        </h2>
        <p className="text-xl text-gray-600 mb-16 max-w-2xl mx-auto">
          Fill this form and our team will contact you
        </p>
        
        <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 mb-2 font-medium">
                <Cake className="w-5 h-5 text-primary" />
                Your Name
              </label>
              <input 
                {...register('name', { required: true })}
                className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-primary focus:outline-none transition-colors"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 mb-2 font-medium">
                🎈 Event Type
              </label>
              <select 
                {...register('event', { required: true })}
                className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-primary focus:outline-none"
              >
                <option>Birthday Party</option>
                <option>Anniversary</option>
                <option>Newborn Welcome</option>
                <option>Engagement</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 mb-2 font-medium">
                <Calendar className="w-5 h-5 text-primary" />
                Event Date
              </label>
              <input 
                type="date"
                {...register('date', { required: true })}
                className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-primary"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 mb-2 font-medium">
                <MapPin className="w-5 h-5 text-primary" />
                Location
              </label>
              <input 
                {...register('location', { required: true })}
                className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-primary"
                placeholder="Mansarovar, Vaishali Nagar, etc."
              />
            </div>
            <div className="md:col-span-2">
              <button 
                type="submit"
                className="w-full bg-linear-to-r from-primary to-secondary text-white py-6 px-8 rounded-2xl text-xl font-bold shadow-2xl hover:shadow-3xl hover:scale-[1.02] transition-all duration-300"
              >
                Get Quote & Book Now 🚀
              </button>
            </div>
          </div>
        </form>
      </div>
    </motion.section>
  )
}
