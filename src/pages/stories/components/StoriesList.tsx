import type { StoryUser } from '../StoriesPage'

interface StoriesListProps {
  users: StoryUser[]
  onUserSelect: (user: StoryUser) => void
}

export function StoriesList({ users, onUserSelect }: StoriesListProps) {
  return (
    <div className="w-full max-w-md mx-auto p-4 animate-in fade-in duration-500">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">Stories</h1>
        <p className="text-muted-foreground text-sm">Tap to view stories</p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 max-lg:scrollbar-hide">
        {users.map((user, index) => (
          <button
            key={user.id}
            onClick={() => onUserSelect(user)}
            className="flex-shrink-0 flex flex-col items-center gap-2 slide-in-from-left duration-500 cursor-pointer"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="relative">
              <div className="size-16 rounded-full bg-gradient-to-tr from-green-700 via-purple-700 to-red-700 p-0.5 transition-all duration-300">
                <div className="w-full h-full rounded-full bg-background p-0.5">
                  <img
                    src={user.avatar || '/placeholder.svg'}
                    alt={user.username}
                    className="w-full h-full rounded-full object-cover transition-transform duration-300"
                  />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center shadow-lg border-2 border-background">
                <span className="text-xs font-bold text-primary-foreground">
                  {user.stories.length}
                </span>
              </div>
            </div>
            <span className="text-xs text-foreground font-medium max-w-16 truncate transition-colors duration-200">
              {user.username}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-8 space-y-4 animate-in slide-in-from-bottom duration-700 delay-300">
        <h2 className="text-lg font-semibold text-foreground">Recent Stories</h2>
        <div className="grid grid-cols-2 gap-3">
          {users.slice(0, 4).map((user, index) => (
            <button
              key={`recent-${user.id}`}
              onClick={() => onUserSelect(user)}
              className="relative aspect-[3/4] rounded-lg overflow-hidden slide-in-from-bottom duration-500 cursor-pointer"
              style={{ animationDelay: `${400 + index * 100}ms` }}
            >
              <img
                src={user.stories[0]?.image || '/placeholder.svg'}
                alt={`${user.username}'s story`}
                className="w-full h-full object-cover transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-all duration-300" />
              <div className="absolute bottom-3 left-3 right-3 transform translate-y-0 transition-transform duration-300">
                <div className="flex items-center gap-2 mb-1">
                  <img
                    src={user.avatar || '/placeholder.svg'}
                    alt={user.username}
                    className="size-6 rounded-full border border-white/20"
                  />
                  <span className="text-white text-sm font-medium">{user.username}</span>
                </div>
                <p className="text-white/80 text-xs text-left">{user.stories[0]?.timestamp} ago</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
