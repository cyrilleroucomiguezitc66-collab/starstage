import { useEffect, useState } from 'react'

interface GiftAnimationProps {
  gift: {
    icon: string
    name: string
    quantity: number
    message?: string
    animation_type: string
  }
  senderName: string
  onComplete: () => void
}

export default function GiftAnimation({ gift, senderName, onComplete }: GiftAnimationProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onComplete, 500)
    }, 4000)

    return () => clearTimeout(timer)
  }, [onComplete])

  const getAnimationStyle = () => {
    const baseStyle = {
      position: 'fixed' as const,
      zIndex: 10000,
      transition: 'all 0.5s ease-out',
      opacity: visible ? 1 : 0
    }

    switch (gift.animation_type) {
      case 'float':
        return {
          ...baseStyle,
          bottom: visible ? '50%' : '20%',
          left: '50%',
          transform: 'translateX(-50%)'
        }
      case 'heart':
        return {
          ...baseStyle,
          top: visible ? '30%' : '10%',
          left: '50%',
          transform: `translateX(-50%) scale(${visible ? 1.2 : 0.8})`
        }
      case 'sparkle':
      case 'fire':
        return {
          ...baseStyle,
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) scale(${visible ? 1.5 : 1})`
        }
      case 'rocket':
        return {
          ...baseStyle,
          bottom: visible ? '50%' : '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          transition: 'all 1s ease-out'
        }
      case 'crown':
      case 'diamond':
        return {
          ...baseStyle,
          top: visible ? '40%' : '30%',
          left: '50%',
          transform: `translateX(-50%) rotate(${visible ? 360 : 0}deg) scale(${visible ? 1.3 : 0.9})`,
          transition: 'all 1s ease-out'
        }
      default:
        return {
          ...baseStyle,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }
    }
  }

  return (
    <div style={getAnimationStyle()}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(0,0,0,0.95), rgba(20,20,20,0.95))',
        border: '3px solid var(--yellow)',
        borderRadius: '24px',
        padding: 'calc(var(--spacing) * 4)',
        minWidth: '300px',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(255, 211, 0, 0.4)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{
          fontSize: '80px',
          marginBottom: 'calc(var(--spacing) * 2)',
          animation: gift.animation_type === 'sparkle' ? 'sparkle 0.5s ease-in-out infinite' : 'none'
        }}>
          {gift.icon}
          {gift.quantity > 1 && (
            <span style={{
              fontSize: '32px',
              color: 'var(--yellow)',
              marginLeft: 'calc(var(--spacing) * 1)',
              fontWeight: '800'
            }}>
              ×{gift.quantity}
            </span>
          )}
        </div>

        <div style={{
          fontSize: '18px',
          fontWeight: '700',
          color: 'var(--yellow)',
          marginBottom: 'calc(var(--spacing) * 1)'
        }}>
          {gift.name}
        </div>

        <div style={{
          fontSize: '16px',
          color: '#ffffff',
          marginBottom: gift.message ? 'calc(var(--spacing) * 2)' : 0
        }}>
          de <strong>{senderName}</strong>
        </div>

        {gift.message && (
          <div style={{
            padding: 'calc(var(--spacing) * 2)',
            background: 'rgba(255, 211, 0, 0.1)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 211, 0, 0.3)',
            fontSize: '14px',
            color: 'var(--text-secondary)',
            fontStyle: 'italic'
          }}>
            "{gift.message}"
          </div>
        )}
      </div>

      <style>{`
        @keyframes sparkle {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </div>
  )
}
