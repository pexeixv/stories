import { Outlet } from 'react-router-dom'
import clsx from 'clsx'
import Footer from '@/components/Footer'
import Header from '@/components/Header'

type BaseLayoutProps = {
  disableHeader?: boolean
  disableFooter?: boolean
  className?: string
}

export default function BaseLayout({
  disableHeader = false,
  disableFooter = false,
  className = '',
}: BaseLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-800">
      {!disableHeader && <Header />}

      <main className={clsx('flex-1 max-w-5xl mx-auto bg-black ', className)}>
        <Outlet />
      </main>

      {!disableFooter && <Footer />}
    </div>
  )
}
