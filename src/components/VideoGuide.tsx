import React from 'react'
import { Video, Info, Upload, Eye } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function VideoGuide() {
  return (
    <Card className="border-secondary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-secondary">
          <Video className="w-5 h-5" />
          Guía de Videos Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4 text-primary" />
              <span className="font-medium">1. Sube tu Video</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Agrega la URL de tu video clip en formato MP4, WebM o OGV
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-accent" />
              <span className="font-medium">2. Preview Automático</span>
            </div>
            <p className="text-sm text-muted-foreground">
              El video se reproduce cuando los usuarios pasan el cursor sobre la portada
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-secondary" />
              <span className="font-medium">3. Audio Sincronizado</span>
            </div>
            <p className="text-sm text-muted-foreground">
              El audio del track se reproduce junto con el video automáticamente
            </p>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-secondary/10 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="border-secondary text-secondary">Especificaciones Técnicas</Badge>
          </div>
          <div className="text-sm text-muted-foreground grid md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p>• <strong>Formatos:</strong> MP4, WebM, OGV</p>
              <p>• <strong>Duración:</strong> 15-30 segundos ideal</p>
              <p>• <strong>Resolución:</strong> 400x400px mínimo</p>
            </div>
            <div className="space-y-1">
              <p>• <strong>Tamaño:</strong> Máximo 10MB</p>
              <p>• <strong>Formato:</strong> Cuadrado (1:1) preferido</p>
              <p>• <strong>Activación:</strong> Hover 300ms</p>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-accent/10 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="border-accent text-accent">Experiencia del Usuario</Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            <p>Cuando un usuario pasa el cursor sobre una portada con video:</p>
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>Se espera 300ms para confirmar la intención</li>
              <li>El video se reproduce automáticamente</li>
              <li>El audio del track se sincroniza con el video</li>
              <li>Al retirar el cursor, todo se pausa y reinicia</li>
            </ol>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}