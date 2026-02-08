import { Link } from '@tanstack/react-router'
import { appConfig } from '@/config/app.config'
import { Hexagon } from 'lucide-react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
}

const sizeVariants = {
  sm: {
    text: 'text-lg',
    icon: 'size-5',
  },
  md: {
    text: 'text-2xl',
    icon: 'size-7',
  },
  lg: {
    text: 'text-4xl',
    icon: 'size-10',
  },
}

export function Logo({ size = 'md', showText = true }: LogoProps) {
  const sizes = sizeVariants[size]

  return (
    <Link
      to="/"
      className="flex items-center gap-2 transition-opacity hover:opacity-80"
    >
      <div className={`${sizes.icon} flex items-center justify-center`}>
        <Hexagon
          className={`${sizes.icon} fill-primary text-primary`}
          strokeWidth={1.5}
        />
      </div>
      {showText && (
        <span
          className={`${sizes.text} font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent`}
        >
          {appConfig.identity.name}
        </span>
      )}
    </Link>
  )
}
