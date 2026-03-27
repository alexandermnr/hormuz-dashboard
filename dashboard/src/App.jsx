import React, { useState, useEffect } from 'react'
import { Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom'
import posthog from 'posthog-js'
import LiveStatus from './pages/LiveStatus'
import SignalDetail from './pages/SignalDetail'
import Briefs from './pages/Briefs'
import Methodology from './pages/Methodology'
import Markets from './pages/Markets'
import Pricing from './pages/Pricing'
import Roadmap from './pages/Roadmap'
import Preview from './pages/Preview'
import Trial from './pages/Trial'
import PublicScore from './pages/PublicScore'
import Terms from './pages/Terms'
import ArchivePage from './pages/ArchivePage'
import PublicMethodology from './pages/PublicMethodology'
import EventLog from './pages/EventLog'
import Accuracy from './pages/Accuracy'
import GritTerminalLanding from './pages/GritTerminalLanding'
import HormuzLanding from './pages/HormuzLanding'
import ComingSoon from './pages/ComingSoon'
import ExtractionLog from './pages/ExtractionLog'

const DASHBOARD_PASSWORD = import.meta.env.VITE_DASHBOARD_PASSWORD || ''

export function TrackedSection({ name, children, className = '' }) {
  const ref = React.useRef(null)

  useEffect(() => {
    if (!import.meta.env.VITE_POSTHOG_KEY || !ref.current) return
    const el = ref.current
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          posthog.capture('section_viewed', { section: name })
          observer.unobserve(el)
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.unobserve(el)
  }, [name])

  return <div ref={ref} className={className}>{children}</div>
}

const NAV_ITEMS = [
  { path: '/app', label: 'Live Status', icon: '01' },
  { path: '/app/signals', label: 'Signal Detail', icon: '02' },
  { path: '/app/briefs', label: 'Briefs', icon: '03' },
  { path: '/app/methodology', label: 'Methodology', icon: '04' },
  { path: '/app/markets', label: 'Markets', icon: '05' },
  { path: '/app/pricing', label: 'Pricing', icon: '06' },
  { path: '/app/roadmap', label: 'Roadmap', icon: '07' },
  { path: '/app/event-log', label: 'Event Log', icon: '08' },
  { path: '/app/data-log', label: 'Extraction Log', icon: '09' },
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
              end={item.path === '/app'}
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
  const location = useLocation()

  useEffect(() => {
    if (import.meta.env.VITE_POSTHOG_KEY) {
      posthog.capture('page_view', { route: location.pathname })
    }
  }, [location.pathname])

  return (
    <Routes>
      {/* ========================================= */}
      {/* PUBLIC ROUTES — no password, no layout    */}
      {/* ========================================= */}
      <Route path="/" element={<GritTerminalLanding />} />
      <Route path="/hormuz" element={<HormuzLanding />} />
      <Route path="/red-sea" element={
        <ComingSoon
          indexName="RED SEA"
          fullName="Red Sea-Suez Corridor Index"
          description="Composite disruption index tracking Houthi activity, Suez transit volumes, container rerouting costs, and Red Sea war risk premiums."
          launchDate="Q3 2026"
        />
      } />
      <Route path="/semiconductors" element={
        <ComingSoon
          indexName="SEMICONDUCTORS"
          fullName="Semiconductor Supply Chain Stress Index"
          description="Multi-signal index tracking Taiwan Strait tension, TSMC production indicators, rare earth export controls, and chip inventory drawdowns."
          launchDate="Q4 2026"
        />
      } />
      <Route path="/food-supply" element={
        <ComingSoon
          indexName="FOOD SUPPLY"
          fullName="Global Food Supply Chain Cascade Index"
          description="Composite index tracking Black Sea grain corridor status, fertilizer export disruptions, El Ni&ntilde;o crop stress, and strategic reserve drawdowns."
          launchDate="Q4 2026"
        />
      } />
      <Route path="/methodology" element={<PublicMethodology />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/accuracy" element={<Accuracy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/preview" element={<Preview />} />
      <Route path="/trial" element={<Trial />} />
      <Route path="/archive" element={<ArchivePage />} />
      <Route path="/public" element={<Navigate to="/hormuz" replace />} />

      {/* ========================================= */}
      {/* INTERNAL ROUTES — password gated          */}
      {/* ========================================= */}
      <Route path="/app" element={
        <PasswordGate>
          <DashboardLayout><LiveStatus /></DashboardLayout>
        </PasswordGate>
      } />
      <Route path="/app/signals" element={
        <PasswordGate>
          <DashboardLayout><SignalDetail /></DashboardLayout>
        </PasswordGate>
      } />
      <Route path="/app/briefs" element={
        <PasswordGate>
          <DashboardLayout><Briefs /></DashboardLayout>
        </PasswordGate>
      } />
      <Route path="/app/methodology" element={
        <PasswordGate>
          <DashboardLayout><Methodology /></DashboardLayout>
        </PasswordGate>
      } />
      <Route path="/app/markets" element={
        <PasswordGate>
          <DashboardLayout><Markets /></DashboardLayout>
        </PasswordGate>
      } />
      <Route path="/app/pricing" element={
        <PasswordGate>
          <DashboardLayout><Pricing /></DashboardLayout>
        </PasswordGate>
      } />
      <Route path="/app/roadmap" element={
        <PasswordGate>
          <DashboardLayout><Roadmap /></DashboardLayout>
        </PasswordGate>
      } />
      <Route path="/app/event-log" element={
        <PasswordGate>
          <DashboardLayout><EventLog /></DashboardLayout>
        </PasswordGate>
      } />
      <Route path="/app/data-log" element={
        <PasswordGate>
          <DashboardLayout><ExtractionLog /></DashboardLayout>
        </PasswordGate>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
