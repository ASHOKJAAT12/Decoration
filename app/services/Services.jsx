import ServiceCard from '@/app/ui/ServiceCard';

const services = [
  {
    title: 'Birthday Decoration',
    desc: 'Hidden room setup, balloon arches, happy birthday backdrop',
    image: '/birthday-photo/B1.png',
    href: '/services/birthday'
  },
  {
    title: 'Anniversary Decoration',
    desc: 'Romantic setup with hearts, rose gold balloons, candlelight',
    image: '/anniversary-photo/A1.png',
    href: '/services/anniversary'
  },
  {
    title: 'Newborn Welcome',
    desc: 'Organic garlands, name backdrop, baby-safe balloons',
    image: '/newborn-photo/N1.png',
    href: '/services/newborn'
  },
  {
    title: 'Kids Birthday Party Decoration',
    desc: 'Jungle, Unicorn, Superhero themes with entry gates',
    image: '/kids-photo/K1.png',
    href: '/services/kids'
  },
  {
    title: 'Engagement Decoration',
    desc: 'Romantic setup with hearts, rose gold balloons, candlelight',
    image: '/engagement-photo/E2.png',
    href: '/services/engagement'
  },
  {
    title: 'Haldi Ceremony Decoration',
    desc: 'Vibrant yellow and orange decor with floral accents',
    image: '/haldi-photo/H1.png',
    href: '/services/haldi'
  },
  {
    title: 'Festival Decoration',
    desc: 'Traditional decor for Diwali, Christmas, Eid, and more',
    image: '/festival-photo/F1.png',
    href: '/services/festival'
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
