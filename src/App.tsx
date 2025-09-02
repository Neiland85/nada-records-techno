import React, { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { TrackCard } from '@/components/TrackCard'
import { Filters } from '@/components/Filters'
import { AdminPanel } from '@/components/AdminPanel'
import { AuthLayout } from '@/components/AuthLayout'
import { UserDashboard } from '@/components/UserDashboard'
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
  },
  {
    id: '4',
    title: 'Circuito Cerebral',
    artist: 'Neiland',
    label: 'Nada Records',
    genre: 'Industrial Techno',
    duration: '7:08',
    bpm: 135,
    price: 3.79,
    coverUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&q=80',
    audioUrl: '/audio/circuito-cerebral.mp3',
    formats: {
      mp3: { size: '13.5 MB', bitrate: '320 kbps', price: 3.79 },
      wav: { size: '74.6 MB', bitrate: '1411 kbps', price: 5.79 },
      flac: { size: '40.8 MB', bitrate: 'Lossless', price: 4.79 }
    }
  },
  {
    id: '5',
    title: 'Flujo Eléctrico',
    artist: 'Neiland',
    label: 'Nada Records',
    genre: 'Acid Techno',
    duration: '6:33',
    bpm: 138,
    price: 3.99,
    coverUrl: 'https://images.unsplash.com/photo-1485579149621-3123dd979885?w=400&h=400&fit=crop&q=80',
    audioUrl: '/audio/flujo-electrico.mp3',
    formats: {
      mp3: { size: '12.4 MB', bitrate: '320 kbps', price: 3.99 },
      wav: { size: '68.8 MB', bitrate: '1411 kbps', price: 5.99 },
      flac: { size: '37.2 MB', bitrate: 'Lossless', price: 4.99 }
    }
  },
  {
    id: '6',
    title: 'Máquina de Sueños',
    artist: 'Neiland',
    label: 'Nada Records',
    genre: 'Deep Techno',
    duration: '9:45',
    bpm: 124,
    price: 4.79,
    coverUrl: 'https://images.unsplash.com/photo-1614149162883-504ce4d13909?w=400&h=400&fit=crop&q=80',
    audioUrl: '/audio/maquina-de-suenos.mp3',
    formats: {
      mp3: { size: '18.4 MB', bitrate: '320 kbps', price: 4.79 },
      wav: { size: '102.0 MB', bitrate: '1411 kbps', price: 6.79 },
      flac: { size: '56.8 MB', bitrate: 'Lossless', price: 5.79 }
    }
  },
  {
    id: '7',
    title: 'Código Binario',
    artist: 'Neiland',
    label: 'Nada Records',
    genre: 'Minimal Techno',
    duration: '8:22',
    bpm: 126,
    price: 4.19,
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop&q=80',
    audioUrl: '/audio/codigo-binario.mp3',
    formats: {
      mp3: { size: '15.8 MB', bitrate: '320 kbps', price: 4.19 },
      wav: { size: '87.6 MB', bitrate: '1411 kbps', price: 6.19 },
      flac: { size: '48.4 MB', bitrate: 'Lossless', price: 5.19 }
    }
  },
  {
    id: '8',
    title: 'Revolución Digital',
    artist: 'Neiland',
    label: 'Nada Records',
    genre: 'Hard Techno',
    duration: '6:55',
    bpm: 142,
    price: 3.89,
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&q=80',
    audioUrl: '/audio/revolucion-digital.mp3',
    formats: {
      mp3: { size: '13.1 MB', bitrate: '320 kbps', price: 3.89 },
      wav: { size: '72.6 MB', bitrate: '1411 kbps', price: 5.89 },
      flac: { size: '39.8 MB', bitrate: 'Lossless', price: 4.89 }
    }
  },
  {
    id: '9',
    title: 'Energía Sintética',
    artist: 'Neiland',
    label: 'Nada Records',
    genre: 'Progressive Techno',
    duration: '10:12',
    bpm: 128,
    price: 5.29,
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop&q=80',
    audioUrl: '/audio/energia-sintetica.mp3',
    formats: {
      mp3: { size: '19.3 MB', bitrate: '320 kbps', price: 5.29 },
      wav: { size: '107.0 MB', bitrate: '1411 kbps', price: 7.29 },
      flac: { size: '59.6 MB', bitrate: 'Lossless', price: 6.29 }
    }
  },
  {
    id: '10',
    title: 'Frecuencia Nada',
    artist: 'Neiland',
    label: 'Nada Records',
    genre: 'Techno',
    duration: '7:41',
    bpm: 133,
    price: 4.09,
    coverUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&q=80',
    audioUrl: '/audio/frecuencia-nada.mp3',
    formats: {
      mp3: { size: '14.5 MB', bitrate: '320 kbps', price: 4.09 },
      wav: { size: '80.4 MB', bitrate: '1411 kbps', price: 6.09 },
      flac: { size: '44.8 MB', bitrate: 'Lossless', price: 5.09 }
    }
  },
  {
    id: '11',
    title: 'Matriz Underground',
    artist: 'Neiland',
    label: 'Nada Records',
    genre: 'Dark Techno',
    duration: '8:58',
    bpm: 129,
    price: 4.59,
    coverUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=400&fit=crop&q=80',
    audioUrl: '/audio/matriz-underground.mp3',
    formats: {
      mp3: { size: '16.9 MB', bitrate: '320 kbps', price: 4.59 },
      wav: { size: '93.8 MB', bitrate: '1411 kbps', price: 6.59 },
      flac: { size: '52.2 MB', bitrate: 'Lossless', price: 5.59 }
    }
  },
  {
    id: '12',
    title: 'Pulso Cibernético',
    artist: 'Neiland',
    label: 'Nada Records',
    genre: 'Cyberpunk Techno',
    duration: '7:27',
    bpm: 136,
    price: 3.99,
    coverUrl: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&h=400&fit=crop&q=80',
    audioUrl: '/audio/pulso-cibernetico.mp3',
    formats: {
      mp3: { size: '14.0 MB', bitrate: '320 kbps', price: 3.99 },
      wav: { size: '78.0 MB', bitrate: '1411 kbps', price: 5.99 },
      flac: { size: '43.4 MB', bitrate: 'Lossless', price: 4.99 }
    }
  }
]

function App() {
  const [currentView, setCurrentView] = useState<AppState>('store')
  const [currentUser, setCurrentUser] = useKV('current-user', null)
  const [neilandTracks] = useKV('neiland-tracks', [])
  const [allTracks, setAllTracks] = useState([...sampleTracks])
  const [filteredTracks, setFilteredTracks] = useState([...sampleTracks])

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
    <div className="min-h-screen bg-background">
      <Header 
        user={currentUser}
        onAuthClick={handleAuthClick}
        onDashboardClick={handleDashboardClick}
        onLogout={handleLogout}
      />
      
      <main className="container mx-auto px-6 py-8">
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
      </main>
      
      <Toaster position="bottom-right" />
    </div>
  )
}

export default App