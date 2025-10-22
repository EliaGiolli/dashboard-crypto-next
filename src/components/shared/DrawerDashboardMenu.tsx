'use client'
//Components
import { Button } from "../../components/ui/button"
import { SkeletonComponent } from "./SkeletonComponent"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../components/ui/sheet"
//Internal imports
import Link from "next/link";
import { SidebarProps } from "@/types/CryptoApiTypes";

export function DrawerDashboardMenu({ data, error, isLoading }:SidebarProps) {
    
    if(isLoading) return <SkeletonComponent />
    if(error) return <p className="text-red-500 bg-red-200 p-4">Errore: nessun dato trovato</p>

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Le nostre crypto</SheetTitle>
          <SheetDescription>
            Clicca sulle icone sottostanti per visualizzare le crypto nel dettaglio.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-1 gap-6 px-4">
          <ul>
            {data?.map((item) => (
                <li key={item.id}>
                    <Link href={`/crypto/${item.id}`}>{item.name}</Link>
                </li>
            ))}
          </ul>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Chiudi</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
