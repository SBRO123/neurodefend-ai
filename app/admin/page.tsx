'use client'
import { useState } from 'react'
import { Users, AlertTriangle, BarChart3, Shield, Search, Download, Eye, Ban, CheckCircle, Settings } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const MOCK_USERS = [
  { id: '1', name: 'Thabo M.', email: 't***@gmail.com', role: 'student', scans: 12, riskScore: 45, status: 'active', lastSeen: '2 min ago' },
  { id: '2', name: 'Nomsa K.', email: 'n***@tut.ac.za', role: 'student', scans: 8, riskScore: 22, status: 'active', lastSeen: '1 hr ago' },
  { id: '3', name: 'Sipho D.', email: 's***@gmail.com', role: 'business', scans: 34, riskScore: 67, status: 'flagged', lastSeen: '3 hr ago' },
  { id: '4', name: 'Lerato B.', email: 'l***@wits.ac.za', role: 'student', scans: 5, riskScore: 15, status: 'active', lastSeen: '1 day ago' },
  { id: '5', name: 'Admin User', email: 'a***@guardianai.co.za', role: 'admin', scans: 89, riskScore: 8, status: 'active', lastSeen: 'now' },
]

const SYSTEM_STATS = [
  { day: 'Mon', scans: 142, threats: 38 },
  { day: 'Tue', scans: 198, threats: 52 },
  { day: 'Wed', scans: 167, threats: 44 },
  { day: 'Thu', scans: 234, threats: 71 },
  { day: 'Fri', scans: 289, threats: 89 },
  { day: 'Sat', scans: 156, threats: 41 },
  { day: 'Sun', scans: 112, threats: 28 },
]

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'threats' | 'settings'>('overview')
  const [search, setSearch] = useState('')

  const filtered = MOCK_USERS.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white mb-1">Admin Panel</h1>
          <p className="text-slate-500 text-sm">System management and threat oversight</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 glass rounded-lg border border-red-500/20 text-xs text-red-400">
          <Shield className="w-3 h-3" /> Admin Access
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-white/5 pb-4">
        {([['overview', BarChart3, 'Overview'], ['users', Users, 'Users'], ['threats', AlertTriangle, 'Threats'], ['settings', Settings, 'Settings']] as const).map(([tab, Icon, label]) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-white glass border border-white/5'
            }`}>
            <Icon className="w-4 h-4" />{label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Users', value: '1,284', icon: Users, color: 'text-cyan-400' },
              { label: 'Scans Today', value: '289', icon: Search, color: 'text-blue-400' },
              { label: 'Threats Blocked', value: '89', icon: AlertTriangle, color: 'text-red-400' },
              { label: 'System Health', value: '99.8%', icon: CheckCircle, color: 'text-green-400' },
            ].map(({ label, value, icon: Icon, color }, i) => (
              <div key={i} className="glass rounded-xl p-4 border border-white/5">
                <Icon className={`w-5 h-5 ${color} mb-2`} />
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          <div className="glass rounded-xl border border-white/5 p-5">
            <h2 className="font-semibold text-white mb-4">Weekly Scan Activity</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={SYSTEM_STATS}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#0d1224', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '11px' }} />
                <Bar dataKey="scans" name="Total Scans" fill="#22d3ee" radius={[4, 4, 0, 0]} opacity={0.7} />
                <Bar dataKey="threats" name="Threats Found" fill="#ef4444" radius={[4, 4, 0, 0]} opacity={0.7} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search users..."
                className="w-full pl-9 pr-4 py-2.5 glass border border-white/10 rounded-lg text-sm text-white placeholder-slate-600 outline-none focus:border-cyan-500/30" />
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 glass border border-white/10 text-sm text-slate-400 hover:text-white rounded-lg transition-all">
              <Download className="w-4 h-4" /> Export
            </button>
          </div>

          <div className="glass rounded-xl border border-white/5 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {['User', 'Role', 'Scans', 'Risk Score', 'Status', 'Last Seen', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs text-slate-500 uppercase tracking-wider font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/3">
                {filtered.map(u => (
                  <tr key={u.id} className="hover:bg-white/2 transition-all">
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-white font-medium">{u.name}</p>
                        <p className="text-xs text-slate-500">{u.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${
                        u.role === 'admin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                        u.role === 'business' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        'bg-slate-500/10 text-slate-400 border-slate-500/20'
                      }`}>{u.role}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{u.scans}</td>
                    <td className="px-4 py-3">
                      <span className={`font-mono text-sm ${u.riskScore >= 60 ? 'text-red-400' : u.riskScore >= 30 ? 'text-yellow-400' : 'text-green-400'}`}>{u.riskScore}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${u.status === 'flagged' ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>{u.status}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{u.lastSeen}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 hover:bg-white/5 rounded text-slate-500 hover:text-cyan-400 transition-all"><Eye className="w-3.5 h-3.5" /></button>
                        <button className="p-1.5 hover:bg-white/5 rounded text-slate-500 hover:text-red-400 transition-all"><Ban className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'threats' && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 mb-4">
            {[
              { label: 'Critical Threats', value: '3', color: 'red' },
              { label: 'High Severity', value: '12', color: 'orange' },
              { label: 'Pending Review', value: '7', color: 'yellow' },
            ].map(({ label, value, color }, i) => (
              <div key={i} className={`glass rounded-xl p-4 border border-${color}-500/20 bg-${color}-500/5`}>
                <p className={`text-2xl font-bold text-${color}-400`}>{value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
          <div className="glass rounded-xl border border-white/5 p-5">
            <h2 className="font-semibold text-white mb-4">Active Threat Database</h2>
            <div className="space-y-2">
              {[
                { pattern: 'bit.ly/nsfas-*', type: 'Phishing URL', severity: 'critical', hits: 234 },
                { pattern: 'ABSA account suspended', type: 'SMS Phishing', severity: 'high', hits: 189 },
                { pattern: 'Amazon SA hiring WhatsApp', type: 'Fake Job', severity: 'high', hits: 156 },
                { pattern: 'SARS tax refund', type: 'Tax Scam', severity: 'medium', hits: 98 },
                { pattern: 'SIM swap request', type: 'SIM Fraud', severity: 'critical', hits: 67 },
              ].map((t, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-white/2 border border-white/5 text-sm">
                  <code className="text-cyan-400 font-mono text-xs flex-1">{t.pattern}</code>
                  <span className="text-slate-400 text-xs">{t.type}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    t.severity === 'critical' ? 'bg-red-500/10 text-red-400' :
                    t.severity === 'high' ? 'bg-orange-500/10 text-orange-400' : 'bg-yellow-500/10 text-yellow-400'
                  }`}>{t.severity}</span>
                  <span className="text-slate-500 text-xs">{t.hits} hits</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="max-w-2xl space-y-4">
          {[
            { label: 'AI Sensitivity', desc: 'Adjust the AI detection threshold', value: 'Medium (Score ≥ 25)' },
            { label: 'Auto-block Threshold', desc: 'Automatically flag users above this risk score', value: '75' },
            { label: 'Alert Notifications', desc: 'Send email alerts for critical threats', value: 'Enabled' },
            { label: 'Demo Mode', desc: 'Show simulated data for demonstration', value: 'Active' },
          ].map(({ label, desc, value }, i) => (
            <div key={i} className="glass rounded-xl p-4 border border-white/5 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">{label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
              </div>
              <span className="text-sm text-cyan-400 font-mono">{value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
