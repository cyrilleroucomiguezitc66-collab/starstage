import { supabase } from './supabase'

export async function createDemoSessions() {
  const demoSessions = [
    {
      title: '🎸 Jam Session Acoustique',
      description: 'Session guitare acoustique chill, venez discuter!',
      viewer_count: 127,
      started_at: new Date(Date.now() - 45 * 60000).toISOString(),
    },
    {
      title: '🎹 Piano Jazz Live',
      description: 'Standards de jazz et improvisations',
      viewer_count: 89,
      started_at: new Date(Date.now() - 30 * 60000).toISOString(),
    },
    {
      title: '🎤 Rap Freestyle Battle',
      description: 'Battles et impros, participez en commentaires!',
      viewer_count: 234,
      started_at: new Date(Date.now() - 15 * 60000).toISOString(),
    },
    {
      title: '🥁 Drum Cover Session',
      description: 'Covers rock/metal sur demande',
      viewer_count: 156,
      started_at: new Date(Date.now() - 60 * 60000).toISOString(),
    },
    {
      title: '🎧 DJ Set Electro House',
      description: 'Mix électro progressif pour bien commencer la soirée',
      viewer_count: 312,
      started_at: new Date(Date.now() - 20 * 60000).toISOString(),
    },
  ]

  const { data: user } = await supabase.auth.getUser()

  if (!user.user) {
    console.log('Utilisateur non connecté')
    return
  }

  const currentUserId = user.user.id

  for (const session of demoSessions) {
    await supabase.from('live_sessions').insert({
      host_id: currentUserId,
      title: session.title,
      description: session.description,
      is_active: true,
      viewer_count: session.viewer_count,
      started_at: session.started_at,
    })
  }

  console.log('Sessions de démo créées!')
}

export async function clearDemoSessions() {
  const { data: user } = await supabase.auth.getUser()

  if (!user.user) return

  const { data: sessions } = await supabase
    .from('live_sessions')
    .select('id')
    .eq('host_id', user.user.id)

  if (sessions) {
    for (const session of sessions) {
      await supabase
        .from('live_sessions')
        .delete()
        .eq('id', session.id)
    }
  }

  console.log('Sessions de démo supprimées!')
}

export function getPrivateDemoSessions() {
  const privateSessions = [
    {
      id: 'demo-private-1',
      title: '🎻 Session Violon Classique',
      host_name: 'Violon Virtuose',
      viewer_count: 45,
      started_at: new Date(Date.now() - 25 * 60000).toISOString(),
      isPrivate: true,
      thumbnail: 'https://images.pexels.com/photos/7520385/pexels-photo-7520385.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 'demo-private-2',
      title: '🎺 Trompette Jazz Trio',
      host_name: 'Jazz Masters',
      viewer_count: 78,
      started_at: new Date(Date.now() - 40 * 60000).toISOString(),
      isPrivate: true,
      thumbnail: 'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 'demo-private-3',
      title: '🎸 Metal Shredding Practice',
      host_name: 'MetalGod666',
      viewer_count: 203,
      started_at: new Date(Date.now() - 10 * 60000).toISOString(),
      isPrivate: true,
      thumbnail: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 'demo-private-4',
      title: '🎤 Session Chant Lyrique',
      host_name: 'Soprano Divine',
      viewer_count: 56,
      started_at: new Date(Date.now() - 50 * 60000).toISOString(),
      isPrivate: true,
      thumbnail: 'https://images.pexels.com/photos/3756774/pexels-photo-3756774.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 'demo-private-5',
      title: '🎹 Synthwave Production Live',
      host_name: 'Retro Beats',
      viewer_count: 167,
      started_at: new Date(Date.now() - 35 * 60000).toISOString(),
      isPrivate: true,
      thumbnail: 'https://images.pexels.com/photos/210922/pexels-photo-210922.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 'demo-private-6',
      title: '🥁 Percussions Africaines',
      host_name: 'Djembé Master',
      viewer_count: 92,
      started_at: new Date(Date.now() - 55 * 60000).toISOString(),
      isPrivate: true,
      thumbnail: 'https://images.pexels.com/photos/995301/pexels-photo-995301.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 'demo-private-7',
      title: '🎸 Bossa Nova Acoustique',
      host_name: 'Rio Sounds',
      viewer_count: 134,
      started_at: new Date(Date.now() - 20 * 60000).toISOString(),
      isPrivate: true,
      thumbnail: 'https://images.pexels.com/photos/1751731/pexels-photo-1751731.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 'demo-private-8',
      title: '🎧 Techno Underground Mix',
      host_name: 'DJ TechnoKid',
      viewer_count: 289,
      started_at: new Date(Date.now() - 65 * 60000).toISOString(),
      isPrivate: true,
      thumbnail: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 'demo-private-9',
      title: '🎤 Rap US Old School',
      host_name: 'MC Vintage',
      viewer_count: 178,
      started_at: new Date(Date.now() - 15 * 60000).toISOString(),
      isPrivate: true,
      thumbnail: 'https://images.pexels.com/photos/976866/pexels-photo-976866.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 'demo-private-10',
      title: '🎹 Improvisation Ambient',
      host_name: 'Space Sounds',
      viewer_count: 112,
      started_at: new Date(Date.now() - 70 * 60000).toISOString(),
      isPrivate: true,
      thumbnail: 'https://images.pexels.com/photos/1813466/pexels-photo-1813466.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 'demo-private-11',
      title: '🎸 Flamenco Passion',
      host_name: 'Guitarra Española',
      viewer_count: 87,
      started_at: new Date(Date.now() - 32 * 60000).toISOString(),
      isPrivate: true,
      thumbnail: 'https://images.pexels.com/photos/1535244/pexels-photo-1535244.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 'demo-private-12',
      title: '🎤 K-Pop Dance Cover',
      host_name: 'Seoul Vibes',
      viewer_count: 456,
      started_at: new Date(Date.now() - 12 * 60000).toISOString(),
      isPrivate: true,
      thumbnail: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
  ]

  return privateSessions
}
