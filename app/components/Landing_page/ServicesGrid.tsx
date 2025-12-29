import ServiceCard from '../../ServiceCard/ServiceCard';

const services = [
  {
    title: 'Surprise Birthday Decoration',
    desc: 'Hidden room setup, balloon arches, happy birthday backdrop',
    image: '/birthday.jpg',
    href: '/birthday'
  },
  {
    title: 'Anniversary Decoration',
    desc: 'Romantic setup with hearts, rose gold balloons, candlelight',
    image: '/anniversary.jpg',
    href: '/anniversary'
  },
  {
    title: 'Newborn Welcome',
    desc: 'Organic garlands, name backdrop, baby-safe balloons',
    image: '/newborn.jpg',
    href: '/newborn'
  },
  {
    title: 'Kids Theme Party',
    desc: 'Jungle, Unicorn, Superhero themes with entry gates',
    image: '/kids.jpg',
    href: '/kids'
  }
]

export default function ServicesGrid() {
  return (
    <div className="py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
          Our Popular Packages
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Choose from our ready-to-book decoration packages or customize your dream setup
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {services.map((service, index) => (
          <ServiceCard key={index} {...service} />
        ))}
      </div>
    </div>
  )
}
