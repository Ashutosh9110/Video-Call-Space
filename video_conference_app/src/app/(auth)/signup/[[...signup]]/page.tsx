import { SignUp } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import type { BaseThemeTaggedType } from "@clerk/types";

import Image from "next/image"
// import logo from "../../../../public/assets/logo.svg"

const SignupPage = () => {
  return (
    <main className="flex flex-col items-center p-5 gap-10">
      <section className="flex flex-col items-center">
        <Image 
          src="/assets/logo.svg" 
          width={100}
          height={100}
          alt="logo"
        />
        <h1 className="text-lg font-extrabold lg:text-2xl">Connect, Communicate, Collaborate in Real-Time</h1>
      </section>
      <div className="flex justify-center items-center h-screen">
        <SignUp 
          appearance={{
            baseTheme: dark as BaseThemeTaggedType
          }}
        />
      </div>
    </main>
  )
}

export default SignupPage