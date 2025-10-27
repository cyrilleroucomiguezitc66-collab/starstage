import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { Sparkles, Check, CreditCard, DollarSign } from 'lucide-react'
import { useAuth } from '../lib/auth-context'
import { supabase } from '../lib/supabase'

const creditPacks = [
  { id: 1, credits: 100, price: 0.99, bonus: 0, popular: false, icon: '🎵', priceId: 'price_1SMx5qBQwCRUcvbxCPBmI5LG' },
  { id: 2, credits: 500, price: 4.99, bonus: 50, popular: false, icon: '⭐', priceId: 'price_1SMx6zBQwCRUcvbxDGpwx3r5' },
  { id: 3, credits: 1000, price: 9.99, bonus: 150, popular: true, icon: '🎤', priceId: 'price_1SMx7XBQwCRUcvbxDWgBnuSy' },
  { id: 4, credits: 2500, price: 19.99, bonus: 500, popular: false, icon: '🔥', priceId: 'price_1SMx7vBQwCRUcvbxfQ3bVmYm' },
  { id: 5, credits: 5000, price: 39.99, bonus: 1200, popular: false, icon: '👑', priceId: 'price_1SMx8IBQwCRUcvbxwbzgSL2U' },
  { id: 6, credits: 10000, price: 69.99, bonus: 3000, popular: false, icon: '💎', priceId: 'price_1SMx8lBQwCRUcvbxrqFv0OiS' }
]

export default function BuyCredits() {
  const { user } = useAuth()
  const [userCredits, setUserCredits] = useState(0)

  useEffect(() => {
    loadUserCredits()

    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('success') === 'true') {
      alert('✅ Paiement réussi! Vos crédits seront ajoutés sous peu.')
      window.history.replaceState({}, '', '/buy-credits')
    } else if (urlParams.get('canceled') === 'true') {
      alert('❌ Paiement annulé')
      window.history.replaceState({}, '', '/buy-credits')
    }
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

  const buyCredits = async (pack: typeof creditPacks[0]) => {
    if (!user) {
      alert('Veuillez vous connecter pour acheter des crédits')
      return
    }

    try {
      const session = await supabase.auth.getSession()
      if (!session.data.session) {
        alert('Session expirée. Veuillez vous reconnecter.')
        return
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.data.session.access_token}`,
          },
          body: JSON.stringify({
            price_id: pack.priceId,
            mode: 'payment',
            success_url: `${window.location.origin}/buy-credits?success=true`,
            cancel_url: `${window.location.origin}/buy-credits?canceled=true`,
            metadata: {
              credits: pack.credits + pack.bonus,
              user_id: user.id
            }
          }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la création de la session')
      }

      const { url } = await response.json()
      if (url) {
        window.location.href = url
      }
    } catch (error: any) {
      console.error('Error:', error)
      alert('Erreur: ' + error.message)
    }
  }

  return (
    <Layout>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: 'calc(var(--spacing) * 6) calc(var(--spacing) * 4)'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: 'calc(var(--spacing) * 6)'
        }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--yellow) 0%, #ffed4e 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto calc(var(--spacing) * 3)'
          }}>
            <Sparkles size={50} color="#000000" />
          </div>
          <h1 style={{
            fontSize: '42px',
            fontWeight: '800',
            color: '#ffffff',
            marginBottom: 'calc(var(--spacing) * 2)'
          }}>
            Acheter des Crédits
          </h1>
          <p style={{
            fontSize: '18px',
            color: 'var(--text-secondary)',
            marginBottom: 'calc(var(--spacing) * 3)'
          }}>
            Soutenez vos artistes préférés avec des cadeaux virtuels!
          </p>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'calc(var(--spacing) * 2)',
            padding: 'calc(var(--spacing) * 3) calc(var(--spacing) * 5)',
            background: 'rgba(255, 211, 0, 0.1)',
            borderRadius: '16px',
            border: '2px solid rgba(255, 211, 0, 0.3)'
          }}>
            <Sparkles size={24} color="var(--yellow)" />
            <div>
              <div style={{
                fontSize: '14px',
                color: 'var(--text-secondary)',
                marginBottom: '4px'
              }}>
                Votre solde
              </div>
              <div style={{
                fontSize: '32px',
                fontWeight: '800',
                color: 'var(--yellow)'
              }}>
                {userCredits.toLocaleString()} Crédits
              </div>
            </div>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'calc(var(--spacing) * 4)',
          marginBottom: 'calc(var(--spacing) * 6)'
        }}>
          {creditPacks.map((pack) => (
            <div
              key={pack.id}
              style={{
                background: 'var(--bg-card)',
                borderRadius: '24px',
                border: pack.popular ? '3px solid var(--yellow)' : '2px solid var(--border)',
                padding: 'calc(var(--spacing) * 5)',
                position: 'relative',
                transition: 'all 0.3s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)'
                e.currentTarget.style.boxShadow = pack.popular
                  ? '0 12px 40px rgba(255, 211, 0, 0.3)'
                  : '0 12px 40px rgba(0, 0, 0, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
              onClick={() => {}}
            >
              {pack.popular && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  padding: 'calc(var(--spacing) * 1.5) calc(var(--spacing) * 3)',
                  background: 'linear-gradient(135deg, var(--yellow) 0%, #ffed4e 100%)',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '800',
                  color: '#000000',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  ⭐ POPULAIRE
                </div>
              )}

              <div style={{
                textAlign: 'center',
                marginBottom: 'calc(var(--spacing) * 4)'
              }}>
                <div style={{ fontSize: '72px', marginBottom: 'calc(var(--spacing) * 2)' }}>
                  {pack.icon}
                </div>
                <div style={{
                  fontSize: '48px',
                  fontWeight: '800',
                  color: '#ffffff',
                  marginBottom: 'calc(var(--spacing) * 1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'calc(var(--spacing) * 1)'
                }}>
                  <Sparkles size={32} color="var(--yellow)" />
                  {pack.credits.toLocaleString()}
                </div>
                <div style={{
                  fontSize: '16px',
                  color: 'var(--text-secondary)',
                  marginBottom: pack.bonus > 0 ? 'calc(var(--spacing) * 2)' : 0
                }}>
                  Crédits
                </div>
                {pack.bonus > 0 && (
                  <div style={{
                    display: 'inline-block',
                    padding: 'calc(var(--spacing) * 1.5) calc(var(--spacing) * 2.5)',
                    background: 'rgba(0, 255, 136, 0.1)',
                    borderRadius: '12px',
                    border: '1px solid rgba(0, 255, 136, 0.3)'
                  }}>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      color: '#00ff88'
                    }}>
                      + {pack.bonus} BONUS
                    </span>
                  </div>
                )}
              </div>

              <div style={{
                padding: 'calc(var(--spacing) * 4) 0',
                borderTop: '1px solid var(--border)',
                borderBottom: '1px solid var(--border)',
                marginBottom: 'calc(var(--spacing) * 4)'
              }}>
                <div style={{
                  fontSize: '16px',
                  color: 'var(--text-secondary)',
                  marginBottom: 'calc(var(--spacing) * 1)',
                  textAlign: 'center'
                }}>
                  Prix
                </div>
                <div style={{
                  fontSize: '40px',
                  fontWeight: '800',
                  color: 'var(--yellow)',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'calc(var(--spacing) * 1)'
                }}>
                  <DollarSign size={32} />
                  {pack.price}
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  buyCredits(pack)
                }}
                style={{
                  width: '100%',
                  padding: 'calc(var(--spacing) * 3.5)',
                  background: pack.popular
                    ? 'linear-gradient(135deg, var(--yellow) 0%, #ffed4e 100%)'
                    : 'linear-gradient(135deg, #00ff88 0%, #00d9ff 100%)',
                  border: 'none',
                  borderRadius: '16px',
                  color: '#000000',
                  fontSize: '18px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'calc(var(--spacing) * 2)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                <CreditCard size={24} />
                Acheter maintenant
              </button>
            </div>
          ))}
        </div>

        <div style={{
          background: 'rgba(0, 217, 255, 0.1)',
          borderRadius: '24px',
          border: '1px solid rgba(0, 217, 255, 0.3)',
          padding: 'calc(var(--spacing) * 6)',
          marginBottom: 'calc(var(--spacing) * 6)'
        }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '800',
            color: '#ffffff',
            marginBottom: 'calc(var(--spacing) * 4)',
            textAlign: 'center'
          }}>
            Comment ça marche?
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 'calc(var(--spacing) * 4)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'rgba(255, 211, 0, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto calc(var(--spacing) * 2)',
                fontSize: '28px'
              }}>
                1️⃣
              </div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#ffffff',
                marginBottom: 'calc(var(--spacing) * 1)'
              }}>
                Achetez des crédits
              </h3>
              <p style={{
                fontSize: '14px',
                color: 'var(--text-secondary)',
                margin: 0
              }}>
                Choisissez un pack et rechargez votre compte
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'rgba(255, 211, 0, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto calc(var(--spacing) * 2)',
                fontSize: '28px'
              }}>
                2️⃣
              </div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#ffffff',
                marginBottom: 'calc(var(--spacing) * 1)'
              }}>
                Regardez des lives
              </h3>
              <p style={{
                fontSize: '14px',
                color: 'var(--text-secondary)',
                margin: 0
              }}>
                Découvrez des artistes incroyables en direct
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'rgba(255, 211, 0, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto calc(var(--spacing) * 2)',
                fontSize: '28px'
              }}>
                3️⃣
              </div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#ffffff',
                marginBottom: 'calc(var(--spacing) * 1)'
              }}>
                Offrez des cadeaux
              </h3>
              <p style={{
                fontSize: '14px',
                color: 'var(--text-secondary)',
                margin: 0
              }}>
                Soutenez vos artistes favoris avec des cadeaux virtuels
              </p>
            </div>
          </div>
        </div>

        <div style={{
          background: 'var(--bg-card)',
          borderRadius: '24px',
          border: '1px solid var(--border)',
          padding: 'calc(var(--spacing) * 5)'
        }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: 'calc(var(--spacing) * 3)'
          }}>
            ✨ Avantages
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 'calc(var(--spacing) * 3)'
          }}>
            {[
              'Crédits bonus sur les gros packs',
              'Apparaissez en direct pendant les lives',
              'Soutenez directement les artistes (70%)',
              'Système sécurisé et légal',
              'Rechargement instantané',
              'Pas d\'abonnement requis'
            ].map((feature, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'calc(var(--spacing) * 2)'
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'rgba(0, 255, 136, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Check size={16} color="#00ff88" />
                </div>
                <span style={{
                  fontSize: '14px',
                  color: 'var(--text-secondary)'
                }}>
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}
