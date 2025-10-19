'use client'

//Components
import { Button } from "../components/ui/button";

//Internal imports
import Image from "next/image"
import { useRouter } from "next/navigation";
import CryptoImg from "../assets/crypto-img.jpg";
//External libs
import { easeIn, motion } from 'motion/react';
//Icons
import { MousePointerClick } from 'lucide-react';

function About() {

    const MotionButton = motion(Button);
    const router = useRouter();

  return (
    <motion.section 
        className="bg-slate-800 text-white max-w-7xl mx-auto px-8 py-12 flex flex-col md:flex-row items-center gap-8 rounded-2xl shadow-md shadow-slate-200"
        aria-labelledby="main-title" 
        role="region" 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ease: easeIn, duration: 2}}  
    >
  
        {/* Immagine */}
        <div className="flex-1">
            <Image
            src={CryptoImg} 
            alt="Un'immagine di una cryptovaluta davanti a un grafico a barre"
            className="w-full rounded-lg"
            />
        </div>

        {/* Testo e bottone */}
        <div className="flex-1 flex flex-col gap-6">
            <h1 id="main-title" className="text-4xl font-bold text-violet-700">
                La tua finestra sul mondo delle crypto
            </h1>
            <p className="text-lg text-slate-200">
                Monitora prezzi, market cap e trend delle principali criptovalute direttamente dal tuo browser, con grafici interattivi e dati sempre aggiornati.
            </p>
            <MotionButton 
                variant="default"
                onClick={() => router.push('/crypto')}
                whileFocus={{ scale: 1.1 }}
                whileHover={{ scale: 1.1 }}
                >
                <MousePointerClick /> Scopri le crypto
            </MotionButton>
        </div>
    </motion.section>

  )
}

export default About