import MainMenu from "@/app/components/MainMenu"
import StatusBar from "@/app/components/StatusBar"

const HomePage = () => {
    return (
        <div className="flex flex-col gap-32 pt-20 pl-10 items-center max-md:gap-10 md:flex-row animate-fade-in">
            <StatusBar/>
            <MainMenu/>
        </div>
    )
}

export default HomePage