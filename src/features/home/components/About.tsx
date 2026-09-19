import Image from "next/image"
import Link from "next/link"
import { MousePointerClick } from 'lucide-react'

import { buttonVariants } from "@/shared/ui/button-variants"
import { FadeInSection } from "@/shared/ui/FadeInSection"
import { cn } from "@/shared/utils"
import CryptoImg from "@/assets/crypto-img.jpg"

/**
 * A server component now. Two things used to force it client-side:
 *
 * - `motion(Button)` called inside the component body, which built a new
 *   component type on every render and remounted the button. It is gone.
 * - `useRouter().push('/crypto')` on a `<Button>`. A button is not a link:
 *   no middle-click, no open-in-new-tab, and screen readers announce it as
 *   "button".
 *
 * The link takes `buttonVariants()` rather than `<Button asChild>`: `Button`
 * is a client component, and wrapping a plain anchor in one pulls an island
 * into a subtree that needs no interactivity. `buttonVariants` is just the
 * class string, so this stays entirely server-rendered.
 */
function About() {
  return (
    <FadeInSection
      className="bg-slate-800 text-white max-w-7xl mx-auto px-8 py-12 flex flex-col md:flex-row items-center gap-8 rounded-2xl shadow-md shadow-slate-200"
      aria-labelledby="main-title"
    >
      {/* Immagine */}
      <div className="flex-1">
        <Image
          src={CryptoImg}
          alt="Un'immagine di una cryptovaluta davanti a un grafico a barre"
          className="w-full rounded-lg"
          // Above the fold and the page's LCP element.
          priority
        />
      </div>

      {/* Testo e bottone */}
      <div className="flex-1 flex flex-col gap-6">
        <h1 id="main-title" className="text-3xl md:text-4xl font-bold text-violet-500">
          La tua finestra sul mondo delle crypto
        </h1>
        <p className="text-lg text-slate-200">
          Monitora prezzi, market cap e trend delle principali criptovalute direttamente dal tuo browser, con grafici interattivi e dati sempre aggiornati.
        </p>
        <Link
          href="/crypto"
          className={cn(buttonVariants({ variant: "default" }), "self-start")}
        >
          <MousePointerClick aria-hidden="true" /> Scopri le crypto
        </Link>
      </div>
    </FadeInSection>
  )
}

export default About
