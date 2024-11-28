import type { HTMLAttributes } from 'react'

export interface ThemeToggleProps extends HTMLAttributes<HTMLDivElement> {
    defaultTheme: 'dark' | 'light'
}
