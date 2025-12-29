export default function Footer() {
  return (
    <footer className="bg-linear-to-r from-primary to-secondary text-white py-12">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-2xl font-bold mb-4">🎈 Balloon Bazar</h3>
          <p className="text-sm opacity-90">Jaipur's #1 Balloon Decoration Service</p>
        </div>
        <div>
          <h4 className="font-bold mb-4">Services</h4>
          <ul className="space-y-2 text-sm">
            <li>Birthday Decorations</li>
            <li>Anniversary Setup</li>
            <li>Newborn Welcome</li>
            <li>Theme Parties</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Contact</h4>
          <p className="text-sm">Jaipur, Rajasthan</p>
          <p className="text-sm">+91 9928xx xxxx</p>
          <p className="text-sm">info@balloonbazar.com</p>
        </div>
        <div>
          <h4 className="font-bold mb-4">Follow Us</h4>
          <div className="flex space-x-4">
            <a href="https://instagram.com/balloonbazzar" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30">📸</a>
            <a href="https://facebook.com/balloonbazzar" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30">📘</a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/20 mt-12 pt-8 text-center text-sm opacity-75">
        © 2025 Balloon Bazar. All rights reserved.
      </div>
    </footer>
  )
}
