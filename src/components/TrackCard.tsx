import React, { useState, useRef, useEffect } from 'react'
import { Download, ShoppingCart, Video } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AudioPreview } from '@/components/AudioPreview'
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

interface TrackCardProps {
  track: Track
}

export function TrackCard({ track }: TrackCardProps) {
  const [selectedFormat, setSelectedFormat] = useState('mp3')
  const [cartItems, setCartItems] = useKV('cart-items', [])
  const [trackVideos] = useKV('track-videos', {})
  const [isHovered, setIsHovered] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const trackVideo = trackVideos[track.id]

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
    }
  }, [])

  const handleMouseEnter = () => {
    setIsHovered(true)
    
    if (trackVideo) {
      console.log(`Hover preview starting for track: ${track.title}`, trackVideo)
      // Delay showing video to prevent accidental triggers
      hoverTimeoutRef.current = setTimeout(() => {
        setShowVideo(true)
        if (videoRef.current) {
          videoRef.current.currentTime = 0
          videoRef.current.play().catch((error) => {
            console.log('Video autoplay prevented:', error)
          })
        }
        if (audioRef.current) {
          audioRef.current.currentTime = 0
          audioRef.current.volume = 0.6
          audioRef.current.play().catch((error) => {
            console.log('Audio autoplay prevented:', error)
          })
        }
      }, 300)
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setShowVideo(false)
    
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
    
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    
    console.log(`Hover preview stopped for track: ${track.title}`)
  }

  const handleVideoError = () => {
    console.log('Video failed to load')
    setShowVideo(false)
  }

  const handleAudioError = () => {
    console.log('Audio failed to load')
  }

  const addToCart = () => {
    const cartItem = {
      trackId: track.id,
      title: track.title,
      artist: track.artist,
      format: selectedFormat,
      price: track.formats[selectedFormat as keyof typeof track.formats].price
    }
    
    setCartItems((current: any[]) => [...current, cartItem])
    toast.success(`Added ${track.title} (${selectedFormat.toUpperCase()}) to cart`)
  }

  return (
    <Card className="group hover:bg-card/80 transition-all duration-300 overflow-hidden">
      <CardContent className="p-0">
        <div 
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Cover Image */}
          <img 
            src={track.coverUrl} 
            alt={`${track.title} cover`}
            className={`w-full h-48 object-cover transition-opacity duration-300 ${
              showVideo && trackVideo ? 'opacity-0' : 'opacity-100'
            }`}
          />
          
          {/* Video Overlay */}
          {trackVideo && (
            <div className={`absolute inset-0 transition-opacity duration-300 ${
              showVideo ? 'opacity-100' : 'opacity-0'
            }`}>
              <video 
                ref={videoRef}
                className="w-full h-48 object-cover"
                muted
                playsInline
                loop
                poster={trackVideo.thumbnailUrl || track.coverUrl}
                onError={handleVideoError}
                onLoadStart={() => console.log(`Video loading started for: ${track.title}`)}
                onCanPlay={() => console.log(`Video ready to play: ${track.title}`)}
                onLoadedData={() => console.log(`Video data loaded: ${track.title}`)}
              >
                <source src={trackVideo.videoUrl} type="video/mp4" />
                <source src={trackVideo.videoUrl} type="video/webm" />
                Your browser does not support the video tag.
              </video>
              
              {/* Audio for video (separate element to control volume) */}
              <audio 
                ref={audioRef}
                volume={0.6}
                src={track.audioUrl}
                onError={handleAudioError}
              />
              
              {/* Video indicator */}
              <div className="absolute top-3 left-3">
                <Badge variant="secondary" className="bg-black/60 text-white flex items-center gap-1">
                  <Video className="w-3 h-3" />
                  Video
                </Badge>
              </div>
              
              {/* Loading indicator */}
              <div className="absolute bottom-3 right-3">
                <Badge variant="outline" className="bg-black/60 border-white/20 text-white text-xs">
                  Preview
                </Badge>
              </div>
            </div>
          )}
          
          {/* Regular Audio Preview Overlay (when no video or not hovering) */}
          {(!trackVideo || !showVideo) && (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <AudioPreview
                trackId={track.id}
                audioUrl={track.audioUrl}
                title={track.title}
              />
            </div>
          )}
          
          {/* BPM Badge */}
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-black/60 text-white">
              {track.bpm} BPM
            </Badge>
          </div>
          
          {/* Video Available Indicator */}
          {trackVideo && !showVideo && (
            <div className="absolute bottom-3 left-3">
              <Badge variant="secondary" className="bg-secondary/80 text-secondary-foreground flex items-center gap-1">
                <Video className="w-3 h-3" />
                Hover for video
              </Badge>
            </div>
          )}
        </div>
        
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-lg leading-tight">{track.title}</h3>
            <p className="text-muted-foreground">{track.artist}</p>
            <p className="text-sm text-muted-foreground">{track.label}</p>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <Badge variant="outline">{track.genre}</Badge>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-muted/30 rounded-full">
              <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse"></div>
              <span className="text-muted-foreground font-mono font-medium tracking-wide">
                {track.duration}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <span className="text-lg font-bold text-secondary">${track.price}</span>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Buy
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Choose Format</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">{track.title}</h4>
                    <p className="text-sm text-muted-foreground">{track.artist}</p>
                  </div>
                  
                  <Tabs value={selectedFormat} onValueChange={setSelectedFormat}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="mp3">MP3</TabsTrigger>
                      <TabsTrigger value="wav">WAV</TabsTrigger>
                      <TabsTrigger value="flac">FLAC</TabsTrigger>
                    </TabsList>
                    
                    {Object.entries(track.formats).map(([format, details]) => (
                      <TabsContent key={format} value={format} className="space-y-2">
                        <div className="border rounded-lg p-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium uppercase">{format}</span>
                            <span className="font-bold text-secondary">${details.price}</span>
                          </div>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p>Quality: {details.bitrate}</p>
                            <p>File size: {details.size}</p>
                          </div>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                  
                  <Button onClick={addToCart} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                    <Download className="w-4 h-4 mr-2" />
                    Add to Cart - ${track.formats[selectedFormat as keyof typeof track.formats].price}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}