'use client'

//Components
import { Button } from "../ui/button";
import MarketCap from "./MarketCap";
//Internal imports
import { useRouter } from "next/navigation";
import { ReactQueryProvider } from "../shared/ReactQueryProvider";
//External libs
import { easeIn, motion } from 'motion/react';
//Icons
import { Bitcoin } from 'lucide-react';
import { MousePointerClick } from 'lucide-react';
import VolumeBarChart from "./VolumeBarChart";

function ChartView() {
    const router = useRouter();
    const MotionButton = motion(Button);

  return (
    <>
    <ReactQueryProvider>
        <motion.section 
            className="w-full max-w-7xl mx-auto bg-slate-800 text-slate-200 px-6 md:px-8 py-12 my-15 rounded-2xl shadow-md shadow-slate-200"
            role="region"
            aria-labelledby="title-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ease: easeIn, duration: 2}}  
            >
            <div className="flex flex-col md:flex-row gap-y-8 justify-between items-center text-center px-8 mb-10">
                <h2 id='title-section' className="text-3xl md:text-4xl text-violet-500 flex items-center"><Bitcoin className="w-[1em] h-[1em]" /> Le nostre crypto</h2>
                <MotionButton 
                  variant="default"
                  size="lg"
                  onClick={() => router.push('/crypto')}
                  whileHover={{ scale: 1 }}
                  whileFocus={{ scale: 1 }}
                  >
                  <MousePointerClick size={40} aria-hidden='true'/>
                  Guarda le nostre crypto
                </MotionButton>
            </div>

            <div className="px-2 md:px-6">
              <MarketCap />
              <VolumeBarChart />
            </div>

        </motion.section>
      </ReactQueryProvider>
    </>
  )
}

export default ChartView