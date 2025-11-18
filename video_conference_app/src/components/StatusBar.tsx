'use client'

import Image from "next/image"

import DateAndTime from "@/components/DateAndTime";
import homeImage from "../../public/assets/homeImage.svg"

import { useGetCalls } from "@/app/hooks/useGetCalls";


const StatusBar = () => {

  const { upcomingCalls } = useGetCalls() || { upcomingCalls: [] };


  const nearestUpcomingCall = upcomingCalls
    ?.filter(call => call?.state?.startsAt)
    .sort((a, b) => new Date(a.state.startsAt!).getTime() - new Date(b.state.startsAt!).getTime())[0];

  const startsAt = nearestUpcomingCall?.state?.startsAt;

  const formattedDate = startsAt ? new Date(startsAt).toLocaleString() : "No upcoming meetings"

  if (formattedDate === "No upcoming meetings") {
    return (
      <section className="flex flex-col gap-5 text-black items-center md:items-start">
          {}
          <h2 className="bg-blue-100 max-w-[273px] rounded-2xl p-4 text-center text-base font-light">
          No Upcoming Meetings
          </h2>
          <DateAndTime/>
  
      </section>
    )
  }
  
  return (
    <section className="flex flex-col gap-5 text-black items-center md:items-start">
      {/* Display the upcoming meeting time */}
      <h2 className="bg-blue-100 max-w-[273px] rounded-2xl p-4 text-center text-base font-light">
        Upcoming Meeting at:
        <p className="text-lg font-semibold text-gray-800">{formattedDate}</p>
      </h2>
      {/* Render the DateAndTime component */}
      <DateAndTime/>
      {/* Display an image with specific styles */}
      <Image 
        src='/assets/home-image.svg' 
        width={400} 
        height={400} 
        alt="home image" 
        className="max-md:hidden -ml-16"
      />
    </section>
  )
}

// Export the StatusBar component as the default export
export default StatusBar