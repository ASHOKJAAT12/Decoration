'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Trash2, Eye, Search, Calendar, Images } from 'lucide-react';
import { eventsAPI, photosAPI } from '@/lib/api';
import ConfirmModal from '../components/ConfirmModal';
import PhotoGrid from '../components/PhotoGrid';
import { toast } from 'sonner';

interface Event {
    _id: string;
    eventName: string;
    slug: string;
    description: string;
    photoCount: number;
    createdAt: string;
}

interface Photo {
    _id: string;
    imageUrl: string;
    cloudinaryPublicId: string;
    uploadedAt: string;
}

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [photosLoading, setPhotosLoading] = useState(false);

    // Create event state
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newEventName, setNewEventName] = useState('');
    const [newEventDesc, setNewEventDesc] = useState('');
    const [creating, setCreating] = useState(false);

    // Delete modals
    const [deleteEventModal, setDeleteEventModal] = useState<Event | null>(null);
    const [deletePhotoId, setDeletePhotoId] = useState<string | null>(null);
    const [bulkDeleteIds, setBulkDeleteIds] = useState<string[]>([]);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        try {
            const data = await eventsAPI.getAll();
            setEvents(data.events);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Failed to load events';
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    const loadPhotos = async (event: Event) => {
        setSelectedEvent(event);
        setPhotosLoading(true);
        try {
            const data = await photosAPI.getByEvent(event._id);
            setPhotos(data.photos);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Failed to load photos';
            toast.error(message);
        } finally {
            setPhotosLoading(false);
        }
    };

    const handleCreateEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newEventName.trim()) {
            toast.error('Event name is required');
            return;
        }
        setCreating(true);
        try {
            await eventsAPI.create(newEventName, newEventDesc);
            toast.success('Event created successfully!');
            setNewEventName('');
            setNewEventDesc('');
            setShowCreateForm(false);
            loadEvents();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Failed to create event';
            toast.error(message);
        } finally {
            setCreating(false);
        }
    };

    const handleDeleteEvent = async () => {
        if (!deleteEventModal) return;
        setIsDeleting(true);
        try {
            await eventsAPI.delete(deleteEventModal._id);
            toast.success('Event deleted successfully!');
            setDeleteEventModal(null);
            if (selectedEvent?._id === deleteEventModal._id) {
                setSelectedEvent(null);
                setPhotos([]);
            }
            loadEvents();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Failed to delete event';
            toast.error(message);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDeletePhoto = async () => {
        if (!deletePhotoId) return;
        setIsDeleting(true);
        try {
            await photosAPI.delete(deletePhotoId);
            toast.success('Photo deleted successfully!');
            setPhotos(prev => prev.filter(p => p._id !== deletePhotoId));
            setDeletePhotoId(null);
            loadEvents(); // Refresh counts
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Failed to delete photo';
            toast.error(message);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleBulkDelete = async () => {
        if (bulkDeleteIds.length === 0) return;
        setIsDeleting(true);
        try {
            let deleted = 0;
            for (const id of bulkDeleteIds) {
                await photosAPI.delete(id);
                deleted++;
            }
            toast.success(`${deleted} photo(s) deleted successfully!`);
            setPhotos(prev => prev.filter(p => !bulkDeleteIds.includes(p._id)));
            setBulkDeleteIds([]);
            loadEvents();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Some deletions failed';
            toast.error(message);
        } finally {
            setIsDeleting(false);
        }
    };

    const filteredEvents = events.filter(e =>
        e.eventName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Loading events...</p>
                </div>
            </div>
        );
    }

    // Photo view for a selected event
    if (selectedEvent) {
        return (
            <div className="space-y-6">
                {/* Back button + Header */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <button
                            onClick={() => { setSelectedEvent(null); setPhotos([]); }}
                            className="text-sm text-violet-400 hover:text-violet-300 mb-2 inline-flex items-center gap-1"
                        >
                            ← Back to Events
                        </button>
                        <h1 className="text-3xl font-bold text-white">{selectedEvent.eventName}</h1>
                        <p className="text-gray-400 mt-1">{photos.length} photo(s)</p>
                    </div>
                    <Link
                        href={`/admin/photos/add?eventId=${selectedEvent._id}`}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-medium hover:from-violet-600 hover:to-fuchsia-600 transition-all flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Photos
                    </Link>
                </div>

                {photosLoading ? (
                    <div className="flex items-center justify-center py-16">
                        <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <PhotoGrid
                        photos={photos}
                        selectable
                        onDelete={(id) => setDeletePhotoId(id)}
                        onBulkDelete={(ids) => setBulkDeleteIds(ids)}
                    />
                )}

                {/* Delete Photo Modal */}
                <ConfirmModal
                    isOpen={!!deletePhotoId}
                    title="Delete Photo"
                    message="This photo will be permanently removed from both Cloudinary and the database. This action cannot be undone."
                    confirmLabel="Delete Photo"
                    onConfirm={handleDeletePhoto}
                    onCancel={() => setDeletePhotoId(null)}
                    isLoading={isDeleting}
                />

                {/* Bulk Delete Modal */}
                <ConfirmModal
                    isOpen={bulkDeleteIds.length > 0}
                    title={`Delete ${bulkDeleteIds.length} Photos`}
                    message={`${bulkDeleteIds.length} photo(s) will be permanently removed from both Cloudinary and the database. This action cannot be undone.`}
                    confirmLabel={`Delete ${bulkDeleteIds.length} Photos`}
                    onConfirm={handleBulkDelete}
                    onCancel={() => setBulkDeleteIds([])}
                    isLoading={isDeleting}
                />
            </div>
        );
    }

    // Events list view
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Events</h1>
                    <p className="text-gray-400 mt-1">Manage your decoration events and galleries</p>
                </div>
                <button
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-medium hover:from-violet-600 hover:to-fuchsia-600 transition-all flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    New Event
                </button>
            </div>

            {/* Create Event Form */}
            {showCreateForm && (
                <form
                    onSubmit={handleCreateEvent}
                    className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-4"
                >
                    <h3 className="text-lg font-semibold text-white">Create New Event</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Event Name *</label>
                            <input
                                type="text"
                                value={newEventName}
                                onChange={(e) => setNewEventName(e.target.value)}
                                placeholder="e.g., Wedding Decoration"
                                className="w-full px-4 py-2.5 rounded-xl bg-gray-700/50 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-violet-500 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Description (optional)</label>
                            <input
                                type="text"
                                value={newEventDesc}
                                onChange={(e) => setNewEventDesc(e.target.value)}
                                placeholder="Brief event description"
                                className="w-full px-4 py-2.5 rounded-xl bg-gray-700/50 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-violet-500 transition-all"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            disabled={creating}
                            className="px-5 py-2.5 rounded-xl bg-violet-500 text-white font-medium hover:bg-violet-600 disabled:opacity-50 transition-colors"
                        >
                            {creating ? 'Creating...' : 'Create Event'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowCreateForm(false)}
                            className="px-5 py-2.5 rounded-xl bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search events..."
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-800/50 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-violet-500 transition-all"
                />
            </div>

            {/* Events Grid */}
            {filteredEvents.length === 0 ? (
                <div className="text-center py-16">
                    <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg font-medium">
                        {searchQuery ? 'No events match your search' : 'No events yet'}
                    </p>
                    {!searchQuery && (
                        <p className="text-gray-500 text-sm mt-1">Create your first event to get started</p>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredEvents.map((event) => (
                        <div
                            key={event._id}
                            className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all group"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-semibold text-white truncate">{event.eventName}</h3>
                                    {event.description && (
                                        <p className="text-sm text-gray-400 mt-1 line-clamp-2">{event.description}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                                <span className="flex items-center gap-1">
                                    <Images className="w-4 h-4" />
                                    {event.photoCount} photos
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(event.createdAt).toLocaleDateString()}
                                </span>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => loadPhotos(event)}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-violet-500/20 text-violet-400 hover:bg-violet-500/30 font-medium text-sm transition-colors"
                                >
                                    <Eye className="w-4 h-4" />
                                    View Photos
                                </button>
                                <button
                                    onClick={() => setDeleteEventModal(event)}
                                    className="px-3 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Delete Event Modal */}
            <ConfirmModal
                isOpen={!!deleteEventModal}
                title="Delete Event"
                message={`Are you sure you want to delete "${deleteEventModal?.eventName}"? This will also permanently delete all ${deleteEventModal?.photoCount || 0} photos from Cloudinary.`}
                confirmLabel="Delete Everything"
                onConfirm={handleDeleteEvent}
                onCancel={() => setDeleteEventModal(null)}
                isLoading={isDeleting}
            />
        </div>
    );
}
