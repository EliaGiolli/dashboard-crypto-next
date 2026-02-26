'use client';

import React, { ReactNode } from 'react';
import { Button } from '../ui/button';
import {motion} from 'motion/react';

interface MotionButtonProps {
    children: ReactNode
}


function MotionButton({children, ...props}: MotionButtonProps) {
    const MotionButton = motion(Button);

  return (
    <MotionButton
        type="submit"
        className="w-full"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        {...props}
    >
        {children}
    </MotionButton>
  )
}

export default MotionButton