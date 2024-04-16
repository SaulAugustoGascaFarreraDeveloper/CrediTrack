import { UserButton } from "@clerk/nextjs"
import Link from "next/link"


const Navbar = () => {
  return (
    <div className="flex flex-row items-center justify-between border-b-2 border-black top-0 p-6">
            
            <Link href={'/'} className="border border-black rounded-md p-4 hover:-translate-y-1 hover:border-b-4 hover:border-r-4">
                <h1 className="text-blue-700 font-semibold lg:text-4xl md:text-2xl text-lg">
                    CrediTrack
                </h1>
            </Link>
            
            <UserButton />
          
    </div>
  )
}

export default Navbar