import React from 'react'
import Hero from './Hero';
import ServicesGrid from './ServicesGrid';
import BookingSection from './BookingSection';
function Index() {
  return (
    <>
    <Hero />
      <section className="py-20 bg-linear-to-br from-pink-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ServicesGrid />
          <BookingSection />
        </div>
      </section>
    </>
  )
}

export default Index