import React from 'react'
import { Video, Play, Mouse, TestTube } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function VideoHoverGuide() {
  return (
    <Card className="border-accent/20 bg-accent/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <TestTube className="w-5 h-5 text-accent" />
          Guía de Prueba - Video Hover Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Mouse className="w-4 h-4" />
              Cómo probar el hover preview:
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <Badge variant="outline" className="text-xs">1</Badge>
                <span>Asegúrate de que hay videos agregados a los tracks</span>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="outline" className="text-xs">2</Badge>
                <span>Pasa el cursor sobre la portada de un track con video</span>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="outline" className="text-xs">3</Badge>
                <span>Mantén el cursor por 300ms para activar el preview</span>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="outline" className="text-xs">4</Badge>
                <span>El video se reproduce automáticamente con audio</span>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="outline" className="text-xs">5</Badge>
                <span>Quita el cursor para pausar y reiniciar</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Video className="w-4 h-4" />
              Indicadores visuales:
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  <Video className="w-3 h-3 mr-1" />
                  Video
                </Badge>
                <span>Indica que el video se está reproduciendo</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">Hover for video</Badge>
                <span>Aparece cuando el track tiene video disponible</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">Preview</Badge>
                <span>Mostrado durante la reproducción del video</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-accent/10 p-3 rounded-lg border border-accent/20">
          <h4 className="font-medium mb-2 text-sm flex items-center gap-2">
            <Play className="w-4 h-4" />
            Características técnicas:
          </h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Delay de 300ms para evitar activaciones accidentales</li>
            <li>• Video en bucle automático durante el hover</li>
            <li>• Audio sincronizado al 60% de volumen</li>
            <li>• Pausa automática al quitar el cursor</li>
            <li>• Soporte para formatos MP4, WebM y OGV</li>
            <li>• Fallback a imagen de portada si el video falla</li>
          </ul>
        </div>
        
        <div className="text-xs text-muted-foreground bg-muted/20 p-2 rounded">
          💡 Abre la consola del navegador (F12) para ver los logs de debug del sistema de video hover.
        </div>
      </CardContent>
    </Card>
  )
}