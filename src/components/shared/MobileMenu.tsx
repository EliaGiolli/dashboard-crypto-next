//Imports from ShadCN library
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
//Internal imports
import Link from "next/link"
//Icons
import { Menu } from 'lucide-react';
//Components
import { Button } from "../ui/button";


export function MobileMenu() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="hamburger" className="md:hidden">
          {/* icona hamburger */}
          <Menu size={30} />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={4}
        className="bg-violet-300 text-2xl text-slate-800 max-w-2xl p-8"
      >
        <ul className="flex flex-col gap-4">
          <li className="hover:bg-violet-300 hover:text-slate-800 hover:rounded-lg text-lg md:text-xl px-3 py-2 transition-colors duration-200 ease-in-out">
            <Link href="/">Chi siamo</Link>
          </li>
          <li className="hover:bg-violet-300 hover:text-slate-800 hover:rounded-lg text-lg md:text-xl px-3 py-2 transition-colors duration-200 ease-in-out">
            <Link href="/projects">Le nostre Crypto</Link>
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  )
}
