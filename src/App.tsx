import React, { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { TrackCard } from '@/components/TrackCard'
import { Filters } from '@/components/Filters'
import { AdminPanel } from '@/components/AdminPanel'
import { Toaster } from '@/components/ui/sonner'
import { useKV } from '@github/spark/hooks'

const sampleTracks = [
  {
    id: '1',
    title: 'Digital Underground',
    artist: 'Neon Pulse',
    label: 'Nada Records',
    genre: 'Techno',
    duration: '6:42',
    bpm: 128,
    price: 2.99,
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    audioUrl: '/audio/sample1.mp3',
    formats: {
      mp3: { size: '12.5 MB', bitrate: '320 kbps', price: 2.99 },
      wav: { size: '67.2 MB', bitrate: '1411 kbps', price: 4.99 },
      flac: { size: '35.8 MB', bitrate: 'Lossless', price: 3.99 }
    }
  },
  {
    id: '2',
    title: 'Midnight Circuit',
    artist: 'Voltage',
    label: 'Dark Matter',
    genre: 'Deep House',
    duration: '7:18',
    bpm: 124,
    price: 3.49,
    coverUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    audioUrl: '/audio/sample2.mp3',
    formats: {
      mp3: { size: '13.8 MB', bitrate: '320 kbps', price: 3.49 },
      wav: { size: '76.4 MB', bitrate: '1411 kbps', price: 5.49 },
      flac: { size: '41.2 MB', bitrate: 'Lossless', price: 4.49 }
    }
  },
  {
    id: '3',
    title: 'Synthetic Dreams',
    artist: 'Code Red',
    label: 'Nada Records',
    genre: 'Minimal',
    duration: '8:05',
    bpm: 132,
    price: 2.79,
    coverUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=400&fit=crop',
    audioUrl: '/audio/sample3.mp3',
    formats: {
      mp3: { size: '15.2 MB', bitrate: '320 kbps', price: 2.79 },
      wav: { size: '84.6 MB', bitrate: '1411 kbps', price: 4.79 },
      flac: { size: '45.1 MB', bitrate: 'Lossless', price: 3.79 }
    }
  },
  {
    id: '4',
    title: 'Bass Revolution',
    artist: 'Subsonic',
    label: 'Underground Ltd',
    genre: 'Acid',
    duration: '5:33',
    bpm: 135,
    price: 3.99,
    coverUrl: 'https://images.unsplash.com/photo-1485579149621-3123dd979885?w=400&h=400&fit=crop',
    audioUrl: '/audio/sample4.mp3',
    formats: {
      mp3: { size: '10.5 MB', bitrate: '320 kbps', price: 3.99 },
      wav: { size: '58.2 MB', bitrate: '1411 kbps', price: 5.99 },
      flac: { size: '31.8 MB', bitrate: 'Lossless', price: 4.99 }
    }
  },
  {
    id: '5',
    title: 'Electron Flow',
    artist: 'Machine Logic',
    label: 'Nada Records',
    genre: 'Progressive',
    duration: '9:12',
    bpm: 126,
    price: 4.29,
    coverUrl: 'https://images.unsplash.com/photo-1614149162883-504ce4d13909?w=400&h=400&fit=crop',
    audioUrl: '/audio/sample5.mp3',
    formats: {
      mp3: { size: '17.4 MB', bitrate: '320 kbps', price: 4.29 },
      wav: { size: '96.4 MB', bitrate: '1411 kbps', price: 6.29 },
      flac: { size: '52.1 MB', bitrate: 'Lossless', price: 5.29 }
    }
  },
  {
    id: '6',
    title: 'Industrial Nightmare',
    artist: 'Steel Pulse',
    label: 'Dark Factory',
    genre: 'Industrial',
    duration: '6:47',
    bpm: 140,
    price: 3.19,
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop',
    audioUrl: '/audio/sample6.mp3',
    formats: {
      mp3: { size: '12.8 MB', bitrate: '320 kbps', price: 3.19 },
      wav: { size: '71.0 MB', bitrate: '1411 kbps', price: 5.19 },
      flac: { size: '38.4 MB', bitrate: 'Lossless', price: 4.19 }
    }
  }
]

function App() {
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        {/* Admin Panel for Neiland */}
        <div className="mb-8">
          <AdminPanel onTrackAdded={handleTrackAdded} />
        </div>
        
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Nada Records Store</h2>
          <p className="text-muted-foreground">
            Música techno original de Neiland y artistas seleccionados
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