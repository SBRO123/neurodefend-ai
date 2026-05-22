import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NeuroDefend AI — Detect. Protect. Empower.',
  description: 'AI-powered phishing detection and real-time threat monitoring for South Africa',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0a0e1a] text-slate-100 antialiased">{children}</body>
    </html>
  )
}
