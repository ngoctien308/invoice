import { Button } from "@/components/ui/button";
import Link from "next/link";

const HomePage = async () => {
  return (
    <main className="text-center gap-2 flex flex-col justify-center">
      <p className="font-bold tracking-widest text-gray-700 uppercase text-3xl">Invoices</p>
      <Link href='/dashboard'><Button>Dashboard</Button></Link>
    </main>
  )
}

export default HomePage
