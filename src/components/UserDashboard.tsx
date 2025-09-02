import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { useKV } from '@github/spark/hooks'
import { 
  Heart, 
  Download, 
  Calendar, 
  Music, 
  ShoppingCart, 
  Gift, 
  Star,
  ArrowLeft,
  Play,
  Pause
} from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface UserDashboardProps {
  user: any
  onBack: () => void
  onLogout: () => void
}

export function UserDashboard({ user, onBack, onLogout }: UserDashboardProps) {
  const [savedTracks] = useKV('user-saved-tracks', [])
  const [purchaseHistory] = useKV('user-purchase-history', [])
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null)

  // Sample offers data
  const offers = [
    {
      id: '1',
      title: 'Flash Sale: 50% OFF',
      description: 'Todos los tracks de Neiland con 50% de descuento',
      discount: 50,
      validUntil: '2024-12-31',
      code: 'NEILAND50',
      type: 'percentage'
    },
    {
      id: '2',
      title: 'Pack Completo Techno',
      description: 'Compra 5 tracks y obtén 2 gratis',
      discount: 0,
      validUntil: '2024-12-25',
      code: 'TECHNO52',
      type: 'bundle'
    },
    {
      id: '3',
      title: 'Suscripción Premium',
      description: 'Acceso ilimitado por €9.99/mes',
      discount: 0,
      validUntil: '2024-12-31',
      code: 'PREMIUM',
      type: 'subscription'
    }
  ]

  // Sample purchase history
  const samplePurchases = [
    {
      id: '1',
      date: '2024-01-15',
      tracks: [
        { title: 'Digital Underground', artist: 'Neiland', format: 'WAV', price: 4.99 }
      ],
      total: 4.99,
      status: 'completed'
    },
    {
      id: '2',
      date: '2024-01-10',
      tracks: [
        { title: 'Midnight Circuit', artist: 'Voltage', format: 'MP3', price: 3.49 },
        { title: 'Synthetic Dreams', artist: 'Code Red', format: 'FLAC', price: 3.79 }
      ],
      total: 7.28,
      status: 'completed'
    }
  ]

  // Sample saved tracks
  const sampleSavedTracks = [
    {
      id: '1',
      title: 'Digital Underground',
      artist: 'Neiland',
      duration: '6:42',
      coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
      audioUrl: '/audio/sample1.mp3'
    },
    {
      id: '2',
      title: 'Bass Revolution',
      artist: 'Subsonic',
      duration: '5:33',
      coverUrl: 'https://images.unsplash.com/photo-1485579149621-3123dd979885?w=400&h=400&fit=crop',
      audioUrl: '/audio/sample2.mp3'
    }
  ]

  const handlePlayPause = (trackId: string) => {
    if (currentlyPlaying === trackId) {
      setCurrentlyPlaying(null)
    } else {
      setCurrentlyPlaying(trackId)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a la tienda
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
            </div>
            <Button variant="outline" onClick={onLogout}>
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Mi Dashboard</h1>
          <p className="text-muted-foreground">
            Gestiona tu música, compras y ofertas especiales
          </p>
        </div>

        <Tabs defaultValue="saved" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="saved">
              <Heart className="w-4 h-4 mr-2" />
              Guardados
            </TabsTrigger>
            <TabsTrigger value="purchases">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Compras
            </TabsTrigger>
            <TabsTrigger value="offers">
              <Gift className="w-4 h-4 mr-2" />
              Ofertas
            </TabsTrigger>
            <TabsTrigger value="profile">
              <Star className="w-4 h-4 mr-2" />
              Perfil
            </TabsTrigger>
          </TabsList>

          <TabsContent value="saved" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tracks Guardados</CardTitle>
                <CardDescription>
                  Tu colección de música favorita
                </CardDescription>
              </CardHeader>
              <CardContent>
                {sampleSavedTracks.length === 0 ? (
                  <div className="text-center py-8">
                    <Music className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No tienes tracks guardados aún</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sampleSavedTracks.map((track) => (
                      <motion.div
                        key={track.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center space-x-4 p-4 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors"
                      >
                        <div className="relative">
                          <img
                            src={track.coverUrl}
                            alt={track.title}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <Button
                            size="sm"
                            variant="secondary"
                            className="absolute inset-0 m-auto w-8 h-8 rounded-full opacity-0 hover:opacity-100 transition-opacity"
                            onClick={() => handlePlayPause(track.id)}
                          >
                            {currentlyPlaying === track.id ? (
                              <Pause className="w-3 h-3" />
                            ) : (
                              <Play className="w-3 h-3" />
                            )}
                          </Button>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{track.title}</h4>
                          <p className="text-sm text-muted-foreground">{track.artist}</p>
                          <p className="text-xs text-muted-foreground">{track.duration}</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Descargar
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="purchases" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Historial de Compras</CardTitle>
                <CardDescription>
                  Todas tus compras y descargas
                </CardDescription>
              </CardHeader>
              <CardContent>
                {samplePurchases.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No tienes compras aún</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {samplePurchases.map((purchase) => (
                      <motion.div
                        key={purchase.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border rounded-lg p-6 bg-card/50"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {formatDate(purchase.date)}
                            </span>
                          </div>
                          <Badge variant={purchase.status === 'completed' ? 'default' : 'secondary'}>
                            {purchase.status === 'completed' ? 'Completado' : 'Pendiente'}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          {purchase.tracks.map((track, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <div>
                                <span className="font-medium">{track.title}</span>
                                <span className="text-muted-foreground"> - {track.artist}</span>
                                <Badge variant="outline" className="ml-2">
                                  {track.format}
                                </Badge>
                              </div>
                              <span className="font-medium">€{track.price}</span>
                            </div>
                          ))}
                        </div>
                        
                        <Separator className="my-4" />
                        
                        <div className="flex items-center justify-between">
                          <span className="font-bold">Total: €{purchase.total}</span>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Descargar Todo
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="offers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ofertas Especiales</CardTitle>
                <CardDescription>
                  Promociones exclusivas de Neiland y Nada Records
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  {offers.map((offer) => (
                    <motion.div
                      key={offer.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.02 }}
                      className="border rounded-lg p-6 bg-gradient-to-br from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-lg">{offer.title}</h3>
                          <p className="text-muted-foreground text-sm mt-1">
                            {offer.description}
                          </p>
                        </div>
                        <Gift className="w-6 h-6 text-primary" />
                      </div>
                      
                      {offer.type === 'percentage' && (
                        <div className="mb-4">
                          <span className="text-3xl font-bold text-primary">
                            {offer.discount}% OFF
                          </span>
                        </div>
                      )}
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Código:</span>
                          <Badge variant="secondary">{offer.code}</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Válido hasta:</span>
                          <span>{formatDate(offer.validUntil)}</span>
                        </div>
                      </div>
                      
                      <Button className="w-full">
                        Usar Oferta
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información del Perfil</CardTitle>
                <CardDescription>
                  Gestiona tu información personal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="text-xl">{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-bold">{user.name}</h3>
                    <p className="text-muted-foreground">{user.email}</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Cambiar Foto
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Tracks Guardados</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{sampleSavedTracks.length}</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Total Gastado</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">
                        €{samplePurchases.reduce((total, purchase) => total + purchase.total, 0).toFixed(2)}
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-4">
                  <Button variant="outline" className="w-full">
                    Editar Perfil
                  </Button>
                  <Button variant="outline" className="w-full">
                    Cambiar Contraseña
                  </Button>
                  <Button variant="outline" className="w-full">
                    Configuración de Notificaciones
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}