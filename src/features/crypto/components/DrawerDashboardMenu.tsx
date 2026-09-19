'use client'

import Link from 'next/link'

import { Button } from '@/shared/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/ui/sheet'

import type { CryptoMarket } from '../types'

interface DrawerDashboardMenuProps {
  markets: CryptoMarket[]
}

/**
 * Mobile coin list. Still a client island — the sheet is interactive — but it
 * takes its data as a prop instead of fetching, and `lg:hidden` rather than a
 * JS media query decides when it shows.
 */
export default function DrawerDashboardMenu({ markets }: DrawerDashboardMenuProps) {
  return (
    <div className="lg:hidden p-4">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Le nostre crypto</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Le nostre crypto</SheetTitle>
            <SheetDescription>
              Clicca sulle icone sottostanti per visualizzare le crypto nel dettaglio.
            </SheetDescription>
          </SheetHeader>
          <nav aria-label="Criptovalute" className="flex flex-1 gap-6 px-4">
            <ul className="flex flex-col gap-3">
              {markets.map((item) => (
                <li key={item.id}>
                  <Link href={`/crypto/${item.id}`}>{item.name}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline">Chiudi</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
