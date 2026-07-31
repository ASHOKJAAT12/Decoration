import React from 'react';
import PublicGallery from '../../components/PublicGallery';

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Services Grid */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <PublicGallery slug="birthday-decoration" />
        </div>
      </section>
    </div>
  )
}
