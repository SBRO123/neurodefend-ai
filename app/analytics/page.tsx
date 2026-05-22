'use client'
import { useState, useEffect } from 'react'
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { TrendingUp, MapPin, Users, AlertTriangle, ThumbsUp } from 'lucide-react'
import { THREAT_TREND_DATA, SCAM_CATEGORIES, SA_HEATMAP_DATA, COMMUNITY_REPORTS } from '@/lib/demoData'
import { getCommunityReports, upvoteReport, CommunityReport, timeAgo } from '@/lib/store'

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass rounded-lg p-3 border border-white/10 text-xs">
      <p className="text-white font-semibold mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  )
}

export default function AnalyticsPage() {
  const totalScams = SA_HEATMAP_DATA.reduce((s, p) => s + p.scams, 0)
  const maxScams = Math.max(...SA_HEATMAP_DATA.map(p => p.scams))
  const [userReports, setUserReports] = useState<CommunityReport[]>([])

  useEffect(() => { setUserReports(getCommunityReports()) }, [])

  const handleUpvote = (id: string) => {
    upvoteReport(id)
    setUserReports(getCommunityReports())
  }

  const allReports = [
    ...userReports.map(r => ({ id: r.id, type: r.type, description: r.description, location: r.location, votes: r.votes, time: timeAgo(r.timestamp), isUser: true })),
    ...COMMUNITY_REPORTS.map(r => ({ ...r, isUser: false })),
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white mb-2">Threat Analytics</h1>
        <p className="text-slate-500 text-sm">South African cybercrime trends and threat intelligence</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Scams Tracked', value: totalScams.toLocaleString(), icon: AlertTriangle, color: 'text-red-400' },
          { label: 'Most Affected Province', value: 'Gauteng', icon: MapPin, color: 'text-cyan-400' },
          { label: 'Community Reports', value: '4,821', icon: Users, color: 'text-blue-400' },
          { label: 'Trend (30 days)', value: '+18%', icon: TrendingUp, color: 'text-yellow-400' },
        ].map(({ label, value, icon: Icon, color }, i) => (
          <div key={i} className="glass rounded-xl p-4 border border-white/5">
            <Icon className={`w-5 h-5 ${color} mb-2`} />
            <p className="text-xl font-bold text-white">{value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Trend chart */}
        <div className="lg:col-span-2 glass rounded-xl border border-white/5 p-5">
          <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" /> Scam Trends — Last 6 Months
          </h2>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={THREAT_TREND_DATA}>
              <defs>
                {[['phishing', '#ef4444'], ['bursary', '#f59e0b'], ['banking', '#8b5cf6'], ['jobs', '#3b82f6']].map(([key, color]) => (
                  <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
              <Area type="monotone" dataKey="phishing" name="Phishing" stroke="#ef4444" fill="url(#grad-phishing)" strokeWidth={2} />
              <Area type="monotone" dataKey="bursary" name="Bursary Scams" stroke="#f59e0b" fill="url(#grad-bursary)" strokeWidth={2} />
              <Area type="monotone" dataKey="banking" name="Banking Fraud" stroke="#8b5cf6" fill="url(#grad-banking)" strokeWidth={2} />
              <Area type="monotone" dataKey="jobs" name="Fake Jobs" stroke="#3b82f6" fill="url(#grad-jobs)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="glass rounded-xl border border-white/5 p-5">
          <h2 className="font-semibold text-white mb-4">Scam Categories</h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={SCAM_CATEGORIES} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {SCAM_CATEGORIES.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {SCAM_CATEGORIES.map((c, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                  <span className="text-slate-400">{c.name}</span>
                </div>
                <span className="text-white font-medium">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SA Heatmap */}
      <div className="glass rounded-xl border border-white/5 p-5 mb-6">
        <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-cyan-400" /> South Africa Scam Heatmap
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-9 gap-3">
          {SA_HEATMAP_DATA.map((p, i) => {
            const intensity = p.scams / maxScams
            const bg = intensity > 0.7 ? 'bg-red-500/20 border-red-500/30' :
                       intensity > 0.4 ? 'bg-orange-500/20 border-orange-500/30' :
                       intensity > 0.2 ? 'bg-yellow-500/20 border-yellow-500/30' : 'bg-blue-500/10 border-blue-500/20'
            const text = intensity > 0.7 ? 'text-red-400' : intensity > 0.4 ? 'text-orange-400' : intensity > 0.2 ? 'text-yellow-400' : 'text-blue-400'
            return (
              <div key={i} className={`rounded-lg p-3 border text-center ${bg}`}>
                <p className={`text-sm font-bold ${text}`}>{p.scams.toLocaleString()}</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-tight">{p.province}</p>
              </div>
            )
          })}
        </div>
        <div className="flex items-center gap-4 mt-4 text-xs text-slate-500">
          <span>Intensity:</span>
          {[['bg-blue-500/30', 'Low'], ['bg-yellow-500/30', 'Medium'], ['bg-orange-500/30', 'High'], ['bg-red-500/30', 'Critical']].map(([c, l]) => (
            <div key={l} className="flex items-center gap-1"><span className={`w-3 h-3 rounded ${c}`} />{l}</div>
          ))}
        </div>
      </div>

      {/* Bar chart + Community reports */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass rounded-xl border border-white/5 p-5">
          <h2 className="font-semibold text-white mb-4">Scams by Province</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={SA_HEATMAP_DATA} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="province" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} width={90} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="scams" name="Scams" radius={[0, 4, 4, 0]}>
                {SA_HEATMAP_DATA.map((entry, i) => (
                  <Cell key={i} fill={entry.scams > 1000 ? '#ef4444' : entry.scams > 500 ? '#f59e0b' : '#3b82f6'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

          <div className="glass rounded-xl border border-white/5 overflow-hidden">
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" /> Community Reports
            </h2>
            <span className="text-xs text-slate-500">{allReports.length} reports</span>
          </div>
          <div className="divide-y divide-white/3 max-h-80 overflow-y-auto">
            {allReports.map(r => (
              <div key={r.id} className="p-4 hover:bg-white/2 transition-all">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 bg-red-500/10 text-red-400 rounded-full border border-red-500/20">{r.type}</span>
                    {r.isUser && <span className="text-xs px-1.5 py-0.5 bg-cyan-500/10 text-cyan-400 rounded-full border border-cyan-500/20">You</span>}
                  </div>
                  <span className="text-xs text-slate-600">{r.time}</span>
                </div>
                <p className="text-sm text-slate-300 mb-1">{r.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 flex items-center gap-1"><MapPin className="w-3 h-3" />{r.location}</span>
                  <button onClick={() => r.isUser && handleUpvote(r.id)}
                    className="flex items-center gap-1 text-xs text-slate-500 hover:text-cyan-400 transition-colors">
                    <ThumbsUp className="w-3 h-3" /> {r.votes} confirmed
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
