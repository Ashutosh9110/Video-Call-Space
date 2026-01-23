const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="relative w-full min-h-screen">
      {children}
    </main>
  )
}

export default HomeLayout
