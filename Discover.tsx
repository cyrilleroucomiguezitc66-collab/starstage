import Layout from '../components/Layout'
import { TrendingUp, Radio as RadioIcon, Flame, Sparkles, Crown, Radio } from 'lucide-react'
import { useState } from 'react'

const trendingArtists = [
  { id: 1, name: 'Luna Star', genre: 'Pop/R&B', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400', cover: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800', followers: '2.4M', visitPercentage: '+45%', profileVisits: 125000, liveCount: 23, isLive: true, liveViewers: 12500 },
  { id: 2, name: 'DJ Nova', genre: 'Electronic/House', avatar: 'https://images.pexels.com/photos/1644888/pexels-photo-1644888.jpeg?auto=compress&cs=tinysrgb&w=400', cover: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800', followers: '3.1M', visitPercentage: '+62%', profileVisits: 215000, liveCount: 45, isLive: true, liveViewers: 28000 },
  { id: 3, name: 'Phoenix Beats', genre: 'Hip-Hop/Rap', avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=400', cover: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800', followers: '1.5M', visitPercentage: '+51%', profileVisits: 142000, liveCount: 31, isLive: false, liveViewers: 0 },
  { id: 4, name: 'Stellar Wave', genre: 'Synthwave', avatar: 'https://images.pexels.com/photos/1386604/pexels-photo-1386604.jpeg?auto=compress&cs=tinysrgb&w=400', cover: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800', followers: '890K', visitPercentage: '+58%', profileVisits: 89000, liveCount: 18, isLive: true, liveViewers: 5600 },
  { id: 5, name: 'Echo Valley', genre: 'Alternative', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400', cover: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800', followers: '1.2M', visitPercentage: '+43%', profileVisits: 105000, liveCount: 27, isLive: false, liveViewers: 0 },
  { id: 6, name: 'Neon Pulse', genre: 'EDM', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400', cover: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800', followers: '2.8M', visitPercentage: '+67%', profileVisits: 198000, liveCount: 52, isLive: true, liveViewers: 19000 }
]

const newTalents = [
  { id: 7, name: 'Violet Sky', genre: 'Pop', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400', cover: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800', followers: '145K', visitPercentage: '+156%', profileVisits: 12500, liveCount: 8, isLive: false, liveViewers: 0 },
  { id: 8, name: 'Urban Legends', genre: 'Hip-Hop', avatar: 'https://images.pexels.com/photos/1687678/pexels-photo-1687678.jpeg?auto=compress&cs=tinysrgb&w=400', cover: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800', followers: '234K', visitPercentage: '+203%', profileVisits: 18900, liveCount: 12, isLive: true, liveViewers: 2800 },
  { id: 9, name: 'Moonlight Serenade', genre: 'Jazz', avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400', cover: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800', followers: '89K', visitPercentage: '+128%', profileVisits: 8300, liveCount: 5, isLive: false, liveViewers: 0 },
  { id: 10, name: 'Cyber Dreams', genre: 'Electronic', avatar: 'https://images.pexels.com/photos/1644888/pexels-photo-1644888.jpeg?auto=compress&cs=tinysrgb&w=400', cover: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800', followers: '312K', visitPercentage: '+178%', profileVisits: 24700, liveCount: 15, isLive: true, liveViewers: 4200 },
  { id: 11, name: 'The Wild Hearts', genre: 'Rock', avatar: 'https://images.pexels.com/photos/1687678/pexels-photo-1687678.jpeg?auto=compress&cs=tinysrgb&w=400', cover: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800', followers: '267K', visitPercentage: '+189%', profileVisits: 21400, liveCount: 11, isLive: false, liveViewers: 0 },
  { id: 12, name: 'Starlight Echo', genre: 'Indie Pop', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400', cover: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800', followers: '178K', visitPercentage: '+145%', profileVisits: 15800, liveCount: 9, isLive: true, liveViewers: 1900 }
]

const topArtists = [
  { id: 13, name: 'Apex Sound', genre: 'Pop/Dance', avatar: 'https://images.pexels.com/photos/1644888/pexels-photo-1644888.jpeg?auto=compress&cs=tinysrgb&w=400', cover: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800', followers: '4.2M', visitPercentage: '+28%', profileVisits: 345000, liveCount: 67, isLive: false, liveViewers: 0 },
  { id: 14, name: 'Diamond Kings', genre: 'Hip-Hop', avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=400', cover: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800', followers: '3.8M', visitPercentage: '+32%', profileVisits: 298000, liveCount: 89, isLive: true, liveViewers: 34000 },
  { id: 15, name: 'Electro Empire', genre: 'Electronic', avatar: 'https://images.pexels.com/photos/1644888/pexels-photo-1644888.jpeg?auto=compress&cs=tinysrgb&w=400', cover: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800', followers: '5.1M', visitPercentage: '+35%', profileVisits: 412000, liveCount: 102, isLive: true, liveViewers: 45000 },
  { id: 16, name: 'Velvet Voices', genre: 'R&B/Soul', avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400', cover: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800', followers: '2.9M', visitPercentage: '+26%', profileVisits: 234000, liveCount: 56, isLive: false, liveViewers: 0 },
  { id: 17, name: 'Thunder Rock', genre: 'Hard Rock', avatar: 'https://images.pexels.com/photos/1687678/pexels-photo-1687678.jpeg?auto=compress&cs=tinysrgb&w=400', cover: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800', followers: '3.3M', visitPercentage: '+29%', profileVisits: 267000, liveCount: 73, isLive: false, liveViewers: 0 },
  { id: 18, name: 'Cosmic Vibes', genre: 'Chillwave', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400', cover: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800', followers: '2.6M', visitPercentage: '+24%', profileVisits: 198000, liveCount: 61, isLive: true, liveViewers: 16000 }
]

const liveNow = [
  { id: 19, name: 'Rave Nation', genre: 'Techno', avatar: 'https://images.pexels.com/photos/1644888/pexels-photo-1644888.jpeg?auto=compress&cs=tinysrgb&w=400', cover: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800', followers: '1.9M', visitPercentage: '+41%', profileVisits: 156000, liveCount: 38, isLive: true, liveViewers: 23500 },
  { id: 20, name: 'Soul Sister', genre: 'Soul', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400', cover: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800', followers: '1.3M', visitPercentage: '+37%', profileVisits: 112000, liveCount: 29, isLive: true, liveViewers: 8900 },
  { id: 21, name: 'Bass Drop', genre: 'Dubstep', avatar: 'https://images.pexels.com/photos/1644888/pexels-photo-1644888.jpeg?auto=compress&cs=tinysrgb&w=400', cover: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800', followers: '2.2M', visitPercentage: '+48%', profileVisits: 178000, liveCount: 44, isLive: true, liveViewers: 31000 },
  { id: 22, name: 'Acoustic Dreams', genre: 'Folk', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400', cover: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800', followers: '678K', visitPercentage: '+31%', profileVisits: 67500, liveCount: 19, isLive: true, liveViewers: 4200 },
  { id: 23, name: 'Metal Storm', genre: 'Metal', avatar: 'https://images.pexels.com/photos/1687678/pexels-photo-1687678.jpeg?auto=compress&cs=tinysrgb&w=400', cover: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800', followers: '1.4M', visitPercentage: '+39%', profileVisits: 123000, liveCount: 33, isLive: true, liveViewers: 12000 },
  { id: 24, name: 'Rhythm Kings', genre: 'Funk', avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=400', cover: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800', followers: '945K', visitPercentage: '+34%', profileVisits: 89200, liveCount: 22, isLive: true, liveViewers: 6700 }
]

type TabType = 'trending' | 'new' | 'top' | 'live'

export default function Discover() {
  const [activeTab, setActiveTab] = useState<TabType>('trending')

  const getArtistsForTab = () => {
    switch (activeTab) {
      case 'trending': return trendingArtists
      case 'new': return newTalents
      case 'top': return topArtists
      case 'live': return liveNow
      default: return trendingArtists
    }
  }

  const tabs = [
    { id: 'trending' as TabType, label: 'En Tendance', icon: Flame, color: '#ff6b35' },
    { id: 'new' as TabType, label: 'Nouveaux Talents', icon: Sparkles, color: '#4ecdc4' },
    { id: 'top' as TabType, label: 'Top Artistes', icon: Crown, color: '#ffd700' },
    { id: 'live' as TabType, label: 'Lives Maintenant', icon: Radio, color: '#ff0000' }
  ]

  return (
    <Layout>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: 'calc(var(--spacing) * 6) calc(var(--spacing) * 4)'
      }}>
        <div style={{
          marginBottom: 'calc(var(--spacing) * 6)'
        }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: '800',
            color: '#ffffff',
            marginBottom: 'calc(var(--spacing) * 2)',
            letterSpacing: '-0.5px'
          }}>
            Découvrir
          </h1>
          <p style={{
            fontSize: '18px',
            color: 'var(--text-secondary)',
            marginBottom: 'calc(var(--spacing) * 4)'
          }}>
            Explorez les meilleurs artistes de la plateforme
          </p>

          <div style={{
            display: 'flex',
            gap: 'calc(var(--spacing) * 2)',
            borderBottom: '2px solid var(--border)',
            overflowX: 'auto',
            paddingBottom: 'calc(var(--spacing) * 2)'
          }}>
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: 'calc(var(--spacing) * 3) calc(var(--spacing) * 4)',
                    background: activeTab === tab.id ? 'rgba(255, 211, 0, 0.1)' : 'transparent',
                    border: activeTab === tab.id ? '2px solid var(--yellow)' : '2px solid transparent',
                    borderRadius: '12px',
                    color: activeTab === tab.id ? '#ffffff' : 'var(--text-secondary)',
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'calc(var(--spacing) * 2)',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    if (activeTab !== tab.id) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== tab.id) {
                      e.currentTarget.style.background = 'transparent'
                    }
                  }}
                >
                  <Icon size={20} color={activeTab === tab.id ? tab.color : 'currentColor'} />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
          gap: 'calc(var(--spacing) * 4)',
          marginBottom: 'calc(var(--spacing) * 8)'
        }}>
          {getArtistsForTab().map((artist) => (
            <div
              key={artist.id}
              style={{
                background: 'var(--bg-card)',
                borderRadius: '20px',
                border: '1px solid var(--border)',
                overflow: 'hidden',
                transition: 'all 0.3s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)'
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(255, 211, 0, 0.15)'
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
                height: '200px',
                background: `url(${artist.cover})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)'
                }} />

                {artist.isLive && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(var(--spacing) * 2)',
                    left: 'calc(var(--spacing) * 2)',
                    padding: 'calc(var(--spacing) * 1.5) calc(var(--spacing) * 2.5)',
                    background: 'rgba(255, 0, 0, 0.9)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'calc(var(--spacing) * 1)',
                    animation: 'pulse 2s infinite'
                  }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#ffffff'
                    }} />
                    <span style={{
                      color: '#ffffff',
                      fontSize: '12px',
                      fontWeight: '700',
                      textTransform: 'uppercase'
                    }}>LIVE</span>
                    <span style={{
                      color: '#ffffff',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>{artist.liveViewers.toLocaleString()}</span>
                  </div>
                )}

                <div style={{
                  position: 'absolute',
                  bottom: '-50px',
                  left: 'calc(var(--spacing) * 3)',
                  width: '100px',
                  height: '100px',
                  borderRadius: '20px',
                  border: '4px solid var(--bg-card)',
                  background: `url(${artist.avatar})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }} />
              </div>

              <div style={{ padding: 'calc(var(--spacing) * 3)' }}>
                <div style={{ marginTop: 'calc(var(--spacing) * 6)', marginBottom: 'calc(var(--spacing) * 3)' }}>
                  <h3 style={{
                    fontSize: '22px',
                    fontWeight: '700',
                    color: '#ffffff',
                    marginBottom: 'calc(var(--spacing) * 1)'
                  }}>
                    {artist.name}
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: 'var(--text-secondary)',
                    margin: 0
                  }}>
                    {artist.genre}
                  </p>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 'calc(var(--spacing) * 2)',
                  marginBottom: 'calc(var(--spacing) * 3)'
                }}>
                  <div style={{
                    padding: 'calc(var(--spacing) * 2)',
                    background: 'rgba(255, 211, 0, 0.1)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 211, 0, 0.2)'
                  }}>
                    <div style={{
                      fontSize: '11px',
                      color: 'var(--text-secondary)',
                      marginBottom: 'calc(var(--spacing) * 0.5)',
                      textTransform: 'uppercase',
                      fontWeight: '600'
                    }}>
                      % Visites
                    </div>
                    <div style={{
                      fontSize: '20px',
                      fontWeight: '700',
                      color: 'var(--yellow)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'calc(var(--spacing) * 1)'
                    }}>
                      <TrendingUp size={18} />
                      {artist.visitPercentage}
                    </div>
                  </div>

                  <div style={{
                    padding: 'calc(var(--spacing) * 2)',
                    background: 'rgba(0, 255, 136, 0.1)',
                    borderRadius: '12px',
                    border: '1px solid rgba(0, 255, 136, 0.2)'
                  }}>
                    <div style={{
                      fontSize: '11px',
                      color: 'var(--text-secondary)',
                      marginBottom: 'calc(var(--spacing) * 0.5)',
                      textTransform: 'uppercase',
                      fontWeight: '600'
                    }}>
                      Nb. Lives
                    </div>
                    <div style={{
                      fontSize: '20px',
                      fontWeight: '700',
                      color: '#00ff88',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'calc(var(--spacing) * 1)'
                    }}>
                      <RadioIcon size={18} />
                      {artist.liveCount}
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 'calc(var(--spacing) * 2.5) 0',
                  borderTop: '1px solid var(--border)',
                  borderBottom: '1px solid var(--border)',
                  marginBottom: 'calc(var(--spacing) * 3)'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: '#ffffff',
                      marginBottom: 'calc(var(--spacing) * 0.5)'
                    }}>
                      {artist.followers}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      textTransform: 'uppercase',
                      fontWeight: '600'
                    }}>
                      Fans
                    </div>
                  </div>

                  <div style={{
                    width: '1px',
                    height: '40px',
                    background: 'var(--border)'
                  }} />

                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: '#ffffff',
                      marginBottom: 'calc(var(--spacing) * 0.5)'
                    }}>
                      {artist.profileVisits.toLocaleString()}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      textTransform: 'uppercase',
                      fontWeight: '600'
                    }}>
                      Personnes
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
