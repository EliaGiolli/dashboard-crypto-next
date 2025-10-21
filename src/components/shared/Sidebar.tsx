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
    <aside className='base-1/3 bg-slate-800 text-slate-200 flex flex-col'>
        <ul>
            {data?.map((item) => (
                <li key={item.id}>
                    <Link href={`/crypto/${item.id}`}>{item.symbol}</Link>
                </li>
            ))}

        </ul>
    </aside>
  )
}

export default Sidebar