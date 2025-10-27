import Layout from '../components/Layout'
import { CreditCard, Check } from 'lucide-react'
import { useAuth } from '../lib/auth-context'
import { supabase } from '../lib/supabase'

export default function Premium() {
  const { user } = useAuth()

  const subscribeToPremium = async () => {
    if (!user) {
      alert('Veuillez vous connecter pour souscrire')
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
            price_id: 'price_1SMwqbBQwCRUcvbxkTzqt71G',
            mode: 'subscription',
            success_url: `${window.location.origin}/premium?success=true`,
            cancel_url: `${window.location.origin}/premium?canceled=true`,
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
        maxWidth: '1400px',
        margin: '0 auto',
        padding: 'calc(var(--spacing) * 6) calc(var(--spacing) * 4)'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: 'calc(var(--spacing) * 8)'
        }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: '800',
            color: '#ffffff',
            marginBottom: 'calc(var(--spacing) * 2)',
            letterSpacing: '-0.5px'
          }}>
            StarStage Premium
          </h1>
          <p style={{
            fontSize: '20px',
            color: 'var(--text-secondary)',
            margin: 0
          }}>
            Débloquez tout le potentiel de votre talent musical
          </p>
        </div>

        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          background: 'var(--bg-card)',
          borderRadius: '24px',
          border: '2px solid var(--yellow)',
          padding: 'calc(var(--spacing) * 6)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, var(--yellow-glow) 0%, transparent 70%)',
            filter: 'blur(60px)',
            pointerEvents: 'none'
          }} />

          <div style={{
            textAlign: 'center',
            marginBottom: 'calc(var(--spacing) * 5)',
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{
              display: 'inline-block',
              padding: 'calc(var(--spacing) * 1.5) calc(var(--spacing) * 3)',
              background: 'rgba(255, 211, 0, 0.1)',
              border: '1px solid var(--yellow)',
              borderRadius: '8px',
              marginBottom: 'calc(var(--spacing) * 3)'
            }}>
              <span style={{
                fontSize: '14px',
                fontWeight: '700',
                color: 'var(--yellow)',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Plan Annuel
              </span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'center',
              gap: 'calc(var(--spacing) * 1)',
              marginBottom: 'calc(var(--spacing) * 2)'
            }}>
              <span style={{
                fontSize: '64px',
                fontWeight: '800',
                color: '#ffffff',
                lineHeight: 1
              }}>
                39,99€
              </span>
              <span style={{
                fontSize: '20px',
                color: 'var(--text-secondary)',
                fontWeight: '600'
              }}>
                /an
              </span>
            </div>

            <p style={{
              fontSize: '16px',
              color: 'var(--text-secondary)'
            }}>
              Soit seulement 3,33€ par mois
            </p>
          </div>

          <div style={{
            marginBottom: 'calc(var(--spacing) * 5)',
            position: 'relative',
            zIndex: 1
          }}>
            {[
              'Lives illimités en HD',
              'Audio professionnel (Dolby/Auto-tune)',
              'Accès aux concours officiels',
              'Téléchargement des replays',
              'Statistiques avancées',
              'Badge vérifié',
              'Multi-caméra',
              'Support prioritaire'
            ].map((feature, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'calc(var(--spacing) * 2)',
                  padding: 'calc(var(--spacing) * 2)',
                  marginBottom: 'calc(var(--spacing) * 1.5)'
                }}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'var(--yellow)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Check size={14} color="#000000" strokeWidth={3} />
                </div>
                <span style={{
                  fontSize: '16px',
                  color: '#ffffff',
                  fontWeight: '500'
                }}>
                  {feature}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={subscribeToPremium}
            style={{
              width: '100%',
              padding: 'calc(var(--spacing) * 3.5)',
              background: 'var(--yellow)',
              border: 'none',
              borderRadius: '16px',
              color: '#000000',
              fontSize: '18px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 8px 24px var(--yellow-glow)',
              position: 'relative',
              zIndex: 1
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
            <CreditCard size={24} style={{ verticalAlign: 'middle', marginRight: 'calc(var(--spacing) * 2)' }} />
            Passer à Premium
          </button>

          <p style={{
            textAlign: 'center',
            marginTop: 'calc(var(--spacing) * 3)',
            fontSize: '14px',
            color: 'var(--text-secondary)',
            position: 'relative',
            zIndex: 1
          }}>
            Annulation possible à tout moment
          </p>
        </div>
      </div>
    </Layout>
  )
}
