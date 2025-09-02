import React, { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { TrackCard } from '@/components/TrackCard'
import { Filters } from '@/components/Filters'
import { AdminPanel } from '@/components/AdminPanel'
import { AuthLayout } from '@/components/AuthLayout'
import { UserDashboard } from '@/components/UserDashboard'
import { AudioPreview } from '@/components/AudioPreview'
import { VideoClipsBanner } from '@/components/VideoClipsBanner'
import { CookieBanner } from '@/components/CookieBanner'
import { AudioPlayerProvider, useAudioPlayerContext } from '@/contexts/AudioPlayerContext'
import { Toaster } from '@/components/ui/sonner'
import { useKV } from '@github/spark/hooks'
import soyDeGestionCover from '@/assets/images/NADA04_-_SOY_DE_GESTiON.png'
import laAmbicionDelNadaCover from '@/assets/images/NADA01_-_LA_AMBICION_DEL_NADA.png'

type AppState = 'store' | 'auth' | 'dashboard'

const sampleTracks = [
  {
    id: '1',
    title: 'Soy de Gestión',
    artist: 'Neiland',
    label: 'Nada Records',
    genre: 'Techno',
    duration: '7:23',
    bpm: 132,
    price: 3.99,
    coverUrl: soyDeGestionCover,
    audioUrl: '/audio/soy-de-gestion.mp3',
    formats: {
      mp3: { size: '14.2 MB', bitrate: '320 kbps', price: 3.99 },
      wav: { size: '77.8 MB', bitrate: '1411 kbps', price: 5.99 },
      flac: { size: '42.1 MB', bitrate: 'Lossless', price: 4.99 }
    }
  },
  {
    id: '2',
    title: 'La Ambición del Nada',
    artist: 'Neiland',
    label: 'Nada Records',
    genre: 'Techno',
    duration: '6:42',
    bpm: 128,
    price: 2.99,
    coverUrl: laAmbicionDelNadaCover,
    audioUrl: '/audio/la-ambicion-del-nada.mp3',
    formats: {
      mp3: { size: '12.5 MB', bitrate: '320 kbps', price: 2.99 },
      wav: { size: '67.2 MB', bitrate: '1411 kbps', price: 4.99 },
      flac: { size: '35.8 MB', bitrate: 'Lossless', price: 3.99 }
    }
  },
  {
    id: '3',
    title: 'Resonancia Mental',
    artist: 'Neiland',
    label: 'Nada Records',
    genre: 'Techno',
    duration: '8:15',
    bpm: 130,
    price: 4.49,
    coverUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=400&fit=crop&q=80',
    audioUrl: '/audio/resonancia-mental.mp3',
    formats: {
      mp3: { size: '15.6 MB', bitrate: '320 kbps', price: 4.49 },
      wav: { size: '86.4 MB', bitrate: '1411 kbps', price: 6.49 },
      flac: { size: '48.2 MB', bitrate: 'Lossless', price: 5.49 }
    }
  }
]

function StoreContent({ 
  onAuthClick, 
  onDashboardClick, 
  onLogout, 
  currentUser 
}: {
  onAuthClick: () => void
  onDashboardClick: () => void
  onLogout: () => void
  currentUser: any
}) {
  const [neilandTracks] = useKV('neiland-tracks', [])
  const [allTracks, setAllTracks] = useState([...sampleTracks])
  const [filteredTracks, setFilteredTracks] = useState([...sampleTracks])
  const { currentTrackId } = useAudioPlayerContext()

  // Find the currently playing track for mini player
  const currentTrack = allTracks.find(track => track.id === currentTrackId)

  // Combine sample tracks with Neiland's tracks
  useEffect(() => {
    const combined = [...sampleTracks, ...neilandTracks]
    setAllTracks(combined)
    setFilteredTracks(combined)
  }, [neilandTracks])

  const handleTrackAdded = (newTrack: any) => {
    const updated = [...allTracks, newTrack]
    setAllTracks(updated)
    setFilteredTracks(updated)
  }

  const handleSearch = (searchTerm: string) => {
    if (!searchTerm) {
      setFilteredTracks(allTracks)
      return
    }
    
    const filtered = allTracks.filter(track =>
      track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
      track.label.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredTracks(filtered)
  }

  const handleGenreFilter = (genre: string) => {
    if (genre === 'All') {
      setFilteredTracks(allTracks)
      return
    }
    
    const filtered = allTracks.filter(track => track.genre === genre)
    setFilteredTracks(filtered)
  }

  const handleSort = (sortType: string) => {
    const sorted = [...filteredTracks].sort((a, b) => {
      switch (sortType) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'bpm-low':
          return a.bpm - b.bpm
        case 'bpm-high':
          return b.bpm - a.bpm
        default:
          return 0
      }
    })
    setFilteredTracks(sorted)
  }

  return (
    <>
      <Header 
        user={currentUser}
        onAuthClick={onAuthClick}
        onDashboardClick={onDashboardClick}
        onLogout={onLogout}
      />
      
      <main className="container mx-auto px-6 py-8 pb-48">{/* Increased bottom padding for banners */}
        {/* Admin Panel for Neiland - only show if user is logged in */}
        {currentUser && (
          <div className="mb-8">
            <AdminPanel onTrackAdded={handleTrackAdded} />
          </div>
        )}
        
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Nada Records Store</h2>
          <p className="text-muted-foreground">
            Música techno original de Neiland - Obras exclusivas y selecciones especiales
          </p>
        </div>
        
        <div className="mb-8">
          <Filters
            onSearchChange={handleSearch}
            onGenreChange={handleGenreFilter}
            onSortChange={handleSort}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTracks.map((track) => (
            <TrackCard key={track.id} track={track} />
          ))}
        </div>
        
        {filteredTracks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">No se encontraron tracks</p>
            <p className="text-muted-foreground">Prueba ajustando tu búsqueda o filtros</p>
          </div>
        )}
        
        {/* Video Clips Banner */}
        <div className="mt-12">
          <VideoClipsBanner />
        </div>
      </main>

      {/* Floating Mini Player */}
      {currentTrack && (
        <div className="fixed bottom-32 right-6 z-40 w-80">{/* Adjusted position to avoid cookie banner */}
          <AudioPreview
            trackId={currentTrack.id}
            audioUrl={currentTrack.audioUrl}
            title={currentTrack.title}
            showMiniPlayer={true}
            className="shadow-2xl border-2"
          />
        </div>
      )}
    </>
  )
}

function App() {
  const [currentView, setCurrentView] = useState<AppState>('store')
  const [currentUser, setCurrentUser] = useKV('current-user', null)

  const handleAuthSuccess = (user: any) => {
    setCurrentUser(user)
    setCurrentView('store')
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setCurrentView('store')
  }

  const handleAuthClick = () => {
    setCurrentView('auth')
  }

  const handleDashboardClick = () => {
    setCurrentView('dashboard')
  }

  const handleBackToStore = () => {
    setCurrentView('store')
  }

  if (currentView === 'auth') {
    return (
      <>
        <AuthLayout 
          onAuthSuccess={handleAuthSuccess}
          onBack={handleBackToStore}
        />
        <Toaster position="bottom-right" />
      </>
    )
  }

  if (currentView === 'dashboard' && currentUser) {
    return (
      <>
        <UserDashboard 
          user={currentUser}
          onBack={handleBackToStore}
          onLogout={handleLogout}
        />
        <Toaster position="bottom-right" />
      </>
    )
  }

  return (
    <AudioPlayerProvider>
      <div className="min-h-screen bg-background">
        <StoreContent 
          onAuthClick={handleAuthClick}
          onDashboardClick={handleDashboardClick}
          onLogout={handleLogout}
          currentUser={currentUser}
        />
        <Toaster position="bottom-right" />
        <CookieBanner />
      </div>
    </AudioPlayerProvider>
  )
}

export default App