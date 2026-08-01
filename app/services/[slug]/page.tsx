'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface EventData {
    id: string;
    eventName: string;
    slug: string;
    description: string;
    coverImageUrl?: string;
}

interface Photo {
    id: string;
    imageUrl: string;
}

// Cloudinary optimization
function optimizeUrl(url: string, w = 800) {
    if (!url || !url.includes('res.cloudinary.com')) return url;
    return url.replace('/upload/', `/upload/f_auto,q_auto,w_${w}/`);
}

function PhotoSkeleton() {
    return (
        <div className="aspect-square rounded-2xl bg-gray-200 animate-pulse" />
    );
}

export default function ServiceDetailPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params?.slug as string;

    const [event, setEvent] = useState<EventData | null>(null);
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [status, setStatus] = useState<'loading' | 'found' | 'not-found' | 'error'>('loading');
    const [error, setError] = useState('');

    // Lightbox state
    const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

    useEffect(() => {
        if (!slug) return;

        const controller = new AbortController();

        async function load() {
            try {
                const res = await fetch(`/api/public/events/${slug}`, {
                    signal: controller.signal,
                });

                if (res.status === 404) {
                    setStatus('not-found');
                    return;
                }

                if (!res.ok) {
                    throw new Error(`Server error: ${res.status}`);
                }

                const data = await res.json();
                setEvent(data.event);
                setPhotos(data.photos || []);
                setStatus('found');
            } catch (err: unknown) {
                if ((err as Error).name === 'AbortError') return;
                setError((err as Error).message || 'Something went wrong');
                setStatus('error');
            }
        }

        load();
        return () => controller.abort();
    }, [slug]);

    // Keyboard navigation for lightbox
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (lightboxIdx === null) return;
            if (e.key === 'Escape') setLightboxIdx(null);
            if (e.key === 'ArrowRight') setLightboxIdx((i) => i !== null ? Math.min(i + 1, photos.length - 1) : null);
            if (e.key === 'ArrowLeft') setLightboxIdx((i) => i !== null ? Math.max(i - 1, 0) : null);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [lightboxIdx, photos.length]);

    // ─── Loading ───────────────────────────────────────────────
    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    {/* Header skeleton */}
                    <div className="animate-pulse mb-12">
                        <div className="h-5 w-20 bg-gray-200 rounded mb-6" />
                        <div className="h-12 w-2/3 bg-gray-200 rounded mb-4" />
                        <div className="h-5 w-1/2 bg-gray-200 rounded" />
                    </div>
                    {/* Cover skeleton */}
                    <div className="h-72 rounded-3xl bg-gray-200 animate-pulse mb-12" />
                    {/* Grid skeleton */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {Array.from({ length: 8 }).map((_, i) => <PhotoSkeleton key={i} />)}
                    </div>
                </div>
            </div>
        );
    }

    // ─── Not found ──────────────────────────────────────────────
    if (status === 'not-found') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex flex-col items-center justify-center text-center px-4">
                <div className="text-8xl mb-6">🎪</div>
                <h1 className="text-4xl font-bold text-gray-800 mb-4">Event Not Found</h1>
                <p className="text-gray-500 mb-8 max-w-md">
                    We couldn&apos;t find an event at this link. It may have been removed or the URL is incorrect.
                </p>
                <Link
                    href="/services"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-2xl hover:shadow-xl transition-all"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to All Services
                </Link>
            </div>
        );
    }

    // ─── Error ─────────────────────────────────────────────────
    if (status === 'error') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex flex-col items-center justify-center text-center px-4">
                <div className="text-8xl mb-6">⚠️</div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Something went wrong</h1>
                <p className="text-gray-500 mb-8">{error}</p>
                <button
                    onClick={() => { setStatus('loading'); setError(''); }}
                    className="px-6 py-3 bg-pink-500 text-white font-semibold rounded-2xl hover:bg-pink-600 transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    // ─── Found ─────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

                {/* Breadcrumb */}
                <div className="mb-8">
                    <Link
                        href="/services"
                        className="inline-flex items-center gap-2 text-pink-500 hover:text-pink-600 font-medium group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        All Services
                    </Link>
                </div>

                {/* Event header */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-4">
                        {event!.eventName}
                    </h1>
                    {event!.description && (
                        <p className="text-xl text-gray-600 max-w-3xl leading-relaxed">
                            {event!.description}
                        </p>
                    )}
                </div>



                {/* Photo count */}
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Gallery
                        {photos.length > 0 && (
                            <span className="ml-3 text-lg font-normal text-gray-400">({photos.length} photos)</span>
                        )}
                    </h2>
                </div>

                {/* Photos */}
                {photos.length === 0 ? (
                    <div className="text-center py-24">
                        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center mb-6">
                            <svg className="w-12 h-12 text-pink-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <p className="text-2xl font-semibold text-gray-400 mb-2">No photos have been added to this event yet.</p>
                        <p className="text-gray-400">Check back soon — beautiful decoration photos are on their way!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        {photos.map((photo, idx) => (
                            <div
                                key={photo.id}
                                onClick={() => setLightboxIdx(idx)}
                                className="group relative aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl cursor-pointer"
                            >
                                <img
                                    src={optimizeUrl(photo.imageUrl, 600)}
                                    alt={`${event!.eventName} photo ${idx + 1}`}
                                    loading="lazy"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Lightbox */}
            {lightboxIdx !== null && photos[lightboxIdx] && (
                <div
                    className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
                    onClick={() => setLightboxIdx(null)}
                >
                    {/* Close */}
                    <button
                        className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
                        onClick={() => setLightboxIdx(null)}
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {/* Prev */}
                    {lightboxIdx > 0 && (
                        <button
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
                            onClick={(e) => { e.stopPropagation(); setLightboxIdx((i) => Math.max((i ?? 1) - 1, 0)); }}
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                    )}

                    {/* Next */}
                    {lightboxIdx < photos.length - 1 && (
                        <button
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
                            onClick={(e) => { e.stopPropagation(); setLightboxIdx((i) => Math.min((i ?? 0) + 1, photos.length - 1)); }}
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    )}

                    <img
                        src={photos[lightboxIdx].imageUrl}
                        alt={`${event!.eventName} photo ${lightboxIdx + 1}`}
                        className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />

                    {/* Counter */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
                        {lightboxIdx + 1} / {photos.length}
                    </div>
                </div>
            )}
        </div>
    );
}
