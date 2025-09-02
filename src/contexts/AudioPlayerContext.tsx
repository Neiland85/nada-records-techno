import React, { createContext, useContext, useState } from 'react'

interface AudioPlayerContextType {
  currentTrackId: string | null
  setCurrentTrackId: (id: string | null) => void
  stopAll: () => void
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined)

export function AudioPlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null)

  const stopAll = () => {
    setCurrentTrackId(null)
  }

  return (
    <AudioPlayerContext.Provider value={{ 
      currentTrackId, 
      setCurrentTrackId, 
      stopAll 
    }}>
      {children}
    </AudioPlayerContext.Provider>
  )
}

export function useAudioPlayerContext() {
  const context = useContext(AudioPlayerContext)
  if (context === undefined) {
    throw new Error('useAudioPlayerContext must be used within an AudioPlayerProvider')
  }
  return context
}