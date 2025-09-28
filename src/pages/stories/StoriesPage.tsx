import { useState, useEffect } from 'react'
import { StoriesList } from './components/StoriesList'
import { StoryViewer } from './components/StoryViewer'

export interface Story {
  id: string
  image: string
  timestamp: string
}

export interface StoryUser {
  id: string
  username: string
  avatar: string
  stories: Story[]
}

export function StoriesPage() {
  const [users, setUsers] = useState<StoryUser[]>([])
  const [selectedUser, setSelectedUser] = useState<StoryUser | null>(null)
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch('/stories.json')
        const data = await response.json()
        setUsers(data)
      } catch (error) {
        console.error('Failed to fetch stories:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStories()
  }, [])

  const handleUserSelect = (user: StoryUser) => {
    setSelectedUser(user)
    setCurrentStoryIndex(0)
  }

  const handleClose = () => {
    setSelectedUser(null)
    setCurrentStoryIndex(0)
  }

  const handleNext = () => {
    if (!selectedUser) return

    if (currentStoryIndex < selectedUser.stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1)
    } else {
      const currentUserIndex = users.findIndex((u) => u.id === selectedUser.id)
      if (currentUserIndex < users.length - 1) {
        const nextUser = users[currentUserIndex + 1]
        setSelectedUser(nextUser)
        setCurrentStoryIndex(0)
      } else {
        handleClose()
      }
    }
  }

  const handlePrevious = () => {
    if (!selectedUser) return

    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1)
    } else {
      const currentUserIndex = users.findIndex((u) => u.id === selectedUser.id)
      if (currentUserIndex > 0) {
        const prevUser = users[currentUserIndex - 1]
        setSelectedUser(prevUser)
        setCurrentStoryIndex(prevUser.stories.length - 1)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <section className="container mx-auto max-w-md">
      <StoriesList users={users} onUserSelect={handleUserSelect} />
      {selectedUser && (
        <StoryViewer
          user={selectedUser}
          currentStoryIndex={currentStoryIndex}
          onClose={handleClose}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      )}
    </section>
  )
}
