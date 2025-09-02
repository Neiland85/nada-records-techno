import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X, Cookie, Shield, Settings } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useKV } from '@github/spark/hooks'

export function CookieBanner() {
  const [cookiesAccepted, setCookiesAccepted] = useKV('cookies-accepted', false)
  const [showBanner, setShowBanner] = React.useState(!cookiesAccepted)

  const handleAcceptAll = () => {
    setCookiesAccepted(true)
    setShowBanner(false)
  }

  const handleAcceptNecessary = () => {
    setCookiesAccepted('necessary-only')
    setShowBanner(false)
  }

  const handleClose = () => {
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed bottom-6 left-6 right-6 z-50 max-w-5xl mx-auto"
      >
        <Card className="glass-card border-accent/20 shadow-2xl">
          <div className="p-6 bg-gradient-to-r from-card via-card/95 to-card">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                  <Cookie size={24} className="text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Gestión de Cookies
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Nada Records • Experiencia personalizada
                  </p>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={20} />
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-accent" />
                  <span className="text-sm font-medium text-foreground">Cookies Esenciales</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Necesarias para el funcionamiento básico del sitio, carrito de compras y autenticación.
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Settings size={16} className="text-secondary" />
                  <span className="text-sm font-medium text-foreground">Personalización</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Recordar tus preferencias de audio, favoritos y configuración de la tienda.
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Cookie size={16} className="text-primary" />
                  </motion.div>
                  <span className="text-sm font-medium text-foreground">Analíticas</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Nos ayudan a entender qué música te gusta más para mejores recomendaciones.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-between items-center pt-4 border-t border-border/50">
              <p className="text-xs text-muted-foreground max-w-md">
                Utilizamos cookies para mejorar tu experiencia en Nada Records. 
                Puedes aceptar todas o solo las esenciales.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAcceptNecessary}
                  className="btn-3d border-border hover:bg-muted/50 text-sm"
                >
                  Solo Esenciales
                </Button>
                <Button
                  onClick={handleAcceptAll}
                  className="btn-3d bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg text-sm"
                >
                  Aceptar Todas
                </Button>
              </div>
            </div>

            {/* Modern accent line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-secondary"></div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}