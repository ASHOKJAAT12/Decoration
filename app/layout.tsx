import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from './components/Share/Navbar';
import Footer from './components/Share/Footer';
import WhatsAppButton from './components/Landing_page/WhatsAppButton';
import { Toaster } from "sonner";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DECORATION FOR YOU - Professional Decoration Services',
  description: 'Transforming Spaces, Creating Memories - Expert Decoration Services for Every Occasion.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Toaster position="bottom-right" />
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  )
}
