'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { publicAPI } from '@/lib/api';
import { X } from 'lucide-react';

interface GalleryPhoto {
    id: string;
    imageUrl: string;
}

// Build a Cloudinary optimized URL
function optimizedUrl(url: string) {
    if (!url.includes('res.cloudinary.com')) return url;
    return url.replace('/upload/', '/upload/f_auto,q_auto,w_600/');
}

function GallerySkeleton() {
    return (
        <div className="flex gap-4 overflow-hidden py-4">
            {Array.from({ length: 8 }).map((_, i) => (
                <div
                    key={i}
                    className="flex-shrink-0 w-64 h-48 rounded-2xl bg-gray-200 animate-pulse"
                />
            ))}
        </div>
    );
}

export default function HomeGallery() {
    const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [lightbox, setLightbox] = useState<string | null>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const isPaused = useRef(false);
    const posRef = useRef(0);
    const rafRef = useRef<number | null>(null);

    // Touch support
    const touchStartX = useRef(0);
    const touchStartPos = useRef(0);

    useEffect(() => {
        publicAPI.getGallery()
            .then((data) => setPhotos(data.photos || []))
            .catch(() => { })
            .finally(() => setIsLoading(false));
    }, []);

    const startScroll = useCallback(() => {
        if (!trackRef.current) return;

        // The duplicated set width (half of total scroll width)
        const halfWidth = trackRef.current.scrollWidth / 2;

        const step = () => {
            if (!isPaused.current && trackRef.current) {
                posRef.current -= 0.5; // px per frame (~30px/s at 60fps)
                if (posRef.current <= -halfWidth) {
                    posRef.current = 0; // seamless loop
                }
                trackRef.current.style.transform = `translateX(${posRef.current}px)`;
            }
            rafRef.current = requestAnimationFrame(step);
        };

        rafRef.current = requestAnimationFrame(step);
        return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
    }, []);

    useEffect(() => {
        if (photos.length === 0) return;
        const cleanup = startScroll();
        return cleanup;
    }, [photos, startScroll]);

    // Touch handlers
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
        touchStartPos.current = posRef.current;
        isPaused.current = true;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        const dx = e.touches[0].clientX - touchStartX.current;
        if (trackRef.current) {
            posRef.current = touchStartPos.current + dx;
            trackRef.current.style.transform = `translateX(${posRef.current}px)`;
        }
    };

    const handleTouchEnd = () => {
        isPaused.current = false;
    };

    // Close lightbox on escape
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightbox(null); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    if (isLoading) {
        return (
            <section className="py-20 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
                        Our Gallery
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        A glimpse into the beautiful moments we create
                    </p>
                </div>
                <GallerySkeleton />
            </section>
        );
    }

    if (photos.length === 0) {
        return (
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
                        Our Gallery
                    </h2>
                    <div className="py-16">
                        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center mb-6">
                            <svg className="w-12 h-12 text-pink-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <p className="text-2xl font-semibold text-gray-400 mb-2">Gallery photos will be available soon</p>
                        <p className="text-gray-400">Our beautiful decoration moments are on their way.</p>
                    </div>
                </div>
            </section>
        );
    }

    // Duplicate photos for seamless infinite scroll
    const displayPhotos = [...photos, ...photos];

    return (
        <section className="py-20 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
                <h2 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
                    Our Gallery
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    A glimpse into the beautiful moments we create
                </p>
            </div>

            {/* Scrolling track */}
            <div
                className="relative select-none cursor-grab active:cursor-grabbing"
                onMouseEnter={() => { isPaused.current = true; }}
                onMouseLeave={() => { isPaused.current = false; }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {/* Gradient fade masks */}
                <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-white to-transparent" />
                <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-white to-transparent" />

                <div
                    ref={trackRef}
                    className="flex gap-4 will-change-transform"
                    style={{ width: 'max-content' }}
                >
                    {displayPhotos.map((photo, idx) => (
                        <div
                            key={`${photo.id}-${idx}`}
                            className="flex-shrink-0 w-64 h-48 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer group"
                            onClick={() => setLightbox(photo.imageUrl)}
                        >
                            <img
                                src={optimizedUrl(photo.imageUrl)}
                                alt="Gallery decoration photo"
                                loading="lazy"
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='192'%3E%3Crect width='256' height='192' fill='%23f3f4f6'/%3E%3C/svg%3E";
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Lightbox */}
            {lightbox && (
                <div
                    className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
                    onClick={() => setLightbox(null)}
                >
                    <button
                        className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                        onClick={() => setLightbox(null)}
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <img
                        src={lightbox}
                        alt="Gallery preview"
                        className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </section>
    );
}
