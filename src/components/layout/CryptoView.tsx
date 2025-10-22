'use client'

//Components
import MarketCap from "./MarketCap";
//External libs
import { easeIn, motion } from 'motion/react';
//Icons
import VolumeBarChart from "./VolumeBarChart";

function CryptoView() {

  return (
    <>
    
        <motion.section 
            className="w-full max-w-7xl mx-auto bg-slate-800 text-slate-200 px-6 md:px-8 py-8  rounded-2xl shadow-md shadow-slate-200"
            role="region"
            aria-labelledby="title-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ease: easeIn, duration: 2}}  
            >

            <div className="px-2 md:px-6">
              <h3 className="text-xl md:text-2xl text-violet-400 p-5 text-start">Top Crypto Market Cap (USD)</h3>
              <MarketCap />
              <h3 className="text-xl md:text-2xl text-violet-400 p-5 text-start">Volume di trading nelle ultime 24 ore</h3>
              <VolumeBarChart />
            </div>

        </motion.section>
    </>
  )
}

export default CryptoView