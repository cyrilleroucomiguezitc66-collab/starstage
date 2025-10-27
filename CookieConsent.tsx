import { useState, useEffect } from 'react'
import { Cookie, X, Settings } from 'lucide-react'

export default function CookieConsent() {
  const [show, setShow] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: false,
    marketing: false
  })

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      setShow(true)
    }
  }, [])

  const acceptAll = () => {
    const allAccepted = { essential: true, analytics: true, marketing: true }
    localStorage.setItem('cookie-consent', JSON.stringify(allAccepted))
    setShow(false)
  }

  const acceptSelected = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(preferences))
    setShow(false)
  }

  const rejectAll = () => {
    const rejected = { essential: true, analytics: false, marketing: false }
    localStorage.setItem('cookie-consent', JSON.stringify(rejected))
    setShow(false)
  }

  if (!show) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 9999,
      background: 'rgba(10, 10, 10, 0.98)',
      backdropFilter: 'blur(10px)',
      borderTop: '2px solid var(--border)',
      padding: 'calc(var(--spacing) * 4)',
      boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.5)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {!showSettings ? (
          <>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 'calc(var(--spacing) * 3)',
              marginBottom: 'calc(var(--spacing) * 3)'
            }}>
              <Cookie size={32} color="var(--yellow)" style={{ flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#ffffff',
                  marginBottom: 'calc(var(--spacing) * 2)'
                }}>
                  Nous utilisons des cookies
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.6',
                  marginBottom: 'calc(var(--spacing) * 2)'
                }}>
                  Nous utilisons des cookies pour améliorer votre expérience, analyser notre trafic et personnaliser le contenu.
                  Certains cookies sont essentiels au fonctionnement du site, d'autres nécessitent votre consentement.
                  Vous pouvez gérer vos préférences à tout moment.
                </p>
                <p style={{
                  fontSize: '13px',
                  color: 'var(--text-secondary)'
                }}>
                  Pour plus d'informations, consultez notre{' '}
                  <a href="/privacy" style={{ color: 'var(--yellow)', textDecoration: 'underline' }}>
                    Politique de Confidentialité
                  </a>
                  {' '}et nos{' '}
                  <a href="/legal" style={{ color: 'var(--yellow)', textDecoration: 'underline' }}>
                    Mentions Légales
                  </a>
                </p>
              </div>
              <button
                onClick={rejectAll}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: 'calc(var(--spacing) * 1)'
                }}
                aria-label="Fermer"
              >
                <X size={24} />
              </button>
            </div>

            <div style={{
              display: 'flex',
              gap: 'calc(var(--spacing) * 2)',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={acceptAll}
                style={{
                  flex: '1',
                  minWidth: '200px',
                  padding: 'calc(var(--spacing) * 2.5)',
                  background: 'var(--yellow)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#000000',
                  fontSize: '15px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Tout accepter
              </button>
              <button
                onClick={() => setShowSettings(true)}
                style={{
                  flex: '1',
                  minWidth: '200px',
                  padding: 'calc(var(--spacing) * 2.5)',
                  background: 'var(--bg-card)',
                  border: '2px solid var(--border)',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '15px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'calc(var(--spacing) * 1)',
                  transition: 'border-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--yellow)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <Settings size={18} />
                Personnaliser
              </button>
              <button
                onClick={rejectAll}
                style={{
                  flex: '1',
                  minWidth: '200px',
                  padding: 'calc(var(--spacing) * 2.5)',
                  background: 'transparent',
                  border: '2px solid var(--border)',
                  borderRadius: '12px',
                  color: 'var(--text-secondary)',
                  fontSize: '15px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
              >
                Tout refuser
              </button>
            </div>
          </>
        ) : (
          <>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#ffffff',
              marginBottom: 'calc(var(--spacing) * 4)'
            }}>
              Paramètres des cookies
            </h3>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'calc(var(--spacing) * 3)',
              marginBottom: 'calc(var(--spacing) * 4)'
            }}>
              <CookieOption
                title="Cookies essentiels"
                description="Nécessaires au fonctionnement du site (authentification, sécurité). Ces cookies ne peuvent pas être désactivés."
                checked={true}
                disabled={true}
                onChange={() => {}}
              />
              <CookieOption
                title="Cookies analytiques"
                description="Nous aident à comprendre comment les visiteurs utilisent le site pour l'améliorer."
                checked={preferences.analytics}
                onChange={(checked) => setPreferences({ ...preferences, analytics: checked })}
              />
              <CookieOption
                title="Cookies marketing"
                description="Utilisés pour personnaliser les publicités et mesurer leur efficacité."
                checked={preferences.marketing}
                onChange={(checked) => setPreferences({ ...preferences, marketing: checked })}
              />
            </div>

            <div style={{
              display: 'flex',
              gap: 'calc(var(--spacing) * 2)',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={acceptSelected}
                style={{
                  flex: '1',
                  minWidth: '200px',
                  padding: 'calc(var(--spacing) * 2.5)',
                  background: 'var(--yellow)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#000000',
                  fontSize: '15px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Confirmer mes choix
              </button>
              <button
                onClick={() => setShowSettings(false)}
                style={{
                  flex: '1',
                  minWidth: '200px',
                  padding: 'calc(var(--spacing) * 2.5)',
                  background: 'transparent',
                  border: '2px solid var(--border)',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '15px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Retour
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function CookieOption({
  title,
  description,
  checked,
  disabled = false,
  onChange
}: {
  title: string
  description: string
  checked: boolean
  disabled?: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <div style={{
      padding: 'calc(var(--spacing) * 3)',
      background: 'var(--bg-card)',
      borderRadius: '12px',
      border: '1px solid var(--border)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 'calc(var(--spacing) * 3)'
      }}>
        <div style={{ flex: 1 }}>
          <h4 style={{
            fontSize: '16px',
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: 'calc(var(--spacing) * 1)'
          }}>
            {title}
          </h4>
          <p style={{
            fontSize: '13px',
            color: 'var(--text-secondary)',
            lineHeight: '1.5'
          }}>
            {description}
          </p>
        </div>
        <label style={{
          position: 'relative',
          display: 'inline-block',
          width: '52px',
          height: '28px',
          cursor: disabled ? 'not-allowed' : 'pointer'
        }}>
          <input
            type="checkbox"
            checked={checked}
            disabled={disabled}
            onChange={(e) => onChange(e.target.checked)}
            style={{
              opacity: 0,
              width: 0,
              height: 0
            }}
          />
          <span style={{
            position: 'absolute',
            cursor: disabled ? 'not-allowed' : 'pointer',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: checked ? 'var(--yellow)' : 'var(--border)',
            borderRadius: '28px',
            transition: '0.3s',
            opacity: disabled ? 0.5 : 1
          }}>
            <span style={{
              position: 'absolute',
              content: '',
              height: '20px',
              width: '20px',
              left: checked ? '28px' : '4px',
              bottom: '4px',
              background: '#000000',
              borderRadius: '50%',
              transition: '0.3s'
            }} />
          </span>
        </label>
      </div>
    </div>
  )
}
