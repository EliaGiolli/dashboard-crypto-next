'use client'

//Components
import { Button } from "../ui/button";
//Internal imports
import { useRouter } from "next/navigation";
//External libs
import { easeIn, motion } from 'motion/react';
//Icons
import { Bitcoin } from 'lucide-react';
import { MousePointerClick } from 'lucide-react';

function ChartView() {
    const router = useRouter();
    const MotionButton = motion(Button);

  return (
    <motion.section 
        className="w-full max-w-7xl mx-auto bg-slate-800 text-slate-200 px-8 py-12 my-15 rounded-2xl shadow-md shadow-slate-200"
        role="region"
        aria-labelledby="title-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ease: easeIn, duration: 2}}  
        >
        
        <h2 id='title-section' className="text-4xl text-violet-500">Le nostre crypto</h2>

    </motion.section>
  )
}

export default ChartView