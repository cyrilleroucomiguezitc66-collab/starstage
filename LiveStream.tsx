import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Video, VideoOff, Mic, MicOff, Users, MessageCircle, X, Send, ArrowLeft, Ban, UserX, UserPlus, Check, XCircle, Volume2, Sparkles, DollarSign, Gift, Music, Shield } from 'lucide-react'
import { useAuth } from '../lib/auth-context'
import { supabase } from '../lib/supabase'
import { LiveSession, Profile, ChatMessage, StageParticipant, Lyric } from '../types'
import LyricsDisplay from '../components/LyricsDisplay'
import LyricsEditor from '../components/LyricsEditor'
import KaraokePlayer from '../components/KaraokePlayer'
import GiftPanel from '../components/GiftPanel'
import GiftAnimation from '../components/GiftAnimation'
import ModerationPanel from '../components/ModerationPanel'

export default function LiveStream() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [session, setSession] = useState<LiveSession | null>(null)
  const [host, setHost] = useState<Profile | null>(null)
  const [isHost, setIsHost] = useState(false)
  const [, setParticipants] = useState<(StageParticipant & { profile: Profile })[]>([])
  const [messages, setMessages] = useState<(ChatMessage & { profile: Profile })[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [showChat, setShowChat] = useState(true)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [showViewers, setShowViewers] = useState(false)
  const [viewers, setViewers] = useState<Profile[]>([])
  const [bannedUsers, setBannedUsers] = useState<string[]>([])
  const [pendingRequests, setPendingRequests] = useState<any[]>([])
  const [showRequests, setShowRequests] = useState(false)
  const [isPerformer, setIsPerformer] = useState(false)
  const [reverbLevel, setReverbLevel] = useState(0)
  const [showAudioControls, setShowAudioControls] = useState(false)
  const [showVideoEffects, setShowVideoEffects] = useState(false)
  const [videoFilter, setVideoFilter] = useState('none')
  const [backgroundBlur, setBackgroundBlur] = useState(0)
  const [virtualBackground, setVirtualBackground] = useState('none')
  const [showTipModal, setShowTipModal] = useState(false)
  const [recentTips, setRecentTips] = useState<{id: string, username: string, giftName: string, giftIcon: string, euroValue: number, message?: string, timestamp: number}[]>([])
  const [totalEarnings, setTotalEarnings] = useState(0)
  const [virtualGifts, setVirtualGifts] = useState<any[]>([])
  const [userCredits, setUserCredits] = useState(0)
  const [lyrics, setLyrics] = useState<Lyric[]>([])
  const [currentTime, setCurrentTime] = useState(0)
  const [showLyricsEditor, setShowLyricsEditor] = useState(false)
  const [showAudioUrlInput, setShowAudioUrlInput] = useState(false)
  const [audioUrlInput, setAudioUrlInput] = useState('')
  const [showGiftPanel, setShowGiftPanel] = useState(false)
  const [activeGiftAnimation, setActiveGiftAnimation] = useState<any>(null)
  const [showModerationPanel, setShowModerationPanel] = useState(false)
  const [selectedUserForModeration, setSelectedUserForModeration] = useState<{ id: string, username: string } | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const convolverRef = useRef<ConvolverNode | null>(null)
  const dryGainRef = useRef<GainNode | null>(null)
  const wetGainRef = useRef<GainNode | null>(null)
  const destinationRef = useRef<MediaStreamAudioDestinationNode | null>(null)

  useEffect(() => {
    if (sessionId) {
      loadSession()
      loadMessages()
      loadParticipants()
      loadPendingRequests()
      loadVirtualGifts()
      loadUserCredits()
      loadLyrics()
      setupRealtimeSubscriptions()
    }
  }, [sessionId])

  const handleAudioTimeUpdate = (time: number) => {
    setCurrentTime(time)
  }

  useEffect(() => {
    if (isHost || isPerformer) {
      startLocalStream()
    }

    return () => {
      stopLocalStream()
    }
  }, [isHost, isPerformer])

  const loadSession = async () => {
    try {
      const { data, error } = await supabase
        .from('live_sessions')
        .select('*')
        .eq('id', sessionId)
        .maybeSingle()

      if (error) throw error
      if (!data) {
        alert('Session introuvable')
        navigate('/')
        return
      }

      setSession(data)
      setIsHost(data.host_id === user?.id)

      const { data: hostData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.host_id)
        .maybeSingle()

      if (hostData) setHost(hostData)
    } catch (error) {
      console.error('Error loading session:', error)
    }
  }

  const loadParticipants = async () => {
    try {
      const { data, error } = await supabase
        .from('session_performers')
        .select(`
          *,
          profile:profiles(*)
        `)
        .eq('session_id', sessionId)
        .is('left_at', null)

      if (error) throw error
      setParticipants(data || [])

      const myPerformer = data?.find((p: any) => p.user_id === user?.id)
      if (myPerformer) {
        setIsPerformer(true)
      }
    } catch (error) {
      console.error('Error loading participants:', error)
    }
  }

  const loadPendingRequests = async () => {
    if (!user) return
    try {
      const { data, error } = await supabase
        .from('session_invitations')
        .select(`
          *,
          invitee:profiles!session_invitations_invitee_id_fkey(*)
        `)
        .eq('session_id', sessionId)
        .eq('status', 'pending')
        .order('created_at', { ascending: true })

      if (error) throw error
      setPendingRequests(data || [])
    } catch (error) {
      console.error('Error loading requests:', error)
    }
  }

  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select(`
          *,
          profile:profiles(*)
        `)
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true })
        .limit(100)

      if (error) throw error
      setMessages(data || [])
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }

  const loadVirtualGifts = async () => {
    try {
      const { data, error } = await supabase
        .from('gift_catalog')
        .select('*')
        .eq('is_active', true)
        .order('credit_cost', { ascending: true })

      if (error) throw error
      setVirtualGifts(data || [])
    } catch (error) {
      console.error('Error loading virtual gifts:', error)
    }
  }

  const loadUserCredits = async () => {
    if (!user) return
    try {
      const { data, error } = await supabase
        .from('user_wallets')
        .select('credits_balance')
        .eq('user_id', user.id)
        .maybeSingle()

      if (error) throw error
      setUserCredits(data?.credits_balance || 0)
    } catch (error) {
      console.error('Error loading user credits:', error)
    }
  }

  const loadLyrics = async () => {
    try {
      const { data, error } = await supabase
        .from('lyrics')
        .select('*')
        .eq('session_id', sessionId)
        .order('line_order', { ascending: true })

      if (error) throw error
      setLyrics(data || [])
    } catch (error) {
      console.error('Error loading lyrics:', error)
    }
  }

  const setupRealtimeSubscriptions = () => {
    const channel = supabase
      .channel(`session:${sessionId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `session_id=eq.${sessionId}`
      }, async (payload) => {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', payload.new.user_id)
          .maybeSingle()

        if (data) {
          setMessages(prev => [...prev, { ...payload.new as ChatMessage, profile: data }])
        }
      })
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'session_invitations',
        filter: `session_id=eq.${sessionId}`
      }, () => {
        loadPendingRequests()
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'session_invitations',
        filter: `session_id=eq.${sessionId}`
      }, () => {
        loadPendingRequests()
        loadParticipants()
      })
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'session_performers',
        filter: `session_id=eq.${sessionId}`
      }, () => {
        loadParticipants()
      })
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }

  const createReverbImpulse = (audioContext: AudioContext, duration: number, decay: number) => {
    const sampleRate = audioContext.sampleRate
    const length = sampleRate * duration
    const impulse = audioContext.createBuffer(2, length, sampleRate)
    const impulseL = impulse.getChannelData(0)
    const impulseR = impulse.getChannelData(1)

    for (let i = 0; i < length; i++) {
      const n = length - i
      impulseL[i] = (Math.random() * 2 - 1) * Math.pow(n / length, decay)
      impulseR[i] = (Math.random() * 2 - 1) * Math.pow(n / length, decay)
    }

    return impulse
  }

  const startLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
          sampleRate: 48000
        }
      })

      const audioContext = new AudioContext()
      audioContextRef.current = audioContext

      const source = audioContext.createMediaStreamSource(stream)
      sourceNodeRef.current = source

      const convolver = audioContext.createConvolver()
      convolver.buffer = createReverbImpulse(audioContext, 2, 2)
      convolverRef.current = convolver

      const dryGain = audioContext.createGain()
      dryGain.gain.value = 1
      dryGainRef.current = dryGain

      const wetGain = audioContext.createGain()
      wetGain.gain.value = 0
      wetGainRef.current = wetGain

      const destination = audioContext.createMediaStreamDestination()
      destinationRef.current = destination

      source.connect(dryGain)
      dryGain.connect(destination)

      source.connect(convolver)
      convolver.connect(wetGain)
      wetGain.connect(destination)

      const videoTrack = stream.getVideoTracks()[0]
      const processedStream = new MediaStream([videoTrack, ...destination.stream.getAudioTracks()])

      setLocalStream(processedStream)
      if (videoRef.current) {
        videoRef.current.srcObject = processedStream
      }
    } catch (error) {
      console.error('Error accessing media devices:', error)
      alert('Impossible d\'accéder à la caméra/micro. Vérifiez les permissions.')
    }
  }

  const stopLocalStream = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop())
      setLocalStream(null)
    }
    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
  }

  const updateReverbLevel = (level: number) => {
    setReverbLevel(level)
    if (wetGainRef.current && dryGainRef.current) {
      const wet = level / 100
      const dry = 1 - (wet * 0.5)
      wetGainRef.current.gain.value = wet
      dryGainRef.current.gain.value = dry
    }
  }

  const getVideoFilterStyle = () => {
    let filters = []

    if (backgroundBlur > 0 && virtualBackground === 'none') {
      filters.push(`blur(${backgroundBlur}px)`)
    }

    switch (videoFilter) {
      case 'sepia':
        filters.push('sepia(100%)')
        break
      case 'grayscale':
        filters.push('grayscale(100%)')
        break
      case 'vintage':
        filters.push('sepia(50%) contrast(1.2) brightness(0.9)')
        break
      case 'cool':
        filters.push('hue-rotate(180deg) saturate(1.5)')
        break
      case 'warm':
        filters.push('sepia(30%) saturate(1.3) brightness(1.1)')
        break
      case 'contrast':
        filters.push('contrast(1.5) brightness(1.1)')
        break
      case 'vivid':
        filters.push('saturate(2) contrast(1.3)')
        break
      default:
        break
    }

    return filters.join(' ')
  }

  const getBackgroundStyle = () => {
    switch (virtualBackground) {
      case 'stage':
        return 'linear-gradient(135deg, #1a0033 0%, #330066 50%, #4d0099 100%)'
      case 'studio':
        return 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
      case 'neon':
        return 'linear-gradient(135deg, #ff006e 0%, #8338ec 50%, #3a86ff 100%)'
      case 'sunset':
        return 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 30%, #c44569 60%, #6c5ce7 100%)'
      case 'ocean':
        return 'linear-gradient(180deg, #0077be 0%, #00b4d8 50%, #90e0ef 100%)'
      case 'forest':
        return 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 50%, #52b788 100%)'
      case 'galaxy':
        return 'radial-gradient(circle at 20% 50%, #3a0ca3 0%, #240046 50%, #10002b 100%)'
      case 'fire':
        return 'linear-gradient(135deg, #ff0000 0%, #ff6b00 30%, #ffd000 60%, #ff8800 100%)'
      default:
        return '#000000'
    }
  }

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setIsVideoEnabled(videoTrack.enabled)
      }
    }
  }

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setIsAudioEnabled(audioTrack.enabled)
      }
    }
  }

  const requestToJoinStage = async () => {
    if (!user || isHost || isPerformer) return

    try {
      const { error } = await supabase
        .from('session_invitations')
        .insert({
          session_id: sessionId,
          inviter_id: session?.host_id,
          invitee_id: user.id,
          status: 'pending'
        })

      if (error) throw error
      alert('✅ Demande envoyée! L\'hôte va la recevoir.')
    } catch (error: any) {
      if (error.code === '23505') {
        alert('Vous avez déjà envoyé une demande')
      } else {
        console.error('Error requesting to join:', error)
        alert('Erreur lors de l\'envoi de la demande')
      }
    }
  }

  const acceptRequest = async (invitationId: string, userId: string) => {
    try {
      await supabase
        .from('session_invitations')
        .update({ status: 'accepted', responded_at: new Date().toISOString() })
        .eq('id', invitationId)

      await supabase
        .from('session_performers')
        .insert({
          session_id: sessionId,
          user_id: userId,
          role: 'guest',
          is_streaming: true
        })

      await loadPendingRequests()
      await loadParticipants()
      alert('✅ Participant accepté!')
    } catch (error) {
      console.error('Error accepting request:', error)
      alert('Erreur lors de l\'acceptation')
    }
  }

  const declineRequest = async (invitationId: string) => {
    try {
      await supabase
        .from('session_invitations')
        .update({ status: 'declined', responded_at: new Date().toISOString() })
        .eq('id', invitationId)

      await loadPendingRequests()
      alert('❌ Demande refusée')
    } catch (error) {
      console.error('Error declining request:', error)
    }
  }

  const sendGift = async (gift: any) => {
    if (!user || !host) return

    if (userCredits < gift.credit_cost) {
      alert('Crédits insuffisants! Vous avez besoin de ' + gift.credit_cost + ' crédits.')
      return
    }

    try {
      const platformCommission = gift.euro_value * 0.30
      const artistEarnings = gift.euro_value * 0.70

      await supabase.from('user_wallets').update({
        credits_balance: userCredits - gift.credit_cost
      }).eq('user_id', user.id)

      await supabase.from('user_wallets').update({
        earnings_balance: supabase.rpc('increment_earnings', {
          amount: artistEarnings
        })
      }).eq('user_id', host.id)

      await supabase.from('gift_transactions_new').insert({
        session_id: sessionId,
        sender_id: user.id,
        recipient_id: host.id,
        gift_id: gift.id,
        quantity: 1,
        credits_spent: gift.credit_cost,
        platform_commission: platformCommission,
        artist_earnings: artistEarnings
      })

      setUserCredits(prev => prev - gift.credit_cost)

      const newTip = {
        id: Math.random().toString(36).substr(2, 9),
        username: user.email?.split('@')[0] || 'Anonymous',
        giftName: gift.name,
        giftIcon: gift.icon,
        euroValue: gift.euro_value,
        timestamp: Date.now()
      }

      setRecentTips(prev => [newTip, ...prev].slice(0, 10))
      setTotalEarnings(prev => prev + artistEarnings)
      setShowTipModal(false)

      setTimeout(() => {
        setRecentTips(prev => prev.filter(tip => tip.id !== newTip.id))
      }, 10000)

      await loadUserCredits()
    } catch (error) {
      console.error('Error sending gift:', error)
      alert('Erreur lors de l\'envoi du cadeau')
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    try {
      await supabase
        .from('chat_messages')
        .insert({
          session_id: sessionId,
          user_id: user?.id,
          message: newMessage.trim()
        })

      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const loadViewers = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('user_id, profile:profiles(*)')
        .eq('session_id', sessionId)

      if (error) throw error

      const uniqueViewers: Profile[] = Array.from(
        new Map((data || []).map((item: any) => [item.user_id, item.profile])).values()
      ).filter((profile): profile is Profile => profile !== null && profile !== undefined)

      setViewers(uniqueViewers)

      const { data: bans } = await supabase
        .from('banned_users')
        .select('banned_user_id')
        .eq('session_id', sessionId)

      if (bans) {
        setBannedUsers(bans.map(b => b.banned_user_id))
      }
    } catch (error) {
      console.error('Error loading viewers:', error)
    }
  }

  const banUser = async (userId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir bannir cet utilisateur?')) return

    try {
      await supabase
        .from('banned_users')
        .insert({
          session_id: sessionId,
          banned_user_id: userId,
          banned_by: user?.id
        })

      await loadViewers()
      alert('Utilisateur banni avec succès')
    } catch (error) {
      console.error('Error banning user:', error)
      alert('Erreur lors du bannissement')
    }
  }

  const unbanUser = async (userId: string) => {
    try {
      await supabase
        .from('banned_users')
        .delete()
        .eq('session_id', sessionId)
        .eq('banned_user_id', userId)

      await loadViewers()
      alert('Utilisateur débanni avec succès')
    } catch (error) {
      console.error('Error unbanning user:', error)
    }
  }

  const toggleKaraokeMode = async () => {
    if (!session) return

    try {
      const newKaraokeMode = !session.karaoke_mode

      const { error } = await supabase
        .from('live_sessions')
        .update({
          karaoke_mode: newKaraokeMode,
          vocal_reduction: newKaraokeMode ? 50 : 0,
          pitch_adjustment: 0
        })
        .eq('id', sessionId)

      if (error) throw error

      setSession({
        ...session,
        karaoke_mode: newKaraokeMode,
        vocal_reduction: newKaraokeMode ? 50 : 0,
        pitch_adjustment: 0
      })

      if (newKaraokeMode) {
        alert('✅ Mode karaoké activé!')
      } else {
        alert('❌ Mode karaoké désactivé')
      }
    } catch (error) {
      console.error('Error toggling karaoke mode:', error)
      alert('Erreur lors du changement de mode')
    }
  }

  const updateAudioUrl = async () => {
    if (!session || !audioUrlInput.trim()) return

    try {
      const { error } = await supabase
        .from('live_sessions')
        .update({ audio_url: audioUrlInput.trim() })
        .eq('id', sessionId)

      if (error) throw error

      setSession({ ...session, audio_url: audioUrlInput.trim() })
      setShowAudioUrlInput(false)
      alert('✅ Musique ajoutée avec succès!')
    } catch (error) {
      console.error('Error updating audio URL:', error)
      alert('Erreur lors de l\'ajout de la musique')
    }
  }

  const endStream = async () => {
    if (!confirm('Êtes-vous sûr de vouloir terminer cette session?')) return

    try {
      await supabase
        .from('live_sessions')
        .update({
          is_active: false,
          ended_at: new Date().toISOString()
        })
        .eq('id', sessionId)

      stopLocalStream()
      navigate('/')
    } catch (error) {
      console.error('Error ending stream:', error)
    }
  }

  if (!session) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a' }}>
        <p style={{ color: '#ffffff' }}>Chargement...</p>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', flexDirection: 'column' }}>
      <header style={{
        padding: 'calc(var(--spacing) * 2)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'calc(var(--spacing) * 1)',
            padding: 'calc(var(--spacing) * 2)',
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            borderRadius: '8px',
            color: '#ffffff',
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 style={{ color: '#ffffff', fontSize: '18px', fontWeight: '600' }}>{session.title}</h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px' }}>par {host?.display_name || host?.username}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(var(--spacing) * 2)' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'calc(var(--spacing) * 1)',
            padding: 'calc(var(--spacing) * 1.5) calc(var(--spacing) * 2.5)',
            background: 'linear-gradient(135deg, rgba(255, 0, 0, 0.25) 0%, rgba(200, 0, 0, 0.2) 100%)',
            borderRadius: '24px',
            border: '1px solid rgba(255, 0, 0, 0.3)',
            boxShadow: '0 4px 12px rgba(255, 0, 0, 0.2)'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#ff0000',
              boxShadow: '0 0 8px #ff0000',
              animation: 'pulse 2s ease-in-out infinite'
            }}></div>
            <span style={{
              color: '#ffffff',
              fontSize: '15px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>LIVE</span>
          </div>
          {session.karaoke_mode && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'calc(var(--spacing) * 1)',
              padding: 'calc(var(--spacing) * 1.5) calc(var(--spacing) * 2.5)',
              background: 'linear-gradient(135deg, rgba(255, 0, 255, 0.25) 0%, rgba(139, 0, 255, 0.2) 100%)',
              borderRadius: '24px',
              border: '1px solid rgba(255, 0, 255, 0.4)',
              boxShadow: '0 4px 12px rgba(255, 0, 255, 0.3)'
            }}>
              <Music size={16} color="#FF00FF" />
              <span style={{
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>KARAOKÉ</span>
            </div>
          )}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'calc(var(--spacing) * 1.5)',
            padding: 'calc(var(--spacing) * 1.5) calc(var(--spacing) * 2.5)',
            background: 'linear-gradient(135deg, rgba(0, 217, 255, 0.2) 0%, rgba(0, 102, 255, 0.15) 100%)',
            borderRadius: '24px',
            border: '1px solid rgba(0, 217, 255, 0.3)',
            boxShadow: '0 4px 12px rgba(0, 217, 255, 0.2)'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #00d9ff 0%, #0066ff 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0, 217, 255, 0.3)'
            }}>
              <Users size={18} color="#ffffff" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{
                color: '#ffffff',
                fontSize: '20px',
                fontWeight: '700',
                lineHeight: '1'
              }}>{session.viewer_count}</span>
              <span style={{
                color: 'rgba(0, 217, 255, 0.8)',
                fontSize: '11px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginTop: '2px'
              }}>Spectateurs</span>
            </div>
          </div>
        </div>
      </header>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 'calc(var(--spacing) * 3)' }}>
          <div style={{
            position: 'relative',
            background: virtualBackground !== 'none' ? getBackgroundStyle() : '#000000',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '16px',
            overflow: 'hidden',
            aspectRatio: '16/9',
            marginBottom: 'calc(var(--spacing) * 3)'
          }}>
            {(isHost || isPerformer) ? (
              <video
                ref={videoRef}
                autoPlay
                muted={isHost}
                playsInline
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: getVideoFilterStyle(),
                  mixBlendMode: virtualBackground !== 'none' ? 'screen' : 'normal',
                  opacity: virtualBackground !== 'none' ? 0.95 : 1
                }}
              />
            ) : (
              <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(255, 255, 255, 0.4)'
              }}>
                <Video size={64} />
              </div>
            )}

            {session.karaoke_mode && lyrics.length > 0 && (
              <LyricsDisplay lyrics={lyrics} currentTime={currentTime} />
            )}
          </div>

          {session.karaoke_mode && session.audio_url && (
            <div style={{ marginTop: 'calc(var(--spacing) * 2)', maxWidth: '900px', margin: 'calc(var(--spacing) * 2) auto 0' }}>
              <KaraokePlayer
                audioUrl={session.audio_url}
                onTimeUpdate={handleAudioTimeUpdate}
              />
            </div>
          )}

          {isHost && session.karaoke_mode && !session.audio_url && (
            <div style={{ marginTop: 'calc(var(--spacing) * 2)', maxWidth: '800px', margin: 'calc(var(--spacing) * 2) auto 0' }}>
              {!showAudioUrlInput ? (
                <button
                  onClick={() => setShowAudioUrlInput(true)}
                  style={{
                    width: '100%',
                    padding: 'calc(var(--spacing) * 3)',
                    background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.2) 0%, rgba(75, 0, 130, 0.2) 100%)',
                    border: '2px dashed rgba(138, 43, 226, 0.5)',
                    borderRadius: '12px',
                    color: '#ffffff',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '16px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(138, 43, 226, 0.3) 0%, rgba(75, 0, 130, 0.3) 100%)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(138, 43, 226, 0.2) 0%, rgba(75, 0, 130, 0.2) 100%)'
                  }}
                >
                  🎵 Ajouter une musique karaoké
                </button>
              ) : (
                <div style={{
                  padding: 'calc(var(--spacing) * 3)',
                  background: 'rgba(138, 43, 226, 0.1)',
                  border: '1px solid rgba(138, 43, 226, 0.3)',
                  borderRadius: '12px'
                }}>
                  <h3 style={{ color: '#ffffff', marginBottom: 'calc(var(--spacing) * 2)', fontSize: '18px', fontWeight: '600' }}>
                    Ajouter une musique
                  </h3>
                  <input
                    type="url"
                    value={audioUrlInput}
                    onChange={(e) => setAudioUrlInput(e.target.value)}
                    placeholder="https://youtube.com/watch?v=... ou lien direct MP3"
                    style={{
                      width: '100%',
                      padding: 'calc(var(--spacing) * 2)',
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '14px',
                      outline: 'none',
                      marginBottom: 'calc(var(--spacing) * 2)'
                    }}
                  />
                  <p style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '12px',
                    marginBottom: 'calc(var(--spacing) * 2)'
                  }}>
                    Accepte: YouTube, MP3, WAV, ou tout lien audio direct
                  </p>
                  <div style={{ display: 'flex', gap: 'calc(var(--spacing) * 2)' }}>
                    <button
                      onClick={updateAudioUrl}
                      disabled={!audioUrlInput.trim()}
                      style={{
                        flex: 1,
                        padding: 'calc(var(--spacing) * 2)',
                        background: audioUrlInput.trim() ? 'rgba(138, 43, 226, 0.8)' : 'rgba(100, 100, 100, 0.3)',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#ffffff',
                        cursor: audioUrlInput.trim() ? 'pointer' : 'not-allowed',
                        fontWeight: '600'
                      }}
                    >
                      Ajouter
                    </button>
                    <button
                      onClick={() => {
                        setShowAudioUrlInput(false)
                        setAudioUrlInput('')
                      }}
                      style={{
                        padding: 'calc(var(--spacing) * 2) calc(var(--spacing) * 3)',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#ffffff',
                        cursor: 'pointer',
                        fontWeight: '600'
                      }}
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {!isHost && !isPerformer && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 'calc(var(--spacing) * 3)',
              marginTop: 'calc(var(--spacing) * 2)'
            }}>
              <button
                onClick={() => setShowTipModal(true)}
                style={{
                  padding: 'calc(var(--spacing) * 3) calc(var(--spacing) * 5)',
                  background: 'linear-gradient(135deg, #00ff88 0%, #00d9ff 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#000000',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'calc(var(--spacing) * 2)',
                  boxShadow: '0 4px 20px rgba(0, 255, 136, 0.4)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)'
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 255, 136, 0.6)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 255, 136, 0.4)'
                }}
              >
                <DollarSign size={20} />
                <span>Offrir un Cadeau</span>
              </button>
              <button
                onClick={requestToJoinStage}
                style={{
                  padding: session.karaoke_mode ? 'calc(var(--spacing) * 4) calc(var(--spacing) * 6)' : 'calc(var(--spacing) * 3) calc(var(--spacing) * 5)',
                  background: session.karaoke_mode
                    ? 'linear-gradient(135deg, #FF00FF 0%, #8B00FF 100%)'
                    : 'linear-gradient(135deg, var(--yellow) 0%, #ffed4e 100%)',
                  border: 'none',
                  borderRadius: '16px',
                  color: session.karaoke_mode ? '#ffffff' : '#000000',
                  cursor: 'pointer',
                  fontWeight: '800',
                  fontSize: session.karaoke_mode ? '20px' : '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'calc(var(--spacing) * 2)',
                  boxShadow: session.karaoke_mode
                    ? '0 8px 32px rgba(139, 0, 255, 0.5), 0 0 40px rgba(255, 0, 255, 0.3)'
                    : '0 4px 20px rgba(255, 211, 0, 0.4)',
                  transition: 'all 0.3s',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)'
                  e.currentTarget.style.boxShadow = session.karaoke_mode
                    ? '0 12px 40px rgba(139, 0, 255, 0.6), 0 0 50px rgba(255, 0, 255, 0.4)'
                    : '0 6px 24px rgba(255, 211, 0, 0.5)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)'
                  e.currentTarget.style.boxShadow = session.karaoke_mode
                    ? '0 8px 32px rgba(139, 0, 255, 0.5), 0 0 40px rgba(255, 0, 255, 0.3)'
                    : '0 4px 20px rgba(255, 211, 0, 0.4)'
                }}
              >
                {session.karaoke_mode ? <Music size={24} /> : <UserPlus size={20} />}
                <span>{session.karaoke_mode ? '🎤 Rejoindre le Karaoké' : 'Demander à monter sur scène'}</span>
                {session.karaoke_mode && (
                  <span style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    background: 'rgba(255, 255, 255, 0.2)',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    marginLeft: 'auto'
                  }}>
                    LIVE
                  </span>
                )}
              </button>
            </div>
          )}

          {isPerformer && !isHost && (
            <div style={{
              display: 'flex',
              gap: 'calc(var(--spacing) * 2)',
              justifyContent: 'center',
              marginTop: 'calc(var(--spacing) * 2)'
            }}>
              <button
                onClick={toggleVideo}
                style={{
                  padding: 'calc(var(--spacing) * 2)',
                  background: isVideoEnabled ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 0, 0, 0.2)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'calc(var(--spacing) * 1)'
                }}
              >
                {isVideoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
                Caméra
              </button>
              <button
                onClick={toggleAudio}
                style={{
                  padding: 'calc(var(--spacing) * 2)',
                  background: isAudioEnabled ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 0, 0, 0.2)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'calc(var(--spacing) * 1)'
                }}
              >
                {isAudioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
                Micro
              </button>
              <button
                onClick={() => setShowAudioControls(!showAudioControls)}
                style={{
                  padding: 'calc(var(--spacing) * 2)',
                  background: showAudioControls ? 'rgba(255, 211, 0, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'calc(var(--spacing) * 1)'
                }}
              >
                <Volume2 size={20} />
                Audio
              </button>
              <button
                onClick={() => setShowVideoEffects(!showVideoEffects)}
                style={{
                  padding: 'calc(var(--spacing) * 2)',
                  background: showVideoEffects ? 'rgba(255, 0, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'calc(var(--spacing) * 1)'
                }}
              >
                <Sparkles size={20} />
                Vidéo
              </button>
            </div>
          )}

          {isHost && showLyricsEditor && session.karaoke_mode && (
            <div style={{
              marginTop: 'calc(var(--spacing) * 3)',
              maxWidth: '800px',
              margin: 'calc(var(--spacing) * 3) auto 0'
            }}>
              <LyricsEditor
                sessionId={sessionId!}
                lyrics={lyrics}
                onLyricsUpdate={(newLyrics) => {
                  setLyrics(newLyrics)
                  setShowLyricsEditor(false)
                }}
              />
            </div>
          )}

          {(isHost || isPerformer) && showAudioControls && (
            <div style={{
              marginTop: 'calc(var(--spacing) * 3)',
              padding: 'calc(var(--spacing) * 3)',
              background: 'rgba(255, 211, 0, 0.1)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 211, 0, 0.3)',
              maxWidth: '500px',
              margin: 'calc(var(--spacing) * 3) auto 0'
            }}>
              <div style={{ marginBottom: 'calc(var(--spacing) * 2)' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 'calc(var(--spacing) * 2)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(var(--spacing) * 1)' }}>
                    <Volume2 size={20} color="var(--yellow)" />
                    <span style={{ color: '#ffffff', fontWeight: '600', fontSize: '16px' }}>
                      Réverbération
                    </span>
                  </div>
                  <span style={{
                    color: 'var(--yellow)',
                    fontWeight: '700',
                    fontSize: '18px',
                    minWidth: '50px',
                    textAlign: 'right'
                  }}>
                    {reverbLevel}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={reverbLevel}
                  onChange={(e) => updateReverbLevel(Number(e.target.value))}
                  style={{
                    width: '100%',
                    height: '8px',
                    borderRadius: '4px',
                    background: `linear-gradient(to right, var(--yellow) 0%, var(--yellow) ${reverbLevel}%, rgba(255, 255, 255, 0.2) ${reverbLevel}%, rgba(255, 255, 255, 0.2) 100%)`,
                    outline: 'none',
                    cursor: 'pointer',
                    appearance: 'none',
                    WebkitAppearance: 'none'
                  }}
                />
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: 'calc(var(--spacing) * 1)',
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.6)'
                }}>
                  <span>Sec</span>
                  <span>Max</span>
                </div>
              </div>
            </div>
          )}

          {(isHost || isPerformer) && showVideoEffects && (
            <div style={{
              marginTop: 'calc(var(--spacing) * 3)',
              padding: 'calc(var(--spacing) * 3)',
              background: 'rgba(255, 0, 255, 0.1)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 0, 255, 0.3)',
              maxWidth: '600px',
              margin: 'calc(var(--spacing) * 3) auto 0'
            }}>
              <div style={{ marginBottom: 'calc(var(--spacing) * 3)' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'calc(var(--spacing) * 1)',
                  marginBottom: 'calc(var(--spacing) * 2)'
                }}>
                  <Sparkles size={20} color="#ff00ff" />
                  <span style={{ color: '#ffffff', fontWeight: '600', fontSize: '16px' }}>
                    Filtres Vidéo
                  </span>
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: 'calc(var(--spacing) * 2)'
                }}>
                  {[
                    { id: 'none', label: 'Normal' },
                    { id: 'sepia', label: 'Sépia' },
                    { id: 'grayscale', label: 'N&B' },
                    { id: 'vintage', label: 'Vintage' },
                    { id: 'cool', label: 'Cool' },
                    { id: 'warm', label: 'Chaud' },
                    { id: 'contrast', label: 'Contraste' },
                    { id: 'vivid', label: 'Vif' }
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setVideoFilter(filter.id)}
                      style={{
                        padding: 'calc(var(--spacing) * 2)',
                        background: videoFilter === filter.id ? 'rgba(255, 0, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                        border: videoFilter === filter.id ? '2px solid #ff00ff' : '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '12px',
                        color: '#ffffff',
                        cursor: 'pointer',
                        fontWeight: videoFilter === filter.id ? '700' : '600',
                        fontSize: '14px',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        if (videoFilter !== filter.id) {
                          e.currentTarget.style.background = 'rgba(255, 0, 255, 0.15)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (videoFilter !== filter.id) {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                        }
                      }}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 'calc(var(--spacing) * 2)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(var(--spacing) * 1)' }}>
                    <Sparkles size={20} color="#ff00ff" />
                    <span style={{ color: '#ffffff', fontWeight: '600', fontSize: '16px' }}>
                      Flou Arrière-plan
                    </span>
                  </div>
                  <span style={{
                    color: '#ff00ff',
                    fontWeight: '700',
                    fontSize: '18px',
                    minWidth: '50px',
                    textAlign: 'right'
                  }}>
                    {backgroundBlur}px
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={backgroundBlur}
                  onChange={(e) => setBackgroundBlur(Number(e.target.value))}
                  style={{
                    width: '100%',
                    height: '8px',
                    borderRadius: '4px',
                    background: `linear-gradient(to right, #ff00ff 0%, #ff00ff ${(backgroundBlur / 20) * 100}%, rgba(255, 255, 255, 0.2) ${(backgroundBlur / 20) * 100}%, rgba(255, 255, 255, 0.2) 100%)`,
                    outline: 'none',
                    cursor: 'pointer',
                    appearance: 'none',
                    WebkitAppearance: 'none'
                  }}
                />
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: 'calc(var(--spacing) * 1)',
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.6)'
                }}>
                  <span>Net</span>
                  <span>Flou Max</span>
                </div>
              </div>

              <div style={{
                marginTop: 'calc(var(--spacing) * 3)',
                paddingTop: 'calc(var(--spacing) * 3)',
                borderTop: '1px solid rgba(255, 0, 255, 0.2)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'calc(var(--spacing) * 1)',
                  marginBottom: 'calc(var(--spacing) * 2)'
                }}>
                  <Sparkles size={20} color="#ff00ff" />
                  <span style={{ color: '#ffffff', fontWeight: '600', fontSize: '16px' }}>
                    Arrière-plans Virtuels
                  </span>
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 'calc(var(--spacing) * 2)'
                }}>
                  {[
                    { id: 'none', label: 'Aucun', gradient: 'transparent' },
                    { id: 'stage', label: 'Scène', gradient: 'linear-gradient(135deg, #1a0033 0%, #330066 50%, #4d0099 100%)' },
                    { id: 'studio', label: 'Studio', gradient: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' },
                    { id: 'neon', label: 'Néon', gradient: 'linear-gradient(135deg, #ff006e 0%, #8338ec 50%, #3a86ff 100%)' },
                    { id: 'sunset', label: 'Coucher', gradient: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 30%, #c44569 60%, #6c5ce7 100%)' },
                    { id: 'ocean', label: 'Océan', gradient: 'linear-gradient(180deg, #0077be 0%, #00b4d8 50%, #90e0ef 100%)' },
                    { id: 'forest', label: 'Forêt', gradient: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 50%, #52b788 100%)' },
                    { id: 'galaxy', label: 'Galaxie', gradient: 'radial-gradient(circle at 20% 50%, #3a0ca3 0%, #240046 50%, #10002b 100%)' },
                    { id: 'fire', label: 'Feu', gradient: 'linear-gradient(135deg, #ff0000 0%, #ff6b00 30%, #ffd000 60%, #ff8800 100%)' }
                  ].map((bg) => (
                    <button
                      key={bg.id}
                      onClick={() => setVirtualBackground(bg.id)}
                      style={{
                        position: 'relative',
                        padding: '0',
                        height: '80px',
                        background: bg.gradient,
                        border: virtualBackground === bg.id ? '3px solid #ff00ff' : '2px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'center'
                      }}
                      onMouseEnter={(e) => {
                        if (virtualBackground !== bg.id) {
                          e.currentTarget.style.border = '2px solid rgba(255, 0, 255, 0.5)'
                          e.currentTarget.style.transform = 'scale(1.05)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (virtualBackground !== bg.id) {
                          e.currentTarget.style.border = '2px solid rgba(255, 255, 255, 0.2)'
                          e.currentTarget.style.transform = 'scale(1)'
                        }
                      }}
                    >
                      <span style={{
                        padding: 'calc(var(--spacing) * 1)',
                        background: 'rgba(0, 0, 0, 0.7)',
                        color: '#ffffff',
                        fontSize: '12px',
                        fontWeight: '600',
                        width: '100%',
                        textAlign: 'center'
                      }}>
                        {bg.label}
                      </span>
                      {virtualBackground === bg.id && (
                        <div style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: '#ff00ff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px'
                        }}>
                          ✓
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {isHost && (
            <div style={{
              display: 'flex',
              gap: 'calc(var(--spacing) * 2)',
              justifyContent: 'center'
            }}>
              <button
                onClick={toggleVideo}
                style={{
                  padding: 'calc(var(--spacing) * 2)',
                  background: isVideoEnabled ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 0, 0, 0.2)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'calc(var(--spacing) * 1)'
                }}
              >
                {isVideoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
                Caméra
              </button>
              <button
                onClick={toggleAudio}
                style={{
                  padding: 'calc(var(--spacing) * 2)',
                  background: isAudioEnabled ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 0, 0, 0.2)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'calc(var(--spacing) * 1)'
                }}
              >
                {isAudioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
                Micro
              </button>
              <button
                onClick={() => setShowAudioControls(!showAudioControls)}
                style={{
                  padding: 'calc(var(--spacing) * 2)',
                  background: showAudioControls ? 'rgba(255, 211, 0, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'calc(var(--spacing) * 1)'
                }}
              >
                <Volume2 size={20} />
                Audio
              </button>
              <button
                onClick={() => setShowVideoEffects(!showVideoEffects)}
                style={{
                  padding: 'calc(var(--spacing) * 2)',
                  background: showVideoEffects ? 'rgba(255, 0, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'calc(var(--spacing) * 1)'
                }}
              >
                <Sparkles size={20} />
                Vidéo
              </button>
              <button
                onClick={toggleKaraokeMode}
                style={{
                  padding: 'calc(var(--spacing) * 2)',
                  background: session.karaoke_mode ? 'rgba(255, 211, 0, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                  border: session.karaoke_mode ? '2px solid var(--yellow)' : 'none',
                  borderRadius: '12px',
                  color: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'calc(var(--spacing) * 1)',
                  fontWeight: session.karaoke_mode ? '700' : '400'
                }}
              >
                <Music size={20} />
                Karaoké
              </button>
              {session.karaoke_mode && (
                <button
                  onClick={() => setShowLyricsEditor(!showLyricsEditor)}
                  style={{
                    padding: 'calc(var(--spacing) * 2)',
                    background: showLyricsEditor ? 'rgba(255, 211, 0, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'calc(var(--spacing) * 1)'
                  }}
                >
                  <Music size={20} />
                  Paroles
                </button>
              )}
              <button
                onClick={() => {
                  setShowViewers(!showViewers)
                  if (!showViewers) loadViewers()
                }}
                style={{
                  padding: 'calc(var(--spacing) * 2)',
                  background: showViewers ? 'rgba(0, 217, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'calc(var(--spacing) * 1)'
                }}
              >
                <Users size={20} />
                Spectateurs
              </button>
              <button
                onClick={() => {
                  setShowRequests(!showRequests)
                  if (!showRequests) loadPendingRequests()
                }}
                style={{
                  padding: 'calc(var(--spacing) * 2)',
                  background: showRequests ? 'rgba(255, 211, 0, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'calc(var(--spacing) * 1)',
                  position: 'relative'
                }}
              >
                <UserPlus size={20} />
                Demandes
                {pendingRequests.length > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    background: '#ff0000',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: '700'
                  }}>
                    {pendingRequests.length}
                  </span>
                )}
              </button>
              <button
                onClick={endStream}
                style={{
                  padding: 'calc(var(--spacing) * 2) calc(var(--spacing) * 3)',
                  background: '#ff0000',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#ffffff',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Terminer le live
              </button>
            </div>
          )}
        </div>

        {showRequests && isHost && (
          <div style={{
            width: '360px',
            borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(0, 0, 0, 0.5)',
            maxHeight: '100vh',
            overflowY: 'auto'
          }}>
            <div style={{
              padding: 'calc(var(--spacing) * 2)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'sticky',
              top: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              zIndex: 10
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(var(--spacing) * 1)' }}>
                <UserPlus size={20} color="var(--yellow)" />
                <span style={{ color: '#ffffff', fontWeight: '600', fontSize: '16px' }}>
                  Demandes ({pendingRequests.length})
                </span>
              </div>
              <button
                onClick={() => setShowRequests(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.6)',
                  cursor: 'pointer',
                  padding: 'calc(var(--spacing) * 1)'
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ flex: 1, padding: 'calc(var(--spacing) * 2)' }}>
              {pendingRequests.length === 0 ? (
                <p style={{ color: 'rgba(255, 255, 255, 0.5)', textAlign: 'center', padding: 'calc(var(--spacing) * 3)' }}>
                  Aucune demande en attente
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(var(--spacing) * 2)' }}>
                  {pendingRequests.map((request) => (
                    <div
                      key={request.id}
                      style={{
                        padding: 'calc(var(--spacing) * 2)',
                        background: 'rgba(255, 211, 0, 0.1)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 211, 0, 0.3)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(var(--spacing) * 1.5)', marginBottom: 'calc(var(--spacing) * 2)' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, var(--yellow) 0%, #ffed4e 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#000000',
                          fontWeight: '700',
                          fontSize: '16px'
                        }}>
                          {request.invitee?.display_name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ color: '#ffffff', fontSize: '15px', fontWeight: '600' }}>
                            {request.invitee?.display_name || request.invitee?.username}
                          </div>
                          <div style={{ color: 'rgba(255, 211, 0, 0.8)', fontSize: '12px', marginTop: '2px' }}>
                            Veut monter sur scène
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 'calc(var(--spacing) * 1.5)' }}>
                        <button
                          onClick={() => acceptRequest(request.id, request.invitee_id)}
                          style={{
                            flex: 1,
                            padding: 'calc(var(--spacing) * 2)',
                            background: 'rgba(0, 255, 0, 0.2)',
                            border: '1px solid rgba(0, 255, 0, 0.4)',
                            borderRadius: '8px',
                            color: '#00ff00',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 'calc(var(--spacing) * 1)'
                          }}
                        >
                          <Check size={16} />
                          Accepter
                        </button>
                        <button
                          onClick={() => declineRequest(request.id)}
                          style={{
                            flex: 1,
                            padding: 'calc(var(--spacing) * 2)',
                            background: 'rgba(255, 0, 0, 0.2)',
                            border: '1px solid rgba(255, 0, 0, 0.4)',
                            borderRadius: '8px',
                            color: '#ff6b6b',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 'calc(var(--spacing) * 1)'
                          }}
                        >
                          <XCircle size={16} />
                          Refuser
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {showViewers && isHost && (
          <div style={{
            width: '320px',
            borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(0, 0, 0, 0.5)',
            maxHeight: '100vh',
            overflowY: 'auto'
          }}>
            <div style={{
              padding: 'calc(var(--spacing) * 2)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'sticky',
              top: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              zIndex: 10
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(var(--spacing) * 1)' }}>
                <Users size={20} color="#ffffff" />
                <span style={{ color: '#ffffff', fontWeight: '600', fontSize: '16px' }}>
                  Spectateurs ({viewers.length})
                </span>
              </div>
              <button
                onClick={() => setShowViewers(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.6)',
                  cursor: 'pointer',
                  padding: 'calc(var(--spacing) * 1)'
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ flex: 1, padding: 'calc(var(--spacing) * 2)' }}>
              {viewers.length === 0 ? (
                <p style={{ color: 'rgba(255, 255, 255, 0.5)', textAlign: 'center', padding: 'calc(var(--spacing) * 3)' }}>
                  Aucun spectateur pour le moment
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(var(--spacing) * 1)' }}>
                  {viewers.map((viewer) => {
                    const isBanned = bannedUsers.includes(viewer.id)
                    return (
                      <div
                        key={viewer.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: 'calc(var(--spacing) * 1.5)',
                          background: isBanned ? 'rgba(255, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '8px',
                          border: isBanned ? '1px solid rgba(255, 0, 0, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(var(--spacing) * 1.5)' }}>
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #00d9ff 0%, #0066ff 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ffffff',
                            fontWeight: '600',
                            fontSize: '14px'
                          }}>
                            {viewer.display_name?.[0]?.toUpperCase() || viewer.username?.[0]?.toUpperCase() || '?'}
                          </div>
                          <div>
                            <div style={{ color: '#ffffff', fontSize: '14px', fontWeight: '600' }}>
                              {viewer.display_name || viewer.username}
                            </div>
                            {isBanned && (
                              <div style={{ color: '#ff6b6b', fontSize: '11px', marginTop: '2px' }}>
                                Banni
                              </div>
                            )}
                          </div>
                        </div>
                        {viewer.id !== user?.id && (
                          isBanned ? (
                            <button
                              onClick={() => unbanUser(viewer.id)}
                              style={{
                                background: 'rgba(0, 255, 0, 0.2)',
                                border: '1px solid rgba(0, 255, 0, 0.3)',
                                borderRadius: '6px',
                                padding: 'calc(var(--spacing) * 1)',
                                cursor: 'pointer',
                                color: '#00ff00',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'calc(var(--spacing) * 0.5)'
                              }}
                              title="Débannir"
                            >
                              <UserX size={14} />
                            </button>
                          ) : (
                            <button
                              onClick={() => banUser(viewer.id)}
                              style={{
                                background: 'rgba(255, 0, 0, 0.2)',
                                border: '1px solid rgba(255, 0, 0, 0.3)',
                                borderRadius: '6px',
                                padding: 'calc(var(--spacing) * 1)',
                                cursor: 'pointer',
                                color: '#ff6b6b',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'calc(var(--spacing) * 0.5)'
                              }}
                              title="Bannir"
                            >
                              <Ban size={14} />
                            </button>
                          )
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {showChat && (
          <div style={{
            width: '360px',
            borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{
              padding: 'calc(var(--spacing) * 2)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(var(--spacing) * 1)' }}>
                <MessageCircle size={20} color="#00d9ff" />
                <h3 style={{ color: '#ffffff', fontSize: '16px', fontWeight: '600' }}>Chat</h3>
              </div>
              <button
                onClick={() => setShowChat(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.6)',
                  cursor: 'pointer',
                  padding: 'calc(var(--spacing) * 1)'
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: 'calc(var(--spacing) * 2)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'calc(var(--spacing) * 2)'
            }}>
              {messages.map((msg) => (
                <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', gap: 'calc(var(--spacing) * 0.5)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(var(--spacing) * 1)' }}>
                    <span
                      onClick={() => {
                        if (msg.user_id !== user?.id) {
                          setSelectedUserForModeration({
                            id: msg.user_id,
                            username: msg.profile?.display_name || msg.profile?.username || 'User'
                          })
                          setShowModerationPanel(true)
                        }
                      }}
                      style={{
                        color: '#00d9ff',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: msg.user_id !== user?.id ? 'pointer' : 'default',
                        textDecoration: msg.user_id !== user?.id ? 'underline' : 'none'
                      }}
                    >
                      {msg.profile?.display_name || msg.profile?.username}
                    </span>
                    {msg.user_id !== user?.id && (
                      <Shield size={12} color="rgba(255, 255, 255, 0.4)" style={{ cursor: 'pointer' }} />
                    )}
                  </div>
                  <p style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '14px',
                    wordWrap: 'break-word'
                  }}>
                    {msg.message}
                  </p>
                </div>
              ))}
            </div>

            <form
              onSubmit={sendMessage}
              style={{
                padding: 'calc(var(--spacing) * 2)',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                gap: 'calc(var(--spacing) * 1)'
              }}
            >
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Envoyer un message..."
                style={{
                  flex: 1,
                  padding: 'calc(var(--spacing) * 2)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                style={{
                  padding: 'calc(var(--spacing) * 2)',
                  background: newMessage.trim() ? '#00d9ff' : 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#ffffff',
                  cursor: newMessage.trim() ? 'pointer' : 'not-allowed'
                }}
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        )}

        {!showChat && (
          <div style={{
            position: 'fixed',
            right: 'calc(var(--spacing) * 3)',
            bottom: 'calc(var(--spacing) * 3)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'calc(var(--spacing) * 2)',
            zIndex: 50
          }}>
            <button
              onClick={() => setShowChat(true)}
              style={{
                padding: 'calc(var(--spacing) * 2)',
                background: '#00d9ff',
                border: 'none',
                borderRadius: '50%',
                color: '#ffffff',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(0, 217, 255, 0.4)',
                width: '56px',
                height: '56px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <MessageCircle size={24} />
            </button>
            {!isHost && (
              <button
                onClick={() => setShowGiftPanel(true)}
                style={{
                  padding: 'calc(var(--spacing) * 2)',
                  background: 'linear-gradient(135deg, var(--yellow), #ffed4e)',
                  border: 'none',
                  borderRadius: '50%',
                  color: '#000000',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(255, 211, 0, 0.4)',
                  width: '56px',
                  height: '56px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Gift size={24} />
              </button>
            )}
          </div>
        )}

        {recentTips.length > 0 && (
          <div style={{
            position: 'fixed',
            top: '100px',
            right: showChat ? '440px' : '80px',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            gap: 'calc(var(--spacing) * 2)',
            maxWidth: '320px'
          }}>
            {recentTips.map((tip) => (
              <div
                key={tip.id}
                style={{
                  background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.95) 0%, rgba(0, 217, 255, 0.95) 100%)',
                  padding: 'calc(var(--spacing) * 3)',
                  borderRadius: '16px',
                  boxShadow: '0 8px 32px rgba(0, 255, 136, 0.4)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  animation: 'slideInRight 0.5s ease-out',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'calc(var(--spacing) * 2)',
                  marginBottom: tip.message ? 'calc(var(--spacing) * 1)' : '0'
                }}>
                  <div style={{
                    fontSize: '40px'
                  }}>
                    {tip.giftIcon}
                  </div>
                  <div>
                    <div style={{
                      color: '#000000',
                      fontWeight: '700',
                      fontSize: '16px'
                    }}>
                      {tip.username}
                    </div>
                    <div style={{
                      color: '#000000',
                      fontWeight: '600',
                      fontSize: '14px',
                      marginTop: '2px'
                    }}>
                      {tip.giftName}
                    </div>
                    <div style={{
                      color: '#000000',
                      fontWeight: '800',
                      fontSize: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'calc(var(--spacing) * 0.5)',
                      marginTop: '2px'
                    }}>
                      <DollarSign size={16} />
                      {tip.euroValue.toFixed(2)}
                    </div>
                  </div>
                </div>
                {tip.message && (
                  <div style={{
                    color: '#000000',
                    fontSize: '14px',
                    marginTop: 'calc(var(--spacing) * 1)',
                    fontStyle: 'italic'
                  }}>
                    "{tip.message}"
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {isHost && totalEarnings > 0 && (
          <div style={{
            position: 'fixed',
            top: '100px',
            left: '80px',
            zIndex: 1000,
            background: 'linear-gradient(135deg, rgba(255, 211, 0, 0.95) 0%, rgba(255, 150, 0, 0.95) 100%)',
            padding: 'calc(var(--spacing) * 3)',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(255, 211, 0, 0.4)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{
              fontSize: '12px',
              color: '#000000',
              fontWeight: '600',
              marginBottom: 'calc(var(--spacing) * 0.5)',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Revenus du Live
            </div>
            <div style={{
              fontSize: '32px',
              fontWeight: '800',
              color: '#000000',
              display: 'flex',
              alignItems: 'center',
              gap: 'calc(var(--spacing) * 1)'
            }}>
              <DollarSign size={28} />
              {totalEarnings}
            </div>
          </div>
        )}

        {showTipModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: 'calc(var(--spacing) * 4)'
          }}>
            <div style={{
              background: 'var(--bg-card)',
              borderRadius: '24px',
              padding: 'calc(var(--spacing) * 6)',
              maxWidth: '500px',
              width: '100%',
              border: '1px solid var(--border)',
              position: 'relative'
            }}>
              <button
                onClick={() => setShowTipModal(false)}
                style={{
                  position: 'absolute',
                  top: 'calc(var(--spacing) * 3)',
                  right: 'calc(var(--spacing) * 3)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#ffffff'
                }}
              >
                <X size={18} />
              </button>

              <div style={{
                textAlign: 'center',
                marginBottom: 'calc(var(--spacing) * 4)'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #00ff88 0%, #00d9ff 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto calc(var(--spacing) * 3)'
                }}>
                  <Gift size={40} color="#000000" />
                </div>
                <h2 style={{
                  fontSize: '28px',
                  fontWeight: '800',
                  color: '#ffffff',
                  marginBottom: 'calc(var(--spacing) * 1)'
                }}>
                  Offrir un Cadeau
                </h2>
                <p style={{
                  fontSize: '16px',
                  color: 'var(--text-secondary)',
                  margin: 0,
                  marginBottom: 'calc(var(--spacing) * 2)'
                }}>
                  Soutenez {host?.display_name || host?.username || 'l\'artiste'}
                </p>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'calc(var(--spacing) * 1)',
                  padding: 'calc(var(--spacing) * 2) calc(var(--spacing) * 3)',
                  background: 'rgba(255, 211, 0, 0.1)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 211, 0, 0.3)'
                }}>
                  <Sparkles size={16} color="var(--yellow)" />
                  <span style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    color: 'var(--yellow)'
                  }}>
                    {userCredits.toLocaleString()} Crédits
                  </span>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 'calc(var(--spacing) * 2)',
                marginBottom: 'calc(var(--spacing) * 4)',
                maxHeight: '400px',
                overflowY: 'auto'
              }}>
                {virtualGifts.map((gift) => (
                  <button
                    key={gift.id}
                    onClick={() => sendGift(gift)}
                    disabled={userCredits < gift.credit_cost}
                    style={{
                      padding: 'calc(var(--spacing) * 3)',
                      background: userCredits >= gift.credit_cost ? 'rgba(0, 255, 136, 0.1)' : 'rgba(100, 100, 100, 0.1)',
                      border: userCredits >= gift.credit_cost ? '2px solid rgba(0, 255, 136, 0.3)' : '2px solid rgba(100, 100, 100, 0.3)',
                      borderRadius: '16px',
                      cursor: userCredits >= gift.credit_cost ? 'pointer' : 'not-allowed',
                      transition: 'all 0.2s',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 'calc(var(--spacing) * 1)',
                      opacity: userCredits >= gift.credit_cost ? 1 : 0.5
                    }}
                    onMouseEnter={(e) => {
                      if (userCredits >= gift.credit_cost) {
                        e.currentTarget.style.background = 'rgba(0, 255, 136, 0.2)'
                        e.currentTarget.style.borderColor = '#00ff88'
                        e.currentTarget.style.transform = 'scale(1.05)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (userCredits >= gift.credit_cost) {
                        e.currentTarget.style.background = 'rgba(0, 255, 136, 0.1)'
                        e.currentTarget.style.borderColor = 'rgba(0, 255, 136, 0.3)'
                        e.currentTarget.style.transform = 'scale(1)'
                      }
                    }}
                  >
                    <span style={{ fontSize: '48px' }}>{gift.icon}</span>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      color: '#ffffff',
                      textAlign: 'center'
                    }}>
                      {gift.name}
                    </span>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'calc(var(--spacing) * 0.5)'
                    }}>
                      <Sparkles size={14} color="var(--yellow)" />
                      <span style={{
                        fontSize: '16px',
                        fontWeight: '800',
                        color: 'var(--yellow)'
                      }}>
                        {gift.credit_cost}
                      </span>
                    </div>
                    <span style={{
                      fontSize: '12px',
                      color: 'var(--text-secondary)'
                    }}>
                      {gift.euro_value}€
                    </span>
                  </button>
                ))}
              </div>

              <div style={{
                padding: 'calc(var(--spacing) * 3)',
                background: 'rgba(0, 217, 255, 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(0, 217, 255, 0.3)',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '14px',
                  color: '#00d9ff',
                  fontWeight: '600',
                  marginBottom: 'calc(var(--spacing) * 1)'
                }}>
                  💡 Commission: 30% plateforme - 70% artiste
                </div>
                <div style={{
                  fontSize: '13px',
                  color: 'var(--text-secondary)'
                }}>
                  Vos cadeaux soutiennent directement l'artiste et apparaissent en direct!
                </div>
              </div>
            </div>
          </div>
        )}

        {!isHost && showGiftPanel && session?.host_id && (
          <div style={{
            position: 'fixed',
            right: 'calc(var(--spacing) * 2)',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '320px',
            maxHeight: '80vh',
            zIndex: 100
          }}>
            <GiftPanel
              sessionId={sessionId!}
              hostId={session.host_id}
              onGiftSent={async (gift) => {
                const { data: profile } = await supabase
                  .from('profiles')
                  .select('display_name, username')
                  .eq('id', user?.id)
                  .maybeSingle()

                setActiveGiftAnimation({
                  ...gift,
                  senderName: profile?.display_name || profile?.username || 'Anonymous'
                })
                setShowGiftPanel(false)
              }}
            />
            <button
              onClick={() => setShowGiftPanel(false)}
              style={{
                position: 'absolute',
                top: 'calc(var(--spacing) * 1)',
                right: 'calc(var(--spacing) * 1)',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(0, 0, 0, 0.7)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 101
              }}
            >
              <X size={18} color="#ffffff" />
            </button>
          </div>
        )}

        {activeGiftAnimation && (
          <GiftAnimation
            gift={activeGiftAnimation}
            senderName={activeGiftAnimation.senderName}
            onComplete={() => setActiveGiftAnimation(null)}
          />
        )}

        {showModerationPanel && selectedUserForModeration && (
          <ModerationPanel
            userId={selectedUserForModeration.id}
            sessionId={sessionId}
            username={selectedUserForModeration.username}
            onClose={() => {
              setShowModerationPanel(false)
              setSelectedUserForModeration(null)
            }}
          />
        )}
      </div>
    </div>
  )
}
