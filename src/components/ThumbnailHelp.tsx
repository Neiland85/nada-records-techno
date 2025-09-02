import React from 'react'
import { Card } from '@/components/ui/card'
import { Camera, Clock, Grid3X3, Download } from '@phosphor-icons/react'

export function ThumbnailHelp() {
  return (
    <Card className="p-4 bg-muted/20 border-accent/20">
      <h4 className="font-semibold mb-3 flex items-center gap-2">
        <Camera size={18} />
        Cómo usar el Generador de Miniaturas
      </h4>
      
      <div className="space-y-3 text-sm text-muted-foreground">
        <div className="flex items-start gap-3">
          <Clock size={16} className="mt-0.5 text-accent" />
          <div>
            <p className="font-medium text-foreground">Captura Manual</p>
            <p>Navega a cualquier momento del video y haz clic en "Capturar Tiempo Actual"</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <Grid3X3 size={16} className="mt-0.5 text-secondary" />
          <div>
            <p className="font-medium text-foreground">Auto-Generación</p>
            <p>Genera automáticamente 6 miniaturas distribuidas uniformemente por el video</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <span className="text-accent font-mono text-xs mt-0.5">0,30,60</span>
          <div>
            <p className="font-medium text-foreground">Marcas Personalizadas</p>
            <p>Especifica timestamps exactos en segundos separados por comas</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <Download size={16} className="mt-0.5 text-primary" />
          <div>
            <p className="font-medium text-foreground">Descarga</p>
            <p>Descarga miniaturas individuales o todas a la vez en formato JPEG</p>
          </div>
        </div>
      </div>
    </Card>
  )
}