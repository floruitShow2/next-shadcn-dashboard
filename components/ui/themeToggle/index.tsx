'use client'

import { useState } from 'react'
import { MoonIcon, SunIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../tooltip'
import type { ThemeToggleProps } from './index.interface'

export function ThemeToggle(props: ThemeToggleProps) {
  const { className } = props
  const [isDarkMode, setIsDarkMode] = useState(true)

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          className={cn(className)}
          onClick={() => {
            setIsDarkMode((prev) => !prev)
            document.body.classList.toggle('dark')
          }}
        >
          {isDarkMode ? <MoonIcon /> : <SunIcon />}
        </TooltipTrigger>
        <TooltipContent>{isDarkMode ? 'Enable light mode' : 'Enable dark mode'}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
