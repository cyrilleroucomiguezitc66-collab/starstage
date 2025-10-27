import { useState } from 'react'
import { Shield, Calendar } from 'lucide-react'

export default function AgeVerification({ onVerified }: { onVerified: () => void }) {
  const [birthDate, setBirthDate] = useState({ day: '', month: '', year: '' })
  const [error, setError] = useState('')

  const verify = () => {
    const { day, month, year } = birthDate

    if (!day || !month || !year) {
      setError('Veuillez remplir tous les champs')
      return
    }

    const dayNum = parseInt(day)
    const monthNum = parseInt(month)
    const yearNum = parseInt(year)

    if (dayNum < 1 || dayNum > 31 || monthNum < 1 || monthNum > 12) {
      setError('Date invalide')
      return
    }

    const birth = new Date(yearNum, monthNum - 1, dayNum)
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const m = today.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--
    }

    if (age < 18) {
      setError('Vous devez avoir au moins 18 ans pour accéder à cette plateforme')
      return
    }

    if (yearNum < 1900 || yearNum > today.getFullYear()) {
      setError('Année invalide')
      return
    }

    localStorage.setItem('age-verified', 'true')
    onVerified()
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'calc(var(--spacing) * 4)'
    }}>
      <div style={{
        maxWidth: '500px',
        width: '100%',
        background: 'var(--bg-card)',
        borderRadius: '32px',
        padding: 'calc(var(--spacing) * 8)',
        border: '2px solid var(--border)',
        boxShadow: '0 24px 64px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: 'rgba(255, 211, 0, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto calc(var(--spacing) * 4)'
        }}>
          <Shield size={50} color="var(--yellow)" />
        </div>

        <h1 style={{
          fontSize: '32px',
          fontWeight: '800',
          color: '#ffffff',
          textAlign: 'center',
          marginBottom: 'calc(var(--spacing) * 2)'
        }}>
          Vérification d'âge
        </h1>

        <p style={{
          fontSize: '16px',
          color: 'var(--text-secondary)',
          textAlign: 'center',
          marginBottom: 'calc(var(--spacing) * 6)',
          lineHeight: '1.6'
        }}>
          Cette plateforme est réservée aux personnes majeures. Veuillez confirmer votre date de naissance pour continuer.
        </p>

        <div style={{
          marginBottom: 'calc(var(--spacing) * 2)'
        }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'calc(var(--spacing) * 1)',
            color: 'var(--text-primary)',
            fontWeight: '600',
            marginBottom: 'calc(var(--spacing) * 2)',
            fontSize: '14px'
          }}>
            <Calendar size={18} color="var(--yellow)" />
            Date de naissance
          </label>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 2fr',
            gap: 'calc(var(--spacing) * 2)'
          }}>
            <input
              type="number"
              placeholder="JJ"
              value={birthDate.day}
              onChange={(e) => {
                const value = e.target.value
                if (value.length <= 2) setBirthDate({ ...birthDate, day: value })
              }}
              min="1"
              max="31"
              style={{
                padding: 'calc(var(--spacing) * 3)',
                background: 'var(--bg-dark)',
                border: '2px solid var(--border)',
                borderRadius: '12px',
                color: '#ffffff',
                fontSize: '18px',
                fontWeight: '700',
                textAlign: 'center',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--yellow)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
            />
            <input
              type="number"
              placeholder="MM"
              value={birthDate.month}
              onChange={(e) => {
                const value = e.target.value
                if (value.length <= 2) setBirthDate({ ...birthDate, month: value })
              }}
              min="1"
              max="12"
              style={{
                padding: 'calc(var(--spacing) * 3)',
                background: 'var(--bg-dark)',
                border: '2px solid var(--border)',
                borderRadius: '12px',
                color: '#ffffff',
                fontSize: '18px',
                fontWeight: '700',
                textAlign: 'center',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--yellow)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
            />
            <input
              type="number"
              placeholder="AAAA"
              value={birthDate.year}
              onChange={(e) => {
                const value = e.target.value
                if (value.length <= 4) setBirthDate({ ...birthDate, year: value })
              }}
              style={{
                padding: 'calc(var(--spacing) * 3)',
                background: 'var(--bg-dark)',
                border: '2px solid var(--border)',
                borderRadius: '12px',
                color: '#ffffff',
                fontSize: '18px',
                fontWeight: '700',
                textAlign: 'center',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--yellow)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
            />
          </div>
        </div>

        {error && (
          <div style={{
            padding: 'calc(var(--spacing) * 2.5)',
            background: 'rgba(255, 68, 68, 0.1)',
            border: '1px solid rgba(255, 68, 68, 0.3)',
            borderRadius: '12px',
            color: '#ff4444',
            fontSize: '14px',
            textAlign: 'center',
            marginBottom: 'calc(var(--spacing) * 4)'
          }}>
            {error}
          </div>
        )}

        <button
          onClick={verify}
          style={{
            width: '100%',
            padding: 'calc(var(--spacing) * 4)',
            background: 'var(--yellow)',
            border: 'none',
            borderRadius: '16px',
            color: '#000000',
            fontSize: '18px',
            fontWeight: '800',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 8px 24px var(--yellow-glow)',
            marginBottom: 'calc(var(--spacing) * 3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)'
            e.currentTarget.style.boxShadow = '0 12px 36px var(--yellow-glow)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 8px 24px var(--yellow-glow)'
          }}
        >
          Vérifier mon âge
        </button>

        <p style={{
          fontSize: '12px',
          color: 'var(--text-secondary)',
          textAlign: 'center',
          lineHeight: '1.6'
        }}>
          En continuant, vous confirmez avoir lu et accepté nos{' '}
          <a href="/terms" style={{ color: 'var(--yellow)', textDecoration: 'underline' }}>
            Conditions d'Utilisation
          </a>
          {' '}et notre{' '}
          <a href="/privacy" style={{ color: 'var(--yellow)', textDecoration: 'underline' }}>
            Politique de Confidentialité
          </a>
        </p>
      </div>
    </div>
  )
}
