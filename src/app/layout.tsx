import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'digiguide.tv - Premium UK TV Listings',
  description: 'The most comprehensive and beautiful TV guide for UK television. Never miss your favourite programmes again.',
  keywords: ['TV guide', 'UK television', 'programme listings', 'TV schedule', 'British TV'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-GB">
      <body className={inter.className}>{children}</body>
    </html>
  )
}