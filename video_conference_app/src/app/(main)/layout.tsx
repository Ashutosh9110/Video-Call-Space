import StreamProvider from "@/providers/StreamProvider"
import { SignIn } from "@clerk/nextjs"
import { currentUser } from "@clerk/nextjs/server"
import { neobrutalism } from "@clerk/themes"
import Image from "next/image"
import React from "react"
// import { BackgroundLines } from "@/components/ui/background-lines"
import { GridBackground } from "@/components/ui/gridBackground"

const MainLayout = async ({
    children
}: {
    children: React.ReactNode
}
) => {

    const user = await currentUser()
    if(!user) return(
        // <BackgroundLines>
            <GridBackground>
            <main className="flex flex-col items-center p-5 gap-10 animate-fade-in relative z-10">
                <section className="flex flex-col items-center">
                    <Image
                        src='/assets/logo.svg'
                        width={100}
                        height={100}
                        alt="Logo"
                    />
                    <h1 className="text-lg font-extrabold text-sky-1 lg:text-2xl">
                        Connect, Communicate, Collaborate in Real-Time
                    </h1>
                </section>
    
                <div className="mt-3">
                    <SignIn
                        routing="hash"
                        appearance={{
                            baseTheme: neobrutalism
                        }}
                    />
                </div>
            </main>
        {/* </BackgroundLines> */}
        </GridBackground>
    )

    return (
        // <BackgroundLines>
        <GridBackground>
            <main className="animate-fade-in relative z-10">
                <StreamProvider>
                    {children}
                </StreamProvider>
            </main>
        {/* </BackgroundLines> */}
        </GridBackground>
    )
}

export default MainLayout