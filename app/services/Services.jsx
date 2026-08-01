'use client';

import { useEffect, useState } from 'react';
import ServiceCard from '@/app/ui/ServiceCard';
import { publicAPI } from '@/lib/api';

function ServiceSkeleton() {
  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200" />
      <div className="p-8 space-y-3">
        <div className="h-6 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-100 rounded w-full" />
        <div className="h-4 bg-gray-100 rounded w-2/3" />
      </div>
    </div>
  );
}

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    publicAPI.getAllEvents()
      .then((data) => setServices(data.events || []))
      .catch(() => { })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="py-20 bg-linear-to-br from-pink-50 to-purple-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            Our Services
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose from our ready-to-book decoration packages or customize your dream setup
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => <ServiceSkeleton key={i} />)}
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <p className="text-2xl font-medium mb-2">No services available yet</p>
            <p className="text-gray-500">Check back soon for our decoration packages.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service) => (
              <ServiceCard
                key={service._id}
                title={service.eventName}
                desc={service.description || 'Professional decoration service'}
                image={service.coverImageUrl || ''}
                href={`/services/${service.slug}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
