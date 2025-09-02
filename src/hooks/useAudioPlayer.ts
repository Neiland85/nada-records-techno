import { useState, useEffect, useRef } from 'react'

interface UseAudioPlayerReturn {
  isPlaying: boolean
  isLoading: boolean
  currentTime: number
  duration: number
  volume: number
  play: () => void
  pause: () => void
  stop: () => void
  seek: (time: number) => void
  setVolume: (volume: number) => void
}

export function useAudioPlayer(src: string): UseAudioPlayerReturn {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolumeState] = useState(0.7)

  useEffect(() => {
    const audio = new Audio()
    audioRef.current = audio

    const handleLoadStart = () => setIsLoading(true)
    const handleCanPlay = () => setIsLoading(false)
    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
      setIsLoading(false)
    }
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }
    const handleError = () => {
      setIsLoading(false)
      console.warn('Audio file not found:', src, '- This is expected during development')
    }

    audio.addEventListener('loadstart', handleLoadStart)
    audio.addEventListener('canplay', handleCanPlay)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)

    audio.src = src
    audio.volume = volume
    audio.preload = 'metadata'

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart)
      audio.removeEventListener('canplay', handleCanPlay)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
      audio.pause()
      audio.src = ''
    }
  }, [src, volume])

  const play = async () => {
    if (!audioRef.current) return
    
    try {
      setIsLoading(true)
      await audioRef.current.play()
      setIsPlaying(true)
    } catch (error) {
      console.error('Error playing audio:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const pause = () => {
    if (!audioRef.current) return
    audioRef.current.pause()
    setIsPlaying(false)
  }

  const stop = () => {
    if (!audioRef.current) return
    audioRef.current.pause()
    audioRef.current.currentTime = 0
    setIsPlaying(false)
    setCurrentTime(0)
  }

  const seek = (time: number) => {
    if (!audioRef.current) return
    audioRef.current.currentTime = time
    setCurrentTime(time)
  }

  const setVolume = (newVolume: number) => {
    if (!audioRef.current) return
    const clampedVolume = Math.max(0, Math.min(1, newVolume))
    audioRef.current.volume = clampedVolume
    setVolumeState(clampedVolume)
  }

  return {
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
  }
}