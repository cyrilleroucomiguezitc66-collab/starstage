import { useState } from 'react'
import { useAuth } from '../lib/auth-context'
import { Mic2, Zap } from 'lucide-react'

type UserRole = 'singer' | 'guitarist' | 'drummer' | 'dj' | 'beatmaker' | 'fan'

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [role, setRole] = useState<UserRole>('fan')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signIn, signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (isLogin) {
      const { error } = await signIn(email, password)
      if (error) {
        setError(error.message)
      }
    } else {
      if (!username || !displayName) {
        setError('Veuillez remplir tous les champs')
        setLoading(false)
        return
      }

      const { error } = await signUp({
        email,
        password,
        username,
        displayName,
        role
      })

      if (error) {
        setError(error.message)
      }
    }

    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'calc(var(--spacing) * 2)',
      background: 'var(--bg-dark)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '10%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, var(--yellow-glow) 0%, transparent 70%)',
        filter: 'blur(80px)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '15%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, var(--yellow-glow) 0%, transparent 70%)',
        filter: 'blur(100px)',
        pointerEvents: 'none'
      }} />

      <div style={{
        position: 'absolute',
        top: '10%',
        right: '5%',
        fontSize: '120px',
        opacity: 0.06,
        pointerEvents: 'none',
        transform: 'rotate(15deg)'
      }}>
        🎸
      </div>
      <div style={{
        position: 'absolute',
        bottom: '15%',
        left: '5%',
        fontSize: '100px',
        opacity: 0.06,
        pointerEvents: 'none',
        transform: 'rotate(-20deg)'
      }}>
        🎤
      </div>
      <div style={{
        position: 'absolute',
        top: '40%',
        left: '3%',
        fontSize: '100px',
        opacity: 0.05,
        pointerEvents: 'none',
        transform: 'rotate(-15deg)'
      }}>
        🎹
      </div>
      <div style={{
        position: 'absolute',
        bottom: '30%',
        right: '8%',
        fontSize: '90px',
        opacity: 0.05,
        pointerEvents: 'none',
        transform: 'rotate(10deg)'
      }}>
        🎵
      </div>
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '10%',
        fontSize: '70px',
        opacity: 0.04,
        pointerEvents: 'none',
        transform: 'rotate(25deg)'
      }}>
        🎧
      </div>
      <div style={{
        position: 'absolute',
        bottom: '40%',
        right: '3%',
        fontSize: '80px',
        opacity: 0.04,
        pointerEvents: 'none',
        transform: 'rotate(-30deg)'
      }}>
        🎺
      </div>

      <div style={{ width: '100%', maxWidth: '480px', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 'calc(var(--spacing) * 5)' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'calc(var(--spacing) * 1)',
            marginBottom: 'calc(var(--spacing) * 3)',
            padding: 'calc(var(--spacing) * 2)',
            background: 'rgba(255, 211, 0, 0.1)',
            borderRadius: '50%',
            border: '2px solid var(--yellow)'
          }}>
            <Mic2 size={32} color="#FFD300" strokeWidth={2.5} />
            <Zap size={28} color="#FFD300" strokeWidth={2.5} />
          </div>
          <h1 style={{
            fontSize: '42px',
            fontWeight: '800',
            color: '#ffffff',
            marginBottom: 'calc(var(--spacing) * 2)',
            letterSpacing: '-0.5px'
          }}>
            StarStage
          </h1>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '16px',
            fontWeight: '500'
          }}>
            La scène mondiale des artistes en direct
          </p>
        </div>

        <div style={{
          background: 'var(--bg-card)',
          borderRadius: '24px',
          padding: 'calc(var(--spacing) * 5)',
          border: '1px solid var(--border)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
        }}>
          <div style={{
            display: 'flex',
            gap: 'calc(var(--spacing) * 2)',
            marginBottom: 'calc(var(--spacing) * 4)',
            background: 'var(--bg-dark)',
            padding: 'calc(var(--spacing) * 1)',
            borderRadius: '16px'
          }}>
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              style={{
                flex: 1,
                padding: 'calc(var(--spacing) * 2)',
                backgroundColor: isLogin ? 'var(--yellow)' : 'transparent',
                color: isLogin ? '#000000' : 'var(--text-secondary)',
                borderRadius: '12px',
                fontWeight: '700',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontSize: '15px'
              }}
            >
              Connexion
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              style={{
                flex: 1,
                padding: 'calc(var(--spacing) * 2)',
                backgroundColor: !isLogin ? 'var(--yellow)' : 'transparent',
                color: !isLogin ? '#000000' : 'var(--text-secondary)',
                borderRadius: '12px',
                fontWeight: '700',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontSize: '15px'
              }}
            >
              Inscription
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div style={{ marginBottom: 'calc(var(--spacing) * 3)' }}>
                  <label style={{
                    display: 'block',
                    color: 'var(--text-primary)',
                    fontWeight: '600',
                    marginBottom: 'calc(var(--spacing) * 1.5)',
                    fontSize: '14px'
                  }}>Nom d'utilisateur</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="johndoe"
                    style={{
                      width: '100%',
                      padding: 'calc(var(--spacing) * 2.5)',
                      background: 'var(--bg-dark)',
                      border: '2px solid var(--border)',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--yellow)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                  />
                </div>

                <div style={{ marginBottom: 'calc(var(--spacing) * 3)' }}>
                  <label style={{
                    display: 'block',
                    color: 'var(--text-primary)',
                    fontWeight: '600',
                    marginBottom: 'calc(var(--spacing) * 1.5)',
                    fontSize: '14px'
                  }}>Nom d'affichage</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                    placeholder="John Doe"
                    style={{
                      width: '100%',
                      padding: 'calc(var(--spacing) * 2.5)',
                      background: 'var(--bg-dark)',
                      border: '2px solid var(--border)',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--yellow)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                  />
                </div>

                <div style={{ marginBottom: 'calc(var(--spacing) * 3)' }}>
                  <label style={{
                    display: 'block',
                    color: 'var(--text-primary)',
                    fontWeight: '600',
                    marginBottom: 'calc(var(--spacing) * 1.5)',
                    fontSize: '14px'
                  }}>Je suis un(e)</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    style={{
                      width: '100%',
                      padding: 'calc(var(--spacing) * 2.5)',
                      background: 'var(--bg-dark)',
                      border: '2px solid var(--border)',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '16px',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--yellow)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                  >
                    <option value="fan">Fan / Spectateur</option>
                    <option value="singer">Chanteur(se)</option>
                    <option value="guitarist">Guitariste</option>
                    <option value="drummer">Batteur(euse)</option>
                    <option value="dj">DJ / Producteur</option>
                    <option value="beatmaker">Beatmaker</option>
                  </select>
                </div>
              </>
            )}

            <div style={{ marginBottom: 'calc(var(--spacing) * 3)' }}>
              <label style={{
                display: 'block',
                color: 'var(--text-primary)',
                fontWeight: '600',
                marginBottom: 'calc(var(--spacing) * 1.5)',
                fontSize: '14px'
              }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="votre@email.com"
                style={{
                  width: '100%',
                  padding: 'calc(var(--spacing) * 2.5)',
                  background: 'var(--bg-dark)',
                  border: '2px solid var(--border)',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--yellow)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            <div style={{ marginBottom: 'calc(var(--spacing) * 4)' }}>
              <label style={{
                display: 'block',
                color: 'var(--text-primary)',
                fontWeight: '600',
                marginBottom: 'calc(var(--spacing) * 1.5)',
                fontSize: '14px'
              }}>Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                minLength={6}
                style={{
                  width: '100%',
                  padding: 'calc(var(--spacing) * 2.5)',
                  background: 'var(--bg-dark)',
                  border: '2px solid var(--border)',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--yellow)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            {error && (
              <div style={{
                padding: 'calc(var(--spacing) * 2.5)',
                backgroundColor: 'rgba(255, 68, 68, 0.1)',
                border: '2px solid var(--red)',
                borderRadius: '12px',
                color: 'var(--red)',
                marginBottom: 'calc(var(--spacing) * 3)',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: 'calc(var(--spacing) * 3)',
                background: 'var(--yellow)',
                border: 'none',
                borderRadius: '12px',
                color: '#000000',
                fontSize: '16px',
                fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                transition: 'all 0.2s',
                boxShadow: '0 4px 20px var(--yellow-glow)'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 6px 30px var(--yellow-glow)'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 20px var(--yellow-glow)'
              }}
            >
              {loading ? 'Chargement...' : (isLogin ? 'Se connecter' : "Créer mon compte")}
            </button>
          </form>
        </div>

        <p style={{
          textAlign: 'center',
          marginTop: 'calc(var(--spacing) * 4)',
          color: 'var(--text-secondary)',
          fontSize: '14px'
        }}>
          {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}
          {' '}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin)
              setError('')
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--yellow)',
              textDecoration: 'underline',
              cursor: 'pointer',
              padding: 0,
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            {isLogin ? "S'inscrire" : "Se connecter"}
          </button>
        </p>
      </div>
    </div>
  )
}
