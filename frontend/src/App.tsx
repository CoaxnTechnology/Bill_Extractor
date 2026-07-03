import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Toaster } from "sonner"
import Navbar from "@/components/Navbar"
import Dashboard from "@/pages/Dashboard"
import Upload from "@/pages/Upload"
import Bills from "@/pages/Bills"
import NotFound from "@/pages/NotFound"

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-8 md:px-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/bills" element={<Bills />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
      <Toaster richColors position="top-right" />
    </BrowserRouter>
  )
}
