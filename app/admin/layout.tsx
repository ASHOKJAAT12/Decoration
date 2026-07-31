'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getAccessToken } from '@/lib/api';
import Sidebar from './components/Sidebar';
import { Toaster } from 'sonner';

const publicPaths = ['/admin/login', '/admin/forgot-password', '/admin/reset-password'];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [isLoaded, setIsLoaded] = useState(false);

    const isPublicPage = publicPaths.some(p => pathname?.startsWith(p));

    useEffect(() => {
        const token = getAccessToken();
        if (!isPublicPage && !token) {
            router.push('/admin/login');
        } else {
            setIsLoaded(true);
        }
    }, [pathname, isPublicPage, router]);

    if (!isLoaded) {
        return (
            <div className="fixed inset-0 z-[100] bg-gray-950 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // Public pages (login, forgot-password, reset-password) — no sidebar
    if (isPublicPage) {
        return (
            <div className="fixed inset-0 z-[100] bg-gray-950 text-white overflow-auto">
                <Toaster
                    position="top-right"
                    theme="dark"
                    toastOptions={{
                        style: {
                            background: '#1f2937',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: '#fff',
                        },
                    }}
                />
                {children}
            </div>
        );
    }

    // Protected pages — with sidebar
    return (
        <div className="fixed inset-0 z-[100] bg-gray-950 text-white overflow-auto">
            <Toaster
                position="top-right"
                theme="dark"
                toastOptions={{
                    style: {
                        background: '#1f2937',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#fff',
                    },
                }}
            />
            <div className="flex min-h-screen">
                <Sidebar />
                <main className="flex-1 lg:ml-72">
                    <div className="p-6 lg:p-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
