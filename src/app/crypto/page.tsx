import TableCryptoLayout from "@/components/layout/TableCryptoLayout";

function page() {
  return (
    <section 
      aria-labelledby="main-title" 
      className='bg-slate-400 items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20'
      >
    <TableCryptoLayout />

    </section>
  )
}

export default page