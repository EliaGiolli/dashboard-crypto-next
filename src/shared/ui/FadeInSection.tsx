'use client'

import type { ReactNode } from 'react'
import { easeIn, motion } from 'motion/react'

interface FadeInSectionProps {
  children: ReactNode
  className?: string
  'aria-labelledby'?: string
}

/**
 * A `<section>` that fades in once.
 *
 * This is the only reason the landing-page sections used to be client
 * components. Isolating the animation here lets `About` and `ChartView`
 * become server components that pass their content through as `children`.
 */
export function FadeInSection({
  children,
  className,
  'aria-labelledby': ariaLabelledBy,
}: FadeInSectionProps) {
  return (
    <motion.section
      className={className}
      aria-labelledby={ariaLabelledBy}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ ease: easeIn, duration: 2 }}
    >
      {children}
    </motion.section>
  )
}
