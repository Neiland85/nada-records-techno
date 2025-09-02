import React from 'react'
import { Video, Play, TestTube } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

export function VideoTestPanel() {
  const [trackVideos, setTrackVideos] = useKV('track-videos', {})

  const sampleVideos = [
    {
      trackId: '1', // Soy de Gestión
      title: 'Soy de Gestión',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      thumbnailUrl: ''
    },
    {
      trackId: '2', // La Ambición del Nada
      title: 'La Ambición del Nada', 
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnailUrl: ''
    },
    {
      trackId: '3', // Resonancia Mental
      title: 'Resonancia Mental',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      thumbnailUrl: ''
    }
  ]

  const addSampleVideos = () => {
    const newVideos = sampleVideos.reduce((acc, video) => {
      acc[video.trackId] = video
      return acc
    }, {} as any)

    setTrackVideos((current: any) => ({
      ...current,
      ...newVideos
    }))

    toast.success('¡Videos de prueba agregados! Pasa el cursor sobre las portadas para probar el hover preview.')
  }

  const clearAllVideos = () => {
    setTrackVideos({})
    toast.success('Todos los videos han sido eliminados.')
  }

  const addCustomTestVideo = (trackId: string, title: string) => {
    const customVideo = {
      trackId,
      title,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      thumbnailUrl: ''
    }

    setTrackVideos((current: any) => ({
      ...current,
      [trackId]: customVideo
    }))

    toast.success(`Video de prueba agregado para "${title}"`)
  }

  const currentVideoCount = Object.keys(trackVideos).length

  return (
    <Card className="border-accent/30 bg-accent/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <TestTube className="w-5 h-5 text-accent" />
          Panel de Prueba - Video Hover Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              Prueba la funcionalidad de hover preview con videos de ejemplo
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                Videos activos: {currentVideoCount}
              </Badge>
              {currentVideoCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  ✓ Hover habilitado
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={addSampleVideos}
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
            size="sm"
          >
            <Video className="w-4 h-4 mr-2" />
            Agregar Videos de Prueba
          </Button>

          <Button 
            onClick={clearAllVideos}
            variant="outline"
            size="sm"
            disabled={currentVideoCount === 0}
          >
            Limpiar Videos
          </Button>
        </div>

        {currentVideoCount > 0 && (
          <div className="bg-accent/10 p-3 rounded-lg border border-accent/20">
            <h4 className="font-medium mb-2 text-sm flex items-center gap-2">
              <Play className="w-4 h-4" />
              Cómo probar:
            </h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>1. Pasa el cursor sobre cualquier portada de track con video</li>
              <li>2. Espera 300ms para que inicie el preview automático</li>
              <li>3. El video se reproduce con audio a 60% de volumen</li>
              <li>4. Quita el cursor para pausar y reiniciar el video</li>
              <li>5. Busca el badge "Hover for video" en las portadas</li>
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {sampleVideos.map((video) => {
            const hasVideo = trackVideos[video.trackId]
            return (
              <div key={video.trackId} className="p-3 border rounded-lg bg-card">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{video.title}</span>
                  {hasVideo ? (
                    <Badge variant="secondary" className="text-xs">✓ Video</Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">Sin video</Badge>
                  )}
                </div>
                {!hasVideo && (
                  <Button 
                    onClick={() => addCustomTestVideo(video.trackId, video.title)}
                    variant="ghost"
                    size="sm"
                    className="w-full text-accent hover:bg-accent/10"
                  >
                    <Video className="w-3 h-3 mr-1" />
                    Agregar Video
                  </Button>
                )}
              </div>
            )
          })}
        </div>

        <div className="text-xs text-muted-foreground bg-muted/20 p-2 rounded">
          💡 Los videos de prueba son de dominio público y se cargan desde CDNs externos. 
          En producción, deberías usar tus propios archivos de video.
        </div>
      </CardContent>
    </Card>
  )
}