import React, { useState } from 'react'
import { Routes, Route, NavLink, Navigate } from 'react-router-dom'
import LiveStatus from './pages/LiveStatus'
import SignalDetail from './pages/SignalDetail'
import Briefs from './pages/Briefs'
import Methodology from './pages/Methodology'
import Markets from './pages/Markets'
import PublicScore from './pages/PublicScore'
import Terms from './pages/Terms'

const DASHBOARD_PASSWORD = import.meta.env.VITE_DASHBOARD_PASSWORD || ''

const NAV_ITEMS = [
  { path: '/', label: 'Live Status', icon: '01' },
  { path: '/signals', label: 'Signal Detail', icon: '02' },
  { path: '/briefs', label: 'Briefs', icon: '03' },
  { path: '/methodology', label: 'Methodology', icon: '04' },
  { path: '/markets', label: 'Markets', icon: '05' },
]

function PasswordGate({ children }) {
  const [authenticated, setAuthenticated] = useState(() => {
    return sessionStorage.getItem('hip_auth') === 'true'
  })
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)

  if (!DASHBOARD_PASSWORD) return children

  if (authenticated) return children

  function handleSubmit(e) {
    e.preventDefault()
    if (input === DASHBOARD_PASSWORD) {
      sessionStorage.setItem('hip_auth', 'true')
      setAuthenticated(true)
    } else {
      setError(true)
      setInput('')
    }
  }

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center">
      <form onSubmit={handleSubmit} className="text-center space-y-4">
        <h1 className="text-gold font-mono text-xs uppercase tracking-[0.3em]">
          Hormuz Intelligence Platform
        </h1>
        <div className="w-16 h-px bg-gold mx-auto" />
        <div className="pt-4">
          <input
            type="password"
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(false) }}
            placeholder="ACCESS CODE"
            className="bg-navy-light border border-navy-mid text-gray-300 font-mono text-sm px-4 py-2 text-center tracking-widest focus:border-gold focus:outline-none w-64"
            autoFocus
          />
        </div>
        {error && (
          <div className="text-red-400 font-mono text-xs">ACCESS DENIED</div>
        )}
        <button
          type="submit"
          className="text-gold font-mono text-xs uppercase tracking-widest hover:text-gold-light"
        >
          [ENTER]
        </button>
      </form>
    </div>
  )
}

function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-navy flex">
      {/* Sidebar */}
      <nav className="w-56 bg-navy-light border-r border-navy-mid flex flex-col shrink-0">
        <div className="p-4 border-b border-navy-mid">
          <div className="text-gold font-mono text-xs uppercase tracking-[0.2em] leading-tight">
            Hormuz<br />Intelligence<br />Platform
          </div>
        </div>
        <div className="flex-1 py-4">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `block px-4 py-2.5 font-mono text-xs uppercase tracking-wider border-l-2 ${
                  isActive
                    ? 'border-gold text-gold bg-navy/50'
                    : 'border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-600'
                }`
              }
            >
              <span className="text-gray-600 mr-2">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </div>
        <div className="p-4 border-t border-navy-mid">
          <div className="text-gray-700 font-mono text-[10px]">
            HIP v1.0 — DATA ONLY
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      {/* Public routes — no password */}
      <Route path="/public" element={<PublicScore />} />
      <Route path="/terms" element={<Terms />} />

      {/* Protected dashboard routes */}
      <Route
        path="/*"
        element={
          <PasswordGate>
            <DashboardLayout>
              <Routes>
                <Route path="/" element={<LiveStatus />} />
                <Route path="/signals" element={<SignalDetail />} />
                <Route path="/briefs" element={<Briefs />} />
                <Route path="/methodology" element={<Methodology />} />
                <Route path="/markets" element={<Markets />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </DashboardLayout>
          </PasswordGate>
        }
      />
    </Routes>
  )
}
