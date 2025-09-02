import React, { useState } from 'react'
import { Video, Upload, X } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

interface VideoData {
  trackId: string
  videoUrl: string
  thumbnailUrl?: string
  title: string
}

interface VideoUploadPanelProps {
  trackId: string
  trackTitle: string
  onVideoAdded: (videoData: VideoData) => void
}

export function VideoUploadPanel({ trackId, trackTitle, onVideoAdded }: VideoUploadPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [trackVideos, setTrackVideos] = useKV('track-videos', {})
  const [formData, setFormData] = useState({
    videoUrl: '',
    thumbnailUrl: ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addVideo = () => {
    if (!formData.videoUrl) {
      toast.error('Por favor ingresa la URL del video')
      return
    }

    const videoData: VideoData = {
      trackId,
      videoUrl: formData.videoUrl,
      thumbnailUrl: formData.thumbnailUrl,
      title: trackTitle
    }

    // Update videos storage
    setTrackVideos((current: any) => ({
      ...current,
      [trackId]: videoData
    }))

    onVideoAdded(videoData)
    
    // Reset form
    setFormData({
      videoUrl: '',
      thumbnailUrl: ''
    })
    
    setIsOpen(false)
    toast.success(`¡Video agregado para "${trackTitle}"!`)
  }

  const removeVideo = () => {
    setTrackVideos((current: any) => {
      const updated = { ...current }
      delete updated[trackId]
      return updated
    })
    toast.success('Video eliminado')
  }

  const currentVideo = trackVideos[trackId]

  return (
    <Card className="border-secondary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Video className="w-5 h-5 text-secondary" />
          Video del Track: {trackTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <p className="text-muted-foreground text-sm">
            Agrega un video clip que se reproducirá al pasar el cursor sobre la portada
          </p>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary/10">
                <Video className="w-4 h-4 mr-2" />
                {currentVideo ? 'Cambiar Video' : 'Agregar Video'}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Agregar Video Clip</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="videoUrl">URL del Video *</Label>
                  <Input
                    id="videoUrl"
                    value={formData.videoUrl}
                    onChange={(e) => handleInputChange('videoUrl', e.target.value)}
                    placeholder="/video/soy-de-gestion-clip.mp4"
                  />
                  <p className="text-xs text-muted-foreground">
                    Formatos soportados: MP4, WebM, OGV
                  </p>
                  <p className="text-xs text-accent">
                    Ejemplo de prueba: https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="thumbnailUrl">URL de Miniatura (opcional)</Label>
                  <Input
                    id="thumbnailUrl"
                    value={formData.thumbnailUrl}
                    onChange={(e) => handleInputChange('thumbnailUrl', e.target.value)}
                    placeholder="/images/video-thumbnail.jpg"
                  />
                  <p className="text-xs text-muted-foreground">
                    Si no se especifica, se usará el primer frame del video
                  </p>
                </div>
              </div>
              
              <div className="bg-muted/30 p-3 rounded-lg">
                <h4 className="font-medium mb-2 text-sm">Consejos para el video:</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Duración recomendada: 15-30 segundos</li>
                  <li>• Formato cuadrado (1:1) para mejor visualización</li>
                  <li>• Resolución mínima: 400x400px</li>
                  <li>• El audio se reproducirá automáticamente</li>
                </ul>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancelar
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    setFormData({
                      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
                      thumbnailUrl: ''
                    })
                  }}
                  className="text-accent hover:bg-accent/10"
                >
                  Demo URL
                </Button>
                <Button onClick={addVideo} className="bg-secondary hover:bg-secondary/90">
                  <Upload className="w-4 h-4 mr-2" />
                  Agregar Video
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        {currentVideo && (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-secondary/20 rounded flex items-center justify-center">
                  <Video className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h5 className="font-medium">Video Clip</h5>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="outline" className="text-xs">Video</Badge>
                    <span>Hover Preview</span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={removeVideo}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="text-xs text-muted-foreground bg-accent/10 p-2 rounded">
              ✓ Video configurado. Se reproducirá cuando los usuarios pasen el cursor sobre la portada del track.
            </div>
          </div>
        )}
        
        {!currentVideo && (
          <div className="text-center py-6 text-muted-foreground">
            <Video className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No hay video configurado</p>
            <p className="text-xs">Agrega un video clip para preview con hover</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}