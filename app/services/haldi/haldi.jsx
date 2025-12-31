const services = [
  {
    image: '/haldi-photo/H1.png'
  },
  {
    image: '/haldi-photo/H2.png',
  },
  {
    image: '/haldi-photo/H3.png',
  },
  {
    image: '/haldi-photo/H4.png',
  },
  {
    image: '/haldi-photo/H5.png',
  },
  {
    image: '/haldi-photo/H6.png',
  },
  {
    image: '/haldi-photo/H7.png',
  },
  {
    image: '/haldi-photo/H8.png',
  }
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">

      {/* Services Grid */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div 
                key={index}
                className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 overflow-hidden cursor-pointer"
              >
                <div className="relative h-64 overflow-hidden rounded-t-3xl">
                  <img 
                    src={service.image}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
