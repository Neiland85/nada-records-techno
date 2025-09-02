import React from 'react'
import { ShoppingCart } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useKV } from '@github/spark/hooks'

export function Header() {
  const [cartItems] = useKV('cart-items', [])
  
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-accent to-primary rounded-md"></div>
            <h1 className="text-2xl font-bold tracking-tight">Nada Records</h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Releases</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Artists</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Labels</a>
          </nav>
          
          <Button variant="outline" className="relative">
            <ShoppingCart className="w-5 h-5" />
            {cartItems.length > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-accent text-accent-foreground px-1.5 py-0.5 text-xs">
                {cartItems.length}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </header>
  )
}