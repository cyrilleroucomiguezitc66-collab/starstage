import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { Music, ShoppingCart, TrendingUp, Filter, Search } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface MarketplaceItem {
  id: string
  seller_id: string
  title: string
  description: string
  item_type: string
  price_euros: number
  tags: string[]
  total_sales: number
  cover?: string
  profiles: {
    display_name: string
    username: string
  }
}

const typeLabels: { [key: string]: string } = {
  'instrument': '🎸 Instrument',
  'software': '💻 Logiciel',
  'equipment': '🎛️ Équipement',
  'accessory': '🎧 Accessoire'
}

const demoItems = [
  { id: '1', seller_id: 'demo', title: 'Gibson Les Paul Standard', description: 'Guitare électrique emblématique en excellent état, sons chauds et puissants. Parfaite pour rock et blues.', item_type: 'instrument', price_euros: 2499, tags: ['guitare', 'électrique', 'gibson'], total_sales: 34, cover: 'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=800', profiles: { display_name: 'Thomas Martin', username: 'tmartin' } },
  { id: '2', seller_id: 'demo', title: 'Ableton Live 12 Suite', description: 'Station de travail audio numérique complète. Licence permanente avec tous les instruments et effets inclus.', item_type: 'software', price_euros: 599, tags: ['daw', 'production', 'ableton'], total_sales: 156, cover: 'https://images.pexels.com/photos/1571939/pexels-photo-1571939.jpeg?auto=compress&cs=tinysrgb&w=800', profiles: { display_name: 'Sophie Dubois', username: 'sdubois' } },
  { id: '3', seller_id: 'demo', title: 'Yamaha P-125 Piano Numérique', description: 'Piano numérique 88 touches avec toucher lourd. Son authentique et interface intuitive.', item_type: 'instrument', price_euros: 749, tags: ['piano', 'clavier', 'yamaha'], total_sales: 67, cover: 'https://images.pexels.com/photos/164936/pexels-photo-164936.jpeg?auto=compress&cs=tinysrgb&w=800', profiles: { display_name: 'Lucas Bernard', username: 'lbernard' } },
  { id: '4', seller_id: 'demo', title: 'Native Instruments Komplete 14', description: 'Bundle complet de plugins et instruments virtuels. Plus de 145 produits professionnels.', item_type: 'software', price_euros: 1299, tags: ['vst', 'plugins', 'native'], total_sales: 203, cover: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=800', profiles: { display_name: 'Emma Petit', username: 'epetit' } },
  { id: '5', seller_id: 'demo', title: 'Fender Jazz Bass American Pro', description: 'Basse électrique 4 cordes signature Fender. Électronique moderne et manche confortable.', item_type: 'instrument', price_euros: 1899, tags: ['basse', 'fender', 'électrique'], total_sales: 28, cover: 'https://images.pexels.com/photos/1407354/pexels-photo-1407354.jpeg?auto=compress&cs=tinysrgb&w=800', profiles: { display_name: 'Nathan Leroy', username: 'nleroy' } },
  { id: '6', seller_id: 'demo', title: 'FL Studio Producer Edition', description: 'DAW populaire pour production hip-hop et électro. Interface intuitive avec mises à jour gratuites.', item_type: 'software', price_euros: 299, tags: ['daw', 'flstudio', 'production'], total_sales: 412, cover: 'https://images.pexels.com/photos/7520385/pexels-photo-7520385.jpeg?auto=compress&cs=tinysrgb&w=800', profiles: { display_name: 'Chloé Moreau', username: 'cmoreau' } },
  { id: '7', seller_id: 'demo', title: 'Roland TD-17KVX Kit Batterie', description: 'Batterie électronique complète avec sons réalistes. Parfaite pour studio et pratique silencieuse.', item_type: 'instrument', price_euros: 1699, tags: ['batterie', 'électronique', 'roland'], total_sales: 45, cover: 'https://images.pexels.com/photos/995301/pexels-photo-995301.jpeg?auto=compress&cs=tinysrgb&w=800', profiles: { display_name: 'Alexandre Simon', username: 'asimon' } },
  { id: '8', seller_id: 'demo', title: 'Logic Pro X', description: 'DAW professionnelle pour Mac. Bibliothèque massive de sons et plugins de qualité studio.', item_type: 'software', price_euros: 199, tags: ['daw', 'logic', 'apple'], total_sales: 289, cover: 'https://images.pexels.com/photos/1643389/pexels-photo-1643389.jpeg?auto=compress&cs=tinysrgb&w=800', profiles: { display_name: 'Julie Laurent', username: 'jlaurent' } },
  { id: '9', seller_id: 'demo', title: 'Korg MicroKorg Synthétiseur', description: 'Synthétiseur analogique compact avec vocoder intégré. Sons vintage et modernes.', item_type: 'instrument', price_euros: 449, tags: ['synthé', 'korg', 'analogique'], total_sales: 92, cover: 'https://images.pexels.com/photos/210922/pexels-photo-210922.jpeg?auto=compress&cs=tinysrgb&w=800', profiles: { display_name: 'Maxime Girard', username: 'mgirard' } },
  { id: '10', seller_id: 'demo', title: 'Waves Platinum Bundle', description: 'Collection de 47 plugins audio essentiels pour mixage et mastering professionnel.', item_type: 'software', price_euros: 399, tags: ['plugins', 'waves', 'mixage'], total_sales: 178, cover: 'https://images.pexels.com/photos/1537635/pexels-photo-1537635.jpeg?auto=compress&cs=tinysrgb&w=800', profiles: { display_name: 'Léa Roux', username: 'lroux' } },
  { id: '11', seller_id: 'demo', title: 'Shure SM7B Microphone', description: 'Micro dynamique légendaire utilisé par les pros. Idéal pour voix, podcast et streaming.', item_type: 'equipment', price_euros: 459, tags: ['micro', 'shure', 'studio'], total_sales: 134, cover: 'https://images.pexels.com/photos/3756774/pexels-photo-3756774.jpeg?auto=compress&cs=tinysrgb&w=800', profiles: { display_name: 'Hugo Blanc', username: 'hblanc' } },
  { id: '12', seller_id: 'demo', title: 'Audio-Technica ATH-M50x', description: 'Casque de studio professionnel fermé. Réponse en fréquence plate et isolation excellente.', item_type: 'accessory', price_euros: 169, tags: ['casque', 'studio', 'audio-technica'], total_sales: 267, cover: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800', profiles: { display_name: 'Camille Fournier', username: 'cfournier' } }
]

export default function Marketplace() {
  const [items, setItems] = useState<MarketplaceItem[]>([])
  const [filteredItems, setFilteredItems] = useState<MarketplaceItem[]>([])
  const [selectedType, setSelectedType] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadItems()
  }, [])

  useEffect(() => {
    filterItems()
  }, [selectedType, searchQuery, items])

  const loadItems = async () => {
    try {
      const { data, error } = await supabase
        .from('marketplace_items')
        .select(`
          *,
          profiles:seller_id(display_name, username)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error

      const loadedItems = data || []
      const allItems = loadedItems.length > 0 ? loadedItems : demoItems

      setItems(allItems)
      setFilteredItems(allItems)
    } catch (error) {
      console.error('Error loading items:', error)
      setItems(demoItems)
      setFilteredItems(demoItems)
    }
  }

  const filterItems = () => {
    let filtered = items

    if (selectedType !== 'all') {
      filtered = filtered.filter(item => item.item_type === selectedType)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    setFilteredItems(filtered)
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
              Marketplace 🎵
            </h1>
            <p style={{
              fontSize: '18px',
              color: 'var(--text-secondary)',
              margin: 0
            }}>
              {filteredItems.length} annonce{filteredItems.length > 1 ? 's' : ''} disponible{filteredItems.length > 1 ? 's' : ''}
            </p>
          </div>

          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'calc(var(--spacing) * 2)',
              padding: 'calc(var(--spacing) * 2.5) calc(var(--spacing) * 4)',
              background: 'var(--yellow)',
              border: 'none',
              borderRadius: '12px',
              color: '#000000',
              fontSize: '16px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 20px var(--yellow-glow)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 6px 30px var(--yellow-glow)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 20px var(--yellow-glow)'
            }}
          >
            <ShoppingCart size={20} />
            <span>Vendre une annonce</span>
          </button>
        </div>

        <div style={{
          display: 'flex',
          gap: 'calc(var(--spacing) * 3)',
          marginBottom: 'calc(var(--spacing) * 5)'
        }}>
          <div style={{
            flex: 1,
            position: 'relative'
          }}>
            <Search
              size={20}
              style={{
                position: 'absolute',
                left: 'calc(var(--spacing) * 3)',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-secondary)'
              }}
            />
            <input
              type="text"
              placeholder="Rechercher instruments, logiciels, équipements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: 'calc(var(--spacing) * 2.5) calc(var(--spacing) * 3) calc(var(--spacing) * 2.5) calc(var(--spacing) * 9)',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                color: '#ffffff',
                fontSize: '16px',
                outline: 'none'
              }}
            />
          </div>

          <div style={{
            display: 'flex',
            gap: 'calc(var(--spacing) * 2)',
            alignItems: 'center',
            padding: 'calc(var(--spacing) * 2.5) calc(var(--spacing) * 3)',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '12px'
          }}>
            <Filter size={20} color="var(--text-secondary)" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="all">Tous les types</option>
              <option value="instrument">Instruments</option>
              <option value="software">Logiciels</option>
              <option value="equipment">Équipements</option>
              <option value="accessory">Accessoires</option>
            </select>
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: 'calc(var(--spacing) * 10) calc(var(--spacing) * 4)',
            background: 'var(--bg-card)',
            borderRadius: '24px',
            border: '1px solid var(--border)'
          }}>
            <Music size={64} color="var(--yellow)" strokeWidth={1.5} style={{ marginBottom: 'calc(var(--spacing) * 3)' }} />
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#ffffff',
              marginBottom: 'calc(var(--spacing) * 2)'
            }}>
              Aucune annonce trouvée
            </h2>
            <p style={{
              fontSize: '16px',
              color: 'var(--text-secondary)',
              marginBottom: 0
            }}>
              Essayez de modifier vos filtres ou votre recherche
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: 'calc(var(--spacing) * 4)'
          }}>
            {filteredItems.map((item) => (
              <div
                key={item.id}
                style={{
                  background: 'var(--bg-card)',
                  borderRadius: '20px',
                  border: '1px solid var(--border)',
                  overflow: 'hidden',
                  transition: 'all 0.3s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.4)'
                  e.currentTarget.style.borderColor = 'var(--yellow)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.borderColor = 'var(--border)'
                }}
              >
                <div style={{
                  height: '200px',
                  background: item.cover ? `url(${item.cover})` : 'linear-gradient(135deg, rgba(255, 211, 0, 0.1) 0%, rgba(0, 217, 255, 0.1) 100%)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: 'calc(var(--spacing) * 2)',
                    right: 'calc(var(--spacing) * 2)',
                    padding: 'calc(var(--spacing) * 1.5) calc(var(--spacing) * 2)',
                    background: 'rgba(0, 0, 0, 0.8)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#ffffff'
                  }}>
                    {typeLabels[item.item_type]}
                  </div>
                  {!item.cover && (
                    <div style={{ fontSize: '64px' }}>
                      {item.item_type === 'instrument' ? '🎸' : item.item_type === 'software' ? '💻' : item.item_type === 'equipment' ? '🎛️' : '🎧'}
                    </div>
                  )}
                </div>

                <div style={{ padding: 'calc(var(--spacing) * 4)' }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#ffffff',
                    marginBottom: 'calc(var(--spacing) * 1)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {item.title}
                  </h3>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'calc(var(--spacing) * 1)',
                    marginBottom: 'calc(var(--spacing) * 2)',
                    fontSize: '13px',
                    color: 'var(--text-secondary)'
                  }}>
                    <span>Par</span>
                    <span style={{ color: 'var(--yellow)', fontWeight: '600' }}>
                      {item.profiles.display_name || item.profiles.username}
                    </span>
                  </div>

                  <p style={{
                    fontSize: '14px',
                    color: 'var(--text-secondary)',
                    marginBottom: 'calc(var(--spacing) * 3)',
                    lineHeight: '1.5',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {item.description}
                  </p>

                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 'calc(var(--spacing) * 1)',
                    marginBottom: 'calc(var(--spacing) * 3)'
                  }}>
                    {item.tags.slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        style={{
                          padding: 'calc(var(--spacing) * 1) calc(var(--spacing) * 2)',
                          background: 'rgba(255, 211, 0, 0.1)',
                          borderRadius: '6px',
                          fontSize: '12px',
                          color: 'var(--yellow)',
                          fontWeight: '600'
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: 'calc(var(--spacing) * 3)',
                    borderTop: '1px solid var(--border)'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'calc(var(--spacing) * 1)',
                      fontSize: '13px',
                      color: 'var(--text-secondary)'
                    }}>
                      <TrendingUp size={16} />
                      <span>{item.total_sales} vente{item.total_sales > 1 ? 's' : ''}</span>
                    </div>
                    <div style={{
                      fontSize: '24px',
                      fontWeight: '800',
                      color: 'var(--yellow)',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      {item.price_euros}€
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      alert('Achat: ' + item.title)
                    }}
                    style={{
                      width: '100%',
                      marginTop: 'calc(var(--spacing) * 3)',
                      padding: 'calc(var(--spacing) * 2.5)',
                      background: 'var(--yellow)',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#000000',
                      fontSize: '16px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 'calc(var(--spacing) * 1.5)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.02)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)'
                    }}
                  >
                    <ShoppingCart size={20} />
                    <span>Acheter maintenant</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
