import Nav from "@/components/landing/Nav"

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="relative w-full min-h-screen overflow-hidden bg-[#1a1a1a]">
      {/* HERO BACKGROUND IMAGE */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url(/assets/images/hero.jpg)" }}
      />

      <div className="fixed inset-0 bg-black/30 -z-10" />

      <Nav />

      <section className="relative z-10 min-h-screen">
        {children}
      </section>
    </main>
  );
};

export default HomeLayout;
