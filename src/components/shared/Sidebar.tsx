'use client'
//Components
import { SkeletonComponent } from './SkeletonComponent';
import Image from 'next/image';
//Internal imports
import Link from 'next/link';
//Types
import { SidebarProps } from '../../types/CryptoApiTypes';

function Sidebar({ data, error, isLoading}:SidebarProps) {

    if(isLoading) return <SkeletonComponent />
    if(error) return <p className="text-red-500 bg-red-200 p-4">Errore: nessun dato trovato</p>
    
  return (
    <aside className='min-w-[200px] bg-slate-800 text-slate-200 flex flex-col justify-start items-center text-center border-r-4 border-r-violet-500 py-10'>
        <ul className='hidden md:flex flex-col gap-6'>
            {data?.map((item) => (
                <li 
                    key={item.id} 
                    className='hover:bg-violet-300 hover:text-slate-800 hover:rounded-lg text-sm md:text-lg capitalize px-3 py-2 transition-colors duration-200 ease-in-out'
                >
                    <Link href={`/crypto/${item.id}`} className='flex gap-4'>
                        <Image width={24} height={24} src={item.image} alt={item.symbol}/>
                        <span>{item.symbol}</span>
                    </Link>
                </li>
            ))}

        </ul>
    </aside>
  )
}

export default Sidebar