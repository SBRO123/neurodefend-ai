import { ScanResult } from './scanner'

export interface StoredScan {
  id: string
  content: string
  result: ScanResult
  timestamp: number
}

export interface UserStats {
  totalScans: number
  threatsFound: number
  safeScans: number
  securityScore: number
  lastScan: number | null
  completedModules: string[]
  reportedScams: number
}

const SCANS_KEY = 'neurodefend_scans'
const STATS_KEY = 'neurodefend_stats'
const REPORTS_KEY = 'neurodefend_reports'

function isBrowser() { return typeof window !== 'undefined' }

// ── Scan History ──────────────────────────────────────────────
export function saveScam(content: string, result: ScanResult): StoredScan {
  const scan: StoredScan = { id: Date.now().toString(), content, result, timestamp: Date.now() }
  if (!isBrowser()) return scan
  const existing = getScans()
  const updated = [scan, ...existing].slice(0, 50) // keep last 50
  localStorage.setItem(SCANS_KEY, JSON.stringify(updated))
  updateStatsAfterScan(result)
  return scan
}

export function getScans(): StoredScan[] {
  if (!isBrowser()) return []
  try { return JSON.parse(localStorage.getItem(SCANS_KEY) || '[]') } catch { return [] }
}

export function clearScans() {
  if (isBrowser()) localStorage.removeItem(SCANS_KEY)
}

// ── User Stats & Security Score ───────────────────────────────
export function getStats(): UserStats {
  if (!isBrowser()) return defaultStats()
  try { return JSON.parse(localStorage.getItem(STATS_KEY) || JSON.stringify(defaultStats())) }
  catch { return defaultStats() }
}

function defaultStats(): UserStats {
  return { totalScans: 0, threatsFound: 0, safeScans: 0, securityScore: 30, lastScan: null, completedModules: [], reportedScams: 0 }
}

function updateStatsAfterScan(result: ScanResult) {
  const stats = getStats()
  stats.totalScans += 1
  stats.lastScan = Date.now()
  if (result.threatLevel !== 'safe') stats.threatsFound += 1
  else stats.safeScans += 1

  // Score logic: scanning improves awareness, clicking dangerous things lowers it
  let delta = 2 // base: +2 for scanning
  if (result.threatLevel === 'dangerous') delta += 3  // +3 for catching a dangerous one
  if (result.threatLevel === 'suspicious') delta += 1
  stats.securityScore = Math.min(100, Math.max(0, stats.securityScore + delta))

  localStorage.setItem(STATS_KEY, JSON.stringify(stats))
}

export function completeModule(moduleId: string) {
  if (!isBrowser()) return
  const stats = getStats()
  if (!stats.completedModules.includes(moduleId)) {
    stats.completedModules.push(moduleId)
    stats.securityScore = Math.min(100, stats.securityScore + 8)
    localStorage.setItem(STATS_KEY, JSON.stringify(stats))
  }
}

export function addReportedScam() {
  if (!isBrowser()) return
  const stats = getStats()
  stats.reportedScams += 1
  stats.securityScore = Math.min(100, stats.securityScore + 5)
  localStorage.setItem(STATS_KEY, JSON.stringify(stats))
}

export function getAwarenessLevel(score: number): { level: string; color: string; next: string | null } {
  if (score >= 75) return { level: 'Guardian', color: 'text-cyan-400', next: null }
  if (score >= 50) return { level: 'Secure', color: 'text-blue-400', next: 'Guardian' }
  if (score >= 25) return { level: 'Aware', color: 'text-yellow-400', next: 'Secure' }
  return { level: 'Beginner', color: 'text-red-400', next: 'Aware' }
}

// ── Community Reports ─────────────────────────────────────────
export interface CommunityReport {
  id: string
  type: string
  description: string
  location: string
  timestamp: number
  votes: number
}

export function getCommunityReports(): CommunityReport[] {
  if (!isBrowser()) return []
  try { return JSON.parse(localStorage.getItem(REPORTS_KEY) || '[]') } catch { return [] }
}

export function submitCommunityReport(type: string, description: string, location: string): CommunityReport {
  const report: CommunityReport = { id: Date.now().toString(), type, description, location, timestamp: Date.now(), votes: 1 }
  if (!isBrowser()) return report
  const existing = getCommunityReports()
  localStorage.setItem(REPORTS_KEY, JSON.stringify([report, ...existing].slice(0, 100)))
  addReportedScam()
  return report
}

export function upvoteReport(id: string) {
  if (!isBrowser()) return
  const reports = getCommunityReports()
  const updated = reports.map(r => r.id === id ? { ...r, votes: r.votes + 1 } : r)
  localStorage.setItem(REPORTS_KEY, JSON.stringify(updated))
}

export function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} hr ago`
  return `${Math.floor(hrs / 24)} day ago`
}
