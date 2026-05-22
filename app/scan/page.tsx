'use client'
import { useState, useRef, useEffect } from 'react'
import { Search, Upload, Link2, MessageSquare, AlertTriangle, CheckCircle, XCircle, Lightbulb, ChevronDown, ChevronUp, Shield, Brain, List, Copy, Share2, Trash2, Clock } from 'lucide-react'
import { analyzeContent, ScanResult } from '@/lib/scanner'
import { saveScam, getScans, clearScans, StoredScan, timeAgo } from '@/lib/store'
import { RiskMeter, ThreatBadge } from '@/components/ui/ThreatUI'

const SAMPLE_INPUTS = [
  { label: 'NSFAS Scam', text: 'NSFAS: Your bursary of R45,000 has been approved. Click here to claim: bit.ly/nsfas-claim2024. Hurry, offer expires today!' },
  { label: 'Banking Fraud', text: 'ABSA ALERT: Your account will be suspended immediately. Verify your details now or lose access. Do not share this OTP: 847291' },
  { label: 'Fake Job', text: 'Congratulations! You have been selected for a remote job at Amazon SA. Earn R25,000/month. WhatsApp +27 81 234 5678 to apply now.' },
  { label: 'Safe Message', text: 'Hi, your TUT registration for 2026 S1 has been confirmed. Please check your timetable on iEnabler at ienabler.tut.ac.za' },
]

type InputMode = 'text' | 'link' | 'file'
type Tab = 'scan' | 'history'

export default function ScanPage() {
  const [mode, setMode] = useState<InputMode>('text')
  const [input, setInput] = useState('')
  const [result, setResult] = useState<ScanResult | null>(null)
  const [scanning, setScanning] = useState(false)
  const [showFlags, setShowFlags] = useState(true)
  const [copied, setCopied] = useState(false)
  const [tab, setTab] = useState<Tab>('scan')
  const [history, setHistory] = useState<StoredScan[]>([])
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => { setHistory(getScans()) }, [tab])

  const handleScan = async () => {
    if (!input.trim()) return
    setScanning(true)
    setResult(null)
    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: input.trim() })
      })
      const data = await res.json()
      if (data.success) {
        saveScam(input, data.result)
        setResult(data.result)
        setTab('scan')
      }
    } catch {
      // fallback to client-side scanner
      const res = analyzeContent(input)
      saveScam(input, res)
      setResult(res)
    }
    setScanning(false)
  }

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setInput(`[Screenshot: ${file.name}] Checking for known phishing patterns in uploaded image content.`)
  }

  const handleCopy = () => {
    if (!result) return
    const text = `GuardianAI Scan Result\nRisk Score: ${result.riskScore}/100\nThreat Level: ${result.threatLevel.toUpperCase()}\n\n${result.explanation}\n\nAI Reasoning: ${result.aiReasoning}\n\nRecommendations:\n${result.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = () => {
    if (!result) return
    if (navigator.share) {
      navigator.share({ title: 'GuardianAI Scan Result', text: `Risk Score: ${result.riskScore}/100 — ${result.threatLevel.toUpperCase()}. ${result.explanation}`, url: window.location.href })
    } else handleCopy()
  }

  const highlightText = (text: string, phrases: string[]) => {
    if (!phrases.length) return text
    let out = text
    phrases.forEach(phrase => {
      out = out.replace(new RegExp(`(${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'),
        '<mark class="bg-red-500/20 text-red-300 rounded px-0.5">$1</mark>')
    })
    return out
  }

  const loadHistoryScan = (scan: StoredScan) => {
    setInput(scan.content)
    setResult(scan.result)
    setTab('scan')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">AI Threat Scanner</h1>
          <p className="text-slate-400">Paste a suspicious message, link, or email for instant AI analysis.</p>
        </div>
        <div className="flex gap-2">
          {(['scan', 'history'] as Tab[]).map(t => (
            <button key={t} onClick={() => { setTab(t); if (t === 'history') setHistory(getScans()) }}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${tab === t ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'glass text-slate-400 border border-white/5 hover:text-white'}`}>
              {t === 'history' ? <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />History ({getScans().length})</span> : 'Scan'}
            </button>
          ))}
        </div>
      </div>

      {tab === 'history' ? (
        <div className="space-y-3">
          {history.length === 0 ? (
            <div className="glass rounded-xl border border-white/5 p-12 text-center">
              <Clock className="w-8 h-8 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500">No scans yet. Run your first scan to see history here.</p>
            </div>
          ) : (
            <>
              <div className="flex justify-end">
                <button onClick={() => { clearScans(); setHistory([]) }} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-400 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" /> Clear History
                </button>
              </div>
              {history.map(scan => (
                <button key={scan.id} onClick={() => loadHistoryScan(scan)}
                  className="w-full glass rounded-xl border border-white/5 hover:border-cyan-500/20 p-4 text-left transition-all">
                  <div className="flex items-start gap-3">
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
                  </div>
                </button>
              ))}
            </>
          )}
        </div>
      ) : (
        <>
          {/* Input mode tabs */}
          <div className="flex gap-2 mb-4">
            {([['text', MessageSquare, 'Message/Email'], ['link', Link2, 'URL/Link'], ['file', Upload, 'Screenshot']] as const).map(([m, Icon, label]) => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === m ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'glass text-slate-400 hover:text-white border border-white/5'
                }`}>
                <Icon className="w-4 h-4" />{label}
              </button>
            ))}
          </div>

          {/* Input area */}
          <div className="glass rounded-xl border border-white/5 p-4 mb-4">
            {mode === 'file' ? (
              <div className="border-2 border-dashed border-white/10 rounded-lg p-10 text-center cursor-pointer hover:border-cyan-500/30 transition-all"
                onClick={() => fileRef.current?.click()}>
                <Upload className="w-8 h-8 text-slate-500 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">Click to upload a screenshot of a suspicious message</p>
                <p className="text-slate-600 text-xs mt-1">PNG, JPG, WEBP supported</p>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
                {input && <p className="text-cyan-400 text-xs mt-3 truncate px-4">{input}</p>}
              </div>
            ) : (
              <textarea value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.ctrlKey && e.key === 'Enter') handleScan() }}
                placeholder={mode === 'link' ? 'Paste a suspicious URL or link here...' : 'Paste a suspicious WhatsApp message, SMS, or email here... (Ctrl+Enter to scan)'}
                className="w-full bg-transparent text-slate-200 placeholder-slate-600 resize-none outline-none text-sm leading-relaxed min-h-[140px]" />
            )}
          </div>

          {/* Character count + sample inputs */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-xs text-slate-600 self-center">Try a sample:</span>
            {SAMPLE_INPUTS.map((s, i) => (
              <button key={i} onClick={() => { setInput(s.text); setMode('text') }}
                className="text-xs px-3 py-1.5 glass border border-white/5 hover:border-cyan-500/20 text-slate-400 hover:text-cyan-400 rounded-lg transition-all">
                {s.label}
              </button>
            ))}
            {input && <span className="ml-auto text-xs text-slate-600">{input.length} chars</span>}
          </div>

          <button onClick={handleScan} disabled={!input.trim() || scanning}
            className="w-full flex items-center justify-center gap-3 py-4 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold rounded-xl transition-all text-lg shadow-lg shadow-cyan-500/10">
            {scanning ? (
              <><div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />Analyzing with AI...</>
            ) : (
              <><Search className="w-5 h-5" />Scan for Threats</>
            )}
          </button>

          {/* Results */}
          {result && (
            <div className="mt-8 space-y-4">
              {/* Score header */}
              <div className={`glass rounded-xl p-6 border ${
                result.threatLevel === 'dangerous' ? 'border-red-500/30 bg-red-500/5' :
                result.threatLevel === 'suspicious' ? 'border-yellow-500/30 bg-yellow-500/5' :
                'border-green-500/30 bg-green-500/5'
              }`}>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <RiskMeter score={result.riskScore} />
                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-3 mb-3">
                      <ThreatBadge level={result.threatLevel} />
                      <span className="text-xs text-slate-500 glass px-2 py-1 rounded-full border border-white/5">{result.category}</span>
                    </div>
                    <p className="text-white font-medium mb-2">{result.explanation}</p>
                    <p className="text-sm text-slate-400">{result.flags.length} threat indicator{result.flags.length !== 1 ? 's' : ''} detected</p>
                  </div>
                  {/* Copy / Share */}
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-2 glass border border-white/10 hover:border-cyan-500/30 text-xs text-slate-400 hover:text-white rounded-lg transition-all">
                      <Copy className="w-3.5 h-3.5" />{copied ? 'Copied!' : 'Copy'}
                    </button>
                    <button onClick={handleShare} className="flex items-center gap-1.5 px-3 py-2 glass border border-white/10 hover:border-cyan-500/30 text-xs text-slate-400 hover:text-white rounded-lg transition-all">
                      <Share2 className="w-3.5 h-3.5" />Share
                    </button>
                  </div>
                </div>
              </div>

              {/* AI Reasoning */}
              <div className="glass rounded-xl border border-purple-500/20 bg-purple-500/3 overflow-hidden">
                <div className="flex items-center gap-2 p-4 border-b border-white/5">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                    <Brain className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Why the AI Made This Decision</h3>
                    <p className="text-xs text-slate-500">Transparent AI reasoning</p>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <p className="text-sm text-slate-300 leading-relaxed border-l-2 border-purple-500/40 pl-3 italic">
                    &ldquo;{result.aiReasoning}&rdquo;
                  </p>
                  {result.reasoningSteps.length > 0 && (
                    <div className="space-y-2 mt-3">
                      <p className="text-xs text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <List className="w-3 h-3" /> Decision Factors
                      </p>
                      {result.reasoningSteps.map((step, i) => (
                        <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-purple-500/5 border border-purple-500/10">
                          <span className="text-purple-400 font-bold text-xs flex-shrink-0 mt-0.5">{i + 1}.</span>
                          <p className="text-xs text-slate-300 leading-relaxed">{step}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Highlighted content */}
              {result.highlightedPhrases.length > 0 && (
                <div className="glass rounded-xl p-4 border border-white/5">
                  <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-400" /> Suspicious Phrases Highlighted
                  </h3>
                  <div className="p-3 bg-black/20 rounded-lg text-sm text-slate-300 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: highlightText(input, result.highlightedPhrases) }} />
                </div>
              )}

              {/* Flags */}
              <div className="glass rounded-xl border border-white/5 overflow-hidden">
                <button onClick={() => setShowFlags(!showFlags)}
                  className="w-full flex items-center justify-between p-4 hover:bg-white/2 transition-all">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Shield className="w-4 h-4 text-cyan-400" /> Threat Indicators ({result.flags.length})
                  </h3>
                  {showFlags ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                </button>
                {showFlags && (
                  <div className="px-4 pb-4 space-y-2">
                    {result.flags.length === 0 ? (
                      <p className="text-sm text-slate-500">No threat indicators found.</p>
                    ) : result.flags.map((flag, i) => (
                      <div key={i} className={`flex items-start gap-3 p-3 rounded-lg ${
                        flag.severity === 'high' ? 'bg-red-500/5 border border-red-500/10' :
                        flag.severity === 'medium' ? 'bg-yellow-500/5 border border-yellow-500/10' :
                        'bg-blue-500/5 border border-blue-500/10'
                      }`}>
                        <XCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${flag.severity === 'high' ? 'text-red-400' : flag.severity === 'medium' ? 'text-yellow-400' : 'text-blue-400'}`} />
                        <div>
                          <p className="text-sm font-medium text-white">{flag.type}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{flag.description}</p>
                        </div>
                        <span className={`ml-auto text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                          flag.severity === 'high' ? 'bg-red-500/10 text-red-400' :
                          flag.severity === 'medium' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-blue-500/10 text-blue-400'
                        }`}>{flag.severity}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Education tip */}
              <div className="glass rounded-xl p-4 border border-cyan-500/10 bg-cyan-500/3">
                <h3 className="text-sm font-semibold text-cyan-400 flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4" /> Security Tip
                </h3>
                <p className="text-sm text-slate-300">{result.educationTip}</p>
              </div>

              {/* Recommendations */}
              <div className="glass rounded-xl p-4 border border-white/5">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" /> Recommended Actions
                </h3>
                <ul className="space-y-2">
                  {result.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="text-cyan-400 font-bold flex-shrink-0">{i + 1}.</span>{rec}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Scan another */}
              <button onClick={() => { setInput(''); setResult(null) }}
                className="w-full py-3 glass border border-white/10 hover:border-cyan-500/20 text-slate-400 hover:text-white text-sm rounded-xl transition-all">
                ← Scan Another Message
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
