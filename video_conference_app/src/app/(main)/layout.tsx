import { SignIn } from "@clerk/nextjs"
import { currentUser } from "@clerk/nextjs/server"
import { dark } from "@clerk/themes"
import Image from "next/image"
import logo from "../../public/assets/logo.svg"

const MainLayout = async ({
  children
}: {
  children: React.ReactNode
}) => {

  const user = await currentUser()
  if(!user) 
    return (
    
    <main className="flex flex-col items-center p-5 gap-10 animate-fade-in">
    <section className="flex flex-col items-center">
      <Image 
      src={logo} 
      width={100}
      height={100}
      alt="logo"
      />
      <h1 className="text-lg font-extrabold lg:text-2xl">Connect, Communicate, Collaborate in Real-Time</h1>
    </section>
    <div className="mt-3 ">
      <SignIn 
      routing="hash"
        appearance={
          {
            baseTheme:dark
          }
        }
      />
    </div>
  </main>
  )

  return (
      <main className="animate-fade-in">
        {children}
      </main>


  )


}

export default MainLayout