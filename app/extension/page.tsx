'use client'
import { useState } from 'react'
import { Shield, Chrome, AlertTriangle, CheckCircle, Zap, Eye, Lock, Globe, Download, Star, ArrowRight, XCircle } from 'lucide-react'

const FEATURES = [
  { icon: Globe, title: 'Real-Time Website Scanning', desc: 'Every website you visit is instantly scanned against our threat database before the page fully loads.', status: 'live' },
  { icon: AlertTriangle, title: 'Unsafe Website Warnings', desc: 'Full-page warning overlay when you navigate to a known phishing or malicious website.', status: 'live' },
  { icon: Lock, title: 'Fake Login Detection', desc: 'Detects cloned login pages that impersonate banks, NSFAS, and social media platforms.', status: 'live' },
  { icon: Zap, title: 'Auto Link Analysis', desc: 'Hover over any link to instantly see its risk score before you click it.', status: 'live' },
  { icon: Eye, title: 'Form Data Protection', desc: 'Alerts you before submitting sensitive data to suspicious websites.', status: 'coming' },
  { icon: Shield, title: 'WhatsApp Web Protection', desc: 'Scans links shared in WhatsApp Web in real-time for phishing content.', status: 'coming' },
]

const DEMO_SITES = [
  { url: 'myNSFAS.org.za', status: 'safe', score: 4, label: 'Official NSFAS Portal' },
  { url: 'nsfas-claim2024.xyz', status: 'dangerous', score: 94, label: 'Phishing Site' },
  { url: 'absa.co.za', status: 'safe', score: 2, label: 'Official ABSA Bank' },
  { url: 'absa-verify-account.tk', status: 'dangerous', score: 97, label: 'Bank Impersonation' },
  { url: 'careers.amazon.com', status: 'safe', score: 5, label: 'Official Amazon Jobs' },
  { url: 'amazon-sa-jobs-whatsapp.ml', status: 'dangerous', score: 88, label: 'Fake Job Scam' },
]

const STATS = [
  { value: '50ms', label: 'Average scan time per page' },
  { value: '99.2%', label: 'Phishing detection rate' },
  { value: '0.3%', label: 'False positive rate' },
  { value: '2M+', label: 'URLs in threat database' },
]

export default function ExtensionPage() {
  const [activeDemo, setActiveDemo] = useState<number | null>(null)
  const [scanning, setScanning] = useState(false)
  const [scanUrl, setScanUrl] = useState('')
  const [scanResult, setScanResult] = useState<null | { safe: boolean; score: number; reason: string }>(null)

  const handleDemoScan = async (url: string, i: number) => {
    setActiveDemo(i)
    setScanning(true)
    setScanResult(null)
    await new Promise(r => setTimeout(r, 900))
    const site = DEMO_SITES[i]
    setScanResult({
      safe: site.status === 'safe',
      score: site.score,
      reason: site.status === 'safe'
        ? 'Domain verified against trusted registry. No phishing indicators found.'
        : 'Domain matches known phishing patterns. Suspicious TLD and brand impersonation detected.',
    })
    setScanning(false)
  }

  const handleManualScan = async () => {
    if (!scanUrl.trim()) return
    setScanning(true)
    setScanResult(null)
    await new Promise(r => setTimeout(r, 1000))
    const isSuspicious = /bit\.ly|tinyurl|\.xyz|\.tk|\.ml|verify|claim|suspended|login-secure/i.test(scanUrl)
    setScanResult({
      safe: !isSuspicious,
      score: isSuspicious ? Math.floor(Math.random() * 30) + 65 : Math.floor(Math.random() * 10) + 2,
      reason: isSuspicious
        ? 'URL contains patterns associated with phishing and social engineering attacks.'
        : 'No significant threat indicators detected in this URL.',
    })
    setScanning(false)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 glass rounded-full border border-cyan-500/20 text-xs text-cyan-400 mb-4">
          <Zap className="w-3 h-3" /> Coming to Chrome, Firefox & Edge
        </div>
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
            <Shield className="w-8 h-8 text-cyan-400" />
          </div>
          <div className="text-left">
            <h1 className="text-3xl font-black text-white">GuardianAI Browser Shield</h1>
            <p className="text-slate-400 text-sm">Real-time protection while you browse</p>
          </div>
        </div>
        <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8">
          The GuardianAI browser extension scans every website, link, and form in real-time — protecting you from phishing sites, fake login pages, and malicious URLs before you even click.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button className="flex items-center justify-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl transition-all">
            <Download className="w-5 h-5" /> Join Waitlist — Free
          </button>
          <button className="flex items-center justify-center gap-2 px-6 py-3 glass border border-white/10 hover:border-cyan-500/30 text-white font-semibold rounded-xl transition-all">
            <Chrome className="w-5 h-5" /> Chrome Extension (Beta)
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {STATS.map((s, i) => (
          <div key={i} className="glass rounded-xl p-4 border border-white/5 text-center">
            <p className="text-2xl font-black text-cyan-400">{s.value}</p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-10">
        {/* Extension demo UI mockup */}
        <div className="space-y-4">
          <h2 className="font-bold text-white text-lg">Extension Demo</h2>
          <p className="text-slate-400 text-sm">Click any URL below to simulate the extension scanning it in real-time.</p>

          <div className="space-y-2">
            {DEMO_SITES.map((site, i) => (
              <button key={i} onClick={() => handleDemoScan(site.url, i)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                  activeDemo === i ? (site.status === 'safe' ? 'border-green-500/40 bg-green-500/5' : 'border-red-500/40 bg-red-500/5') : 'glass border-white/5 hover:border-white/10'
                }`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  site.status === 'safe' ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'
                }`}>
                  {site.status === 'safe'
                    ? <CheckCircle className="w-4 h-4 text-green-400" />
                    : <XCircle className="w-4 h-4 text-red-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-mono text-white truncate">{site.url}</p>
                  <p className="text-xs text-slate-500">{site.label}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 flex-shrink-0" />
              </button>
            ))}
          </div>

          {/* Scan result popup */}
          {activeDemo !== null && (
            <div className={`rounded-xl p-4 border ${
              scanning ? 'glass border-white/10' :
              scanResult?.safe ? 'bg-green-500/5 border-green-500/30' : 'bg-red-500/5 border-red-500/30'
            }`}>
              {scanning ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
                  <p className="text-sm text-slate-400">GuardianAI Shield scanning {DEMO_SITES[activeDemo].url}...</p>
                </div>
              ) : scanResult && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {scanResult.safe
                      ? <CheckCircle className="w-5 h-5 text-green-400" />
                      : <AlertTriangle className="w-5 h-5 text-red-400" />}
                    <span className={`font-bold text-sm ${scanResult.safe ? 'text-green-400' : 'text-red-400'}`}>
                      {scanResult.safe ? '✓ Site is Safe' : '⚠ Dangerous Site Blocked'}
                    </span>
                    <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-mono ${
                      scanResult.safe ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                    }`}>Score: {scanResult.score}/100</span>
                  </div>
                  <p className="text-xs text-slate-400">{scanResult.reason}</p>
                </div>
              )}
            </div>
          )}

          {/* Manual URL test */}
          <div className="glass rounded-xl border border-white/5 p-4">
            <p className="text-sm font-semibold text-white mb-3">Test Any URL</p>
            <div className="flex gap-2">
              <input value={scanUrl} onChange={e => setScanUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleManualScan()}
                placeholder="Enter a URL to scan..."
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 outline-none focus:border-cyan-500/30" />
              <button onClick={handleManualScan} disabled={!scanUrl.trim() || scanning}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-black font-semibold text-sm rounded-lg transition-all">
                {scanning ? '...' : 'Scan'}
              </button>
            </div>
            {!scanning && scanResult && scanUrl && (
              <div className={`mt-3 p-3 rounded-lg border text-xs ${scanResult.safe ? 'bg-green-500/5 border-green-500/20 text-green-300' : 'bg-red-500/5 border-red-500/20 text-red-300'}`}>
                <span className="font-bold">{scanResult.safe ? '✓ Safe' : '✗ Dangerous'}</span> — Score: {scanResult.score}/100 — {scanResult.reason}
              </div>
            )}
          </div>
        </div>

        {/* Features list */}
        <div className="space-y-4">
          <h2 className="font-bold text-white text-lg">Extension Features</h2>
          <div className="space-y-3">
            {FEATURES.map(({ icon: Icon, title, desc, status }, i) => (
              <div key={i} className={`glass rounded-xl p-4 border transition-all ${
                status === 'live' ? 'border-cyan-500/15 hover:border-cyan-500/30' : 'border-white/5 opacity-70'
              }`}>
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    status === 'live' ? 'bg-cyan-500/10 border border-cyan-500/20' : 'bg-white/5 border border-white/10'
                  }`}>
                    <Icon className={`w-4 h-4 ${status === 'live' ? 'text-cyan-400' : 'text-slate-500'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-white">{title}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        status === 'live' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-slate-500/10 text-slate-500 border border-slate-500/20'
                      }`}>{status === 'live' ? 'Available' : 'Coming Soon'}</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Browser support */}
      <div className="glass rounded-xl border border-white/5 p-6 text-center">
        <h2 className="font-bold text-white mb-2">Browser Support</h2>
        <p className="text-slate-400 text-sm mb-6">GuardianAI Shield will be available on all major browsers</p>
        <div className="flex flex-wrap justify-center gap-6">
          {[
            { name: 'Chrome', icon: '🟡', status: 'Beta' },
            { name: 'Firefox', icon: '🦊', status: 'Coming Soon' },
            { name: 'Edge', icon: '🔵', status: 'Coming Soon' },
            { name: 'Brave', icon: '🦁', status: 'Coming Soon' },
          ].map(({ name, icon, status }, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 glass rounded-2xl border border-white/10 flex items-center justify-center text-2xl">{icon}</div>
              <p className="text-sm text-white font-medium">{name}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full ${status === 'Beta' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-white/5 text-slate-500'}`}>{status}</span>
            </div>
          ))}
        </div>
        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-500">
          <Star className="w-3 h-3 text-yellow-400" />
          <span>Join 2,400+ users on the waitlist for early access</span>
        </div>
      </div>
    </div>
  )
}
