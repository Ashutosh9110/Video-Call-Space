import MainMenu from "../../../components/MainMenu"
import StatusBar from "../../../components/StatusBar"
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal"

const HomePage = () => {
    // Sample content for StickyScroll
    const features = [
        {
            title: "High Quality Video Conferencing",
            description: "Experience crystal clear video and audio quality with our advanced streaming technology.",
            content: (
                <div className="flex justify-center items-center h-full w-full rounded-md bg-gradient-to-br from-cyan-500 to-emerald-500 opacity-80">High Quality Video Conferencing</div>
            )
        },
        {
            title: "Secure and Private",
            description: "End-to-end encryption ensures your meetings remain confidential and secure.",
            content: (
                <div className="flex justify-center items-center h-full w-full rounded-md bg-gradient-to-br from-pink-500 to-indigo-500 opacity-80">Secure and Private</div>
            )
        },
        {
            title: "Seamless Collaboration",
            description: "Share screens, files, and collaborate in real-time with intuitive tools.",
            content: (
                <div className="flex justify-center items-center h-full w-full rounded-md bg-gradient-to-br from-orange-500 to-yellow-500 opacity-80">Seamless Collaboration</div>
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