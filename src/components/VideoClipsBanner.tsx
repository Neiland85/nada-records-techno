import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play, Volume2 } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface VideoClipsBannerProps {
  className?: string
}

export function VideoClipsBanner({ className = '' }: VideoClipsBannerProps) {
  // Using the latest track - "Soy de Gestión" which is the first track
  const latestTrack = {
    title: 'Soy de Gestión',
    artist: 'Neiland',
    videoUrl: '/video/soy-de-gestion-clip.mp4', // Placeholder for video URL
    thumbnailUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=450&fit=crop&q=80',
    duration: '2:45',
    description: 'El video oficial del último lanzamiento de Neiland captura la esencia urbana y tecnológica que define el sonido de Nada Records.'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`w-full ${className}`}
    >
      <Card className="glass-card border-accent/20 overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold text-foreground">
                Video-Clip del Último Lanzamiento
              </h3>
              <p className="text-muted-foreground">
                Descubre el video oficial de "{latestTrack.title}"
              </p>
            </div>
            <div className="flex items-center gap-2 text-accent">
              <Volume2 size={24} />
              <span className="text-sm font-medium">NUEVO</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 items-center">
            {/* Video Thumbnail */}
            <div className="relative group cursor-pointer">
              <div className="aspect-video rounded-lg overflow-hidden bg-muted/20 border border-accent/20">
                <img
                  src={latestTrack.thumbnailUrl}
                  alt={`Video clip de ${latestTrack.title}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* Play Overlay */}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-16 h-16 bg-accent/90 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <Play size={24} className="text-accent-foreground ml-1" />
                  </motion.div>
                </div>
                
                {/* Duration Badge */}
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {latestTrack.duration}
                </div>
              </div>
            </div>

            {/* Track Info & CTA */}
            <div className="space-y-4">
              <div>
                <h4 className="text-xl font-semibold text-foreground mb-1">
                  {latestTrack.title}
                </h4>
                <p className="text-accent font-medium">
                  por {latestTrack.artist}
                </p>
                <p className="text-muted-foreground text-sm mt-2">
                  {latestTrack.description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  className="btn-3d bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg"
                  size="lg"
                >
                  <Play size={20} className="mr-2" />
                  Ver Video Completo
                </Button>
                <Button 
                  variant="outline" 
                  className="border-accent/30 hover:bg-accent/10"
                  size="lg"
                >
                  Comprar Track
                </Button>
              </div>

              {/* Stats */}
              <div className="flex gap-6 text-sm text-muted-foreground pt-2">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-accent rounded-full"></span>
                  <span>Estreno Reciente</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-secondary rounded-full"></span>
                  <span>Exclusivo Nada Records</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}