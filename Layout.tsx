import { ReactNode, useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Compass, Music, CreditCard, Settings as SettingsIcon, LogOut, Mic2, Zap, Sparkles, TrendingUp } from 'lucide-react'
import { useAuth } from '../lib/auth-context'
import { supabase } from '../lib/supabase'
import NotificationBell from './NotificationBell'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { signOut, user } = useAuth()
  const [userCredits, setUserCredits] = useState(0)

  useEffect(() => {
    loadUserCredits()
  }, [user])

  const loadUserCredits = async () => {
    if (!user) return
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('total_credits')
        .eq('id', user.id)
        .maybeSingle()

      if (error) throw error
      setUserCredits(Number(data?.total_credits || 0))
    } catch (error) {
      console.error('Error loading credits:', error)
    }
  }

  const handleLogout = async () => {
    await signOut()
    navigate('/auth')
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-dark)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    }}>
      <div style={{
        position: 'fixed',
        top: '25%',
        right: '8%',
        fontSize: '150px',
        opacity: 0.05,
        pointerEvents: 'none',
        zIndex: 0,
        transform: 'rotate(-10deg)'
      }}>
        🎹
      </div>
      <div style={{
        position: 'fixed',
        bottom: '25%',
        left: '5%',
        fontSize: '130px',
        opacity: 0.05,
        pointerEvents: 'none',
        zIndex: 0,
        transform: 'rotate(15deg)'
      }}>
        🎵
      </div>
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '3%',
        fontSize: '120px',
        opacity: 0.04,
        pointerEvents: 'none',
        zIndex: 0,
        transform: 'rotate(-25deg)'
      }}>
        🎧
      </div>
      <div style={{
        position: 'fixed',
        top: '10%',
        left: '15%',
        fontSize: '90px',
        opacity: 0.03,
        pointerEvents: 'none',
        zIndex: 0,
        transform: 'rotate(20deg)'
      }}>
        🎺
      </div>
      <div style={{
        position: 'fixed',
        bottom: '15%',
        right: '10%',
        fontSize: '100px',
        opacity: 0.03,
        pointerEvents: 'none',
        zIndex: 0,
        transform: 'rotate(-15deg)'
      }}>
        🥁
      </div>

      <nav style={{
        background: 'var(--bg-card)',
        borderBottom: '1px solid var(--border)',
        padding: 'calc(var(--spacing) * 2) calc(var(--spacing) * 4)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'calc(var(--spacing) * 2)',
            cursor: 'pointer'
          }} onClick={() => navigate('/')}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'calc(var(--spacing) * 1)',
              padding: 'calc(var(--spacing) * 1)',
              background: 'rgba(255, 211, 0, 0.1)',
              borderRadius: '12px',
              border: '1px solid var(--yellow)'
            }}>
              <Mic2 size={20} color="#FFD300" strokeWidth={2.5} />
              <Zap size={16} color="#FFD300" strokeWidth={2.5} />
            </div>
            <h1 style={{
              fontSize: '22px',
              fontWeight: '800',
              color: '#ffffff',
              margin: 0
            }}>
              StarStage
            </h1>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'calc(var(--spacing) * 1)'
          }}>
            <NavButton
              icon={<Home size={20} />}
              label="Accueil"
              active={isActive('/')}
              onClick={() => navigate('/')}
            />
            <NavButton
              icon={<Compass size={20} />}
              label="Découvrir"
              active={isActive('/discover')}
              onClick={() => navigate('/discover')}
            />
            <NavButton
              icon={<Music size={20} />}
              label="Marketplace"
              active={isActive('/marketplace')}
              onClick={() => navigate('/marketplace')}
            />
            <NavButton
              icon={<CreditCard size={20} />}
              label="Premium"
              active={isActive('/premium')}
              onClick={() => navigate('/premium')}
            />
            <NavButton
              icon={<TrendingUp size={20} />}
              label="Artiste"
              active={isActive('/artist')}
              onClick={() => navigate('/artist')}
            />
            <NavButton
              icon={<SettingsIcon size={20} />}
              label="Paramètres"
              active={isActive('/settings')}
              onClick={() => navigate('/settings')}
            />
            <NotificationBell />
            <button
              onClick={() => navigate('/credits')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'calc(var(--spacing) * 1.5)',
                padding: 'calc(var(--spacing) * 2) calc(var(--spacing) * 3)',
                background: 'linear-gradient(135deg, var(--yellow) 0%, #ffed4e 100%)',
                border: 'none',
                borderRadius: '12px',
                color: '#000000',
                fontWeight: '700',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(255, 211, 0, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(255, 211, 0, 0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 211, 0, 0.3)'
              }}
            >
              <Sparkles size={18} />
              <span>{userCredits.toLocaleString()} Crédits</span>
            </button>
            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'calc(var(--spacing) * 1)',
                padding: 'calc(var(--spacing) * 2) calc(var(--spacing) * 3)',
                background: 'transparent',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                color: 'var(--text-secondary)',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--red)'
                e.currentTarget.style.color = 'var(--red)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.color = 'var(--text-secondary)'
              }}
            >
              <LogOut size={18} />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </nav>

      <main style={{ flex: 1 }}>
        {children}
      </main>

      <footer style={{
        background: 'var(--bg-card)',
        borderTop: '1px solid var(--border)',
        padding: 'calc(var(--spacing) * 6) calc(var(--spacing) * 4)',
        marginTop: 'calc(var(--spacing) * 8)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'calc(var(--spacing) * 6)'
        }}>
          <div>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#ffffff',
              marginBottom: 'calc(var(--spacing) * 3)'
            }}>
              À propos
            </h3>
            <p style={{
              fontSize: '14px',
              color: 'var(--text-secondary)',
              lineHeight: '1.6'
            }}>
              StarStage est la plateforme de streaming live pour artistes musicaux et fans passionnés.
            </p>
          </div>

          <div>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#ffffff',
              marginBottom: 'calc(var(--spacing) * 3)'
            }}>
              Légal
            </h3>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'calc(var(--spacing) * 2)'
            }}>
              <a href="/terms" style={{
                fontSize: '14px',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                transition: 'color 0.2s'
              }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--yellow)'}
                 onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>
                Conditions d'utilisation
              </a>
              <a href="/privacy" style={{
                fontSize: '14px',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                transition: 'color 0.2s'
              }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--yellow)'}
                 onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>
                Politique de confidentialité
              </a>
              <a href="/legal" style={{
                fontSize: '14px',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                transition: 'color 0.2s'
              }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--yellow)'}
                 onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>
                Mentions légales
              </a>
            </div>
          </div>

          <div>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#ffffff',
              marginBottom: 'calc(var(--spacing) * 3)'
            }}>
              Support
            </h3>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'calc(var(--spacing) * 2)'
            }}>
              <a href="mailto:support@starstage.com" style={{
                fontSize: '14px',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                transition: 'color 0.2s'
              }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--yellow)'}
                 onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>
                Contact
              </a>
              <a href="mailto:legal@starstage.com" style={{
                fontSize: '14px',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                transition: 'color 0.2s'
              }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--yellow)'}
                 onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>
                Questions légales
              </a>
            </div>
          </div>

          <div>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#ffffff',
              marginBottom: 'calc(var(--spacing) * 3)'
            }}>
              Plateforme
            </h3>
            <p style={{
              fontSize: '13px',
              color: 'var(--text-secondary)',
              lineHeight: '1.6'
            }}>
              Version 1.0.0<br />
              Réservé aux 18 ans et plus<br />
              Conforme RGPD
            </p>
          </div>
        </div>

        <div style={{
          maxWidth: '1400px',
          margin: 'calc(var(--spacing) * 6) auto 0',
          paddingTop: 'calc(var(--spacing) * 4)',
          borderTop: '1px solid var(--border)',
          textAlign: 'center'
        }}>
          <p style={{
            fontSize: '13px',
            color: 'var(--text-secondary)'
          }}>
            © {new Date().getFullYear()} StarStage. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  )
}

interface NavButtonProps {
  icon: ReactNode
  label: string
  active: boolean
  onClick: () => void
}

function NavButton({ icon, label, active, onClick }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'calc(var(--spacing) * 1)',
        padding: 'calc(var(--spacing) * 2) calc(var(--spacing) * 3)',
        background: active ? 'var(--yellow)' : 'transparent',
        border: '1px solid ' + (active ? 'var(--yellow)' : 'transparent'),
        borderRadius: '12px',
        color: active ? '#000000' : 'var(--text-secondary)',
        fontWeight: '600',
        fontSize: '14px',
        cursor: 'pointer',
        transition: 'all 0.2s'
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.background = 'rgba(255, 211, 0, 0.1)'
          e.currentTarget.style.color = 'var(--yellow)'
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.color = 'var(--text-secondary)'
        }
      }}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}
