import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/ui/themeToggle'

interface LogoutProps {
  children?: React.ReactNode
}

export default function LoggedOutLayout({ children }: LogoutProps) {
  return (
    <>
      <div className={cn('min-h-screen p-24', 'gap-y-4 flex flex-col items-center justify-center')}>
        {children}
      </div>

      <ThemeToggle className="fixed right-4 top-1/2 -translate-y-1/2"></ThemeToggle>
    </>
  )
}
