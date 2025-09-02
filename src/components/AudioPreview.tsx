import React, { useEffect } from 'react'
import { Play, Pause, SpeakerHigh, SpeakerX } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { useAudioPlayer } from '@/hooks/useAudioPlayer'
import { useAudioPlayerContext } from '@/contexts/AudioPlayerContext'
import { toast } from 'sonner'

interface AudioPreviewProps {
  trackId: string
  audioUrl: string
  title: string
  className?: string
  showMiniPlayer?: boolean
}

export function AudioPreview({ 
  trackId, 
  audioUrl, 
  title, 
  className = '',
  showMiniPlayer = false 
}: AudioPreviewProps) {
  const { currentTrackId, setCurrentTrackId } = useAudioPlayerContext()
  const isCurrentTrack = currentTrackId === trackId
  
  const {
    isPlaying,
    isLoading,
    currentTime,
    duration,
    volume,
    play,
    pause,
    stop,
    seek,
    setVolume
  } = useAudioPlayer(audioUrl)

  // Stop playback when another track starts
  useEffect(() => {
    if (currentTrackId !== trackId && isPlaying) {
      pause()
    }
  }, [currentTrackId, trackId, isPlaying, pause])

  const handlePlayPause = async () => {
    if (isPlaying) {
      pause()
      setCurrentTrackId(null)
    } else {
      // Stop any other playing track
      if (currentTrackId && currentTrackId !== trackId) {
        setCurrentTrackId(null)
      }
      
      setCurrentTrackId(trackId)
      try {
        await play()
        toast.success(`Now playing: ${title}`)
      } catch (error) {
        toast.error('Failed to play audio')
        setCurrentTrackId(null)
      }
    }
  }

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleSeek = (value: number[]) => {
    const newTime = (value[0] / 100) * duration
    seek(newTime)
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0] / 100)
  }

  if (showMiniPlayer && isCurrentTrack && isPlaying) {
    return (
      <div className={`bg-card border rounded-lg p-3 space-y-3 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              onClick={handlePlayPause}
              disabled={isLoading}
              className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full w-8 h-8 p-0"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </Button>
            <span className="text-sm font-medium truncate">{title}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <Slider
            value={[duration > 0 ? (currentTime / duration) * 100 : 0]}
            onValueChange={handleSeek}
            max={100}
            step={1}
            className="w-full"
          />
        </div>
        
        {/* Volume Control */}
        <div className="flex items-center space-x-2">
          {volume === 0 ? (
            <SpeakerX className="w-4 h-4 text-muted-foreground" />
          ) : (
            <SpeakerHigh className="w-4 h-4 text-muted-foreground" />
          )}
          <Slider
            value={[volume * 100]}
            onValueChange={handleVolumeChange}
            max={100}
            step={1}
            className="w-20"
          />
        </div>
      </div>
    )
  }

  return (
    <Button
      size="lg"
      onClick={handlePlayPause}
      disabled={isLoading}
      className={`bg-accent hover:bg-accent/90 text-accent-foreground rounded-full w-16 h-16 ${className}`}
    >
      {isLoading ? (
        <div className="w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : isPlaying && isCurrentTrack ? (
        <Pause className="w-8 h-8" />
      ) : (
        <Play className="w-8 h-8" />
      )}
    </Button>
  )
}