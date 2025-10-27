import { useState, useEffect } from 'react'
import { Gift, Sparkles, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth-context'

interface GiftType {
  id: string
  name: string
  icon: string
  cost_credits: number
  rarity: string
  animation_type: string
}

interface GiftPanelProps {
  sessionId: string
  hostId: string
  onGiftSent: (gift: any) => void
}

export default function GiftPanel({ sessionId, hostId, onGiftSent }: GiftPanelProps) {
  const { user } = useAuth()
  const [gifts, setGifts] = useState<GiftType[]>([])
  const [userCredits, setUserCredits] = useState(0)
  const [selectedGift, setSelectedGift] = useState<GiftType | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    loadGifts()
    loadUserCredits()
  }, [user])

  const loadGifts = async () => {
    const { data, error } = await supabase
      .from('gift_types')
      .select('*')
      .eq('is_active', true)
      .order('cost_credits')

    if (!error && data) {
      setGifts(data)
    }
  }

  const loadUserCredits = async () => {
    if (!user) return
    const { data } = await supabase
      .from('profiles')
      .select('total_credits')
      .eq('id', user.id)
      .maybeSingle()

    if (data) {
      setUserCredits(data.total_credits)
    }
  }

  const sendGift = async () => {
    if (!selectedGift || !user) return

    setSending(true)
    try {
      const { data, error } = await supabase.rpc('send_gift', {
        p_session_id: sessionId,
        p_recipient_id: hostId,
        p_gift_type_id: selectedGift.id,
        p_quantity: quantity,
        p_message: message || null
      })

      if (error) throw error

      if (data.success) {
        await loadUserCredits()
        onGiftSent({
          ...selectedGift,
          quantity,
          message,
          sender_id: user.id
        })
        setSelectedGift(null)
        setQuantity(1)
        setMessage('')
      } else {
        alert(data.error)
      }
    } catch (error: any) {
      alert('Erreur: ' + error.message)
    } finally {
      setSending(false)
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'rgba(150, 150, 150, 0.3)'
      case 'rare': return 'rgba(0, 150, 255, 0.3)'
      case 'epic': return 'rgba(200, 0, 255, 0.3)'
      case 'legendary': return 'rgba(255, 215, 0, 0.3)'
      default: return 'rgba(100, 100, 100, 0.3)'
    }
  }

  const totalCost = selectedGift ? selectedGift.cost_credits * quantity : 0
  const canAfford = totalCost <= userCredits

  return (
    <div style={{
      background: 'var(--bg-card)',
      borderRadius: '16px',
      border: '1px solid var(--border)',
      padding: 'calc(var(--spacing) * 3)',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 'calc(var(--spacing) * 3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(var(--spacing) * 2)' }}>
          <Gift size={20} color="var(--yellow)" />
          <h3 style={{
            fontSize: '16px',
            fontWeight: '700',
            color: '#ffffff',
            margin: 0
          }}>
            Cadeaux Virtuels
          </h3>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'calc(var(--spacing) * 1)',
          padding: 'calc(var(--spacing) * 1.5) calc(var(--spacing) * 2)',
          background: 'rgba(255, 211, 0, 0.1)',
          borderRadius: '8px'
        }}>
          <Sparkles size={14} color="var(--yellow)" />
          <span style={{
            fontSize: '14px',
            fontWeight: '700',
            color: 'var(--yellow)'
          }}>
            {userCredits.toLocaleString()}
          </span>
        </div>
      </div>

      {!selectedGift ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 'calc(var(--spacing) * 2)',
          overflowY: 'auto',
          flex: 1
        }}>
          {gifts.map(gift => (
            <button
              key={gift.id}
              onClick={() => setSelectedGift(gift)}
              style={{
                background: `linear-gradient(135deg, ${getRarityColor(gift.rarity)}, rgba(0,0,0,0.2))`,
                border: `2px solid ${getRarityColor(gift.rarity).replace('0.3', '0.6')}`,
                borderRadius: '12px',
                padding: 'calc(var(--spacing) * 2)',
                cursor: userCredits >= gift.cost_credits ? 'pointer' : 'not-allowed',
                opacity: userCredits >= gift.cost_credits ? 1 : 0.5,
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'calc(var(--spacing) * 1)'
              }}
              onMouseEnter={(e) => {
                if (userCredits >= gift.cost_credits) {
                  e.currentTarget.style.transform = 'scale(1.05)'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
              }}
              disabled={userCredits < gift.cost_credits}
            >
              <div style={{ fontSize: '32px' }}>{gift.icon}</div>
              <div style={{
                fontSize: '12px',
                fontWeight: '700',
                color: '#ffffff',
                textAlign: 'center'
              }}>
                {gift.name}
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'calc(var(--spacing) * 0.5)',
                fontSize: '11px',
                fontWeight: '600',
                color: 'var(--yellow)'
              }}>
                <Sparkles size={10} />
                {gift.cost_credits}
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'calc(var(--spacing) * 3)',
          flex: 1
        }}>
          <div style={{
            background: `linear-gradient(135deg, ${getRarityColor(selectedGift.rarity)}, rgba(0,0,0,0.2))`,
            border: `2px solid ${getRarityColor(selectedGift.rarity).replace('0.3', '0.6')}`,
            borderRadius: '12px',
            padding: 'calc(var(--spacing) * 3)',
            textAlign: 'center',
            position: 'relative'
          }}>
            <button
              onClick={() => setSelectedGift(null)}
              style={{
                position: 'absolute',
                top: 'calc(var(--spacing) * 1)',
                right: 'calc(var(--spacing) * 1)',
                background: 'rgba(0, 0, 0, 0.5)',
                border: 'none',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={16} color="#ffffff" />
            </button>
            <div style={{ fontSize: '64px', marginBottom: 'calc(var(--spacing) * 2)' }}>
              {selectedGift.icon}
            </div>
            <div style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#ffffff',
              marginBottom: 'calc(var(--spacing) * 1)'
            }}>
              {selectedGift.name}
            </div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'calc(var(--spacing) * 1)',
              padding: 'calc(var(--spacing) * 1) calc(var(--spacing) * 2)',
              background: 'rgba(255, 211, 0, 0.2)',
              borderRadius: '8px'
            }}>
              <Sparkles size={14} color="var(--yellow)" />
              <span style={{
                fontSize: '14px',
                fontWeight: '700',
                color: 'var(--yellow)'
              }}>
                {selectedGift.cost_credits} crédits
              </span>
            </div>
          </div>

          <div>
            <label style={{
              fontSize: '12px',
              fontWeight: '600',
              color: 'var(--text-secondary)',
              display: 'block',
              marginBottom: 'calc(var(--spacing) * 1)'
            }}>
              Quantité
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'calc(var(--spacing) * 2)'
            }}>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{
                  width: '36px',
                  height: '36px',
                  background: 'var(--bg-hover)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '18px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                -
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                style={{
                  flex: 1,
                  padding: 'calc(var(--spacing) * 1.5)',
                  background: 'var(--bg-hover)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '16px',
                  fontWeight: '700',
                  textAlign: 'center'
                }}
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                style={{
                  width: '36px',
                  height: '36px',
                  background: 'var(--bg-hover)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '18px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                +
              </button>
            </div>
          </div>

          <div>
            <label style={{
              fontSize: '12px',
              fontWeight: '600',
              color: 'var(--text-secondary)',
              display: 'block',
              marginBottom: 'calc(var(--spacing) * 1)'
            }}>
              Message (optionnel)
            </label>
            <input
              type="text"
              placeholder="Ajouter un message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={100}
              style={{
                width: '100%',
                padding: 'calc(var(--spacing) * 1.5)',
                background: 'var(--bg-hover)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{
            padding: 'calc(var(--spacing) * 2)',
            background: canAfford ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 0, 0, 0.1)',
            border: `1px solid ${canAfford ? 'rgba(0, 255, 136, 0.3)' : 'rgba(255, 0, 0, 0.3)'}`,
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{
              fontSize: '14px',
              color: 'var(--text-secondary)'
            }}>
              Total
            </span>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'calc(var(--spacing) * 1)'
            }}>
              <Sparkles size={16} color={canAfford ? '#00ff88' : '#ff0000'} />
              <span style={{
                fontSize: '18px',
                fontWeight: '700',
                color: canAfford ? '#00ff88' : '#ff0000'
              }}>
                {totalCost.toLocaleString()}
              </span>
            </div>
          </div>

          <button
            onClick={sendGift}
            disabled={!canAfford || sending}
            style={{
              padding: 'calc(var(--spacing) * 2.5)',
              background: canAfford ? 'linear-gradient(135deg, var(--yellow) 0%, #ffed4e 100%)' : 'rgba(100, 100, 100, 0.3)',
              border: 'none',
              borderRadius: '12px',
              color: '#000000',
              fontSize: '16px',
              fontWeight: '700',
              cursor: canAfford && !sending ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'calc(var(--spacing) * 1.5)',
              opacity: canAfford && !sending ? 1 : 0.5
            }}
          >
            <Gift size={20} />
            {sending ? 'Envoi...' : 'Envoyer le cadeau'}
          </button>
        </div>
      )}
    </div>
  )
}
