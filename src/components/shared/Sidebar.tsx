'use client'
//Components
import { SkeletonComponent } from './SkeletonComponent';
//Internal imports
import Link from 'next/link';
//Types
import { SidebarProps } from '../../types/CryptoApiTypes';

function Sidebar({ data, error, isLoading}:SidebarProps) {

    if(isLoading) return <SkeletonComponent />
    if(error) return <p className="text-red-500">Errore: nessun dato trovato</p>
    
  return (
    <aside className='min-w-[200px] bg-slate-800 text-slate-200 flex flex-col justify-start items-center text-center border-r-4 border-r-violet-500 py-10'>
        <ul className='hidden md:flex flex-col gap-6'>
            {data?.map((item) => (
                <li 
                    key={item.id} 
                    className='hover:bg-violet-300 hover:text-slate-800 hover:rounded-lg text-lg md:text-xl capitalize px-3 py-2 transition-colors duration-200 ease-in-out'
                >
                    <Link href={`/crypto/${item.id}`}>{item.name}</Link>
                </li>
            ))}

        </ul>
    </aside>
  )
}

export default Sidebar