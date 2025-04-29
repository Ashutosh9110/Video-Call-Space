import MainMenu from "../../../components/MainMenu"
import StatusBar from "../../../components/StatusBar"
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal"
import one from "../../../../public/assets/images/1.jpg"
import two from "../../../../public/assets/images/2.jpg"
import Image from "next/image"

const HomePage = () => {
    // Sample content for StickyScroll
    const features = [
        {
            title: "High Quality Video Conferencing",
            description: "Experience crystal-clear video and immersive audio powered by advanced streaming technology, ensuring smooth, lag-free meetings — even on low-bandwidth connections.",
            content: (
                <div className="h-full w-full rounded-md flex items-center justify-center overflow-hidden">
                    <video 
                        className="h-full w-full object-cover"
                        autoPlay 
                        muted 
                        loop
                        playsInline
                    >
                        <source src="/assets/Videos/video2.mp4.mov" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            )
        },
        {
            title: "Secure and Private",
            description: "End-to-end encryption ensures your meetings remain confidential and secure, protecting all audio, video, and shared content from unauthorized access — so only you and your participants can access the conversation.",
            content: (
                <div className="h-full w-full">
									<Image src={one} alt="" className="h-full w-full object-cover rounded-md"/>
                </div>
            )
        },
        {
            title: "Seamless Collaboration",
            description: "Share screens, exchange files, and collaborate in real-time with intuitive tools designed to keep your team connected, productive, and in sync — whether you're across the office or across the globe.",
            content: (
                <div className="flex justify-center items-center h-full w-full rounded-md bg-gradient-to-br from-orange-500 to-yellow-500 opacity-80">
									<div className="h-full w-full">
										<Image src={two} alt="" className="h-full w-full object-cover rounded-md"/>
                </div>
								</div>
            )
        }
    ];

    return (
        <div className="flex flex-col gap-32 items-center max-md:gap-10 animate-fade-in">
            <div className="flex flex-col gap-32 pt-20 pl-10 items-center max-md:gap-10 md:flex-row w-full">
                <StatusBar/>
                <MainMenu/>
            </div>
            
            <div className="w-full max-w-7xl px-4 mt-20 mb-10">
                <h2 className="text-2xl font-bold mb-6 text-center">Our Features</h2>
                <StickyScroll content={features} />
            </div>
        </div>
    )
}

export default HomePage