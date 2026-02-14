import type { Metadata } from 'next'
import { Space_Mono, Orbitron } from 'next/font/google'

import './globals.css'
import { Toaster } from 'sonner'

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-space-mono'
})

const orbitron = Orbitron({
  weight: ['400', '700', '900'],
  subsets: ['latin'],
  variable: '--font-orbitron'
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
    <html lang="en" className={`${spaceMono.variable} ${orbitron.variable}`}>
      <body className="font-mono antialiased bg-background text-foreground">
        {children}
        <Toaster position="bottom-right" theme="dark" richColors />
      </body>
    </html>
  )
}
