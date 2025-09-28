import { useState, useEffect, useRef } from 'react'
import { LoaderCircleIcon, PauseIcon, XIcon } from 'lucide-react'
import type { StoryUser } from '../StoriesPage'
import { cn } from '@/lib/utils'

interface StoryViewerProps {
  user: StoryUser
  currentStoryIndex: number
  onClose: () => void
  onNext: () => void
  onPrevious: () => void
}

export function StoryViewer({
  user,
  currentStoryIndex,
  onClose,
  onNext,
  onPrevious,
}: StoryViewerProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const autoAdvanceTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const currentStory = user.stories[currentStoryIndex]
  const STORY_DURATION = 5000

  useEffect(() => {
    setIsVisible(true)
    return () => setIsVisible(false)
  }, [])

  useEffect(() => {
    if (!imageLoaded || isPaused) return

    setProgress(0)

    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
    }
    if (autoAdvanceTimeoutRef.current) {
      clearTimeout(autoAdvanceTimeoutRef.current)
    }

    const startTime = Date.now()
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime
      const newProgress = Math.min((elapsed / STORY_DURATION) * 100, 100)
      setProgress(newProgress)
    }, 50)

    autoAdvanceTimeoutRef.current = setTimeout(() => {
      onNext()
    }, STORY_DURATION)

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
      if (autoAdvanceTimeoutRef.current) {
        clearTimeout(autoAdvanceTimeoutRef.current)
      }
    }
  }, [imageLoaded, isPaused, currentStoryIndex, user.id, onNext])

  useEffect(() => {
    setImageLoaded(false)
    setProgress(0)
  }, [currentStoryIndex, user.id])

  useEffect(() => {
    if (!currentStory) return

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      setTimeout(() => setImageLoaded(true), 100)
    }
    img.src = currentStory.image

    const nextStoryIndex = currentStoryIndex + 1
    if (nextStoryIndex < user.stories.length) {
      const nextImg = new Image()
      nextImg.crossOrigin = 'anonymous'
      nextImg.src = user.stories[nextStoryIndex].image
    }
  }, [currentStory, currentStoryIndex, user.stories])

  const handleTouchStart = () => {
    setIsPaused(true)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsPaused(false)

    const touch = e.changedTouches[0]
    const rect = e.currentTarget.getBoundingClientRect()
    const x = touch.clientX - rect.left
    const width = rect.width

    if (x < width / 2) {
      onPrevious()
    } else {
      onNext()
    }
  }

  const handleMouseDown = () => {
    setIsPaused(true)
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    setIsPaused(false)

    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const width = rect.width

    if (x < width / 2) {
      onPrevious()
    } else {
      onNext()
    }
  }

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
    }, 200)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          onPrevious()
          break
        case 'ArrowRight':
        case ' ':
          onNext()
          break
        case 'Escape':
          handleClose()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onNext, onPrevious])

  if (!currentStory) return null

  return (
    <div
      className={cn(
        'fixed inset-0 bg-black z-50 flex items-center justify-center transition-all duration-300 max-w-md mx-auto',
        isVisible && !isClosing ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      )}
    >
      {/* Backdrop */}

      <div className="absolute w-full h-20 top-0 left-0 bg-gradient-to-b from-black/90 to-transparent pointer-events-none z-10"></div>

      {/* Progress bars */}
      <div
        className={cn(
          'absolute top-4 left-4 right-4 flex gap-1 z-10 transition-all duration-500',
          isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
        )}
      >
        {user.stories.map((_, index) => (
          <div key={index} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-100 ease-linear"
              style={{
                width:
                  index < currentStoryIndex
                    ? '100%'
                    : index === currentStoryIndex
                      ? `${progress}%`
                      : '0%',
              }}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div
        className={cn(
          'absolute top-8 left-4 right-4 flex items-center justify-between z-10 transition-all duration-500 delay-100',
          isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
        )}
      >
        <div className="flex items-center gap-3">
          <img
            src={user.avatar || '/placeholder.svg'}
            alt={user.username}
            className="size-8 rounded-full border border-white/20"
          />
          <div>
            <p className="text-white font-medium text-sm">{user.username}</p>
            <p className="text-white/70 text-xs">{currentStory.timestamp} ago</p>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="size-8 rounded-full bg-black/20 flex items-center justify-center hover:bg-black/40 transition-all duration-200 cursor-pointer"
        >
          <XIcon className="size-5 text-white" />
        </button>
      </div>

      {/* Story content */}
      <div
        className={cn(
          'relative w-full h-full max-w-md mx-auto cursor-pointer select-none transition-all duration-500 delay-200',
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        )}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-muted/20 to-muted/40 animate-pulse">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <LoaderCircleIcon />
              </div>
            </div>
          </div>
        )}
        <img
          src={currentStory.image || '/placeholder.svg'}
          alt={`${user.username}'s story`}
          className={cn(
            'w-full h-full object-cover transition-all duration-500',
            imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          )}
          onLoad={() => setImageLoaded(true)}
          draggable={false}
        />

        {isPaused && imageLoaded && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center animate-in fade-in duration-200">
            <div className="size-16 bg-black/60 rounded-full flex items-center justify-center backdrop-blur-sm">
              <div className="flex gap-1">
                <PauseIcon className="size-6 text-white" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
