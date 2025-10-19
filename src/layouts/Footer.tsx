import Link from "next/link"
import { Github, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer
      className="bg-slate-800 w-full max-h-[500px] p-8 text-slate-200 border-t-2 border-t-violet-500"
      aria-labelledby="footer-id"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Logo / Nome App */}
        <h2 id="footer-id" className="text-3xl md:text-4xl text-violet-600">
          CryptoDashboard
        </h2>

        {/* Link utili */}
        <ul className='hidden md:flex gap-6'>
            <li className='hover:bg-violet-300 hover:text-slate-800 hover:rounded-lg text-lg md:text-xl px-3 py-2 transition-colors duration-200 ease-in-out'>
                <Link href="/homepage" className='block w-full h-full'>Chi siamo</Link>
            </li>
            <li className='hover:bg-violet-300 hover:text-slate-800 hover:rounded-lg text-lg md:text-xl px-3 py-2 transition-colors duration-200 ease-in-out'>
                <Link href="/homepage"className='block w-full h-full'>Le nostre Crypto</Link>
            </li>    
        </ul>

        {/* Social icons */}
        <div className="flex gap-4">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-violet-300 transition-colors">
            <Github size={30} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-violet-500 transition-colors">
            <Twitter size={30} />
          </a>
        </div>
      </div>

      {/* Credits / copyright */}
      <div className="mt-6 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} CryptoDashboard. All rights reserved.
      </div>
    </footer>
  )
}
