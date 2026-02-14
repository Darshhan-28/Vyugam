import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'

import './globals.css'
import { Toaster } from 'sonner'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter'
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit'
})

export const metadata: Metadata = {
  title: 'VYUGAM - Technical Symposium',
  description: 'Technical Symposium by Department of Information Technology, P.A. College of Engineering and Technology, Pollachi',
  generator: 'v0.app',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
        <Toaster position="bottom-right" theme="dark" richColors />
      </body>
    </html>
  )
}
