import { SignIn } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import Image from "next/image"
import logo from "../../../../public/assets/logo.svg"

const LoginPage = () => {

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
      <div className="flex justify-center items-center h-screen">
        <SignIn 
          appearance={
            {
              baseTheme:dark
            }
          }
        />
      </div>
    </main>

  )
}

export default LoginPage