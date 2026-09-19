'use client'
//components
import SidebarWrapper from "@/features/crypto/components/SidebarWrapper";
import { ReactQueryProvider } from "@/shared/providers/ReactQueryProvider";

export default function CryptoLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <section className="flex min-h-screen">
       <ReactQueryProvider>
        <SidebarWrapper />
        <main className="flex-1">
            {children}
        </main>
       </ReactQueryProvider>
     </section>
  );
}
