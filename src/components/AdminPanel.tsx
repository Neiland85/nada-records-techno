import React, { useState } from 'react'
import { Plus, Upload, Music, X } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { MusicUploadGuide } from '@/components/MusicUploadGuide'
import { VideoUploadPanel } from '@/components/VideoUploadPanel'
import { VideoGuide } from '@/components/VideoGuide'
import { VideoTestPanel } from '@/components/VideoTestPanel'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

interface Track {
  id: string
  title: string
  artist: string
  label: string
  genre: string
  duration: string
  bpm: number
  price: number
  coverUrl: string
  audioUrl: string
  formats: {
    mp3: { size: string; bitrate: string; price: number }
    wav: { size: string; bitrate: string; price: number }
    flac: { size: string; bitrate: string; price: number }
  }
}

interface AdminPanelProps {
  onTrackAdded: (track: Track) => void
}

export function AdminPanel({ onTrackAdded }: AdminPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [myTracks, setMyTracks] = useKV('neiland-tracks', [])
  const [formData, setFormData] = useState({
    title: '',
    artist: 'Neiland',
    label: 'Nada Records',
    genre: 'Techno',
    duration: '',
    bpm: '',
    price: '',
    coverUrl: '',
    audioUrl: '',
    mp3Size: '',
    wavSize: '',
    flacSize: '',
    mp3Price: '',
    wavPrice: '',
    flacPrice: ''
  })

  const genres = ['Techno', 'Deep House', 'Minimal', 'Acid', 'Progressive', 'Industrial', 'Hard Techno', 'Dub Techno']

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const calculatePrices = (basePrice: number) => {
    return {
      mp3: basePrice,
      wav: basePrice + 2,
      flac: basePrice + 1
    }
  }

  const addTrack = () => {
    if (!formData.title || !formData.duration || !formData.bpm || !formData.price) {
      toast.error('Por favor completa todos los campos requeridos')
      return
    }

    const basePrice = parseFloat(formData.price)
    const prices = calculatePrices(basePrice)

    const newTrack: Track = {
      id: `neiland-${Date.now()}`,
      title: formData.title,
      artist: formData.artist,
      label: formData.label,
      genre: formData.genre,
      duration: formData.duration,
      bpm: parseInt(formData.bpm),
      price: basePrice,
      coverUrl: formData.coverUrl || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
      audioUrl: formData.audioUrl || '/audio/neiland-sample.mp3',
      formats: {
        mp3: { 
          size: formData.mp3Size || `${Math.round(parseInt(formData.duration.split(':')[0]) * 2.1)} MB`, 
          bitrate: '320 kbps', 
          price: prices.mp3 
        },
        wav: { 
          size: formData.wavSize || `${Math.round(parseInt(formData.duration.split(':')[0]) * 11.2)} MB`, 
          bitrate: '1411 kbps', 
          price: prices.wav 
        },
        flac: { 
          size: formData.flacSize || `${Math.round(parseInt(formData.duration.split(':')[0]) * 6.1)} MB`, 
          bitrate: 'Lossless', 
          price: prices.flac 
        }
      }
    }

    setMyTracks((current: Track[]) => [...current, newTrack])
    onTrackAdded(newTrack)
    
    // Reset form
    setFormData({
      title: '',
      artist: 'Neiland',
      label: 'Nada Records',
      genre: 'Techno',
      duration: '',
      bpm: '',
      price: '',
      coverUrl: '',
      audioUrl: '',
      mp3Size: '',
      wavSize: '',
      flacSize: '',
      mp3Price: '',
      wavPrice: '',
      flacPrice: ''
    })
    
    setIsOpen(false)
    toast.success(`¡Track "${newTrack.title}" agregado exitosamente!`)
  }

  const removeTrack = (trackId: string) => {
    setMyTracks((current: Track[]) => current.filter(track => track.id !== trackId))
    toast.success('Track eliminado')
  }

  const handleVideoAdded = (videoData: any) => {
    // Video data is automatically stored in the VideoUploadPanel component
    toast.success('¡Video agregado exitosamente!')
  }

  return (
    <div className="space-y-6">
      <MusicUploadGuide />
      
      <VideoGuide />
      
      <VideoTestPanel />
      
      {/* Video Upload Panel for Soy de Gestión */}
      <VideoUploadPanel 
        trackId="1"
        trackTitle="Soy de Gestión"
        onVideoAdded={handleVideoAdded}
      />
      
      <Card className="border-accent/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="w-5 h-5 text-accent" />
            Panel de Administración - Neiland (Nada Records)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <p className="text-muted-foreground">
              Gestiona tu catálogo de música techno
            </p>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Track
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Agregar Nueva Producción</DialogTitle>
                </DialogHeader>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título del Track *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Ej: Digital Underground"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="artist">Artista</Label>
                    <Input
                      id="artist"
                      value={formData.artist}
                      onChange={(e) => handleInputChange('artist', e.target.value)}
                      placeholder="Neiland"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="genre">Género</Label>
                    <Select value={formData.genre} onValueChange={(value) => handleInputChange('genre', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {genres.map(genre => (
                          <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duración *</Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                      placeholder="6:42"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bpm">BPM *</Label>
                    <Input
                      id="bpm"
                      type="number"
                      value={formData.bpm}
                      onChange={(e) => handleInputChange('bpm', e.target.value)}
                      placeholder="128"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="price">Precio Base (USD) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="2.99"
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="coverUrl">URL de Portada</Label>
                    <Input
                      id="coverUrl"
                      value={formData.coverUrl}
                      onChange={(e) => handleInputChange('coverUrl', e.target.value)}
                      placeholder="https://ejemplo.com/portada.jpg"
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="audioUrl">URL del Audio Preview</Label>
                    <Input
                      id="audioUrl"
                      value={formData.audioUrl}
                      onChange={(e) => handleInputChange('audioUrl', e.target.value)}
                      placeholder="/audio/mi-track.mp3"
                    />
                  </div>
                </div>
                
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">Información Automática</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Los precios se calcularán automáticamente:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• MP3: Precio base</li>
                    <li>• WAV: Precio base + $2.00</li>
                    <li>• FLAC: Precio base + $1.00</li>
                  </ul>
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={addTrack} className="bg-accent hover:bg-accent/90">
                    <Upload className="w-4 h-4 mr-2" />
                    Agregar Track
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          {myTracks.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium">Mis Tracks ({myTracks.length})</h4>
              <div className="grid gap-3">
                {myTracks.map((track: Track) => (
                  <div key={track.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <img 
                        src={track.coverUrl} 
                        alt={track.title}
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div>
                        <h5 className="font-medium">{track.title}</h5>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline" className="text-xs">{track.genre}</Badge>
                          <span>{track.bpm} BPM</span>
                          <span>${track.price}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTrack(track.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {myTracks.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Music className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Aún no has agregado ningún track</p>
              <p className="text-sm">Comienza subiendo tu primera producción</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}