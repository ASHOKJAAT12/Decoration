'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Images, ImagePlus, Calendar, TrendingUp, Clock } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import { photosAPI } from '@/lib/api';
import { toast } from 'sonner';

interface RecentPhoto {
    _id: string;
    imageUrl: string;
    uploadedAt: string;
    eventId: { _id: string; eventName: string } | null;
}

interface Stats {
    totalEvents: number;
    totalPhotos: number;
    recentPhotos: RecentPhoto[];
}

export default function DashboardPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const data = await photosAPI.getStats();
            setStats(data);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Failed to load stats';
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                <p className="text-gray-400 mt-1">Welcome to your admin panel</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatsCard
                    label="Total Events"
                    value={stats?.totalEvents || 0}
                    icon={Calendar}
                    gradient="bg-gradient-to-br from-violet-500 to-purple-600"
                />
                <StatsCard
                    label="Total Photos"
                    value={stats?.totalPhotos || 0}
                    icon={Images}
                    gradient="bg-gradient-to-br from-fuchsia-500 to-pink-600"
                />
                <StatsCard
                    label="Average per Event"
                    value={stats && stats.totalEvents > 0 ? Math.round(stats.totalPhotos / stats.totalEvents) : 0}
                    icon={TrendingUp}
                    gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
                />
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Link
                        href="/admin/photos/add"
                        className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 hover:border-violet-500/40 transition-all group"
                    >
                        <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center group-hover:bg-violet-500/30 transition-colors">
                            <ImagePlus className="w-6 h-6 text-violet-400" />
                        </div>
                        <div>
                            <p className="font-semibold text-white">Add Photos</p>
                            <p className="text-sm text-gray-400">Upload new images</p>
                        </div>
                    </Link>

                    <Link
                        href="/admin/events"
                        className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-br from-fuchsia-500/10 to-pink-500/10 border border-fuchsia-500/20 hover:border-fuchsia-500/40 transition-all group"
                    >
                        <div className="w-12 h-12 rounded-xl bg-fuchsia-500/20 flex items-center justify-center group-hover:bg-fuchsia-500/30 transition-colors">
                            <Images className="w-6 h-6 text-fuchsia-400" />
                        </div>
                        <div>
                            <p className="font-semibold text-white">Manage Events</p>
                            <p className="text-sm text-gray-400">View & edit galleries</p>
                        </div>
                    </Link>

                    <Link
                        href="/admin/events"
                        className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-br from-rose-500/10 to-red-500/10 border border-rose-500/20 hover:border-rose-500/40 transition-all group"
                    >
                        <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center group-hover:bg-rose-500/30 transition-colors">
                            <svg className="w-6 h-6 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-semibold text-white">Delete Photos</p>
                            <p className="text-sm text-gray-400">Remove from gallery</p>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Recent Uploads */}
            {stats?.recentPhotos && stats.recentPhotos.length > 0 && (
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <Clock className="w-5 h-5 text-gray-400" />
                        <h2 className="text-xl font-semibold text-white">Recent Uploads</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {stats.recentPhotos.map((photo) => (
                            <div key={photo._id} className="group relative aspect-square rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all">
                                <img
                                    src={photo.imageUrl}
                                    alt=""
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <p className="text-xs text-white font-medium truncate">
                                        {photo.eventId?.eventName || 'Unknown Event'}
                                    </p>
                                    <p className="text-xs text-gray-300">
                                        {new Date(photo.uploadedAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
