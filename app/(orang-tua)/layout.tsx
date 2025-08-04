export default function OrangTuaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-orange-600 text-white px-4 py-3">
        <h1 className="text-xl font-bold">Dashboard Orang Tua</h1>
      </header>
      <main className="p-4">{children}</main>
    </div>
  )
}
