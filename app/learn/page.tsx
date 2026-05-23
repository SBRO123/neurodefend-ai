'use client'
import { useState, useEffect, useRef } from 'react'
import { BookOpen, MessageCircle, Award, Send, ChevronDown, ChevronUp, Shield, AlertTriangle, Smartphone, CreditCard, GraduationCap, Briefcase, CheckCircle } from 'lucide-react'
import { SECURITY_TIPS } from '@/lib/demoData'
import { getStats, completeModule, getAwarenessLevel } from '@/lib/store'

const SCAM_TYPES = [
  {
    icon: GraduationCap, title: 'NSFAS & Bursary Scams', color: 'yellow',
    signs: ['Asks for banking details via WhatsApp', 'Promises instant bursary approval', 'Requests upfront "processing fee"', 'Uses unofficial contact numbers'],
    howToAvoid: 'Only check your NSFAS status on myNSFAS.org.za. NSFAS never contacts students via WhatsApp to request banking details.',
  },
  {
    icon: CreditCard, title: 'Banking & OTP Fraud', color: 'red',
    signs: ['Claims your account will be suspended', 'Asks for OTP or PIN', 'Sends suspicious links to "verify"', 'Impersonates ABSA, FNB, Capitec, Nedbank'],
    howToAvoid: 'Your bank will NEVER ask for your OTP, PIN, or full card number via SMS or WhatsApp. Call the number on the back of your card.',
  },
  {
    icon: Briefcase, title: 'Fake Job Offers', color: 'blue',
    signs: ['Offers unusually high salaries', 'Requires WhatsApp communication only', 'Asks for upfront payment or ID copy', 'No formal interview process'],
    howToAvoid: 'Verify job offers on official company websites. Legitimate employers never ask for money upfront.',
  },
  {
    icon: Smartphone, title: 'SIM Swap Fraud', color: 'purple',
    signs: ['Sudden loss of mobile signal', 'Unable to make calls or use data', 'Unexpected OTPs received', 'Someone asks about your network provider'],
    howToAvoid: 'Contact your network provider immediately if you lose signal unexpectedly. Add a SIM swap block to your account.',
  },
  {
    icon: AlertTriangle, title: 'WhatsApp Scams', color: 'green',
    signs: ['Unknown numbers claiming to be officials', 'Requests to forward messages', 'Fake prize or lottery notifications', 'Impersonates family members in distress'],
    howToAvoid: 'Never send money to unknown contacts. Verify identity through a phone call before acting on any WhatsApp request.',
  },
]

const CHATBOT_QA: Record<string, string> = {
  'is this message safe': 'To check if a message is safe, go to the Scan page and paste the message. Our AI will analyze it for phishing patterns, suspicious links, and social engineering tactics instantly.',
  'what is phishing': 'Phishing is when scammers pretend to be legitimate organizations (like your bank or NSFAS) to trick you into sharing personal information like passwords, OTPs, or banking details.',
  'clicked a suspicious link': 'Act immediately: 1) Do NOT enter any information on the page. 2) Close the browser tab. 3) Change passwords for important accounts. 4) Contact your bank if banking details were involved. 5) Run a virus scan.',
  'what is nsfas scam': 'NSFAS scams involve fraudsters pretending to be NSFAS officials via WhatsApp or SMS, asking for banking details to "process" your bursary. NSFAS only communicates through myNSFAS.org.za — never WhatsApp.',
  'how do i report': 'Report scams to: SABRIC (011 847 3000), SA Fraud Hotline (0800 00 2870), SAPS Cybercrime (10111), or forward SMS scams to 7726. You can also report on our community page.',
  'what is sim swap': 'SIM swap fraud is when criminals convince your network provider to transfer your number to a SIM they control, letting them intercept your OTPs and access your bank accounts.',
  'how to stay safe': 'Key rules: 1) Never share OTPs. 2) Verify senders independently. 3) Enable 2FA on all accounts. 4) Check URLs before clicking. 5) Use NeuroDefend AI to scan suspicious messages.',
  'what is otp': 'An OTP (One-Time PIN) is a temporary code sent to your phone to verify your identity. NEVER share it with anyone — not even someone claiming to be from your bank or NSFAS.',
  'absa': 'ABSA will never ask for your OTP, PIN, or full card number via SMS or WhatsApp. If you receive such a message, it is a scam. Call ABSA directly on 0860 008 600.',
  'fnb': 'FNB will never request your password or OTP via message. Contact FNB directly on 087 575 9404 if you receive suspicious messages claiming to be from them.',
  'capitec': 'Capitec will never ask for your Remote PIN or OTP via SMS or WhatsApp. Call Capitec on 0860 10 20 43 to report suspicious activity.',
}

const BADGES = [
  { name: 'First Scan', desc: 'Completed your first threat scan', earned: true, icon: '🔍' },
  { name: 'Phishing Expert', desc: 'Identified 5 phishing attempts', earned: true, icon: '🎣' },
  { name: 'Guardian', desc: 'Reported a scam to the community', earned: false, icon: '🛡️' },
  { name: 'Educator', desc: 'Completed all security lessons', earned: false, icon: '📚' },
  { name: 'Cyber Warrior', desc: 'Achieved 90%+ security score', earned: false, icon: '⚔️' },
]

export default function LearnPage() {
  const [openScam, setOpenScam] = useState<number | null>(0)
  const [chatInput, setChatInput] = useState('')
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai'; msg: string }[]>([
    { role: 'ai', msg: 'Hi! I\'m NeuroDefend AI Assistant. Ask me anything: "What is phishing?", "What is a SIM swap?", "How do I stay safe?"' }
  ])
  const chatEndRef = useRef<HTMLDivElement>(null)
  const [stats, setStats] = useState(getStats())
  const awareness = getAwarenessLevel(stats.securityScore)

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [chatHistory])

  const handleChat = () => {
    if (!chatInput.trim()) return
    const userMsg = chatInput.trim()
    setChatHistory(h => [...h, { role: 'user', msg: userMsg }])
    setChatInput('')
    const key = Object.keys(CHATBOT_QA).find(k => userMsg.toLowerCase().includes(k))
    const response = key
      ? CHATBOT_QA[key]
      : `Good question. For specific threat analysis, use the Scan page. General tip: never share OTPs, always verify senders, and report suspicious messages to SABRIC (011 847 3000). You can also ask me: "What is phishing?", "What is a SIM swap?", or "How do I stay safe?"`
    setTimeout(() => setChatHistory(h => [...h, { role: 'ai', msg: response }]), 500)
  }

  const handleModuleComplete = (moduleId: string) => {
    completeModule(moduleId)
    setStats(getStats())
  }

  const colorMap: Record<string, string> = {
    yellow: 'border-yellow-500/20 bg-yellow-500/5 text-yellow-400',
    red: 'border-red-500/20 bg-red-500/5 text-red-400',
    blue: 'border-blue-500/20 bg-blue-500/5 text-blue-400',
    purple: 'border-purple-500/20 bg-purple-500/5 text-purple-400',
    green: 'border-green-500/20 bg-green-500/5 text-green-400',
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white mb-2">Cybersecurity Learning Center</h1>
        <p className="text-slate-500 text-sm">Learn to identify and avoid South African scams and cyber threats.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Security tips */}
          <div className="glass rounded-xl border border-white/5 p-5">
            <h2 className="font-semibold text-white flex items-center gap-2 mb-4">
              <Shield className="w-4 h-4 text-cyan-400" /> Essential Security Tips
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {SECURITY_TIPS.map((tip, i) => (
                <div key={i} className="p-3 rounded-lg bg-white/2 border border-white/5 hover:border-cyan-500/20 transition-all">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{tip.icon}</span>
                    <span className="text-sm font-semibold text-white">{tip.title}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{tip.tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Scam types accordion */}
          <div className="glass rounded-xl border border-white/5 overflow-hidden">
            <div className="p-4 border-b border-white/5">
              <h2 className="font-semibold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" /> Common Scam Types in South Africa
              </h2>
            </div>
            <div className="divide-y divide-white/3">
              {SCAM_TYPES.map(({ icon: Icon, title, color, signs, howToAvoid }, i) => (
                <div key={i}>
                  <button onClick={() => setOpenScam(openScam === i ? null : i)}
                    className="w-full flex items-center justify-between p-4 hover:bg-white/2 transition-all text-left">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${colorMap[color]}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-white text-sm">{title}</span>
                    </div>
                    {openScam === i ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                  </button>
                  {openScam === i && (
                    <div className="px-4 pb-4 space-y-3">
                      <div>
                        <p className="text-xs font-semibold text-red-400 mb-2 uppercase tracking-wider">Warning Signs</p>
                        <ul className="space-y-1">
                          {signs.map((s, j) => (
                            <li key={j} className="flex items-start gap-2 text-sm text-slate-400">
                              <span className="text-red-400 mt-0.5">•</span>{s}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className={`p-3 rounded-lg border ${colorMap[color]}`}>
                        <p className="text-xs font-semibold mb-1">How to Avoid</p>
                        <p className="text-xs leading-relaxed opacity-80">{howToAvoid}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Official reporting contacts only */}
          <div id="report" className="glass rounded-xl border border-red-500/20 bg-red-500/3 p-5">
            <h2 className="font-semibold text-white flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-red-400" /> Official Reporting Channels
            </h2>
            <p className="text-sm text-slate-400 mb-4">To report a scam to the community, go to the <a href="/analytics" className="text-cyan-400 hover:underline">Analytics page</a>. For official reporting:</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { org: 'SABRIC', contact: '011 847 3000' },
                { org: 'Fraud Hotline', contact: '0800 00 2870' },
                { org: 'SAPS', contact: '10111' },
                { org: 'SMS Spam', contact: 'Fwd to 7726' },
              ].map(({ org, contact }, i) => (
                <div key={i} className="p-2 rounded-lg bg-white/2 border border-white/5">
                  <p className="text-xs font-semibold text-white">{org}</p>
                  <p className="text-xs text-cyan-400 font-mono">{contact}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* AI Chatbot */}
          <div className="glass rounded-xl border border-white/5 overflow-hidden flex flex-col" style={{ height: '420px' }}>
            <div className="p-4 border-b border-white/5 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">AI Security Assistant</p>
                <p className="text-xs text-green-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-400" /> Online</p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {chatHistory.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                    m.role === 'user' ? 'bg-cyan-500/20 text-cyan-100 border border-cyan-500/20' : 'bg-white/5 text-slate-300 border border-white/5'
                  }`}>{m.msg}</div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <div className="p-3 border-t border-white/5 flex gap-2">
              <input value={chatInput} onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleChat()}
                placeholder="Ask: What is phishing? How do I stay safe?"
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 outline-none focus:border-cyan-500/30" />
              <button onClick={handleChat} className="p-2 bg-cyan-500 hover:bg-cyan-400 rounded-lg transition-all">
                <Send className="w-3.5 h-3.5 text-black" />
              </button>
            </div>
          </div>

          {/* Live badges from store */}
          <div className="glass rounded-xl border border-white/5 p-4">
            <h2 className="font-semibold text-white flex items-center gap-2 mb-3">
              <Award className="w-4 h-4 text-yellow-400" /> Your Progress
            </h2>
            <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/10">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                <span className="text-lg font-black text-cyan-400">{stats.securityScore}</span>
              </div>
              <div>
                <p className={`font-bold ${awareness.color}`}>{awareness.level}</p>
                <p className="text-xs text-slate-500">{stats.totalScans} scans · {stats.reportedScams} reports</p>
              </div>
            </div>
            <div className="space-y-2">
              {[
                { id: 'phishing', label: 'Phishing Module', icon: '🎣', done: stats.completedModules.includes('phishing') },
                { id: 'banking', label: 'Banking Safety', icon: '🏦', done: stats.completedModules.includes('banking') },
                { id: 'jobs', label: 'Fake Job Awareness', icon: '💼', done: stats.completedModules.includes('jobs') },
                { id: 'simswap', label: 'SIM Swap Protection', icon: '📱', done: stats.completedModules.includes('simswap') },
              ].map(({ id, label, icon, done }) => (
                <button key={id} onClick={() => !done && handleModuleComplete(id)}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-lg border text-left transition-all ${
                    done ? 'bg-green-500/5 border-green-500/20 cursor-default' : 'bg-white/2 border-white/5 hover:border-cyan-500/20'
                  }`}>
                  <span className="text-lg">{icon}</span>
                  <span className="text-sm text-white flex-1">{label}</span>
                  {done
                    ? <CheckCircle className="w-4 h-4 text-green-400" />
                    : <span className="text-xs text-cyan-400">+8pts</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
