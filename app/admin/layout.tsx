import Navbar from '@/components/Navbar'
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <><Navbar /><main className="pt-16 min-h-screen bg-[#0a0e1a] grid-bg">{children}</main></>
}
