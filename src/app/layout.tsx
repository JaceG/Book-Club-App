import React from 'react'
import './globals.css'
import { Inter } from 'next/font/google'
import Header from '../components/Header'
import Footer from '../components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Book Club App',
  description:
    'Discover, discuss, and vote on books with your literary community',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className="container mx-auto py-8">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
