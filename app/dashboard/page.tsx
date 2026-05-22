'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Shield, AlertTriangle, Search, Activity, MapPin, Clock, Smartphone, Wifi, TrendingUp, Eye, Bell, ChevronRight } from 'lucide-react'
import { StatCard, AlertItem, ThreatBadge } from '@/components/ui/ThreatUI'
import { DEMO_ALERTS, DEMO_ACTIVITY } from '@/lib/demoData'
import { getScans, getStats, getAwarenessLevel, StoredScan, UserStats, timeAgo } from '@/lib/store'

const LIVE_EVENTS = [
  'Login attempt from Johannesburg, GP',
  'Phishing link scan completed',
  'Failed login attempt blocked',
  'New device detected: Android',
  'Suspicious IP flagged: 196.25.x.x',
  'SIM swap alert triggered',
  'Location anomaly detected',
  'Scan completed: DANGEROUS result',
]

export default function DashboardPage() {
  const [liveEvents, setLiveEvents] = useState<{ msg: string; time: string; id: number }[]>([])
  const [scans, setScans] = useState<StoredScan[]>([])
  const [stats, setStats] = useState<UserStats | null>(null)

  useEffect(() => {
    setScans(getScans())
    setStats(getStats())
    const interval = setInterval(() => {
      setLiveEvents(prev => [
        { msg: LIVE_EVENTS[Math.floor(Math.random() * LIVE_EVENTS.length)], time: 'just now', id: Date.now() },
        ...prev.slice(0, 6),
      ])
      // refresh stats live
      setStats(getStats())
      setScans(getScans())
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  const awareness = stats ? getAwarenessLevel(stats.securityScore) : null

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Security Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Real-time threat monitoring & activity feed</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 glass rounded-lg border border-green-500/20 text-xs text-green-400">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> System Active
          </div>
          <Link href="/scan" className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-sm rounded-lg transition-all">
            <Search className="w-4 h-4" /> New Scan
          </Link>
        </div>
      </div>

      {/* Live stats from localStorage */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Security Score"
          value={stats?.securityScore ?? 30}
          icon={<Shield className="w-5 h-5 text-yellow-400" />}
          color="yellow"
          sub={awareness ? `Level: ${awareness.level}` : 'Loading...'}
        />
        <StatCard
          label="Threats Found"
          value={stats?.threatsFound ?? 0}
          icon={<AlertTriangle className="w-5 h-5 text-red-400" />}
          color="red"
          sub="From your scans"
        />
        <StatCard
          label="Total Scans"
          value={stats?.totalScans ?? 0}
          icon={<Search className="w-5 h-5 text-cyan-400" />}
          color="cyan"
          sub="All time"
        />
        <StatCard
          label="Safe Scans"
          value={stats?.safeScans ?? 0}
          icon={<TrendingUp className="w-5 h-5 text-green-400" />}
          color="green"
          sub="Clean messages"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Live activity feed */}
          <div className="glass rounded-xl border border-white/5 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <h2 className="font-semibold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" /> Live Activity Feed
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-green-400">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Live
              </div>
            </div>
            <div className="p-4 space-y-2 min-h-[180px]">
              {liveEvents.length === 0 ? (
                <p className="text-slate-600 text-sm text-center py-8">Monitoring for activity...</p>
              ) : liveEvents.map(e => (
                <div key={e.id} className="flex items-center gap-3 p-2 rounded-lg bg-white/2 border border-white/5 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0" />
                  <span className="text-slate-300 flex-1">{e.msg}</span>
                  <span className="text-slate-600 text-xs">{e.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Real scan history */}
          <div className="glass rounded-xl border border-white/5 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <h2 className="font-semibold text-white flex items-center gap-2">
                <Search className="w-4 h-4 text-cyan-400" /> Your Recent Scans
              </h2>
              <Link href="/scan" className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                New scan <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-white/5">
              {scans.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-slate-500 text-sm mb-3">No scans yet.</p>
                  <Link href="/scan" className="text-xs text-cyan-400 hover:text-cyan-300">Run your first scan →</Link>
                </div>
              ) : scans.slice(0, 5).map(scan => (
                <Link key={scan.id} href="/scan"
                  className="p-4 flex items-start gap-3 hover:bg-white/2 transition-all block">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                    scan.result.threatLevel === 'dangerous' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                    scan.result.threatLevel === 'suspicious' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                    'bg-green-500/10 text-green-400 border border-green-500/20'
                  }`}>{scan.result.riskScore}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-300 truncate">{scan.content}</p>
                    <p className="text-xs text-slate-600 mt-0.5">{timeAgo(scan.timestamp)}</p>
                  </div>
                  <ThreatBadge level={scan.result.threatLevel} />
                </Link>
              ))}
            </div>
          </div>

          {/* Login history */}
          <div className="glass rounded-xl border border-white/5 overflow-hidden">
            <div className="p-4 border-b border-white/5">
              <h2 className="font-semibold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" /> Login History
              </h2>
            </div>
            <div className="divide-y divide-white/5">
              {DEMO_ACTIVITY.map((a, i) => (
                <div key={i} className="p-3 flex items-center gap-3 hover:bg-white/2 transition-all">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${a.status === 'success' ? 'bg-green-400' : 'bg-red-400'}`} />
                  <div className="flex-1 grid grid-cols-3 gap-2 text-sm">
                    <span className="text-white font-medium">{a.event}</span>
                    <span className="text-slate-500 flex items-center gap-1"><MapPin className="w-3 h-3" />{a.location}</span>
                    <span className="text-slate-500 flex items-center gap-1"><Smartphone className="w-3 h-3" />{a.device}</span>
                  </div>
                  <span className="text-xs text-slate-600">{a.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Security level card */}
          {stats && awareness && (
            <div className="glass rounded-xl border border-cyan-500/20 bg-cyan-500/3 p-4">
              <h2 className="font-semibold text-white flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-cyan-400" /> Your Security Level
              </h2>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <span className="text-xl font-black text-cyan-400">{stats.securityScore}</span>
                </div>
                <div>
                  <p className={`font-bold text-lg ${awareness.color}`}>{awareness.level}</p>
                  {awareness.next && <p className="text-xs text-slate-500">Next: {awareness.next}</p>}
                </div>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-1000"
                  style={{ width: `${stats.securityScore}%` }} />
              </div>
              <Link href="/profile" className="mt-3 flex items-center justify-between text-xs text-slate-400 hover:text-cyan-400 transition-colors">
                View full profile <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          )}

          {/* Security alerts */}
          <div className="glass rounded-xl border border-white/5 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <h2 className="font-semibold text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-red-400" /> Security Alerts
              </h2>
              <span className="text-xs px-2 py-0.5 bg-red-500/10 text-red-400 rounded-full border border-red-500/20">{DEMO_ALERTS.length}</span>
            </div>
            <div className="p-3 space-y-2">
              {DEMO_ALERTS.map(alert => <AlertItem key={alert.id} alert={alert} />)}
            </div>
          </div>

          {/* Active devices */}
          <div className="glass rounded-xl border border-white/5 p-4">
            <h2 className="font-semibold text-white flex items-center gap-2 mb-4">
              <Smartphone className="w-4 h-4 text-cyan-400" /> Active Devices
            </h2>
            <div className="space-y-3">
              {[
                { name: 'Chrome / Windows 11', location: 'Pretoria, GP', status: 'current', icon: Wifi },
                { name: 'Safari / iPhone 15', location: 'Johannesburg, GP', status: 'recent', icon: Smartphone },
                { name: 'Unknown Android', location: 'Unknown', status: 'suspicious', icon: AlertTriangle },
              ].map((d, i) => (
                <div key={i} className={`flex items-center gap-3 p-2 rounded-lg ${d.status === 'suspicious' ? 'bg-red-500/5 border border-red-500/10' : 'bg-white/2'}`}>
                  <d.icon className={`w-4 h-4 flex-shrink-0 ${d.status === 'suspicious' ? 'text-red-400' : d.status === 'current' ? 'text-green-400' : 'text-slate-500'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white font-medium truncate">{d.name}</p>
                    <p className="text-xs text-slate-500">{d.location}</p>
                  </div>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    d.status === 'current' ? 'bg-green-500/10 text-green-400' :
                    d.status === 'suspicious' ? 'bg-red-500/10 text-red-400' : 'bg-slate-500/10 text-slate-400'
                  }`}>{d.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="glass rounded-xl border border-white/5 p-4">
            <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Eye className="w-4 h-4 text-cyan-400" /> Quick Actions
            </h2>
            <div className="space-y-2">
              {[
                { label: 'Scan a message', href: '/scan' },
                { label: 'View analytics', href: '/analytics' },
                { label: 'Learn about scams', href: '/learn' },
                { label: 'My security profile', href: '/profile' },
                { label: 'Report a scam', href: '/learn#report' },
              ].map(({ label, href }, i) => (
                <Link key={i} href={href}
                  className="flex items-center justify-between p-2.5 rounded-lg glass-hover border border-white/5 text-sm text-slate-300 hover:text-white transition-all">
                  {label} <ChevronRight className="w-4 h-4 text-slate-600" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
