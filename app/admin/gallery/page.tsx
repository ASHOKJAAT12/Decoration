'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Plus, Trash2, Upload, Images } from 'lucide-react';
import { adminGalleryAPI } from '@/lib/api';
import ConfirmModal from '../components/ConfirmModal';
import { toast } from 'sonner';

interface GalleryPhoto {
    _id: string;
    imageUrl: string;
    cloudinaryPublicId: string;
    uploadedAt: string;
}

export default function GalleryPage() {
    const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        loadPhotos();
    }, []);

    const loadPhotos = async () => {
        try {
            const data = await adminGalleryAPI.getAll();
            setPhotos(data.photos || []);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Failed to load gallery';
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFiles = async (files: File[]) => {
        if (files.length === 0) return;
        const validFiles = files.filter(f => f.type.startsWith('image/'));
        if (validFiles.length === 0) {
            toast.error('Please select image files only');
            return;
        }

        setUploading(true);
        setUploadProgress(0);

        try {
            const data: any = await adminGalleryAPI.upload(validFiles, (pct) => setUploadProgress(pct));
            toast.success(data.message || `${validFiles.length} photo(s) uploaded!`);
            loadPhotos();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Upload failed';
            toast.error(message);
        } finally {
            setUploading(false);
            setUploadProgress(0);
            if (inputRef.current) inputRef.current.value = '';
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        handleFiles(files);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
    };

    const handleDeletePhoto = async () => {
        if (!deleteId) return;
        setIsDeleting(true);
        try {
            await adminGalleryAPI.delete(deleteId);
            toast.success('Photo deleted successfully!');
            setPhotos(prev => prev.filter(p => p._id !== deleteId));
            setDeleteId(null);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Delete failed';
            toast.error(message);
        } finally {
            setIsDeleting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Loading gallery...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Gallery</h1>
                    <p className="text-gray-400 mt-1">Manage your homepage auto-scrolling gallery</p>
                </div>
                <button
                    onClick={() => inputRef.current?.click()}
                    disabled={uploading}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-medium hover:from-violet-600 hover:to-fuchsia-600 disabled:opacity-50 transition-all flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Upload Photos
                </button>
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleInputChange}
                />
            </div>

            {/* Upload Zone */}
            <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => !uploading && inputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${dragOver
                    ? 'border-violet-400 bg-violet-500/10'
                    : 'border-white/20 hover:border-violet-400/50 hover:bg-violet-500/5'
                    }`}
            >
                {uploading ? (
                    <div className="space-y-3">
                        <Upload className="w-10 h-10 text-violet-400 mx-auto animate-bounce" />
                        <p className="text-gray-300 font-medium">Uploading... {uploadProgress}%</p>
                        <div className="w-full max-w-xs mx-auto bg-gray-700 rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-violet-500 to-fuchsia-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                    </div>
                ) : (
                    <>
                        <Images className="w-10 h-10 text-gray-500 mx-auto mb-3" />
                        <p className="text-gray-300 font-medium mb-1">Drag & drop images here or click to browse</p>
                        <p className="text-gray-500 text-sm">Supports JPG, PNG, WEBP — Max 10MB each</p>
                    </>
                )}
            </div>

            {/* Photo Count */}
            {photos.length > 0 && (
                <p className="text-sm text-gray-400">{photos.length} photo(s) in gallery</p>
            )}

            {/* Gallery Grid */}
            {photos.length === 0 ? (
                <div className="text-center py-16">
                    <Images className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg font-medium">No gallery photos yet</p>
                    <p className="text-gray-500 text-sm mt-1">Upload images to display in the home page gallery</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {photos.map((photo) => (
                        <div
                            key={photo._id}
                            className="group relative aspect-square rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all"
                        >
                            <img
                                src={photo.imageUrl}
                                alt="Gallery"
                                loading="lazy"
                                className="w-full h-full object-cover"
                            />
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            {/* Delete button */}
                            <button
                                onClick={() => setDeleteId(photo._id)}
                                className="absolute top-2 right-2 p-2 rounded-lg bg-red-500/80 text-white opacity-0 group-hover:opacity-100 hover:bg-red-500 transition-all"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            {/* Date */}
                            <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <p className="text-xs text-gray-300 truncate">
                                    {new Date(photo.uploadedAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Delete Confirm Modal */}
            <ConfirmModal
                isOpen={!!deleteId}
                title="Delete Gallery Photo"
                message="This photo will be permanently removed from Cloudinary, the database, and the homepage gallery. This action cannot be undone."
                confirmLabel="Delete Photo"
                onConfirm={handleDeletePhoto}
                onCancel={() => setDeleteId(null)}
                isLoading={isDeleting}
            />
        </div>
    );
}
