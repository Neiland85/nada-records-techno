import React, { useState, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Play, Pause, Volume2, Upload, X, ArrowLeft, ArrowRight } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import { VideoThumbnailGenerator } from '@/components/VideoThumbnailGenerator'
import soyDeGestionCover from '@/assets/images/NADA04_-_SOY_DE_GESTiON.png'
import laAmbicionDelNadaCover from '@/assets/images/NADA01_-_LA_AMBICION_DEL_NADA.png'

interface VideoClip {
  id: string
  title: string
  artist: string
  videoUrl: string
  thumbnailUrl: string
  duration: string
  description: string
  releaseDate: string
  generatedThumbnails?: Array<{
    id: string
    timestamp: number
    dataUrl: string
    filename: string
  }>
}

interface VideoClipsBannerProps {
  className?: string
}

export function VideoClipsBanner({ className = '' }: VideoClipsBannerProps) {
  const [videoClips, setVideoClips] = useKV('neiland-video-clips', [
    {
      id: '1',
      title: 'Soy de Gestión',
      artist: 'Neiland',
      videoUrl: '', // You can upload your actual video file here
      thumbnailUrl: soyDeGestionCover,
      duration: '2:45',
      description: 'El video oficial del último lanzamiento de Neiland captura la esencia urbana y tecnológica que define el sonido de Nada Records.',
      releaseDate: '2024-01-15'
    },
    {
      id: '2',
      title: 'La Ambición del Nada',
      artist: 'Neiland',
      videoUrl: '', // You can upload your actual video file here
      thumbnailUrl: laAmbicionDelNadaCover,
      duration: '3:12',
      description: 'Un viaje visual través de los ritmos hipnóticos que caracterizan la propuesta artística de Neiland.',
      releaseDate: '2024-01-10'
    }
  ])
  
  const [currentClipIndex, setCurrentClipIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [uploadingClipId, setUploadingClipId] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const currentClip = videoClips[currentClipIndex] || videoClips[0]

  const handleThumbnailGenerated = (clipId: string, thumbnail: any) => {
    const updatedClips = videoClips.map(clip => 
      clip.id === clipId 
        ? { 
            ...clip, 
            generatedThumbnails: [...(clip.generatedThumbnails || []), thumbnail]
          } 
        : clip
    )
    
    setVideoClips(updatedClips)
  }

  const handleVideoUpload = async (clipId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('video/')) {
      toast.error('Por favor, selecciona un archivo de video válido')
      return
    }

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast.error('El archivo es demasiado grande. Máximo 50MB.')
      return
    }

    try {
      // Create object URL for the video
      const videoUrl = URL.createObjectURL(file)
      
      // Update the video clip with the new URL
      const updatedClips = videoClips.map(clip => 
        clip.id === clipId 
          ? { ...clip, videoUrl } 
          : clip
      )
      
      setVideoClips(updatedClips)
      setShowUploadDialog(false)
      setUploadingClipId(null)
      
      toast.success('Video subido exitosamente!')
    } catch (error) {
      toast.error('Error al subir el video')
      console.error('Upload error:', error)
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const nextClip = () => {
    setCurrentClipIndex((prev) => (prev + 1) % videoClips.length)
    setIsPlaying(false)
  }

  const previousClip = () => {
    setCurrentClipIndex((prev) => (prev - 1 + videoClips.length) % videoClips.length)
    setIsPlaying(false)
  }

  if (!currentClip) return null

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
                Video-Clips de Neiland
              </h3>
              <p className="text-muted-foreground">
                Explora los videos oficiales de "{currentClip.title}"
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-accent">
                <Volume2 size={24} />
                <span className="text-sm font-medium">NUEVO</span>
              </div>
              <div className="flex items-center gap-2">
                {currentClip.videoUrl ? (
                  <VideoThumbnailGenerator
                    videoUrl={currentClip.videoUrl}
                    videoTitle={currentClip.title}
                    onThumbnailGenerated={(thumbnail) => handleThumbnailGenerated(currentClip.id, thumbnail)}
                  />
                ) : (
                  <Button variant="outline" size="sm" disabled className="gap-2">
                    <span className="text-xs">Sube un video primero</span>
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowUploadDialog(true)}
                  className="border-accent/30 hover:bg-accent/10"
                >
                  <Upload size={16} className="mr-2" />
                  Subir Video
                </Button>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 items-center">
            {/* Enhanced Video Player */}
            <div className="relative group">
              <div className="aspect-video rounded-lg overflow-hidden bg-muted/20 border-2 border-accent/20 shadow-xl group-hover:shadow-2xl transition-all duration-300">
                {currentClip.videoUrl ? (
                  <video
                    ref={videoRef}
                    src={currentClip.videoUrl}
                    poster={currentClip.thumbnailUrl}
                    className="w-full h-full object-cover transition-all duration-300 group-hover:scale-[1.02]"
                    onClick={togglePlayPause}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => setIsPlaying(false)}
                    controls={false}
                    preload="metadata"
                  />
                ) : (
                  <div className="w-full h-full relative">
                    <img
                      src={currentClip.thumbnailUrl}
                      alt={`Video clip de ${currentClip.title}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-center justify-center">
                      <div className="text-center text-white">
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Upload size={48} className="mx-auto mb-3 opacity-80" />
                        </motion.div>
                        <p className="text-lg font-medium">Video Próximamente</p>
                        <p className="text-sm opacity-80 mb-3">Sube el video para activar la reproducción</p>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                          onClick={() => setShowUploadDialog(true)}
                        >
                          Subir Ahora
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Enhanced Play/Pause Overlay */}
                {currentClip.videoUrl && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
                       onClick={togglePlayPause}>
                    <motion.div
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      animate={{ 
                        boxShadow: isPlaying 
                          ? ["0 0 20px rgba(var(--accent), 0.3)", "0 0 40px rgba(var(--accent), 0.5)", "0 0 20px rgba(var(--accent), 0.3)"]
                          : "0 0 30px rgba(var(--accent), 0.4)"
                      }}
                      transition={{ 
                        duration: isPlaying ? 2 : 0.3, 
                        repeat: isPlaying ? Infinity : 0 
                      }}
                      className="w-20 h-20 bg-gradient-to-br from-accent via-accent/90 to-accent/80 rounded-full flex items-center justify-center shadow-2xl border-2 border-white/20 backdrop-blur-sm"
                    >
                      {isPlaying ? (
                        <Pause size={28} className="text-accent-foreground" />
                      ) : (
                        <Play size={28} className="text-accent-foreground ml-1" />
                      )}
                    </motion.div>
                  </div>
                )}
                
                {/* Enhanced Duration Badge */}
                <div className="absolute bottom-2 right-2 bg-gradient-to-r from-black/90 via-black/80 to-black/70 text-white text-sm px-3 py-1.5 rounded-full border border-white/20 shadow-lg backdrop-blur-sm">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse"></div>
                    <span className="font-mono font-medium tracking-wide">
                      {currentClip.duration}
                    </span>
                  </div>
                </div>

                {/* Video Quality Indicator */}
                <div className="absolute top-2 left-2 bg-gradient-to-r from-secondary/90 to-secondary/70 text-secondary-foreground text-xs px-2 py-1 rounded-full border border-white/20 shadow-lg backdrop-blur-sm">
                  <div className="flex items-center gap-1">
                    <div className="w-1 h-1 bg-secondary-foreground rounded-full"></div>
                    <span className="font-medium">HD</span>
                  </div>
                </div>

                {/* Enhanced Navigation Arrows */}
                {videoClips.length > 1 && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.1, x: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={previousClip}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-r from-black/80 to-black/60 hover:from-black/90 hover:to-black/80 rounded-full flex items-center justify-center text-white transition-all duration-300 border border-white/20 shadow-lg backdrop-blur-sm"
                    >
                      <ArrowLeft size={18} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1, x: 2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={nextClip}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-l from-black/80 to-black/60 hover:from-black/90 hover:to-black/80 rounded-full flex items-center justify-center text-white transition-all duration-300 border border-white/20 shadow-lg backdrop-blur-sm"
                    >
                      <ArrowRight size={18} />
                    </motion.button>
                  </>
                )}

                {/* Video Progress Bar (when playing) */}
                {currentClip.videoUrl && isPlaying && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
                    <motion.div
                      className="h-full bg-gradient-to-r from-accent to-accent/80"
                      style={{
                        width: videoRef.current 
                          ? `${(videoRef.current.currentTime / videoRef.current.duration) * 100}%`
                          : '0%'
                      }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                )}
              </div>

              {/* Video Navigation Dots */}
              {videoClips.length > 1 && (
                <div className="flex justify-center gap-2 mt-3">
                  {videoClips.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentClipIndex(index)
                        setIsPlaying(false)
                      }}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentClipIndex ? 'bg-accent' : 'bg-muted-foreground/30'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Enhanced Generated Thumbnails Preview */}
            {currentClip.generatedThumbnails && currentClip.generatedThumbnails.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
                    Momentos del Video ({currentClip.generatedThumbnails.length})
                  </h4>
                  <div className="text-sm text-muted-foreground">
                    Haz clic para saltar al momento
                  </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {currentClip.generatedThumbnails.map((thumbnail, index) => (
                    <motion.div
                      key={thumbnail.id}
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ 
                        duration: 0.4, 
                        delay: index * 0.1,
                        ease: "easeOut"
                      }}
                      whileHover={{ 
                        scale: 1.05, 
                        transition: { duration: 0.2 } 
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="group relative cursor-pointer"
                      onClick={() => {
                        if (videoRef.current) {
                          videoRef.current.currentTime = thumbnail.timestamp
                          toast.success(`Saltando a ${Math.floor(thumbnail.timestamp / 60)}:${Math.floor(thumbnail.timestamp % 60).toString().padStart(2, '0')}`)
                        }
                      }}
                    >
                      <div className="aspect-video rounded-lg overflow-hidden border-2 border-accent/20 bg-muted/20 shadow-lg group-hover:shadow-xl group-hover:border-accent/40 transition-all duration-300">
                        <img
                          src={thumbnail.dataUrl}
                          alt={`Miniatura en ${Math.floor(thumbnail.timestamp / 60)}:${Math.floor(thumbnail.timestamp % 60).toString().padStart(2, '0')}`}
                          className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110 group-hover:brightness-110"
                        />
                      </div>
                      
                      {/* Enhanced Timestamp Badge */}
                      <div className="absolute bottom-2 right-2 bg-gradient-to-r from-black/80 to-black/70 text-white text-xs px-2 py-1 rounded-full border border-white/20 shadow-lg">
                        <span className="font-mono font-medium">
                          {Math.floor(thumbnail.timestamp / 60)}:{Math.floor(thumbnail.timestamp % 60).toString().padStart(2, '0')}
                        </span>
                      </div>
                      
                      {/* Progress indicator for timestamp position */}
                      <div className="absolute bottom-0 left-0 h-1 bg-accent rounded-b-lg transition-all duration-300 group-hover:h-1.5" 
                           style={{ 
                             width: `${(thumbnail.timestamp / (videoRef.current?.duration || 1)) * 100}%` 
                           }} 
                      />
                      
                      {/* Hover Play Icon */}
                      <div className="absolute inset-0 bg-black/30 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          whileHover={{ scale: 1, opacity: 1 }}
                          className="w-8 h-8 bg-accent/90 rounded-full flex items-center justify-center shadow-lg"
                        >
                          <Play size={14} className="text-accent-foreground ml-0.5" />
                        </motion.div>
                      </div>
                      
                      {/* Tooltip on hover */}
                      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                        Ir a {Math.floor(thumbnail.timestamp / 60)}:{Math.floor(thumbnail.timestamp % 60).toString().padStart(2, '0')}
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {/* Video Timeline Preview */}
                <div className="mt-4 p-3 bg-muted/20 rounded-lg border border-accent/20">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-secondary rounded-full"></div>
                    <span className="text-sm font-medium">Línea de Tiempo del Video</span>
                  </div>
                  <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/30 to-secondary/20"></div>
                    {currentClip.generatedThumbnails.map((thumbnail) => (
                      <div
                        key={thumbnail.id}
                        className="absolute top-0 w-1 h-full bg-accent shadow-sm cursor-pointer hover:bg-accent/80 transition-colors"
                        style={{ 
                          left: `${(thumbnail.timestamp / (videoRef.current?.duration || 1)) * 100}%` 
                        }}
                        onClick={() => {
                          if (videoRef.current) {
                            videoRef.current.currentTime = thumbnail.timestamp
                          }
                        }}
                        title={`${Math.floor(thumbnail.timestamp / 60)}:${Math.floor(thumbnail.timestamp % 60).toString().padStart(2, '0')}`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>0:00</span>
                    <span>{currentClip.duration}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Track Info & CTA */}
            <div className="space-y-4">{/* Previous content starts here */}
              <div>
                <h4 className="text-xl font-semibold text-foreground mb-1">
                  {currentClip.title}
                </h4>
                <p className="text-accent font-medium">
                  por {currentClip.artist}
                </p>
                <p className="text-muted-foreground text-sm mt-2">
                  {currentClip.description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      className="btn-3d bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg"
                      size="lg"
                      disabled={!currentClip.videoUrl}
                    >
                      <Play size={20} className="mr-2" />
                      Ver Video Completo
                    </Button>
                  </DialogTrigger>
                  {currentClip.videoUrl && (
                    <DialogContent className="max-w-4xl p-0 bg-black border-accent/20">
                      <div className="relative aspect-video">
                        <video
                          src={currentClip.videoUrl}
                          controls
                          autoPlay
                          className="w-full h-full"
                        />
                        <DialogTrigger asChild>
                          <button className="absolute top-4 right-4 w-8 h-8 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center text-white transition-colors">
                            <X size={16} />
                          </button>
                        </DialogTrigger>
                      </div>
                    </DialogContent>
                  )}
                </Dialog>
                
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

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-md">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Subir Video Clip</h3>
              <p className="text-sm text-muted-foreground">
                Selecciona el track para el cual quieres subir un video
              </p>
            </div>
            
            <div className="space-y-3">
              {videoClips.map((clip) => (
                <div
                  key={clip.id}
                  className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={clip.thumbnailUrl}
                      alt={clip.title}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div>
                      <p className="font-medium text-sm">{clip.title}</p>
                      <p className="text-xs text-muted-foreground">{clip.artist}</p>
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setUploadingClipId(clip.id)
                      fileInputRef.current?.click()
                    }}
                    className="text-xs"
                  >
                    {clip.videoUrl ? 'Cambiar' : 'Subir'}
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => uploadingClipId && handleVideoUpload(uploadingClipId, e)}
          />
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}