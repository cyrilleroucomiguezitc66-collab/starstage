import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { TrendingUp, DollarSign, Gift, Users, Calendar, CreditCard, CheckCircle, Clock, XCircle } from 'lucide-react'
import { useAuth } from '../lib/auth-context'
import { supabase } from '../lib/supabase'

interface Earnings {
  total_earned_credits: number
  available_credits: number
  withdrawn_credits: number
}

interface Stats {
  total_sessions: number
  total_viewers: number
  total_gifts: number
  total_followers: number
}

interface WithdrawalRequest {
  id: string
  amount_credits: number
  amount_euros: number
  status: string
  created_at: string
  processed_at?: string
}

export default function ArtistDashboard() {
  const { user } = useAuth()
  const [earnings, setEarnings] = useState<Earnings | null>(null)
  const [stats, setStats] = useState<Stats>({ total_sessions: 0, total_viewers: 0, total_gifts: 0, total_followers: 0 })
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([])
  const [showWithdrawal, setShowWithdrawal] = useState(false)
  const [withdrawalAmount, setWithdrawalAmount] = useState('')
  const [paymentEmail, setPaymentEmail] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('paypal')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (user) {
      loadEarnings()
      loadStats()
      loadWithdrawalRequests()
    }
  }, [user])

  const loadEarnings = async () => {
    if (!user) return
    const { data } = await supabase
      .from('artist_earnings')
      .select('*')
      .eq('artist_id', user.id)
      .maybeSingle()

    if (data) {
      setEarnings(data)
    } else {
      setEarnings({ total_earned_credits: 0, available_credits: 0, withdrawn_credits: 0 })
    }
  }

  const loadStats = async () => {
    if (!user) return

    const [sessionsRes, giftsRes, followersRes] = await Promise.all([
      supabase.from('live_sessions').select('viewer_count', { count: 'exact' }).eq('host_id', user.id),
      supabase.from('gifts_sent').select('*', { count: 'exact' }).eq('recipient_id', user.id),
      supabase.from('follows').select('*', { count: 'exact' }).eq('following_id', user.id)
    ])

    const totalViewers = sessionsRes.data?.reduce((sum, s) => sum + (s.viewer_count || 0), 0) || 0

    setStats({
      total_sessions: sessionsRes.count || 0,
      total_viewers: totalViewers,
      total_gifts: giftsRes.count || 0,
      total_followers: followersRes.count || 0
    })
  }

  const loadWithdrawalRequests = async () => {
    if (!user) return
    const { data } = await supabase
      .from('withdrawal_requests')
      .select('*')
      .eq('artist_id', user.id)
      .order('created_at', { ascending: false })

    if (data) {
      setWithdrawalRequests(data)
    }
  }

  const submitWithdrawal = async () => {
    if (!user || !earnings) return

    const amount = parseInt(withdrawalAmount)
    if (amount < 1000 || amount > earnings.available_credits) {
      alert('Montant invalide. Minimum 1000 crédits.')
      return
    }

    if (!paymentEmail) {
      alert('Veuillez entrer votre email de paiement')
      return
    }

    setSubmitting(true)
    try {
      const amountEuros = (amount / 100).toFixed(2)

      const { error } = await supabase
        .from('withdrawal_requests')
        .insert({
          artist_id: user.id,
          amount_credits: amount,
          amount_euros: parseFloat(amountEuros),
          payment_method: paymentMethod,
          payment_email: paymentEmail,
          status: 'pending'
        })

      if (error) throw error

      alert('Demande de retrait soumise!')
      setShowWithdrawal(false)
      setWithdrawalAmount('')
      setPaymentEmail('')
      loadWithdrawalRequests()
    } catch (error: any) {
      alert('Erreur: ' + error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle size={16} color="#00ff88" />
      case 'pending': return <Clock size={16} color="#ffd300" />
      case 'approved': return <CheckCircle size={16} color="#00d9ff" />
      case 'rejected': return <XCircle size={16} color="#ff0000" />
      default: return null
    }
  }

  const creditsToEuros = (credits: number) => (credits / 100).toFixed(2)

  return (
    <Layout>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: 'calc(var(--spacing) * 6) calc(var(--spacing) * 4)'
      }}>
        <div style={{
          marginBottom: 'calc(var(--spacing) * 6)'
        }}>
          <h1 style={{
            fontSize: '42px',
            fontWeight: '800',
            color: '#ffffff',
            marginBottom: 'calc(var(--spacing) * 2)'
          }}>
            Tableau de bord Artiste
          </h1>
          <p style={{
            fontSize: '18px',
            color: 'var(--text-secondary)',
            margin: 0
          }}>
            Gérez vos revenus et statistiques
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 'calc(var(--spacing) * 4)',
          marginBottom: 'calc(var(--spacing) * 6)'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(255, 211, 0, 0.2), rgba(255, 237, 78, 0.1))',
            border: '2px solid rgba(255, 211, 0, 0.3)',
            borderRadius: '20px',
            padding: 'calc(var(--spacing) * 4)'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(255, 211, 0, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 'calc(var(--spacing) * 2)'
            }}>
              <TrendingUp size={24} color="var(--yellow)" />
            </div>
            <div style={{
              fontSize: '14px',
              color: 'var(--text-secondary)',
              marginBottom: 'calc(var(--spacing) * 1)'
            }}>
              Total Gagné
            </div>
            <div style={{
              fontSize: '32px',
              fontWeight: '800',
              color: 'var(--yellow)'
            }}>
              €{creditsToEuros(earnings?.total_earned_credits || 0)}
            </div>
            <div style={{
              fontSize: '12px',
              color: 'var(--text-secondary)',
              marginTop: 'calc(var(--spacing) * 1)'
            }}>
              {(earnings?.total_earned_credits || 0).toLocaleString()} crédits
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.2), rgba(0, 217, 255, 0.1))',
            border: '2px solid rgba(0, 255, 136, 0.3)',
            borderRadius: '20px',
            padding: 'calc(var(--spacing) * 4)'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(0, 255, 136, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 'calc(var(--spacing) * 2)'
            }}>
              <DollarSign size={24} color="#00ff88" />
            </div>
            <div style={{
              fontSize: '14px',
              color: 'var(--text-secondary)',
              marginBottom: 'calc(var(--spacing) * 1)'
            }}>
              Disponible
            </div>
            <div style={{
              fontSize: '32px',
              fontWeight: '800',
              color: '#00ff88'
            }}>
              €{creditsToEuros(earnings?.available_credits || 0)}
            </div>
            <div style={{
              fontSize: '12px',
              color: 'var(--text-secondary)',
              marginTop: 'calc(var(--spacing) * 1)'
            }}>
              {(earnings?.available_credits || 0).toLocaleString()} crédits
            </div>
          </div>

          <div style={{
            background: 'var(--bg-card)',
            border: '2px solid var(--border)',
            borderRadius: '20px',
            padding: 'calc(var(--spacing) * 4)'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'var(--bg-hover)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 'calc(var(--spacing) * 2)'
            }}>
              <CreditCard size={24} color="#ffffff" />
            </div>
            <div style={{
              fontSize: '14px',
              color: 'var(--text-secondary)',
              marginBottom: 'calc(var(--spacing) * 1)'
            }}>
              Retiré
            </div>
            <div style={{
              fontSize: '32px',
              fontWeight: '800',
              color: '#ffffff'
            }}>
              €{creditsToEuros(earnings?.withdrawn_credits || 0)}
            </div>
            <div style={{
              fontSize: '12px',
              color: 'var(--text-secondary)',
              marginTop: 'calc(var(--spacing) * 1)'
            }}>
              {(earnings?.withdrawn_credits || 0).toLocaleString()} crédits
            </div>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'calc(var(--spacing) * 3)',
          marginBottom: 'calc(var(--spacing) * 6)'
        }}>
          {[
            { icon: Calendar, label: 'Sessions', value: stats.total_sessions, color: '#00d9ff' },
            { icon: Users, label: 'Viewers', value: stats.total_viewers, color: '#ff00ff' },
            { icon: Gift, label: 'Cadeaux', value: stats.total_gifts, color: '#ffd300' },
            { icon: Users, label: 'Followers', value: stats.total_followers, color: '#00ff88' }
          ].map((stat, i) => (
            <div key={i} style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              padding: 'calc(var(--spacing) * 3)',
              display: 'flex',
              alignItems: 'center',
              gap: 'calc(var(--spacing) * 2)'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: `${stat.color}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <stat.icon size={20} color={stat.color} />
              </div>
              <div>
                <div style={{
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  marginBottom: '4px'
                }}>
                  {stat.label}
                </div>
                <div style={{
                  fontSize: '24px',
                  fontWeight: '800',
                  color: '#ffffff'
                }}>
                  {stat.value.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          background: 'var(--bg-card)',
          borderRadius: '24px',
          border: '1px solid var(--border)',
          padding: 'calc(var(--spacing) * 5)',
          marginBottom: 'calc(var(--spacing) * 6)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'calc(var(--spacing) * 4)'
          }}>
            <div>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '800',
                color: '#ffffff',
                marginBottom: 'calc(var(--spacing) * 1)'
              }}>
                Demander un retrait
              </h2>
              <p style={{
                fontSize: '14px',
                color: 'var(--text-secondary)',
                margin: 0
              }}>
                Minimum: 1000 crédits (€10.00) • Taux: 1 crédit = €0.01
              </p>
            </div>
            <button
              onClick={() => setShowWithdrawal(!showWithdrawal)}
              disabled={(earnings?.available_credits || 0) < 1000}
              style={{
                padding: 'calc(var(--spacing) * 2.5) calc(var(--spacing) * 4)',
                background: (earnings?.available_credits || 0) >= 1000 ? 'linear-gradient(135deg, #00ff88, #00d9ff)' : 'rgba(100, 100, 100, 0.3)',
                border: 'none',
                borderRadius: '12px',
                color: '#000000',
                fontSize: '16px',
                fontWeight: '700',
                cursor: (earnings?.available_credits || 0) >= 1000 ? 'pointer' : 'not-allowed',
                opacity: (earnings?.available_credits || 0) >= 1000 ? 1 : 0.5
              }}
            >
              Nouveau retrait
            </button>
          </div>

          {showWithdrawal && (
            <div style={{
              padding: 'calc(var(--spacing) * 4)',
              background: 'var(--bg-hover)',
              borderRadius: '16px',
              marginBottom: 'calc(var(--spacing) * 4)'
            }}>
              <div style={{ marginBottom: 'calc(var(--spacing) * 3)' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'var(--text-secondary)',
                  marginBottom: 'calc(var(--spacing) * 1)'
                }}>
                  Montant (crédits)
                </label>
                <input
                  type="number"
                  min="1000"
                  max={earnings?.available_credits || 0}
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                  placeholder="Ex: 5000"
                  style={{
                    width: '100%',
                    padding: 'calc(var(--spacing) * 2)',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '16px'
                  }}
                />
                {withdrawalAmount && (
                  <div style={{
                    marginTop: 'calc(var(--spacing) * 1)',
                    fontSize: '14px',
                    color: '#00ff88'
                  }}>
                    ≈ €{creditsToEuros(parseInt(withdrawalAmount) || 0)}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: 'calc(var(--spacing) * 3)' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'var(--text-secondary)',
                  marginBottom: 'calc(var(--spacing) * 1)'
                }}>
                  Méthode de paiement
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{
                    width: '100%',
                    padding: 'calc(var(--spacing) * 2)',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '16px'
                  }}
                >
                  <option value="paypal">PayPal</option>
                  <option value="bank">Virement bancaire</option>
                </select>
              </div>

              <div style={{ marginBottom: 'calc(var(--spacing) * 3)' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'var(--text-secondary)',
                  marginBottom: 'calc(var(--spacing) * 1)'
                }}>
                  Email de paiement
                </label>
                <input
                  type="email"
                  value={paymentEmail}
                  onChange={(e) => setPaymentEmail(e.target.value)}
                  placeholder="votre@email.com"
                  style={{
                    width: '100%',
                    padding: 'calc(var(--spacing) * 2)',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '16px'
                  }}
                />
              </div>

              <button
                onClick={submitWithdrawal}
                disabled={submitting}
                style={{
                  width: '100%',
                  padding: 'calc(var(--spacing) * 2.5)',
                  background: 'linear-gradient(135deg, var(--yellow), #ffed4e)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#000000',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  opacity: submitting ? 0.5 : 1
                }}
              >
                {submitting ? 'Envoi...' : 'Soumettre la demande'}
              </button>
            </div>
          )}

          <div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#ffffff',
              marginBottom: 'calc(var(--spacing) * 3)'
            }}>
              Historique des retraits
            </h3>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'calc(var(--spacing) * 2)'
            }}>
              {withdrawalRequests.length === 0 ? (
                <div style={{
                  padding: 'calc(var(--spacing) * 4)',
                  textAlign: 'center',
                  color: 'var(--text-secondary)',
                  fontSize: '14px'
                }}>
                  Aucune demande de retrait
                </div>
              ) : (
                withdrawalRequests.map(req => (
                  <div key={req.id} style={{
                    padding: 'calc(var(--spacing) * 3)',
                    background: 'var(--bg-hover)',
                    borderRadius: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: '700',
                        color: '#ffffff',
                        marginBottom: '4px'
                      }}>
                        €{req.amount_euros} ({req.amount_credits.toLocaleString()} crédits)
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: 'var(--text-secondary)'
                      }}>
                        {new Date(req.created_at).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'calc(var(--spacing) * 1)',
                      padding: 'calc(var(--spacing) * 1.5) calc(var(--spacing) * 2)',
                      background: 'var(--bg-card)',
                      borderRadius: '8px'
                    }}>
                      {getStatusIcon(req.status)}
                      <span style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#ffffff',
                        textTransform: 'capitalize'
                      }}>
                        {req.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'center'
        }}>
          <Link to="/new-stream">
            <button style={{
              padding: 'calc(var(--spacing) * 3) calc(var(--spacing) * 6)',
              background: 'linear-gradient(135deg, var(--pink), #ff00ff)',
              border: 'none',
              borderRadius: '16px',
              color: '#ffffff',
              fontSize: '18px',
              fontWeight: '700',
              cursor: 'pointer'
            }}>
              Démarrer un Live
            </button>
          </Link>
        </div>
      </div>
    </Layout>
  )
}
