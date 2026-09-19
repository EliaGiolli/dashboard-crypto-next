'use client';

import React, { ReactNode } from 'react';
import { motion } from 'motion/react';

import { Button } from '@/shared/ui/button';

/**
 * Hoisted to module scope on purpose. This used to be built inside the
 * component body, which created a NEW component type on every render and
 * remounted the button — losing focus and restarting its animation.
 *
 * `motion.create()` rather than `motion()`: the call form is deprecated and
 * logs a warning on every page load.
 */
const AnimatedButton = motion.create(Button);

interface MotionButtonProps {
    children: ReactNode,
    disabled?: boolean
}

function MotionButton({children, disabled, ...props}: MotionButtonProps) {
  return (
    <AnimatedButton
        type="submit"
        disabled={disabled}
        className="w-full"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        {...props}
    >
        {children}
    </AnimatedButton>
  )
}

export default MotionButton
