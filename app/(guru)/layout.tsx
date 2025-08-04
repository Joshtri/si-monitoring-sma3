export default function GuruLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-600 text-white px-4 py-3">
        <h1 className="text-xl font-bold">Dashboard Guru</h1>
      </header>
      <main className="p-4">{children}</main>
    </div>
  )
}
