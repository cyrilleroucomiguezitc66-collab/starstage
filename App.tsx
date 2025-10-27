import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './lib/auth-context'
import Auth from './pages/Auth'
import Home from './pages/Home'
import Discover from './pages/Discover'
import Marketplace from './pages/Marketplace'
import Premium from './pages/Premium'
import NewStream from './pages/NewStream'
import LiveStream from './pages/LiveStream'
import Settings from './pages/Settings'
import BuyCredits from './pages/BuyCredits'
import ArtistDashboard from './pages/ArtistDashboard'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import Legal from './pages/Legal'
import AgeVerification from './components/AgeVerification'
import CookieConsent from './components/CookieConsent'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)'
      }}>
        <p style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Chargement...</p>
      </div>
    )
  }

  return user ? <>{children}</> : <Navigate to="/auth" />
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)'
      }}>
        <p style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Chargement...</p>
      </div>
    )
  }

  return user ? <Navigate to="/" /> : <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/legal" element={<Legal />} />
      <Route path="/auth" element={
        <PublicRoute>
          <Auth />
        </PublicRoute>
      } />
      <Route path="/" element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      } />
      <Route path="/discover" element={
        <ProtectedRoute>
          <Discover />
        </ProtectedRoute>
      } />
      <Route path="/marketplace" element={
        <ProtectedRoute>
          <Marketplace />
        </ProtectedRoute>
      } />
      <Route path="/premium" element={
        <ProtectedRoute>
          <Premium />
        </ProtectedRoute>
      } />
      <Route path="/stream/new" element={
        <ProtectedRoute>
          <NewStream />
        </ProtectedRoute>
      } />
      <Route path="/stream/:sessionId" element={
        <ProtectedRoute>
          <LiveStream />
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } />
      <Route path="/credits" element={
        <ProtectedRoute>
          <BuyCredits />
        </ProtectedRoute>
      } />
      <Route path="/artist" element={
        <ProtectedRoute>
          <ArtistDashboard />
        </ProtectedRoute>
      } />
    </Routes>
  )
}

export default function App() {
  const [ageVerified, setAgeVerified] = useState(() => {
    return localStorage.getItem('age-verified') === 'true'
  })

  if (!ageVerified) {
    return <AgeVerification onVerified={() => setAgeVerified(true)} />
  }

  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
        <CookieConsent />
      </AuthProvider>
    </Router>
  )
}
