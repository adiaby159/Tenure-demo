import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Tenure',
  description: 'Institutional knowledge that survives leadership transitions.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  )
}
