'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Upload, X, Check, ImagePlus, FileImage } from 'lucide-react';
import { eventsAPI, photosAPI } from '@/lib/api';
import { toast } from 'sonner';

interface Event {
    _id: string;
    eventName: string;
}

function AddPhotosForm() {
    const searchParams = useSearchParams();
    const preselectedEventId = searchParams.get('eventId');

    const [events, setEvents] = useState<Event[]>([]);
    const [selectedEventId, setSelectedEventId] = useState(preselectedEventId || '');
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isDragOver, setIsDragOver] = useState(false);
    const [isLoadingEvents, setIsLoadingEvents] = useState(true);

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
            setIsLoadingEvents(false);
        }
    };

    const validateFiles = (fileList: File[]) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
        const maxSize = 10 * 1024 * 1024; // 10MB
        const valid: File[] = [];

        for (const file of fileList) {
            if (!allowedTypes.includes(file.type)) {
                toast.error(`${file.name}: Invalid file type. Only JPG, PNG, WEBP allowed.`);
                continue;
            }
            if (file.size > maxSize) {
                toast.error(`${file.name}: File too large (max 10MB)`);
                continue;
            }
            valid.push(file);
        }

        return valid;
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = validateFiles(Array.from(e.target.files));
            addFiles(newFiles);
        }
    };

    const addFiles = useCallback((newFiles: File[]) => {
        if (newFiles.length === 0) return;

        setFiles(prev => [...prev, ...newFiles]);
        // Generate previews
        newFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviews(prev => [...prev, e.target?.result as string]);
            };
            reader.readAsDataURL(file);
        });
    }, []);

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        if (e.dataTransfer.files) {
            const newFiles = validateFiles(Array.from(e.dataTransfer.files));
            addFiles(newFiles);
        }
    };

    const handleUpload = async () => {
        if (!selectedEventId) {
            toast.error('Please select an event');
            return;
        }
        if (files.length === 0) {
            toast.error('Please select at least one image');
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);

        try {
            await photosAPI.upload(selectedEventId, files, (percent) => {
                setUploadProgress(percent);
            });
            toast.success(`${files.length} photo(s) uploaded successfully!`);
            setFiles([]);
            setPreviews([]);
            setUploadProgress(0);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Upload failed';
            toast.error(message);
        } finally {
            setIsUploading(false);
        }
    };

    if (isLoadingEvents) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white">Add Photos</h1>
                <p className="text-gray-400 mt-1">Upload images to your decoration events</p>
            </div>

            {/* Event Selector */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Select Event *</label>
                <select
                    value={selectedEventId}
                    onChange={(e) => setSelectedEventId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-700/50 border border-white/10 text-white focus:outline-none focus:border-violet-500 transition-all appearance-none cursor-pointer"
                >
                    <option value="" className="bg-gray-800">Choose an event...</option>
                    {events.map((event) => (
                        <option key={event._id} value={event._id} className="bg-gray-800">
                            {event.eventName}
                        </option>
                    ))}
                </select>
            </div>

            {/* Upload Area */}
            <div
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all ${isDragOver
                        ? 'border-violet-500 bg-violet-500/10'
                        : 'border-white/20 hover:border-white/30 bg-gray-800/30'
                    }`}
            >
                <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="pointer-events-none">
                    <div className="w-16 h-16 rounded-2xl bg-violet-500/20 flex items-center justify-center mx-auto mb-4">
                        <Upload className={`w-8 h-8 ${isDragOver ? 'text-violet-400' : 'text-gray-400'}`} />
                    </div>
                    <p className="text-lg font-medium text-white">
                        {isDragOver ? 'Drop images here' : 'Drag & drop images here'}
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                        or click to browse • JPG, PNG, WEBP • Max 10MB each
                    </p>
                </div>
            </div>

            {/* File Previews */}
            {previews.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <FileImage className="w-5 h-5 text-gray-400" />
                            {files.length} file(s) selected
                        </h3>
                        <button
                            onClick={() => { setFiles([]); setPreviews([]); }}
                            className="text-sm text-red-400 hover:text-red-300 transition-colors"
                        >
                            Clear all
                        </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {previews.map((preview, index) => (
                            <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group">
                                <img src={preview} alt="" className="w-full h-full object-cover" />
                                <button
                                    onClick={() => removeFile(index)}
                                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white opacity-0 group-hover:opacity-100 hover:bg-red-500 transition-all"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                <div className="absolute bottom-0 left-0 right-0 px-2 py-1 bg-black/60 text-xs text-gray-300 truncate">
                                    {files[index]?.name}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Upload Progress */}
            {isUploading && (
                <div className="bg-gray-800/50 border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-300">Uploading...</span>
                        <span className="text-sm font-bold text-violet-400">{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Upload Button */}
            <button
                onClick={handleUpload}
                disabled={isUploading || files.length === 0 || !selectedEventId}
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold text-lg hover:from-violet-600 hover:to-fuchsia-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
                {isUploading ? (
                    <span className="flex items-center gap-2">
                        <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Uploading {files.length} photo(s)...
                    </span>
                ) : (
                    <>
                        <ImagePlus className="w-5 h-5" />
                        Upload {files.length > 0 ? `${files.length} Photo(s)` : 'Photos'}
                    </>
                )}
            </button>
        </div>
    );
}

export default function AddPhotosPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <AddPhotosForm />
        </Suspense>
    );
}
