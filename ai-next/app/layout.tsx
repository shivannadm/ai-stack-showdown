import type { Metadata } from 'next'
import './globals.css'  // ← This line must be here!

export const metadata: Metadata = {
  title: 'AI Next App',
  description: 'Next.js AI Application with OpenAI and MongoDB',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
