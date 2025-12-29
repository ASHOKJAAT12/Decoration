import Hero from './components/Landing_page/Hero';
import ServicesGrid from './components/Landing_page/ServicesGrid';
import BookingSection from './components/Landing_page/BookingSection';

export default function Home() {
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
