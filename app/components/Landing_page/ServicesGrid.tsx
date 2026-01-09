import ServiceCard from '@/app/ui/ServiceCard';

const services = [
  {
    title: 'Surprise Birthday Decoration',
    desc: 'Hidden room setup, balloon arches, happy birthday backdrop',
    image: '/birthday-photo/B1.png',
    href: '/services/birthday'
  },
  {
    title: 'Festival Decoration',
    desc: 'Traditional decor for Diwali, Christmas, Eid, and more',
    image: '/festival-photo/F1.png',
    href: '/services/festival'
  },
  {
    title: 'Engagement Decoration',
    desc: 'Romantic setup with hearts, rose gold balloons, candlelight',
    image: '/engagement-photo/E2.png',
    href: '/services/engagement'
  },
  {
    title: 'Anniversary Decoration',
    desc: 'Romantic setup with hearts, rose gold balloons, candlelight',
    image: '/anniversary-photo/A1.png',
    href: '/services/anniversary'
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
