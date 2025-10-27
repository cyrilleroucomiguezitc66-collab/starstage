import { useState } from 'react'
import { Shield, Ban, AlertTriangle, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth-context'

interface ModerationPanelProps {
  userId: string
  sessionId?: string
  username: string
  onClose: () => void
}

export default function ModerationPanel({ userId, sessionId, username, onClose }: ModerationPanelProps) {
  const { user } = useAuth()
  const [reason, setReason] = useState('harassment')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [action, setAction] = useState<'report' | 'block'>('report')

  if (!user || user.id === userId) {
    return null
  }

  const handleReport = async () => {
    if (!description.trim()) {
      alert('Veuillez décrire le problème')
      return
    }

    setSubmitting(true)
    try {
      const { data, error } = await supabase.rpc('report_user', {
        p_reported_user_id: userId,
        p_session_id: sessionId || null,
        p_reason: reason,
        p_description: description
      })

      if (error) throw error

      if (data.success) {
        alert('Signalement envoyé. Notre équipe va examiner votre rapport.')
        onClose()
      } else {
        alert(data.error)
      }
    } catch (error: any) {
      alert('Erreur: ' + error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleBlock = async () => {
    if (!confirm(`Bloquer ${username}? Vous ne verrez plus leur contenu.`)) {
      return
    }

    setSubmitting(true)
    try {
      const { data, error } = await supabase.rpc('block_user', {
        p_blocked_id: userId
      })

      if (error) throw error

      if (data.success) {
        alert(`${username} a été bloqué.`)
        onClose()
      } else {
        alert(data.error)
      }
    } catch (error: any) {
      alert('Erreur: ' + error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          zIndex: 9998,
          backdropFilter: 'blur(4px)'
        }}
      />
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: '500px',
        background: 'var(--bg-card)',
        border: '2px solid var(--border)',
        borderRadius: '24px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        zIndex: 9999,
        padding: 'calc(var(--spacing) * 4)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'calc(var(--spacing) * 4)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(var(--spacing) * 2)' }}>
            <Shield size={24} color="var(--yellow)" />
            <h2 style={{
              fontSize: '20px',
              fontWeight: '800',
              color: '#ffffff',
              margin: 0
            }}>
              Modération
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'var(--bg-hover)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} color="#ffffff" />
          </button>
        </div>

        <div style={{
          padding: 'calc(var(--spacing) * 3)',
          background: 'rgba(255, 211, 0, 0.1)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 211, 0, 0.3)',
          marginBottom: 'calc(var(--spacing) * 4)'
        }}>
          <div style={{
            fontSize: '14px',
            color: 'var(--text-secondary)',
            marginBottom: '4px'
          }}>
            Utilisateur
          </div>
          <div style={{
            fontSize: '18px',
            fontWeight: '700',
            color: '#ffffff'
          }}>
            {username}
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: 'calc(var(--spacing) * 2)',
          marginBottom: 'calc(var(--spacing) * 4)'
        }}>
          <button
            onClick={() => setAction('report')}
            style={{
              flex: 1,
              padding: 'calc(var(--spacing) * 2)',
              background: action === 'report' ? 'rgba(255, 211, 0, 0.2)' : 'var(--bg-hover)',
              border: action === 'report' ? '2px solid var(--yellow)' : '2px solid var(--border)',
              borderRadius: '12px',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'calc(var(--spacing) * 1)'
            }}
          >
            <AlertTriangle size={18} />
            Signaler
          </button>
          <button
            onClick={() => setAction('block')}
            style={{
              flex: 1,
              padding: 'calc(var(--spacing) * 2)',
              background: action === 'block' ? 'rgba(255, 0, 0, 0.2)' : 'var(--bg-hover)',
              border: action === 'block' ? '2px solid #ff0000' : '2px solid var(--border)',
              borderRadius: '12px',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'calc(var(--spacing) * 1)'
            }}
          >
            <Ban size={18} />
            Bloquer
          </button>
        </div>

        {action === 'report' && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'calc(var(--spacing) * 3)'
          }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--text-secondary)',
                marginBottom: 'calc(var(--spacing) * 1)'
              }}>
                Raison
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                style={{
                  width: '100%',
                  padding: 'calc(var(--spacing) * 2)',
                  background: 'var(--bg-hover)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '14px'
                }}
              >
                <option value="harassment">Harcèlement</option>
                <option value="spam">Spam</option>
                <option value="inappropriate_content">Contenu inapproprié</option>
                <option value="impersonation">Usurpation d'identité</option>
                <option value="other">Autre</option>
              </select>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--text-secondary)',
                marginBottom: 'calc(var(--spacing) * 1)'
              }}>
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Décrivez le problème..."
                rows={4}
                style={{
                  width: '100%',
                  padding: 'calc(var(--spacing) * 2)',
                  background: 'var(--bg-hover)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '14px',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <button
              onClick={handleReport}
              disabled={submitting || !description.trim()}
              style={{
                padding: 'calc(var(--spacing) * 2.5)',
                background: !submitting && description.trim() ? 'linear-gradient(135deg, var(--yellow), #ffed4e)' : 'rgba(100, 100, 100, 0.3)',
                border: 'none',
                borderRadius: '12px',
                color: '#000000',
                fontSize: '16px',
                fontWeight: '700',
                cursor: !submitting && description.trim() ? 'pointer' : 'not-allowed',
                opacity: !submitting && description.trim() ? 1 : 0.5
              }}
            >
              {submitting ? 'Envoi...' : 'Envoyer le signalement'}
            </button>
          </div>
        )}

        {action === 'block' && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'calc(var(--spacing) * 3)'
          }}>
            <div style={{
              padding: 'calc(var(--spacing) * 3)',
              background: 'rgba(255, 0, 0, 0.1)',
              border: '1px solid rgba(255, 0, 0, 0.3)',
              borderRadius: '12px'
            }}>
              <p style={{
                fontSize: '14px',
                color: 'var(--text-secondary)',
                margin: 0,
                lineHeight: '1.6'
              }}>
                Bloquer {username} empêchera:
              </p>
              <ul style={{
                fontSize: '14px',
                color: 'var(--text-secondary)',
                marginTop: 'calc(var(--spacing) * 2)',
                marginBottom: 0,
                paddingLeft: 'calc(var(--spacing) * 4)',
                lineHeight: '1.8'
              }}>
                <li>De voir vos lives</li>
                <li>De vous envoyer des messages</li>
                <li>De vous suivre</li>
                <li>D'interagir avec votre contenu</li>
              </ul>
            </div>

            <button
              onClick={handleBlock}
              disabled={submitting}
              style={{
                padding: 'calc(var(--spacing) * 2.5)',
                background: submitting ? 'rgba(100, 100, 100, 0.3)' : 'linear-gradient(135deg, #ff0000, #cc0000)',
                border: 'none',
                borderRadius: '12px',
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: '700',
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.5 : 1
              }}
            >
              {submitting ? 'Blocage...' : `Bloquer ${username}`}
            </button>
          </div>
        )}
      </div>
    </>
  )
}
