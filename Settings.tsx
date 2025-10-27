import { useEffect, useState } from 'react'
import { Save, User, Crown, Coins, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth-context'

interface Profile {
  username: string
  display_name: string
  bio: string
  role: string
  is_premium: boolean
  total_credits: number
}

export default function Settings() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<Partial<Profile>>({
    username: '',
    display_name: '',
    bio: '',
    role: 'fan',
    is_premium: false,
    total_credits: 0
  })
  const [creditsToAdd, setCreditsToAdd] = useState('')

  useEffect(() => {
    loadProfile()
  }, [user])

  const loadProfile = async () => {
    if (!user) return

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()

    if (data) {
      setProfile(data)
    }
    setLoading(false)
  }

  const handleSave = async () => {
    if (!user) return

    if (!profile.username?.trim() || !profile.display_name?.trim()) {
      alert('Le nom d\'utilisateur et le nom d\'affichage sont requis')
      return
    }

    setSaving(true)

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: profile.username.trim().toLowerCase().replace(/[^a-z0-9_]/g, ''),
          display_name: profile.display_name.trim(),
          bio: profile.bio?.trim() || '',
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (error) throw error

      alert('Paramètres sauvegardés avec succès')
    } catch (error: any) {
      console.error('Error saving settings:', error)
      if (error.code === '23505') {
        alert('Ce nom d\'utilisateur est déjà pris')
      } else {
        alert('Erreur lors de la sauvegarde')
      }
    }

    setSaving(false)
  }

  if (loading) {
    return (
      <Layout>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px'
        }}>
          <p style={{ color: 'var(--text-secondary)' }}>Chargement...</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: 'calc(var(--spacing) * 6) calc(var(--spacing) * 4)'
      }}>
        <div style={{ marginBottom: 'calc(var(--spacing) * 6)' }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: '800',
            color: '#ffffff',
            marginBottom: 'calc(var(--spacing) * 1)',
            letterSpacing: '-0.5px'
          }}>
            Paramètres
          </h1>
          <p style={{
            fontSize: '18px',
            color: 'var(--text-secondary)',
            margin: 0
          }}>
            Gérez votre profil et vos préférences
          </p>
        </div>

        <div style={{
          background: 'var(--bg-card)',
          borderRadius: '24px',
          padding: 'calc(var(--spacing) * 5)',
          marginBottom: 'calc(var(--spacing) * 4)',
          border: '1px solid var(--border)'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '700',
            marginBottom: 'calc(var(--spacing) * 4)',
            display: 'flex',
            alignItems: 'center',
            gap: 'calc(var(--spacing) * 2)',
            color: '#ffffff'
          }}>
            <User size={24} color="var(--yellow)" />
            Profil artiste
          </h2>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'calc(var(--spacing) * 3)'
          }}>
            <div>
              <label style={{
                display: 'block',
                color: 'var(--text-primary)',
                fontWeight: '600',
                marginBottom: 'calc(var(--spacing) * 1.5)',
                fontSize: '14px'
              }}>
                Nom d'utilisateur *
              </label>
              <input
                type="text"
                value={profile.username}
                onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                placeholder="artiste123"
                maxLength={30}
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
              <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginTop: 'calc(var(--spacing) * 1)' }}>
                Lettres, chiffres et underscores uniquement
              </p>
            </div>

            <div>
              <label style={{
                display: 'block',
                color: 'var(--text-primary)',
                fontWeight: '600',
                marginBottom: 'calc(var(--spacing) * 1.5)',
                fontSize: '14px'
              }}>
                Nom d'affichage *
              </label>
              <input
                type="text"
                value={profile.display_name}
                onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
                placeholder="Mon nom de scène"
                maxLength={50}
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

            <div>
              <label style={{
                display: 'block',
                color: 'var(--text-primary)',
                fontWeight: '600',
                marginBottom: 'calc(var(--spacing) * 1.5)',
                fontSize: '14px'
              }}>
                Rôle
              </label>
              <select
                value={profile.role}
                onChange={(e) => setProfile({ ...profile, role: e.target.value })}
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

            <div>
              <label style={{
                display: 'block',
                color: 'var(--text-primary)',
                fontWeight: '600',
                marginBottom: 'calc(var(--spacing) * 1.5)',
                fontSize: '14px'
              }}>
                Biographie
              </label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                placeholder="Parlez-nous de vous et de votre musique..."
                maxLength={300}
                rows={4}
                style={{
                  width: '100%',
                  padding: 'calc(var(--spacing) * 2.5)',
                  background: 'var(--bg-dark)',
                  border: '2px solid var(--border)',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '16px',
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--yellow)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
          </div>
        </div>

        <div style={{
          background: 'var(--bg-card)',
          borderRadius: '24px',
          padding: 'calc(var(--spacing) * 5)',
          marginBottom: 'calc(var(--spacing) * 4)',
          border: '1px solid var(--border)'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '700',
            marginBottom: 'calc(var(--spacing) * 4)',
            display: 'flex',
            alignItems: 'center',
            gap: 'calc(var(--spacing) * 2)',
            color: '#ffffff'
          }}>
            <Crown size={24} color="var(--yellow)" />
            Mode Test - Gestion compte
          </h2>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'calc(var(--spacing) * 3)'
          }}>
            <div style={{
              padding: 'calc(var(--spacing) * 3)',
              background: 'rgba(255, 211, 0, 0.1)',
              borderRadius: '12px',
              border: '1px solid var(--yellow)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'calc(var(--spacing) * 2)'
              }}>
                <span style={{ color: '#ffffff', fontWeight: '600' }}>Statut Premium</span>
                <span style={{
                  color: profile.is_premium ? 'var(--green)' : 'var(--text-secondary)',
                  fontWeight: '700'
                }}>
                  {profile.is_premium ? '✓ Actif' : 'Inactif'}
                </span>
              </div>
              <button
                onClick={async () => {
                  if (!user) return
                  const newStatus = !profile.is_premium
                  await supabase
                    .from('profiles')
                    .update({ is_premium: newStatus })
                    .eq('id', user.id)
                  setProfile({ ...profile, is_premium: newStatus })
                  alert(newStatus ? '✓ Premium activé!' : 'Premium désactivé')
                }}
                style={{
                  width: '100%',
                  padding: 'calc(var(--spacing) * 2)',
                  background: profile.is_premium ? 'var(--red)' : 'var(--yellow)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#000000',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                {profile.is_premium ? 'Désactiver Premium' : 'Activer Premium'}
              </button>
            </div>

            <div style={{
              padding: 'calc(var(--spacing) * 3)',
              background: 'rgba(255, 211, 0, 0.1)',
              borderRadius: '12px',
              border: '1px solid var(--yellow)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'calc(var(--spacing) * 2)'
              }}>
                <span style={{ color: '#ffffff', fontWeight: '600' }}>Crédits actuels</span>
                <span style={{ color: 'var(--yellow)', fontWeight: '700', fontSize: '18px' }}>
                  {Number(profile.total_credits || 0).toLocaleString()}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 'calc(var(--spacing) * 2)' }}>
                <input
                  type="number"
                  value={creditsToAdd}
                  onChange={(e) => setCreditsToAdd(e.target.value)}
                  placeholder="Nombre de crédits"
                  style={{
                    flex: 1,
                    padding: 'calc(var(--spacing) * 2)',
                    background: 'var(--bg-dark)',
                    border: '2px solid var(--border)',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={async () => {
                    if (!user || !creditsToAdd) return
                    const amount = parseInt(creditsToAdd)
                    if (isNaN(amount) || amount <= 0) {
                      alert('Entrez un nombre valide')
                      return
                    }
                    const newTotal = Number(profile.total_credits || 0) + amount
                    await supabase
                      .from('profiles')
                      .update({ total_credits: newTotal })
                      .eq('id', user.id)
                    setProfile({ ...profile, total_credits: newTotal })
                    setCreditsToAdd('')
                    alert(`✓ ${amount} crédits ajoutés!`)
                  }}
                  style={{
                    padding: 'calc(var(--spacing) * 2) calc(var(--spacing) * 3)',
                    background: 'var(--yellow)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#000000',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'calc(var(--spacing) * 1)'
                  }}
                >
                  <Coins size={16} />
                  Ajouter
                </button>
              </div>
            </div>

            <div style={{
              padding: 'calc(var(--spacing) * 2)',
              background: 'rgba(100, 100, 100, 0.2)',
              borderRadius: '8px',
              fontSize: '13px',
              color: 'var(--text-secondary)',
              textAlign: 'center'
            }}>
              Mode test - Ces actions sont instantanées et ne nécessitent pas de paiement
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            width: '100%',
            padding: 'calc(var(--spacing) * 3.5)',
            background: 'var(--yellow)',
            border: 'none',
            borderRadius: '16px',
            color: '#000000',
            fontSize: '18px',
            fontWeight: '700',
            cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.6 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'calc(var(--spacing) * 2)',
            transition: 'all 0.2s',
            boxShadow: '0 8px 24px var(--yellow-glow)',
            marginBottom: 'calc(var(--spacing) * 3)'
          }}
          onMouseEnter={(e) => {
            if (!saving) {
              e.currentTarget.style.transform = 'translateY(-3px)'
              e.currentTarget.style.boxShadow = '0 12px 36px var(--yellow-glow)'
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 8px 24px var(--yellow-glow)'
          }}
        >
          <Save size={20} />
          {saving ? 'Sauvegarde...' : 'Sauvegarder les paramètres'}
        </button>

        <button
          onClick={async () => {
            await signOut()
            navigate('/auth')
          }}
          style={{
            width: '100%',
            padding: 'calc(var(--spacing) * 3.5)',
            background: 'transparent',
            border: '2px solid var(--red)',
            borderRadius: '16px',
            color: 'var(--red)',
            fontSize: '18px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'calc(var(--spacing) * 2)',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--red)'
            e.currentTarget.style.color = '#ffffff'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = 'var(--red)'
          }}
        >
          <LogOut size={20} />
          Se déconnecter
        </button>
      </div>
    </Layout>
  )
}
