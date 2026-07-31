'use client';

import React, { useEffect, useState } from 'react';
import { publicAPI } from '@/lib/api';

interface PublicPhoto {
    id: string;
    imageUrl: string;
}

interface PublicGalleryProps {
    slug: string;
}

export default function PublicGallery({ slug }: PublicGalleryProps) {
    const [photos, setPhotos] = useState<PublicPhoto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;

        const fetchPhotos = async () => {
            try {
                setIsLoading(true);
                const data = await publicAPI.getPhotosByEventSlug(slug);
                if (mounted) {
                    setPhotos(data.photos);
                    setError(null);
                }
            } catch (err: any) {
                if (mounted) {
                    setError(err.message || 'Failed to load gallery');
                }
            } finally {
                if (mounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchPhotos();

        return () => {
            mounted = false;
        };
    }, [slug]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-24">
                <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-24 text-center text-gray-500">
                <p>Could not load gallery.</p>
                <p className="text-sm mt-2">{error}</p>
            </div>
        );
    }

    if (photos.length === 0) {
        return (
            <div className="py-24 text-center text-gray-500 font-medium text-lg">
                Coming soon! Beautiful decorations for this event are on their way.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {photos.map((photo) => (
                <div
                    key={photo.id}
                    className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 overflow-hidden cursor-pointer"
                >
                    <div className="relative h-64 overflow-hidden rounded-3xl">
                        <img
                            src={photo.imageUrl}
                            loading="lazy"
                            alt=""
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}
