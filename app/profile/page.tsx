'use client'
import { useState } from 'react'
import { Shield, TrendingUp, BookOpen, Award, CheckCircle, XCircle, Lock, Smartphone, Eye, Zap, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

const AWARENESS_LEVELS = [
  { level: 'Beginner', min: 0, max: 24, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', desc: 'You are just starting your cybersecurity journey. Complete the learning modules to improve.' },
  { level: 'Aware', min: 25, max: 49, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', desc: 'You have basic awareness of cyber threats. Keep learning to strengthen your defenses.' },
  { level: 'Secure', min: 50, max: 74, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', desc: 'You have solid cybersecurity habits. A few more steps will make you a Guardian.' },
  { level: 'Guardian', min: 75, max: 100, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20', desc: 'Excellent! You are a cybersecurity Guardian. Help others stay safe too.' },
]

const SCORE_HISTORY = [
  { week: 'Wk 1', score: 28 },
  { week: 'Wk 2', score: 35 },
  { week: 'Wk 3', score: 41 },
  { week: 'Wk 4', score: 52 },
  { week: 'Wk 5', score: 58 },
  { week: 'Wk 6', score: 68 },
]

const RADAR_DATA = [
  { subject: 'Phishing', score: 80 },
  { subject: 'Passwords', score: 55 },
  { subject: 'Links', score: 70 },
  { subject: 'Banking', score: 65 },
  { subject: 'Social Eng.', score: 45 },
  { subject: 'Devices', score: 60 },
]

const SECURITY_CHECKLIST = [
  { label: 'Completed first scan', done: true, points: 10 },
  { label: 'Enabled 2FA on email', done: true, points: 15 },
  { label: 'Completed phishing module', done: true, points: 20 },
  { label: 'Reported a scam', done: false, points: 15 },
  { label: 'Completed banking fraud module', done: false, points: 20 },
  { label: 'Set up SIM swap protection', done: false, points: 15 },
  { label: 'Completed all learning modules', done: false, points: 25 },
  { label: 'Achieved Guardian level', done: false, points: 30 },
]

const BADGES = [
  { name: 'First Scan', icon: '🔍', earned: true, desc: 'Ran your first threat scan' },
  { name: 'Phishing Expert', icon: '🎣', earned: true, desc: 'Identified 5 phishing attempts' },
  { name: 'Quick Learner', icon: '📖', earned: true, desc: 'Completed a learning module' },
  { name: 'Guardian', icon: '🛡️', earned: false, desc: 'Reported a scam to the community' },
  { name: 'Cyber Warrior', icon: '⚔️', earned: false, desc: 'Achieved 90%+ security score' },
  { name: 'Educator', icon: '🎓', earned: false, desc: 'Completed all security lessons' },
]

export default function ProfilePage() {
  const [securityScore] = useState(68)

  const currentLevel = AWARENESS_LEVELS.find(l => securityScore >= l.min && securityScore <= l.max) || AWARENESS_LEVELS[0]
  const nextLevel = AWARENESS_LEVELS[AWARENESS_LEVELS.indexOf(currentLevel) + 1]
  const progressToNext = nextLevel
    ? ((securityScore - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100
    : 100
  const earnedPoints = SECURITY_CHECKLIST.filter(i => i.done).reduce((s, i) => s + i.points, 0)
  const totalPoints = SECURITY_CHECKLIST.reduce((s, i) => s + i.points, 0)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white mb-2">Personal Security Score</h1>
        <p className="text-slate-500 text-sm">Track your cybersecurity awareness and improve your defenses over time.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left — main score */}
        <div className="space-y-6">
          {/* Score card */}
          <div className={`glass rounded-xl p-6 border ${currentLevel.bg} text-center`}>
            <div className="relative w-36 h-36 mx-auto mb-4">
              <svg className="w-36 h-36 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                <circle cx="50" cy="50" r="42" fill="none"
                  stroke={securityScore >= 75 ? '#22d3ee' : securityScore >= 50 ? '#3b82f6' : securityScore >= 25 ? '#f59e0b' : '#ef4444'}
                  strokeWidth="8" strokeDasharray={`${2 * Math.PI * 42}`}
                  strokeDashoffset={`${2 * Math.PI * 42 * (1 - securityScore / 100)}`}
                  strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1.5s ease' }} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-4xl font-black ${currentLevel.color}`}>{securityScore}</span>
                <span className="text-xs text-slate-500">/ 100</span>
              </div>
            </div>
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-bold mb-3 ${currentLevel.bg} ${currentLevel.color}`}>
              <Shield className="w-4 h-4" /> {currentLevel.level}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{currentLevel.desc}</p>

            {nextLevel && (
              <div className="mt-4">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>{currentLevel.level}</span>
                  <span>{nextLevel.level}</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-1000 ${
                    securityScore >= 50 ? 'bg-blue-500' : 'bg-yellow-500'
                  }`} style={{ width: `${progressToNext}%` }} />
                </div>
                <p className="text-xs text-slate-600 mt-1">{Math.round(progressToNext)}% to {nextLevel.level}</p>
              </div>
            )}
          </div>

          {/* Awareness levels */}
          <div className="glass rounded-xl border border-white/5 p-4">
            <h2 className="font-semibold text-white mb-3 text-sm">Awareness Levels</h2>
            <div className="space-y-2">
              {AWARENESS_LEVELS.map((l, i) => (
                <div key={i} className={`flex items-center gap-3 p-2.5 rounded-lg border ${
                  currentLevel.level === l.level ? l.bg : 'bg-white/2 border-white/5 opacity-50'
                }`}>
                  <Shield className={`w-4 h-4 flex-shrink-0 ${l.color}`} />
                  <div className="flex-1">
                    <p className={`text-xs font-bold ${l.color}`}>{l.level}</p>
                    <p className="text-xs text-slate-600">{l.min}–{l.max} points</p>
                  </div>
                  {currentLevel.level === l.level && <span className="text-xs text-white bg-white/10 px-2 py-0.5 rounded-full">Current</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Middle — charts & checklist */}
        <div className="space-y-6">
          {/* Score history */}
          <div className="glass rounded-xl border border-white/5 p-5">
            <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" /> Score History
            </h2>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={SCORE_HISTORY}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="week" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#0d1224', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '11px' }} />
                <Area type="monotone" dataKey="score" stroke="#22d3ee" fill="url(#scoreGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Skill radar */}
          <div className="glass rounded-xl border border-white/5 p-5">
            <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Eye className="w-4 h-4 text-cyan-400" /> Skill Breakdown
            </h2>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={RADAR_DATA}>
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Radar name="Score" dataKey="score" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.15} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Points summary */}
          <div className="glass rounded-xl border border-white/5 p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-white text-sm flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" /> Points Earned
              </h2>
              <span className="text-yellow-400 font-bold">{earnedPoints} / {totalPoints}</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
                style={{ width: `${(earnedPoints / totalPoints) * 100}%` }} />
            </div>
          </div>
        </div>

        {/* Right — checklist & badges */}
        <div className="space-y-6">
          {/* Security checklist */}
          <div className="glass rounded-xl border border-white/5 overflow-hidden">
            <div className="p-4 border-b border-white/5">
              <h2 className="font-semibold text-white flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" /> Security Checklist
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Complete tasks to boost your score</p>
            </div>
            <div className="divide-y divide-white/3">
              {SECURITY_CHECKLIST.map((item, i) => (
                <div key={i} className={`flex items-center gap-3 p-3 ${item.done ? 'opacity-100' : 'opacity-60'}`}>
                  {item.done
                    ? <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    : <XCircle className="w-4 h-4 text-slate-600 flex-shrink-0" />}
                  <span className={`text-sm flex-1 ${item.done ? 'text-slate-300 line-through decoration-slate-600' : 'text-slate-300'}`}>
                    {item.label}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${item.done ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-slate-500'}`}>
                    +{item.points}pts
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Badges */}
          <div className="glass rounded-xl border border-white/5 p-4">
            <h2 className="font-semibold text-white flex items-center gap-2 mb-4">
              <Award className="w-4 h-4 text-yellow-400" /> Badges
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {BADGES.map((b, i) => (
                <div key={i} className={`flex flex-col items-center p-3 rounded-xl border text-center transition-all ${
                  b.earned ? 'bg-yellow-500/5 border-yellow-500/20' : 'bg-white/2 border-white/5 opacity-40 grayscale'
                }`}>
                  <span className="text-2xl mb-1">{b.icon}</span>
                  <p className="text-xs font-semibold text-white leading-tight">{b.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick links to improve score */}
          <div className="glass rounded-xl border border-cyan-500/10 p-4">
            <h2 className="font-semibold text-white text-sm mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" /> Improve Your Score
            </h2>
            <div className="space-y-2">
              {[
                { label: 'Run a threat scan', href: '/scan', icon: Shield },
                { label: 'Complete learning modules', href: '/learn', icon: BookOpen },
                { label: 'Report a scam', href: '/learn#report', icon: Lock },
                { label: 'Enable 2FA on your accounts', href: '/learn', icon: Smartphone },
              ].map(({ label, href, icon: Icon }, i) => (
                <Link key={i} href={href}
                  className="flex items-center justify-between p-2.5 rounded-lg glass-hover border border-white/5 text-sm text-slate-300 hover:text-white transition-all">
                  <div className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5 text-cyan-400" />{label}
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
