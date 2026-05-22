'use client'
import Link from 'next/link'
import { Shield, Search, AlertTriangle, BookOpen, Users, TrendingUp, ChevronRight, CheckCircle, Zap, Globe, Lock } from 'lucide-react'

const STATS = [
  { value: '2.4M+', label: 'Scams Detected in SA (2024)' },
  { value: 'R2.6B', label: 'Lost to Cybercrime Annually' },
  { value: '94%', label: 'Detection Accuracy' },
  { value: '<1s', label: 'Average Scan Time' },
]

const FEATURES = [
  { icon: Search, title: 'AI Phishing Detector', desc: 'Paste links, messages, or emails. Our AI analyzes urgency tactics, suspicious domains, and social engineering patterns.', color: 'cyan' },
  { icon: AlertTriangle, title: 'Real-Time Monitoring', desc: 'Monitor login attempts, device changes, impossible travel, and SIM swap risk indicators on your account.', color: 'red' },
  { icon: BookOpen, title: 'Cybersecurity Education', desc: 'Learn about NSFAS bursary scams, fake job offers, WhatsApp fraud, and how to protect yourself.', color: 'blue' },
  { icon: Globe, title: 'SA Scam Heatmap', desc: 'See real-time scam activity across South Africa\'s provinces with threat intelligence feeds.', color: 'purple' },
  { icon: Users, title: 'Community Reporting', desc: 'Report scams to help protect other South Africans. Crowdsourced threat intelligence.', color: 'green' },
  { icon: TrendingUp, title: 'Risk Score Tracking', desc: 'Get a personal cybersecurity risk score and track your improvement over time with gamified learning.', color: 'yellow' },
]

const SAMPLE_SCAMS = [
  { type: 'NSFAS Scam', msg: 'Your bursary of R45,000 is ready. Click here to claim: bit.ly/nsfas-claim2024', score: 92 },
  { type: 'Banking Fraud', msg: 'ABSA: Your account will be suspended. Verify now or lose access permanently.', score: 88 },
  { type: 'Fake Job', msg: 'Congratulations! Amazon SA is hiring. WhatsApp +27 for your R25,000/month offer.', score: 74 },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0e1a] grid-bg">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
              <Shield className="w-4 h-4 text-cyan-400" />
            </div>
            <span className="font-bold text-white">NeuroDefend<span className="text-cyan-400"> AI</span></span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-slate-400">
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-white transition-colors">How It Works</Link>
            <Link href="/learn" className="hover:text-white transition-colors">Learn</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-sm text-slate-400 hover:text-white transition-colors hidden md:block">Dashboard</Link>
            <Link href="/scan" className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-sm rounded-lg transition-all">
              <Search className="w-4 h-4" /> Scan Now
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-cyan-500/5 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-cyan-500/20 text-xs text-cyan-400 mb-6">
            <Zap className="w-3 h-3" /> AI-Powered Cybersecurity for South Africa
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            Stop Scams<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Before They Stop You</span>
          </h1>

          <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            NeuroDefend AI detects phishing links, NSFAS bursary scams, fake job offers, WhatsApp fraud, and banking scams in real-time using advanced AI analysis.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/scan" className="flex items-center justify-center gap-2 px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl transition-all text-lg shadow-lg shadow-cyan-500/20">
              <Search className="w-5 h-5" /> Scan a Message Free
            </Link>
            <Link href="/dashboard" className="flex items-center justify-center gap-2 px-8 py-4 glass border border-white/10 hover:border-cyan-500/30 text-white font-semibold rounded-xl transition-all text-lg">
              View Dashboard <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Demo scan preview */}
          <div className="glass rounded-2xl border border-white/5 p-6 max-w-2xl mx-auto text-left">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs text-slate-500 uppercase tracking-wider">Live Demo — Recent Scans Detected</span>
            </div>
            <div className="space-y-3">
              {SAMPLE_SCAMS.map((s, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/2 border border-white/5">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-red-400">{s.score}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-red-400 mb-0.5">{s.type}</p>
                    <p className="text-xs text-slate-500 truncate">{s.msg}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 bg-red-500/10 text-red-400 rounded-full border border-red-500/20 flex-shrink-0">DANGEROUS</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4 border-y border-white/5">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl font-black text-cyan-400">{s.value}</p>
              <p className="text-xs text-slate-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Everything You Need to Stay Safe</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Built specifically for South African threats — NSFAS scams, banking fraud, fake bursaries, and more.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map(({ icon: Icon, title, desc, color }, i) => {
              const colorMap: Record<string, string> = {
                cyan: 'border-cyan-500/20 bg-cyan-500/5 text-cyan-400',
                red: 'border-red-500/20 bg-red-500/5 text-red-400',
                blue: 'border-blue-500/20 bg-blue-500/5 text-blue-400',
                purple: 'border-purple-500/20 bg-purple-500/5 text-purple-400',
                green: 'border-green-500/20 bg-green-500/5 text-green-400',
                yellow: 'border-yellow-500/20 bg-yellow-500/5 text-yellow-400',
              }
              return (
                <div key={i} className="glass glass-hover rounded-xl p-5 border border-white/5">
                  <div className={`w-10 h-10 rounded-lg border flex items-center justify-center mb-4 ${colorMap[color]}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-white mb-2">{title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-black text-white mb-12">How NeuroDefend AI Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Paste or Upload', desc: 'Paste a suspicious message, link, email, or upload a screenshot', icon: Search },
              { step: '02', title: 'AI Analysis', desc: 'Our AI scans for 20+ threat patterns including SA-specific scam tactics', icon: Zap },
              { step: '03', title: 'Get Protected', desc: 'Receive a risk score, threat explanation, and actionable recommendations', icon: Shield },
            ].map(({ step, title, desc, icon: Icon }, i) => (
              <div key={i} className="relative">
                {i < 2 && <div className="hidden md:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-cyan-500/30 to-transparent z-10" />}
                <div className="glass rounded-xl p-6 border border-white/5">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div className="text-xs text-cyan-400 font-mono mb-2">{step}</div>
                  <h3 className="font-bold text-white mb-2">{title}</h3>
                  <p className="text-sm text-slate-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User types */}
      <section className="py-20 px-4 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-white text-center mb-12">Built for Everyone</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Students & Individuals', features: ['Free phishing scans', 'Personal risk score', 'NSFAS scam alerts', 'Security education'], color: 'cyan', badge: 'Free' },
              { title: 'SME & Business', features: ['Team dashboards', 'Employee threat reports', 'Admin controls', 'Exportable reports'], color: 'blue', badge: 'Pro' },
              { title: 'Universities', features: ['Student threat analytics', 'Mass scam alerts', 'Security campaigns', 'Institutional portal'], color: 'purple', badge: 'Enterprise' },
            ].map(({ title, features, color, badge }, i) => {
              const c: Record<string, string> = { cyan: 'border-cyan-500/30 bg-cyan-500/5', blue: 'border-blue-500/30 bg-blue-500/5', purple: 'border-purple-500/30 bg-purple-500/5' }
              const t: Record<string, string> = { cyan: 'text-cyan-400', blue: 'text-blue-400', purple: 'text-purple-400' }
              return (
                <div key={i} className={`glass rounded-xl p-6 border ${c[color]}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-white">{title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${c[color]} ${t[color]}`}>{badge}</span>
                  </div>
                  <ul className="space-y-2">
                    {features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-slate-400">
                        <CheckCircle className={`w-4 h-4 flex-shrink-0 ${t[color]}`} />{f}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 border-t border-white/5">
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass rounded-2xl p-10 border border-cyan-500/20">
            <Lock className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
            <h2 className="text-3xl font-black text-white mb-4">Start Protecting Yourself Today</h2>
            <p className="text-slate-400 mb-8">Free scans. No account required. Instant AI analysis.</p>
            <Link href="/scan" className="inline-flex items-center gap-2 px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl transition-all text-lg">
              <Search className="w-5 h-5" /> Scan a Message Now
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-slate-500">NeuroDefend AI — Detect. Protect. Empower.</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-slate-600">
            <span>SABRIC: 011 847 3000</span>
            <span>SA Fraud Hotline: 0800 00 2870</span>
            <span>SAPS Cybercrime: 10111</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
