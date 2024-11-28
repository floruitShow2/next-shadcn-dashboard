import Link from 'next/link'
import { PersonStandingIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <>
      <h1 className="gap-x-2 flex items-center justify-start">
        <PersonStandingIcon size={50} className="text-pink-500" />
        Landing Page
      </h1>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
      <div className={cn('gap-x-2 flex items-center justify-start')}>
        <Button asChild>
          <Link href="/login">Log in</Link>
        </Button>
        <small>or</small>
        <Button asChild variant="outline">
          <Link href="/sign-up">Sign up</Link>
        </Button>
      </div>
    </>
  )
}
