# GuardianAI 🛡️

**AI-Powered Cybersecurity Protection for South Africa**

GuardianAI detects phishing scams, fake bursary offers, banking fraud, fake job offers, WhatsApp scams, and suspicious account behavior in real-time using AI-powered analysis.

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
http://localhost:3000
```

---

## 📁 Project Structure

```
guardianai/
├── app/
│   ├── page.tsx          # Landing page
│   ├── dashboard/        # Real-time monitoring dashboard
│   ├── scan/             # AI threat scanner
│   ├── analytics/        # Charts, heatmap, community reports
│   ├── learn/            # Education center + AI chatbot
│   ├── admin/            # Admin panel
│   └── api/
│       ├── scan/         # POST /api/scan — AI analysis
│       ├── auth/         # POST /api/auth — JWT login
│       └── alerts/       # GET /api/alerts — security alerts
├── components/
│   ├── Navbar.tsx
│   └── ui/ThreatUI.tsx   # RiskMeter, ThreatBadge, StatCard, AlertItem
├── lib/
│   ├── scanner.ts        # Core AI scanning engine (NLP + pattern matching)
│   └── demoData.ts       # Demo/simulation data
```

---

## 🔑 Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with hero, features, stats |
| `/scan` | AI phishing & scam detector |
| `/dashboard` | Real-time security monitoring |
| `/analytics` | Threat trends, SA heatmap, community reports |
| `/learn` | Education center, AI chatbot, badges |
| `/admin` | Admin panel (users, threats, settings) |

---

## 🤖 AI Scanner Features

The scanner (`lib/scanner.ts`) detects:

- Urgency language tactics
- OTP/password requests
- NSFAS/bursary scam patterns
- Banking impersonation (ABSA, FNB, Capitec, Nedbank)
- Fake job offer patterns
- SIM swap risk indicators
- Suspicious/shortened URLs
- Brand misspellings
- Social engineering tactics
- SARS/tax authority impersonation

**Output:** Risk score (0–100), threat level, flagged phrases, recommendations, education tip.

---

## 🔐 Demo Credentials

```
Email: demo@guardianai.co.za
Password: demo1234

Admin:
Email: admin@guardianai.co.za
Password: admin1234
```

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, React 18, TypeScript, Tailwind CSS
- **Charts:** Recharts
- **Auth:** JWT + bcryptjs
- **AI:** Rule-based NLP engine (extendable to Gemini/OpenAI)
- **Deployment:** Vercel / Railway / Render

---

## 🌍 Deployment (Vercel)

```bash
npm install -g vercel
vercel
```

---

## 📞 SA Cybercrime Contacts

- **SABRIC:** 011 847 3000
- **SA Fraud Hotline:** 0800 00 2870
- **SAPS Cybercrime:** 10111
- **SMS Spam:** Forward to 7726
