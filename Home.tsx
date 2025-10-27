import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Radio, Play, Eye, Clock } from 'lucide-react'
import Layout from '../components/Layout'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth-context'

interface LiveSession {
  id: string
  title: string
  description: string
  musical_style: string
  viewer_count: number
  started_at: string
  thumbnail_url: string | null
  host: {
    username: string
    display_name: string
    avatar_url: string | null
  }
}

interface Profile {
  username: string
  display_name: string
  role: string
}

export default function Home() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [user])

  const loadData = async () => {
    if (!user) return

    const { data: profileData } = await supabase
      .from('profiles')
      .select('username, display_name, role')
      .eq('id', user.id)
      .maybeSingle()

    if (profileData) {
      setProfile(profileData)
    }

    const { data: sessions } = await supabase
      .from('live_sessions')
      .select(`
        id,
        title,
        description,
        musical_style,
        viewer_count,
        started_at,
        thumbnail_url,
        host:profiles!live_sessions_host_id_fkey (
          username,
          display_name,
          avatar_url
        )
      `)
      .eq('is_active', true)
      .order('viewer_count', { ascending: false })
      .limit(12)

    const demoSessions = generateDemoSessions()
    const allSessions = [...demoSessions, ...(sessions || [])]

    setLiveSessions(allSessions as unknown as LiveSession[])
    setLoading(false)
  }

  const generateDemoSessions = () => {
    const sessions = [
      {
        title: '🎸 Rock Session Live',
        style: 'Rock',
        name: 'Luna',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        thumbnail: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800',
        viewers: 234
      },
      {
        title: '🎹 Jazz Piano Night',
        style: 'Jazz',
        name: 'Max',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        thumbnail: 'https://images.pexels.com/photos/164821/pexels-photo-164821.jpeg?auto=compress&cs=tinysrgb&w=800',
        viewers: 189
      },
      {
        title: '🎤 Hip-Hop Freestyle',
        style: 'Hip-Hop',
        name: 'Sophie',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        thumbnail: 'https://images.pexels.com/photos/976866/pexels-photo-976866.jpeg?auto=compress&cs=tinysrgb&w=800',
        viewers: 456
      },
      {
        title: '🎧 Electronic Beats',
        style: 'Electronic',
        name: 'Alex',
        avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        thumbnail: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800',
        viewers: 312
      },
      {
        title: '🎵 Pop Covers Live',
        style: 'Pop',
        name: 'Emma',
        avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        thumbnail: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800',
        viewers: 567
      },
      {
        title: '🌴 Reggae Vibes',
        style: 'Reggae',
        name: 'Lucas',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        thumbnail: 'https://images.pexels.com/photos/995301/pexels-photo-995301.jpeg?auto=compress&cs=tinysrgb&w=800',
        viewers: 178
      },
      {
        title: '🎸 Blues Guitar Solo',
        style: 'Blues',
        name: 'Mia',
        avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        thumbnail: 'https://images.pexels.com/photos/1751731/pexels-photo-1751731.jpeg?auto=compress&cs=tinysrgb&w=800',
        viewers: 145
      },
      {
        title: '🎤 R&B Soul Session',
        style: 'R&B',
        name: 'Noah',
        avatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        thumbnail: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=800',
        viewers: 289
      }
    ]

    return sessions.map((s, i) => ({
      id: `demo-${i}`,
      title: s.title,
      description: 'Session privée',
      musical_style: s.style,
      viewer_count: s.viewers,
      started_at: new Date(Date.now() - Math.random() * 60 * 60000).toISOString(),
      thumbnail_url: s.thumbnail,
      is_private: true,
      host: {
        username: s.name.toLowerCase(),
        display_name: s.name,
        avatar_url: s.avatar
      }
    }))
  }

  const getTimeAgo = (timestamp: string) => {
    const now = new Date()
    const start = new Date(timestamp)
    const diffMs = now.getTime() - start.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 60) return `${diffMins}m`
    const diffHours = Math.floor(diffMins / 60)
    return `${diffHours}h`
  }

  return (
    <Layout>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: 'calc(var(--spacing) * 6) calc(var(--spacing) * 4)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'calc(var(--spacing) * 6)'
        }}>
          <div>
            <h1 style={{
              fontSize: '36px',
              fontWeight: '800',
              color: '#ffffff',
              marginBottom: 'calc(var(--spacing) * 1)',
              letterSpacing: '-0.5px'
            }}>
              Bienvenue {profile?.display_name || 'Artiste'} 🎵
            </h1>
            <p style={{
              fontSize: '18px',
              color: 'var(--text-secondary)',
              margin: 0
            }}>
              Découvrez les meilleurs lives en cours
            </p>
          </div>

          {profile?.role !== 'fan' && (
            <button
              onClick={() => navigate('/stream/new')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'calc(var(--spacing) * 2)',
                padding: 'calc(var(--spacing) * 3) calc(var(--spacing) * 5)',
                background: 'var(--yellow)',
                border: 'none',
                borderRadius: '16px',
                color: '#000000',
                fontSize: '18px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 8px 24px var(--yellow-glow)'
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
              <Radio size={24} />
              <span>Démarrer un Live</span>
            </button>
          )}
        </div>

        {loading ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px'
          }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
              Chargement des lives...
            </p>
          </div>
        ) : liveSessions.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: 'calc(var(--spacing) * 10) calc(var(--spacing) * 4)',
            background: 'var(--bg-card)',
            borderRadius: '24px',
            border: '1px solid var(--border)'
          }}>
            <Radio size={64} color="var(--yellow)" strokeWidth={1.5} style={{ marginBottom: 'calc(var(--spacing) * 3)' }} />
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#ffffff',
              marginBottom: 'calc(var(--spacing) * 2)'
            }}>
              Aucun live en cours
            </h2>
            <p style={{
              fontSize: '16px',
              color: 'var(--text-secondary)',
              marginBottom: 'calc(var(--spacing) * 4)'
            }}>
              Soyez le premier à lancer un live et partager votre passion musicale!
            </p>
            {profile?.role !== 'fan' && (
              <button
                onClick={() => navigate('/stream/new')}
                style={{
                  padding: 'calc(var(--spacing) * 3) calc(var(--spacing) * 5)',
                  background: 'var(--yellow)',
                  border: 'none',
                  borderRadius: '16px',
                  color: '#000000',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 4px 20px var(--yellow-glow)'
                }}
              >
                Démarrer un Live
              </button>
            )}
          </div>
        ) : (
          <>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'calc(var(--spacing) * 2)',
              marginBottom: 'calc(var(--spacing) * 4)'
            }}>
              <div style={{
                width: '4px',
                height: '24px',
                background: 'var(--yellow)',
                borderRadius: '4px'
              }} />
              <h2 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#ffffff',
                margin: 0
              }}>
                Lives en direct
              </h2>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'calc(var(--spacing) * 1)',
                padding: 'calc(var(--spacing) * 1) calc(var(--spacing) * 2)',
                background: 'rgba(255, 68, 68, 0.15)',
                borderRadius: '8px'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  background: 'var(--red)',
                  borderRadius: '50%',
                  animation: 'pulse 2s ease-in-out infinite'
                }} />
                <span style={{
                  color: 'var(--red)',
                  fontSize: '12px',
                  fontWeight: '700',
                  textTransform: 'uppercase'
                }}>
                  LIVE
                </span>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 'calc(var(--spacing) * 4)'
            }}>
              {liveSessions.map((session) => (
                <LiveSessionCard key={session.id} session={session} getTimeAgo={getTimeAgo} onViewLive={(id) => navigate(`/stream/${id}`)} />
              ))}
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.2);
          }
        }

        .live-card:hover .play-icon {
          opacity: 1 !important;
        }
      `}</style>
    </Layout>
  )
}

interface LiveSessionCardProps {
  session: LiveSession
  getTimeAgo: (timestamp: string) => string
  onViewLive: (id: string) => void
}

function LiveSessionCard({ session, getTimeAgo, onViewLive }: LiveSessionCardProps) {
  const isPrivateDemo = session.id.startsWith('demo-')

  const handleClick = () => {
    if (isPrivateDemo) {
      alert('🔒 Cette session est privée. Créez votre propre live pour commencer!')
      return
    }
    onViewLive(session.id)
  }

  return (
    <div
      onClick={handleClick}
      className="live-card"
      style={{
        background: 'var(--bg-card)',
        borderRadius: '20px',
        overflow: 'hidden',
        border: '1px solid var(--border)',
        cursor: 'pointer',
        transition: 'all 0.3s',
        position: 'relative',
        opacity: isPrivateDemo ? 0.75 : 1
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px)'
        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.4)'
        e.currentTarget.style.borderColor = 'var(--yellow)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.borderColor = 'var(--border)'
      }}
    >
      <div style={{
        position: 'relative',
        aspectRatio: '16 / 9',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {session.thumbnail_url ? (
          <img src={session.thumbnail_url} alt={session.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <Radio size={64} color="var(--yellow)" strokeWidth={1} opacity={0.3} />
        )}

        {isPrivateDemo && (
          <div style={{
            position: 'absolute',
            top: 'calc(var(--spacing) * 2)',
            left: 'calc(var(--spacing) * 2)',
            display: 'flex',
            alignItems: 'center',
            gap: 'calc(var(--spacing) * 1)',
            padding: 'calc(var(--spacing) * 1) calc(var(--spacing) * 2)',
            background: 'rgba(100, 100, 100, 0.9)',
            borderRadius: '8px',
            backdropFilter: 'blur(10px)',
            zIndex: 2
          }}>
            <span style={{
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: '700',
              textTransform: 'uppercase'
            }}>
              🔒 PRIVÉ
            </span>
          </div>
        )}

        <div style={{
          position: 'absolute',
          top: isPrivateDemo ? 'calc(var(--spacing) * 7)' : 'calc(var(--spacing) * 2)',
          left: 'calc(var(--spacing) * 2)',
          display: 'flex',
          alignItems: 'center',
          gap: 'calc(var(--spacing) * 1)',
          padding: 'calc(var(--spacing) * 1) calc(var(--spacing) * 2)',
          background: 'rgba(255, 68, 68, 0.9)',
          borderRadius: '8px',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            background: '#ffffff',
            borderRadius: '50%',
            animation: 'pulse 2s ease-in-out infinite'
          }} />
          <span style={{
            color: '#ffffff',
            fontSize: '12px',
            fontWeight: '700',
            textTransform: 'uppercase'
          }}>
            LIVE
          </span>
        </div>

        <div style={{
          position: 'absolute',
          top: 'calc(var(--spacing) * 2)',
          right: 'calc(var(--spacing) * 2)',
          display: 'flex',
          alignItems: 'center',
          gap: 'calc(var(--spacing) * 1)',
          padding: 'calc(var(--spacing) * 1) calc(var(--spacing) * 2)',
          background: 'rgba(0, 0, 0, 0.7)',
          borderRadius: '8px',
          backdropFilter: 'blur(10px)'
        }}>
          <Eye size={14} color="#ffffff" />
          <span style={{
            color: '#ffffff',
            fontSize: '12px',
            fontWeight: '600'
          }}>
            {session.viewer_count}
          </span>
        </div>

        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60%',
          background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 100%)',
          pointerEvents: 'none'
        }} />

        <div
          className="play-icon"
          style={{
            position: 'absolute',
            bottom: 'calc(var(--spacing) * 2)',
            left: '50%',
            transform: 'translateX(-50%)',
            opacity: 0,
            transition: 'opacity 0.3s'
          }}>
          <Play size={48} color="var(--yellow)" fill="var(--yellow)" />
        </div>
      </div>

      <div style={{ padding: 'calc(var(--spacing) * 3)' }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '700',
          color: '#ffffff',
          marginBottom: 'calc(var(--spacing) * 1)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {session.title}
        </h3>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'calc(var(--spacing) * 2)',
          marginBottom: 'calc(var(--spacing) * 2)'
        }}>
          {session.host.avatar_url ? (
            <img
              src={session.host.avatar_url}
              alt={session.host.display_name}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid var(--yellow)'
              }}
            />
          ) : (
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'var(--yellow)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: '700',
              color: '#000000'
            }}>
              {session.host.display_name.charAt(0).toUpperCase()}
            </div>
          )}
          <span style={{
            fontSize: '14px',
            color: 'var(--text-secondary)',
            fontWeight: '500'
          }}>
            {session.host.display_name}
          </span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'calc(var(--spacing) * 2)'
        }}>
          {session.musical_style && (
            <span style={{
              padding: 'calc(var(--spacing) * 1) calc(var(--spacing) * 2)',
              background: 'rgba(255, 211, 0, 0.1)',
              border: '1px solid rgba(255, 211, 0, 0.3)',
              borderRadius: '8px',
              fontSize: '12px',
              color: 'var(--yellow)',
              fontWeight: '600',
              textTransform: 'capitalize'
            }}>
              {session.musical_style}
            </span>
          )}

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'calc(var(--spacing) * 1)',
            marginLeft: 'auto'
          }}>
            <Clock size={12} color="var(--text-secondary)" />
            <span style={{
              fontSize: '12px',
              color: 'var(--text-secondary)',
              fontWeight: '500'
            }}>
              {session.started_at && getTimeAgo(session.started_at)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
