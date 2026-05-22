export interface ScanResult {
  riskScore: number
  threatLevel: 'safe' | 'suspicious' | 'dangerous'
  flags: Flag[]
  explanation: string
  aiReasoning: string
  reasoningSteps: string[]
  highlightedPhrases: string[]
  recommendations: string[]
  category: string
  educationTip: string
}

export interface Flag {
  type: string
  severity: 'low' | 'medium' | 'high'
  description: string
}

const PHISHING_PATTERNS = [
  { pattern: /urgent|immediately|act now|expires? (today|soon|in \d+)/gi, type: 'Urgency Tactic', severity: 'high' as const, score: 20 },
  { pattern: /verify your (account|identity|details|banking|card)/gi, type: 'Account Verification Request', severity: 'high' as const, score: 25 },
  { pattern: /otp|one.?time.?pin|pin number|password|passcode/gi, type: 'OTP/Password Request', severity: 'high' as const, score: 30 },
  { pattern: /nsfas|bursary|scholarship|funding approved|student loan/gi, type: 'Bursary Scam Pattern', severity: 'medium' as const, score: 15 },
  { pattern: /you (have|'ve) (won|been selected|qualified)|congratulations|winner/gi, type: 'Prize/Winner Scam', severity: 'high' as const, score: 20 },
  { pattern: /click (here|this link|below)|tap here|follow this link/gi, type: 'Suspicious Link Prompt', severity: 'medium' as const, score: 10 },
  { pattern: /whatsapp|telegram|send (via|through) whatsapp/gi, type: 'WhatsApp Redirect', severity: 'low' as const, score: 5 },
  { pattern: /bank(ing)? details|account number|eft|transfer (money|funds|payment)/gi, type: 'Banking Information Request', severity: 'high' as const, score: 25 },
  { pattern: /job offer|hiring|vacancy|apply now|employment opportunity/gi, type: 'Fake Job Offer Pattern', severity: 'medium' as const, score: 12 },
  { pattern: /sim swap|sim card|network provider|vodacom|mtn|cell c|telkom/gi, type: 'SIM Swap Risk', severity: 'high' as const, score: 20 },
  { pattern: /free (data|airtime|money|cash|voucher)|r\s*\d{3,}|rand \d{3,}/gi, type: 'Free Reward Lure', severity: 'medium' as const, score: 15 },
  { pattern: /sars|south african revenue|tax refund|irs|revenue service/gi, type: 'Tax Authority Impersonation', severity: 'high' as const, score: 25 },
  { pattern: /absa|fnb|standard bank|nedbank|capitec|african bank/gi, type: 'Bank Impersonation', severity: 'high' as const, score: 20 },
  { pattern: /bit\.ly|tinyurl|t\.co|goo\.gl|ow\.ly|short\.|rb\.gy/gi, type: 'Shortened URL', severity: 'medium' as const, score: 15 },
  { pattern: /your account (has been|will be) (suspended|blocked|closed|deactivated)/gi, type: 'Account Threat', severity: 'high' as const, score: 25 },
  { pattern: /confirm (your|the) (details|information|identity|account)/gi, type: 'Confirmation Request', severity: 'medium' as const, score: 12 },
  { pattern: /do not (share|tell|show) (anyone|this|the)/gi, type: 'Secrecy Instruction', severity: 'high' as const, score: 20 },
  { pattern: /limited time|offer expires|last chance|final notice/gi, type: 'False Urgency', severity: 'medium' as const, score: 15 },
]

const SUSPICIOUS_DOMAINS = [
  /[a-z0-9-]+\.(xyz|tk|ml|ga|cf|gq|top|click|download|loan|work|date|racing)/gi,
  /[a-z]+-[a-z]+-[a-z]+\.(com|co\.za|net)/gi,
  /(secure|login|verify|account|update|confirm)[a-z0-9-]*\.(com|net|org|co\.za)/gi,
  /[a-z]+(absa|fnb|nedbank|capitec|standardbank|sars|nsfas)[a-z0-9-]*\.(com|net|org)/gi,
]

const EDUCATION_TIPS: Record<string, string> = {
  'Urgency Tactic': 'Scammers create urgency to prevent you from thinking clearly. Legitimate organizations give you time to verify.',
  'OTP/Password Request': 'No legitimate bank, NSFAS, or company will ever ask for your OTP or password. Never share these.',
  'Bursary Scam Pattern': 'NSFAS and legitimate bursaries never ask for upfront fees or personal banking details via WhatsApp/SMS.',
  'Banking Information Request': 'Never share banking details via SMS, WhatsApp, or email. Call your bank directly to verify.',
  'SIM Swap Risk': 'If someone asks about your SIM card or network provider, it may be a SIM swap attempt. Contact your network immediately.',
  'Bank Impersonation': 'Banks never ask for full card numbers, PINs, or OTPs via message. Always call the number on the back of your card.',
  'default': 'When in doubt, do not click links or share personal information. Contact the organization directly using official contact details.',
}

function analyzeUrl(url: string): Flag[] {
  const flags: Flag[] = []
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`)
    const hostname = parsed.hostname.toLowerCase()
    if (SUSPICIOUS_DOMAINS.some(r => r.test(hostname))) {
      flags.push({ type: 'Suspicious Domain', severity: 'high', description: `Domain "${hostname}" matches known phishing patterns` })
    }
    if (hostname.split('.').length > 3) {
      flags.push({ type: 'Excessive Subdomains', severity: 'medium', description: 'Multiple subdomains often used to disguise phishing sites' })
    }
    if (/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(hostname)) {
      flags.push({ type: 'IP Address URL', severity: 'high', description: 'Legitimate sites use domain names, not raw IP addresses' })
    }
  } catch { /* not a URL */ }
  return flags
}

export function analyzeContent(input: string): ScanResult {
  const flags: Flag[] = []
  const highlightedPhrases: string[] = []
  let totalScore = 0
  let primaryCategory = 'General'

  // URL analysis
  const urlMatch = input.match(/https?:\/\/[^\s]+|www\.[^\s]+/gi)
  if (urlMatch) {
    urlMatch.forEach(url => {
      const urlFlags = analyzeUrl(url)
      flags.push(...urlFlags)
      totalScore += urlFlags.reduce((s, f) => s + (f.severity === 'high' ? 20 : f.severity === 'medium' ? 10 : 5), 0)
    })
  }

  // Pattern matching
  for (const { pattern, type, severity, score } of PHISHING_PATTERNS) {
    const matches = input.match(pattern)
    if (matches) {
      flags.push({ type, severity, description: `Detected: "${matches[0]}"` })
      highlightedPhrases.push(...matches.slice(0, 2))
      totalScore += score
      if (score >= 20) primaryCategory = type
    }
  }

  // Misspelling check for common brands
  const misspellings = [
    [/abssa|absaa|abza/gi, 'ABSA'], [/fnbb|f-n-b/gi, 'FNB'],
    [/nsfaas|nsfass|nsfaz/gi, 'NSFAS'], [/sarss|s-a-r-s/gi, 'SARS'],
  ]
  for (const [pattern, brand] of misspellings) {
    if ((pattern as RegExp).test(input)) {
      flags.push({ type: 'Brand Misspelling', severity: 'high', description: `Misspelled "${brand}" — common phishing tactic` })
      totalScore += 25
    }
  }

  const riskScore = Math.min(100, totalScore)
  const threatLevel = riskScore >= 60 ? 'dangerous' : riskScore >= 25 ? 'suspicious' : 'safe'

  const explanations: Record<string, string> = {
    safe: 'No significant threat indicators were detected in this content.',
    suspicious: `This content contains ${flags.length} suspicious indicator(s). Exercise caution before acting on this message.`,
    dangerous: `This content shows strong signs of a phishing/scam attempt. ${flags.length} threat indicators detected. Do NOT click links or share information.`,
  }

  const recommendations: Record<string, string[]> = {
    safe: ['Continue to stay vigilant', 'Verify sender identity independently', 'Never share OTPs or passwords'],
    suspicious: ['Do not click any links', 'Verify with the organization directly', 'Report to the South African Fraud Hotline: 0800 00 2870', 'Screenshot and report to SABRIC'],
    dangerous: ['Do NOT respond or click any links', 'Block the sender immediately', 'Report to SAPS Cybercrime Unit', 'Call your bank if banking details were requested', 'Report to SABRIC: 011 847 3000', 'Forward to 7726 (SPAM) on your mobile'],
  }

  const tipKey = flags[0]?.type || 'default'
  const educationTip = EDUCATION_TIPS[tipKey] || EDUCATION_TIPS['default']

  // Build AI reasoning explanation
  const reasoningSteps: string[] = []
  const flagTypes = flags.map(f => f.type)

  if (flagTypes.includes('Urgency Tactic') || flagTypes.includes('False Urgency'))
    reasoningSteps.push('Detected urgency language designed to pressure the recipient into acting without thinking')
  if (flagTypes.includes('OTP/Password Request'))
    reasoningSteps.push('Message explicitly requests an OTP or password — a tactic exclusively used by fraudsters, never legitimate institutions')
  if (flagTypes.includes('Bank Impersonation') || flagTypes.includes('Banking Information Request'))
    reasoningSteps.push('Impersonates a financial institution (ABSA, FNB, Capitec, Nedbank) to gain trust before requesting sensitive data')
  if (flagTypes.includes('Bursary Scam Pattern'))
    reasoningSteps.push('Uses NSFAS or bursary-related language — a common social engineering tactic targeting South African students')
  if (flagTypes.includes('Shortened URL') || flagTypes.includes('Suspicious Domain'))
    reasoningSteps.push('Contains a shortened or suspicious URL commonly used to disguise phishing destinations')
  if (flagTypes.includes('Fake Job Offer Pattern'))
    reasoningSteps.push('Matches patterns of fake job offers that lure victims with high salaries and request personal information')
  if (flagTypes.includes('SIM Swap Risk'))
    reasoningSteps.push('References network providers or SIM cards — a strong indicator of a SIM swap fraud attempt')
  if (flagTypes.includes('Account Threat'))
    reasoningSteps.push('Threatens account suspension or closure to create panic and force immediate action')
  if (flagTypes.includes('Prize/Winner Scam'))
    reasoningSteps.push('Uses prize or winner language to create excitement and lower the victim\'s guard')
  if (flagTypes.includes('Secrecy Instruction'))
    reasoningSteps.push('Instructs the recipient not to share the message — a classic tactic to prevent victims from seeking advice')
  if (flagTypes.includes('Tax Authority Impersonation'))
    reasoningSteps.push('Impersonates SARS or a tax authority to create fear of legal consequences')
  if (flagTypes.includes('Brand Misspelling'))
    reasoningSteps.push('Contains deliberate misspellings of trusted brand names — a known technique to bypass spam filters')
  if (reasoningSteps.length === 0 && threatLevel === 'safe')
    reasoningSteps.push('No significant threat patterns were detected in the content')

  const aiReasoning = reasoningSteps.length > 0
    ? `The AI flagged this content because: ${reasoningSteps.join('; ')}. Combined risk score: ${riskScore}/100.`
    : 'No threat patterns matched. Content appears safe based on current detection rules.'

  return {
    riskScore,
    threatLevel,
    flags,
    explanation: explanations[threatLevel],
    aiReasoning,
    reasoningSteps,
    highlightedPhrases: [...new Set(highlightedPhrases)],
    recommendations: recommendations[threatLevel],
    category: primaryCategory,
    educationTip,
  }
}
