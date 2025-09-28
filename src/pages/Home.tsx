import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Terminal, ClipboardCopy, Check } from 'lucide-react'
import { useState } from 'react'

const technologies = [
  { name: 'Vite', url: 'https://vitejs.dev' },
  { name: 'React', url: 'https://reactjs.org' },
  { name: 'TypeScript', url: 'https://www.typescriptlang.org' },
  { name: 'Tailwind CSS', url: 'https://tailwindcss.com' },
  { name: 'shadcn/ui', url: 'https://ui.shadcn.com' },
  { name: 'React Router', url: 'https://reactrouter.com' },
]

export default function Home() {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText('git clone https://github.com/pexeixv/shadcn-starter')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col items-center text-center gap-6 py-12">
      <h1 className="text-4xl font-bold">
        shadcn-starter by{' '}
        <a href="//gavn.in" className="hover:underline">
          Gavin Pereira
        </a>
      </h1>

      <p className="text-muted-foreground text-sm flex flex-wrap justify-center gap-1">
        {technologies.map((tech, index) => (
          <span key={tech.name}>
            {!!index && <span className="mx-1">&middot;</span>}
            <a
              href={tech.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-primary transition-colors"
            >
              {tech.name}
            </a>
          </span>
        ))}
      </p>

      <Card className="w-full max-w-2xl p-0">
        <CardContent className="p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm font-mono">
            <Terminal className="size-4" />
            <span>git clone https://github.com/pexeixv/shadcn-starter</span>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={handleCopy}
            aria-label="Copy to clipboard"
            className="cursor-pointer"
          >
            {copied ? (
              <Check className="size-4 text-green-500" />
            ) : (
              <ClipboardCopy className="size-4" />
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
