import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from './components/Share/Navbar';
import Footer from './components/Share/Footer';
import WhatsAppButton from './components/Landing_page/WhatsAppButton';
import { Toaster } from "sonner";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Balloon Bazar - Professional Balloon Decoration Jaipur',
  description: 'Birthday, Anniversary, Baby Shower Balloon Decorations starting ₹999'
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
