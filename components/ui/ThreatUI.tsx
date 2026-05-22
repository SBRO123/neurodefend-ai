'use client'

export function ThreatBadge({ level }: { level: 'safe' | 'suspicious' | 'dangerous' }) {
  const config = {
    safe: { label: 'SAFE', className: 'bg-green-500/10 text-green-400 border-green-500/30' },
    suspicious: { label: 'SUSPICIOUS', className: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' },
    dangerous: { label: 'DANGEROUS', className: 'bg-red-500/10 text-red-400 border-red-500/30' },
  }
  const { label, className } = config[level]
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${level === 'safe' ? 'bg-green-400' : level === 'suspicious' ? 'bg-yellow-400' : 'bg-red-400'} animate-pulse`} />
      {label}
    </span>
  )
}

export function RiskMeter({ score }: { score: number }) {
  const color = score >= 60 ? '#ef4444' : score >= 25 ? '#f59e0b' : '#22c55e'
  const circumference = 2 * Math.PI * 45
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-28 h-28">
        <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
          <circle cx="50" cy="50" r="45" fill="none" stroke={color} strokeWidth="8"
            strokeDasharray={circumference} strokeDashoffset={offset}
            strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease' }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold" style={{ color }}>{score}</span>
          <span className="text-xs text-slate-500">/ 100</span>
        </div>
      </div>
      <span className="text-xs text-slate-400">Risk Score</span>
    </div>
  )
}

export function StatCard({ label, value, icon, color = 'cyan', sub }: {
  label: string; value: string | number; icon: React.ReactNode; color?: string; sub?: string
}) {
  const colors: Record<string, string> = {
    cyan: 'border-cyan-500/20 bg-cyan-500/5',
    red: 'border-red-500/20 bg-red-500/5',
    green: 'border-green-500/20 bg-green-500/5',
    yellow: 'border-yellow-500/20 bg-yellow-500/5',
  }
  return (
    <div className={`glass rounded-xl p-4 border ${colors[color] || colors.cyan}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
        </div>
        <div className={`p-2 rounded-lg ${colors[color]}`}>{icon}</div>
      </div>
    </div>
  )
}

export function AlertItem({ alert }: { alert: { type: string; severity: string; message: string; time: string; ip: string } }) {
  const severityColor: Record<string, string> = {
    critical: 'border-l-red-500 bg-red-500/5',
    high: 'border-l-orange-500 bg-orange-500/5',
    medium: 'border-l-yellow-500 bg-yellow-500/5',
    low: 'border-l-blue-500 bg-blue-500/5',
  }
  return (
    <div className={`glass rounded-lg p-3 border-l-2 ${severityColor[alert.severity] || severityColor.low}`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm text-white font-medium">{alert.message}</p>
          <p className="text-xs text-slate-500 mt-0.5">IP: {alert.ip} · {alert.time}</p>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
          alert.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
          alert.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
          alert.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'
        }`}>{alert.severity}</span>
      </div>
    </div>
  )
}
