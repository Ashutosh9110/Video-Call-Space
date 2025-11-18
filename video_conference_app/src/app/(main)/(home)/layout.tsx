import NavBar from "@/components/Navbar"

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="relative w-full min-h-screen overflow-hidden">

      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover -z-10"
      >
        <source src="https://res.cloudinary.com/deqp37rqp/video/upload/v1763462466/otp1_xz9o7o.mp4" type="video/mp4" />
      </video>

      <div className="fixed inset-0 bg-black/40 -z-10" />

      <NavBar />

      <section className="flex flex-1 flex-col min-h-screen px-6 pb-6 pt-28 max-md:pb-14 sm:px-14 relative z-10">
        <div className="w-full">
          {children}
        </div>
      </section>

    </main>
  );
};

export default HomeLayout;
