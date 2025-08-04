export default function WaliKelasLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-indigo-700 text-white px-4 py-3">
        <h1 className="text-xl font-bold">Dashboard Wali Kelas</h1>
      </header>
      <main className="p-4">{children}</main>
    </div>
  )
}
