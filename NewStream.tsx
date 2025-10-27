import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Radio } from 'lucide-react'
import Layout from '../components/Layout'
import { useAuth } from '../lib/auth-context'
import { supabase } from '../lib/supabase'

export default function NewStream() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [musicalStyle, setMusicalStyle] = useState('')
  const [karaokeMode, setKaraokeMode] = useState(false)
  const [vocalReduction, setVocalReduction] = useState(0)
  const [pitchAdjustment, setPitchAdjustment] = useState(0)
  const [audioUrl, setAudioUrl] = useState('')
  const [loading, setLoading] = useState(false)

  const handleStartStream = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      alert('Veuillez entrer un titre pour votre session')
      return
    }

    setLoading(true)

    try {
      const { data: session, error } = await supabase
        .from('live_sessions')
        .insert({
          host_id: user?.id,
          title: title.trim(),
          description: description.trim(),
          musical_style: musicalStyle.trim(),
          is_active: true,
          viewer_count: 0,
          started_at: new Date().toISOString(),
          karaoke_mode: karaokeMode,
          vocal_reduction: karaokeMode ? vocalReduction : 0,
          pitch_adjustment: karaokeMode ? pitchAdjustment : 0,
          audio_url: karaokeMode && audioUrl ? audioUrl : null
        })
        .select()
        .maybeSingle()

      if (error) throw error

      navigate(`/stream/${session!.id}`)
    } catch (error) {
      console.error('Error creating session:', error)
      alert('Erreur lors de la création de la session')
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div style={{
        maxWidth: '700px',
        margin: '0 auto',
        padding: 'calc(var(--spacing) * 6) calc(var(--spacing) * 4)'
      }}>
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: '24px',
          padding: 'calc(var(--spacing) * 6)',
          border: '1px solid var(--border)'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: 'calc(var(--spacing) * 5)'
          }}>
            <Radio size={64} color="var(--yellow)" strokeWidth={1.5} style={{ marginBottom: 'calc(var(--spacing) * 3)' }} />
            <h1 style={{
              fontSize: '32px',
              fontWeight: '800',
              color: '#ffffff',
              marginBottom: 'calc(var(--spacing) * 2)'
            }}>
              Nouveau Live
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
              Configurez votre session avant de démarrer
            </p>
          </div>

          <form onSubmit={handleStartStream}>
            <div style={{ marginBottom: 'calc(var(--spacing) * 3)' }}>
              <label style={{
                display: 'block',
                color: 'var(--text-primary)',
                fontWeight: '600',
                marginBottom: 'calc(var(--spacing) * 1.5)',
                fontSize: '14px'
              }}>
                Titre de la session *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Jam session acoustique"
                maxLength={100}
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
              <div style={{
                textAlign: 'right',
                color: 'var(--text-secondary)',
                fontSize: '12px',
                marginTop: 'calc(var(--spacing) * 1)'
              }}>
                {title.length}/100
              </div>
            </div>

            <div style={{ marginBottom: 'calc(var(--spacing) * 3)' }}>
              <label style={{
                display: 'block',
                color: 'var(--text-primary)',
                fontWeight: '600',
                marginBottom: 'calc(var(--spacing) * 1.5)',
                fontSize: '14px'
              }}>
                Style musical
              </label>
              <input
                type="text"
                value={musicalStyle}
                onChange={(e) => setMusicalStyle(e.target.value)}
                placeholder="Ex: Jazz, Rock, Hip-Hop..."
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

            <div style={{ marginBottom: 'calc(var(--spacing) * 4)' }}>
              <label style={{
                display: 'block',
                color: 'var(--text-primary)',
                fontWeight: '600',
                marginBottom: 'calc(var(--spacing) * 1.5)',
                fontSize: '14px'
              }}>
                Description (optionnel)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Décrivez votre session..."
                maxLength={500}
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
              <div style={{
                textAlign: 'right',
                color: 'var(--text-secondary)',
                fontSize: '12px',
                marginTop: 'calc(var(--spacing) * 1)'
              }}>
                {description.length}/500
              </div>
            </div>

            <div style={{ marginBottom: 'calc(var(--spacing) * 3)' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'calc(var(--spacing) * 2.5)',
                background: 'var(--bg-dark)',
                border: '2px solid var(--border)',
                borderRadius: '12px',
                cursor: 'pointer'
              }}
              onClick={() => setKaraokeMode(!karaokeMode)}>
                <div>
                  <label style={{
                    color: 'var(--text-primary)',
                    fontWeight: '600',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}>
                    Mode Karaoké 🎤
                  </label>
                  <p style={{
                    color: 'var(--text-secondary)',
                    fontSize: '12px',
                    margin: '4px 0 0 0'
                  }}>
                    Afficher les paroles en temps réel
                  </p>
                </div>
                <div style={{
                  width: '48px',
                  height: '28px',
                  background: karaokeMode ? 'var(--yellow)' : 'var(--border)',
                  borderRadius: '14px',
                  position: 'relative',
                  transition: 'background 0.2s'
                }}>
                  <div style={{
                    width: '22px',
                    height: '22px',
                    background: '#ffffff',
                    borderRadius: '50%',
                    position: 'absolute',
                    top: '3px',
                    left: karaokeMode ? '23px' : '3px',
                    transition: 'left 0.2s'
                  }} />
                </div>
              </div>

              {karaokeMode && (
                <div style={{
                  marginTop: 'calc(var(--spacing) * 2)',
                  padding: 'calc(var(--spacing) * 3)',
                  background: 'rgba(255, 211, 0, 0.05)',
                  border: '1px solid rgba(255, 211, 0, 0.2)',
                  borderRadius: '12px'
                }}>
                  <div style={{ marginBottom: 'calc(var(--spacing) * 3)' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 'calc(var(--spacing) * 1.5)'
                    }}>
                      <label style={{
                        color: 'var(--text-primary)',
                        fontWeight: '600',
                        fontSize: '14px'
                      }}>
                        Réduction vocale
                      </label>
                      <span style={{
                        color: 'var(--yellow)',
                        fontWeight: '600',
                        fontSize: '14px'
                      }}>
                        {vocalReduction}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={vocalReduction}
                      onChange={(e) => setVocalReduction(Number(e.target.value))}
                      style={{
                        width: '100%',
                        height: '6px',
                        borderRadius: '3px',
                        background: 'var(--border)',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    />
                  </div>

                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 'calc(var(--spacing) * 1.5)'
                    }}>
                      <label style={{
                        color: 'var(--text-primary)',
                        fontWeight: '600',
                        fontSize: '14px'
                      }}>
                        Ajustement de tonalité
                      </label>
                      <span style={{
                        color: 'var(--yellow)',
                        fontWeight: '600',
                        fontSize: '14px'
                      }}>
                        {pitchAdjustment > 0 ? '+' : ''}{pitchAdjustment}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="-12"
                      max="12"
                      value={pitchAdjustment}
                      onChange={(e) => setPitchAdjustment(Number(e.target.value))}
                      style={{
                        width: '100%',
                        height: '6px',
                        borderRadius: '3px',
                        background: 'var(--border)',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    />
                  </div>

                  <div style={{ marginTop: 'calc(var(--spacing) * 3)' }}>
                    <label style={{
                      display: 'block',
                      color: 'var(--text-primary)',
                      fontWeight: '600',
                      fontSize: '14px',
                      marginBottom: 'calc(var(--spacing) * 1.5)'
                    }}>
                      Lien de la musique karaoké 🎵
                    </label>
                    <input
                      type="url"
                      value={audioUrl}
                      onChange={(e) => setAudioUrl(e.target.value)}
                      placeholder="https://youtube.com/watch?v=... ou lien direct MP3"
                      style={{
                        width: '100%',
                        padding: 'calc(var(--spacing) * 2)',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        color: 'var(--text-primary)',
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--yellow)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                    />
                    <p style={{
                      color: 'var(--text-secondary)',
                      fontSize: '11px',
                      marginTop: 'calc(var(--spacing) * 1)',
                      lineHeight: '1.4'
                    }}>
                      Accepte: YouTube, MP3, WAV, ou tout lien audio direct
                    </p>
                  </div>

                  <p style={{
                    color: 'var(--text-secondary)',
                    fontSize: '12px',
                    marginTop: 'calc(var(--spacing) * 2)',
                    lineHeight: '1.5'
                  }}>
                    💡 Vous pourrez ajouter les paroles une fois le stream démarré
                  </p>
                </div>
              )}
            </div>

            <div style={{
              background: 'rgba(255, 211, 0, 0.1)',
              border: '1px solid rgba(255, 211, 0, 0.3)',
              borderRadius: '12px',
              padding: 'calc(var(--spacing) * 2.5)',
              marginBottom: 'calc(var(--spacing) * 4)'
            }}>
              <p style={{ color: 'var(--yellow)', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                Assurez-vous que votre micro et webcam sont connectés. Vous pourrez inviter d'autres musiciens à vous rejoindre une fois la session démarrée.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !title.trim()}
              style={{
                width: '100%',
                padding: 'calc(var(--spacing) * 3.5)',
                background: title.trim() ? 'var(--yellow)' : 'var(--bg-dark)',
                border: 'none',
                borderRadius: '16px',
                color: title.trim() ? '#000000' : 'var(--text-secondary)',
                fontSize: '18px',
                fontWeight: '700',
                cursor: title.trim() && !loading ? 'pointer' : 'not-allowed',
                opacity: loading ? 0.6 : 1,
                transition: 'all 0.2s',
                boxShadow: title.trim() ? '0 8px 24px var(--yellow-glow)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (title.trim() && !loading) {
                  e.currentTarget.style.transform = 'translateY(-3px)'
                  e.currentTarget.style.boxShadow = '0 12px 36px var(--yellow-glow)'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = title.trim() ? '0 8px 24px var(--yellow-glow)' : 'none'
              }}
            >
              {loading ? 'Démarrage...' : 'Démarrer le live'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  )
}
