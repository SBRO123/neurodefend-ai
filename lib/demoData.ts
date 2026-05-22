export const DEMO_ALERTS = [
  { id: '1', type: 'login', severity: 'high', message: 'Unknown device login from Johannesburg, GP', time: '2 min ago', ip: '196.25.1.44', device: 'Unknown Android' },
  { id: '2', type: 'failed_login', severity: 'medium', message: '5 failed login attempts detected', time: '8 min ago', ip: '41.13.100.22', device: 'Chrome/Windows' },
  { id: '3', type: 'location', severity: 'high', message: 'Impossible travel: Cape Town → Durban (12 min)', time: '15 min ago', ip: '105.27.8.91', device: 'Safari/iPhone' },
  { id: '4', type: 'sim_swap', severity: 'critical', message: 'SIM swap risk indicator detected', time: '1 hr ago', ip: 'N/A', device: 'Network Event' },
  { id: '5', type: 'scan', severity: 'low', message: 'Phishing link scan completed — DANGEROUS', time: '2 hr ago', ip: 'Local', device: 'Chrome/Windows' },
]

export const DEMO_ACTIVITY = [
  { time: '14:32', event: 'Login', location: 'Pretoria, GP', device: 'Chrome/Windows', status: 'success' },
  { time: '14:28', event: 'Failed Login', location: 'Unknown', device: 'Unknown', status: 'failed' },
  { time: '13:15', event: 'Scan', location: 'Pretoria, GP', device: 'Chrome/Windows', status: 'success' },
  { time: '11:02', event: 'Login', location: 'Johannesburg, GP', device: 'Safari/iPhone', status: 'success' },
  { time: '09:44', event: 'Password Change', location: 'Pretoria, GP', device: 'Chrome/Windows', status: 'success' },
]

export const DEMO_SCANS = [
  { id: '1', content: 'NSFAS: Your bursary of R45,000 is ready. Click here to claim: bit.ly/nsfas-claim', score: 85, level: 'dangerous', time: '10 min ago' },
  { id: '2', content: 'ABSA: Verify your account immediately or it will be suspended. OTP: 123456', score: 92, level: 'dangerous', time: '1 hr ago' },
  { id: '3', content: 'Congratulations! You have been selected for a job at Amazon SA. WhatsApp +27...', score: 67, level: 'suspicious', time: '3 hr ago' },
  { id: '4', content: 'Your TUT registration is confirmed for 2026 S1. See timetable on iEnabler.', score: 8, level: 'safe', time: '1 day ago' },
]

export const THREAT_TREND_DATA = [
  { month: 'Nov', phishing: 42, bursary: 18, banking: 31, jobs: 12 },
  { month: 'Dec', phishing: 58, bursary: 24, banking: 45, jobs: 19 },
  { month: 'Jan', phishing: 71, bursary: 67, banking: 38, jobs: 28 },
  { month: 'Feb', phishing: 63, bursary: 52, banking: 41, jobs: 35 },
  { month: 'Mar', phishing: 89, bursary: 78, banking: 55, jobs: 42 },
  { month: 'Apr', phishing: 76, bursary: 61, banking: 48, jobs: 38 },
]

export const SCAM_CATEGORIES = [
  { name: 'Phishing Links', value: 34, color: '#ef4444' },
  { name: 'Bursary Scams', value: 28, color: '#f59e0b' },
  { name: 'Banking Fraud', value: 22, color: '#8b5cf6' },
  { name: 'Fake Jobs', value: 10, color: '#3b82f6' },
  { name: 'SIM Swap', value: 6, color: '#22d3ee' },
]

export const SA_HEATMAP_DATA = [
  { province: 'Gauteng', scams: 1842, lat: -26.2, lng: 28.0 },
  { province: 'Western Cape', scams: 934, lat: -33.9, lng: 18.4 },
  { province: 'KwaZulu-Natal', scams: 721, lat: -29.8, lng: 31.0 },
  { province: 'Eastern Cape', scams: 412, lat: -33.0, lng: 27.9 },
  { province: 'Limpopo', scams: 298, lat: -23.9, lng: 29.4 },
  { province: 'Mpumalanga', scams: 267, lat: -25.5, lng: 30.9 },
  { province: 'North West', scams: 198, lat: -26.7, lng: 25.1 },
  { province: 'Free State', scams: 187, lat: -29.1, lng: 26.2 },
  { province: 'Northern Cape', scams: 89, lat: -29.0, lng: 24.8 },
]

export const COMMUNITY_REPORTS = [
  { id: '1', type: 'WhatsApp Scam', description: 'Fake NSFAS agent asking for banking details', location: 'Soweto, GP', votes: 47, time: '2 hr ago' },
  { id: '2', type: 'SMS Phishing', description: 'ABSA account suspension threat with suspicious link', location: 'Cape Town, WC', votes: 31, time: '5 hr ago' },
  { id: '3', type: 'Fake Job', description: 'Amazon SA hiring scam — R5000 upfront fee required', location: 'Durban, KZN', votes: 28, time: '1 day ago' },
  { id: '4', type: 'Email Phishing', description: 'SARS tax refund email with malicious attachment', location: 'Pretoria, GP', votes: 19, time: '2 days ago' },
]

export const SECURITY_TIPS = [
  { title: 'Never Share OTPs', tip: 'Your bank, NSFAS, or any legitimate organization will NEVER ask for your OTP via WhatsApp or SMS.', icon: '🔐' },
  { title: 'Verify Before You Click', tip: 'Hover over links to see the real URL. If it looks suspicious, do not click.', icon: '🔍' },
  { title: 'Enable 2FA', tip: 'Two-factor authentication adds an extra layer of security to your accounts.', icon: '🛡️' },
  { title: 'Report Scams', tip: 'Report scams to SABRIC (011 847 3000) or the SA Fraud Hotline (0800 00 2870).', icon: '📢' },
  { title: 'Check NSFAS Officially', tip: 'Only check your NSFAS status on myNSFAS.org.za — never through WhatsApp agents.', icon: '🎓' },
  { title: 'SIM Swap Protection', tip: 'Contact your network provider to add a SIM swap block to your number.', icon: '📱' },
]
