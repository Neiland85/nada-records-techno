import React from 'react'
import { ShoppingCart, User, SignIn } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { useKV } from '@github/spark/hooks'
import { motion } from 'framer-motion'

interface HeaderProps {
  user?: any
  onAuthClick: () => void
  onDashboardClick: () => void
  onLogout: () => void
}

export function Header({ user, onAuthClick, onDashboardClick, onLogout }: HeaderProps) {
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
          
          <div className="flex items-center gap-3">
            <Button variant="outline" className="relative">
              <ShoppingCart className="w-5 h-5" />
              {cartItems.length > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-accent text-accent-foreground px-1.5 py-0.5 text-xs">
                  {cartItems.length}
                </Badge>
              )}
            </Button>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onDashboardClick}>
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout}>
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={onAuthClick}
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transform transition-all duration-200 shadow-lg hover:shadow-xl active:shadow-inner active:translate-y-0.5"
                  style={{
                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.1)'
                  }}
                >
                  <SignIn className="w-4 h-4 mr-2" />
                  Iniciar Sesión
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}