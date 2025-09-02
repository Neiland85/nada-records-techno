import React, { useState } from 'react'
import { Play, Pause, Download, ShoppingCart } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedFormat, setSelectedFormat] = useState('mp3')
  const [cartItems, setCartItems] = useKV('cart-items', [])

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
    if (!isPlaying) {
      toast.success(`Now playing: ${track.title}`)
    }
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
        <div className="relative">
          <img 
            src={track.coverUrl} 
            alt={`${track.title} cover`}
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Button
              size="lg"
              onClick={handlePlayPause}
              className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full w-16 h-16"
            >
              {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
            </Button>
          </div>
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-black/60 text-white">
              {track.bpm} BPM
            </Badge>
          </div>
        </div>
        
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-lg leading-tight">{track.title}</h3>
            <p className="text-muted-foreground">{track.artist}</p>
            <p className="text-sm text-muted-foreground">{track.label}</p>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <Badge variant="outline">{track.genre}</Badge>
            <span className="text-muted-foreground">{track.duration}</span>
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