import React, { useState, useRef, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Camera, Download, Clock, Grid3X3, Play, Pause, HelpCircle } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { ThumbnailHelp } from '@/components/ThumbnailHelp'

interface ThumbnailPreview {
  id: string
  timestamp: number
  dataUrl: string
  filename: string
}

interface VideoThumbnailGeneratorProps {
  videoUrl?: string
  videoTitle?: string
  onThumbnailGenerated?: (thumbnail: ThumbnailPreview) => void
}

export function VideoThumbnailGenerator({ 
  videoUrl, 
  videoTitle = 'Video',
  onThumbnailGenerated 
}: VideoThumbnailGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [thumbnails, setThumbnails] = useState<ThumbnailPreview[]>([])
  const [currentTime, setCurrentTime] = useState(0)
  const [videoDuration, setVideoDuration] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [customTimestamps, setCustomTimestamps] = useState('0, 30, 60')
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const captureFrame = useCallback((timestamp: number) => {
    if (!videoRef.current || !canvasRef.current) return null

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    if (!ctx || video.readyState < 2) {
      toast.error('El video no está listo para la captura')
      return null
    }

    // Set high-quality canvas dimensions for better thumbnails
    const targetWidth = 640
    const targetHeight = 360
    const aspectRatio = video.videoWidth / video.videoHeight
    
    let canvasWidth = targetWidth
    let canvasHeight = targetHeight
    
    // Maintain aspect ratio
    if (aspectRatio > targetWidth / targetHeight) {
      canvasHeight = targetWidth / aspectRatio
    } else {
      canvasWidth = targetHeight * aspectRatio
    }
    
    canvas.width = canvasWidth
    canvas.height = canvasHeight

    // Enable image smoothing for better quality
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    
    // Clear canvas with black background
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)
    
    // Draw current video frame to canvas with centering
    const drawWidth = canvasWidth
    const drawHeight = canvasHeight
    const drawX = 0
    const drawY = 0
    
    ctx.drawImage(video, drawX, drawY, drawWidth, drawHeight)
    
    // Add subtle border for thumbnail
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.lineWidth = 2
    ctx.strokeRect(1, 1, canvasWidth - 2, canvasHeight - 2)
    
    // Convert to high-quality data URL
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92) // Higher quality
    
    const thumbnail: ThumbnailPreview = {
      id: `thumb_${Date.now()}_${timestamp}`,
      timestamp,
      dataUrl,
      filename: `${videoTitle.replace(/\s+/g, '-').toLowerCase()}_${formatTime(timestamp).replace(':', 'm')}s.jpg`
    }

    return thumbnail
  }, [videoTitle])

  const handleSeek = (timestamp: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = timestamp
      setCurrentTime(timestamp)
    }
  }

  const generateThumbnailAtCurrentTime = () => {
    const thumbnail = captureFrame(currentTime)
    if (thumbnail) {
      setThumbnails(prev => [...prev, thumbnail])
      onThumbnailGenerated?.(thumbnail)
      toast.success(`Miniatura capturada en ${formatTime(currentTime)}`)
    } else {
      toast.error('Error al capturar la miniatura')
    }
  }

  const generateMultipleThumbnails = () => {
    const timestamps = customTimestamps
      .split(',')
      .map(t => parseFloat(t.trim()))
      .filter(t => !isNaN(t) && t >= 0 && t <= videoDuration)

    if (timestamps.length === 0) {
      toast.error('No hay marcas de tiempo válidas')
      return
    }

    const newThumbnails: ThumbnailPreview[] = []
    
    timestamps.forEach((timestamp, index) => {
      setTimeout(() => {
        handleSeek(timestamp)
        setTimeout(() => {
          const thumbnail = captureFrame(timestamp)
          if (thumbnail) {
            newThumbnails.push(thumbnail)
            setThumbnails(prev => [...prev, thumbnail])
            onThumbnailGenerated?.(thumbnail)
          }
          
          if (index === timestamps.length - 1) {
            toast.success(`${newThumbnails.length} miniaturas generadas`)
          }
        }, 100) // Wait for video to seek
      }, index * 200) // Stagger the captures
    })
  }

  const generateAutoThumbnails = () => {
    if (videoDuration === 0) return

    const intervals = 6 // Generate 6 thumbnails
    const step = videoDuration / (intervals + 1)
    const timestamps = Array.from({ length: intervals }, (_, i) => (i + 1) * step)
    
    setCustomTimestamps(timestamps.map(t => Math.round(t)).join(', '))
    
    // Auto-generate after setting timestamps
    setTimeout(() => generateMultipleThumbnails(), 100)
  }

  const downloadThumbnail = (thumbnail: ThumbnailPreview) => {
    const link = document.createElement('a')
    link.download = thumbnail.filename
    link.href = thumbnail.dataUrl
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Miniatura descargada')
  }

  const downloadAllThumbnails = () => {
    thumbnails.forEach((thumbnail, index) => {
      setTimeout(() => downloadThumbnail(thumbnail), index * 100)
    })
  }

  const clearThumbnails = () => {
    setThumbnails([])
    toast.success('Miniaturas eliminadas')
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  if (!videoUrl) {
    return (
      <Button variant="outline" disabled className="gap-2">
        <Camera size={16} />
        No hay video
      </Button>
    )
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2 border-accent/30 hover:bg-accent/10">
            <Camera size={16} />
            Generar Miniaturas
          </Button>
        </DialogTrigger>
        
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera size={20} />
              Generador de Miniaturas - {videoTitle}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Video Preview & Controls */}
            <div className="space-y-4">
              <Card className="p-4">
                <div className="aspect-video rounded-lg overflow-hidden bg-muted/20 border border-accent/20 relative">
                  <video
                    ref={videoRef}
                    src={videoUrl}
                    className="w-full h-full object-cover"
                    onLoadedMetadata={() => {
                      if (videoRef.current) {
                        setVideoDuration(videoRef.current.duration)
                      }
                    }}
                    onTimeUpdate={() => {
                      if (videoRef.current) {
                        setCurrentTime(videoRef.current.currentTime)
                      }
                    }}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  />
                  
                  {/* Play/Pause Overlay */}
                  <div 
                    className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                    onClick={togglePlay}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-16 h-16 bg-accent/90 rounded-full flex items-center justify-center shadow-lg"
                    >
                      {isPlaying ? (
                        <Pause size={24} className="text-accent-foreground" />
                      ) : (
                        <Play size={24} className="text-accent-foreground ml-1" />
                      )}
                    </motion.div>
                  </div>
                  
                  {/* Enhanced Time Display with detailed info */}
                  <div className="absolute bottom-2 right-2 bg-gradient-to-r from-black/90 to-black/70 text-white text-sm px-3 py-1.5 rounded-full border border-white/20 shadow-lg backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse"></div>
                        <span className="font-mono font-medium tracking-wide">
                          {formatTime(currentTime)}
                        </span>
                      </div>
                      <div className="w-px h-3 bg-white/30"></div>
                      <span className="font-mono text-xs opacity-80">
                        {formatTime(videoDuration)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Video Progress Indicator */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
                    <div 
                      className="h-full bg-gradient-to-r from-accent to-accent/80 transition-all duration-300"
                      style={{ width: `${(currentTime / videoDuration) * 100}%` }}
                    />
                  </div>
                </div>
                
                {/* Seek Bar */}
                <div className="mt-4 space-y-2">
                  <Label className="text-sm flex items-center gap-2">
                    <Clock size={16} />
                    Tiempo: {formatTime(currentTime)}
                  </Label>
                  <input
                    type="range"
                    min={0}
                    max={videoDuration}
                    value={currentTime}
                    onChange={(e) => handleSeek(parseFloat(e.target.value))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, rgb(var(--accent)) 0%, rgb(var(--accent)) ${(currentTime / videoDuration) * 100}%, rgb(var(--muted)) ${(currentTime / videoDuration) * 100}%, rgb(var(--muted)) 100%)`
                    }}
                  />
                </div>
              </Card>
              
              {/* Capture Controls */}
              <Card className="p-4 space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Camera size={18} />
                  Controles de Captura
                </h3>
                
                {/* Help Section */}
                <ThumbnailHelp />
                
                <div className="grid gap-3">
                  <Button 
                    onClick={generateThumbnailAtCurrentTime}
                    className="btn-3d bg-accent hover:bg-accent/90"
                  >
                    <Camera size={16} className="mr-2" />
                    Capturar Tiempo Actual
                  </Button>
                  
                  <Button 
                    onClick={generateAutoThumbnails}
                    variant="outline"
                    className="border-secondary/30 hover:bg-secondary/10"
                  >
                    <Grid3X3 size={16} className="mr-2" />
                    Auto-Generar 6 Miniaturas
                  </Button>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timestamps" className="text-sm">
                      Marcas de tiempo personalizadas (segundos, separados por comas):
                    </Label>
                    <Input
                      id="timestamps"
                      value={customTimestamps}
                      onChange={(e) => setCustomTimestamps(e.target.value)}
                      placeholder="0, 30, 60, 90"
                      className="text-sm"
                    />
                    <Button 
                      onClick={generateMultipleThumbnails}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      Generar desde Marcas
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
            
            {/* Generated Thumbnails */}
            <div className="space-y-4">
              <Card className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">
                    Miniaturas Generadas ({thumbnails.length})
                  </h3>
                  {thumbnails.length > 0 && (
                    <div className="flex gap-2">
                      <Button 
                        onClick={downloadAllThumbnails}
                        variant="outline"
                        size="sm"
                        className="gap-1"
                      >
                        <Download size={14} />
                        Descargar Todas
                      </Button>
                      <Button 
                        onClick={clearThumbnails}
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10"
                      >
                        Limpiar
                      </Button>
                    </div>
                  )}
                </div>
                
                {thumbnails.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Camera size={32} className="mx-auto mb-2 opacity-50" />
                    <p>No hay miniaturas generadas</p>
                    <p className="text-sm">Usa los controles para capturar frames</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-accent/20 scrollbar-track-transparent">
                    {thumbnails.map((thumbnail, index) => (
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
                          y: -4,
                          transition: { duration: 0.2 } 
                        }}
                        className="group relative"
                      >
                        <div className="aspect-video rounded-lg overflow-hidden border-2 border-border group-hover:border-accent/60 shadow-lg group-hover:shadow-xl transition-all duration-300">
                          <img
                            src={thumbnail.dataUrl}
                            alt={`Miniatura en ${formatTime(thumbnail.timestamp)}`}
                            className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105 group-hover:brightness-110"
                          />
                        </div>
                        
                        {/* Enhanced Thumbnail Info */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 rounded-b-lg">
                          <div className="text-white">
                            <p className="font-mono font-bold text-sm mb-1 tracking-wide">
                              {formatTime(thumbnail.timestamp)}
                            </p>
                            <div className="flex items-center gap-1 text-xs opacity-80">
                              <div className="w-1 h-1 bg-accent rounded-full"></div>
                              <span>Calidad HD</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              onClick={() => downloadThumbnail(thumbnail)}
                              size="sm"
                              variant="secondary"
                              className="w-8 h-8 p-0 bg-black/70 hover:bg-black/90 border-white/20 backdrop-blur-sm"
                            >
                              <Download size={14} className="text-white" />
                            </Button>
                          </motion.div>
                        </div>
                        
                        {/* Seek to timestamp button */}
                        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              onClick={() => {
                                handleSeek(thumbnail.timestamp)
                                toast.success(`Saltando a ${formatTime(thumbnail.timestamp)}`)
                              }}
                              size="sm"
                              variant="secondary"
                              className="w-8 h-8 p-0 bg-accent/80 hover:bg-accent border-white/20 backdrop-blur-sm"
                            >
                              <Clock size={14} className="text-accent-foreground" />
                            </Button>
                          </motion.div>
                        </div>

                        {/* Progress indicator */}
                        <div className="absolute bottom-0 left-0 h-1 bg-accent rounded-bl-lg transition-all duration-300 group-hover:h-1.5" 
                             style={{ 
                               width: `${(thumbnail.timestamp / videoDuration) * 100}%` 
                             }} 
                        />

                        {/* Thumbnail quality badge */}
                        <div className="absolute bottom-2 right-2 bg-secondary/90 text-secondary-foreground text-xs px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          HD
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </div>
          
          {/* Hidden Canvas for Capture */}
          <canvas
            ref={canvasRef}
            className="hidden"
          />
        </DialogContent>
      </Dialog>
    </>
  )
}