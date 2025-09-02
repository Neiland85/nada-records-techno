import React from 'react'
import { Info, Upload, Music, DollarSign, Video } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function MusicUploadGuide() {
  return (
    <Card className="border-accent/20 mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-accent">
          <Info className="w-5 h-5" />
          Cómo Agregar Tu Música y Videos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4 text-primary" />
              <span className="font-medium">1. Información del Track</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Completa el título, duración, BPM y género de tu producción
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-secondary" />
              <span className="font-medium">2. Precio Base</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Define el precio para MP3. WAV y FLAC se calculan automáticamente
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-accent" />
              <span className="font-medium">3. Media Opcional</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Agrega URLs de portada y preview de audio (opcional)
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-secondary" />
              <span className="font-medium">4. Video Clips</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Agrega videos que se reproducen al pasar el cursor sobre la portada
            </p>
          </div>
        </div>
        
        <div className="mt-4 grid md:grid-cols-2 gap-4">
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">Formatos de Audio</Badge>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• <strong>MP3 320kbps:</strong> Precio base que tú defines</p>
              <p>• <strong>WAV 1411kbps:</strong> Precio base + $2.00 (calidad sin pérdida)</p>
              <p>• <strong>FLAC Lossless:</strong> Precio base + $1.00 (compresión sin pérdida)</p>
            </div>
          </div>
          
          <div className="p-3 bg-secondary/10 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="border-secondary text-secondary">Video Preview</Badge>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• <strong>Formato:</strong> MP4, WebM, OGV</p>
              <p>• <strong>Duración:</strong> 15-30 segundos recomendado</p>
              <p>• <strong>Resolución:</strong> Mínimo 400x400px</p>
              <p>• <strong>Activación:</strong> Hover sobre la portada</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}