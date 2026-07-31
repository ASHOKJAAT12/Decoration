'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
    label: string;
    value: number | string;
    icon: LucideIcon;
    gradient: string;
    trend?: string;
}

export default function StatsCard({ label, value, icon: Icon, gradient, trend }: StatsCardProps) {
    return (
        <div className="relative overflow-hidden rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-white/10 p-6 group hover:border-white/20 transition-all duration-300">
            {/* Background gradient blob */}
            <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full ${gradient} opacity-20 blur-2xl group-hover:opacity-30 transition-opacity`} />

            <div className="relative flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-400 mb-1">{label}</p>
                    <p className="text-3xl font-bold text-white">{value}</p>
                    {trend && (
                        <p className="text-xs text-emerald-400 mt-2 font-medium">{trend}</p>
                    )}
                </div>
                <div className={`w-12 h-12 rounded-xl ${gradient} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
        </div>
    );
}
