'use client';

import React, { useState } from 'react';
import { Trash2, Check } from 'lucide-react';

interface Photo {
    _id: string;
    imageUrl: string;
    cloudinaryPublicId: string;
    uploadedAt: string;
}

interface PhotoGridProps {
    photos: Photo[];
    selectable?: boolean;
    onDelete?: (photoId: string) => void;
    onBulkDelete?: (photoIds: string[]) => void;
}

export default function PhotoGrid({ photos, selectable = false, onDelete, onBulkDelete }: PhotoGridProps) {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const toggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const selectAll = () => {
        if (selectedIds.length === photos.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(photos.map(p => p._id));
        }
    };

    if (photos.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="w-20 h-20 rounded-full bg-gray-700/50 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <p className="text-gray-400 text-lg font-medium">No photos yet</p>
                <p className="text-gray-500 text-sm mt-1">Upload some photos to get started</p>
            </div>
        );
    }

    return (
        <div>
            {/* Bulk actions */}
            {selectable && (
                <div className="flex items-center gap-4 mb-4">
                    <button
                        onClick={selectAll}
                        className="text-sm text-violet-400 hover:text-violet-300 font-medium transition-colors"
                    >
                        {selectedIds.length === photos.length ? 'Deselect All' : 'Select All'}
                    </button>
                    {selectedIds.length > 0 && (
                        <>
                            <span className="text-sm text-gray-400">
                                {selectedIds.length} selected
                            </span>
                            {onBulkDelete && (
                                <button
                                    onClick={() => {
                                        onBulkDelete(selectedIds);
                                        setSelectedIds([]);
                                    }}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 text-sm font-medium transition-colors"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Delete Selected
                                </button>
                            )}
                        </>
                    )}
                </div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {photos.map((photo) => (
                    <div
                        key={photo._id}
                        className={`group relative aspect-square rounded-xl overflow-hidden border transition-all duration-200 ${selectedIds.includes(photo._id)
                                ? 'border-violet-500 ring-2 ring-violet-500/30'
                                : 'border-white/10 hover:border-white/20'
                            }`}
                        onClick={() => selectable && toggleSelect(photo._id)}
                    >
                        <img
                            src={photo.imageUrl}
                            alt=""
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        {/* Selection checkbox */}
                        {selectable && (
                            <div className={`absolute top-2 left-2 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${selectedIds.includes(photo._id)
                                    ? 'bg-violet-500 border-violet-500'
                                    : 'border-white/50 bg-black/30'
                                }`}>
                                {selectedIds.includes(photo._id) && <Check className="w-4 h-4 text-white" />}
                            </div>
                        )}

                        {/* Delete button */}
                        {onDelete && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(photo._id);
                                }}
                                className="absolute top-2 right-2 p-2 rounded-lg bg-red-500/80 text-white opacity-0 group-hover:opacity-100 hover:bg-red-500 transition-all"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}

                        {/* Date */}
                        <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-xs text-gray-300 truncate">
                                {new Date(photo.uploadedAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
