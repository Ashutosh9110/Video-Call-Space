import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { CartSidebar } from "@/components/cart/cart-sidebar"
import { AuthProvider } from "@/components/providers/auth-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Premium Ecommerce - Experience the Future of Shopping",
  description: "Discover premium products with Apple-level design, cinematic animations, and seamless performance.",
  keywords: ["ecommerce", "premium", "shopping", "products", "online store"],
  authors: [{ name: "Premium Ecommerce" }],
  openGraph: {
    title: "Premium Ecommerce",
    description: "Experience the future of online shopping",
    type: "website",
    url: "https://premium-ecommerce.com",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Premium Ecommerce",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Premium Ecommerce",
    description: "Experience the future of online shopping",
    images: ["/og-image.jpg"],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
              <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center space-x-8">
                    <Link href="/" className="flex items-center space-x-2">
                      <span className="text-2xl font-bold">Premium</span>
                    </Link>
                    <nav className="hidden md:flex space-x-6">
                      <Link href="/products" className="text-sm font-medium hover:text-black transition-colors">
                        Products
                      </Link>
                      <Link href="/categories" className="text-sm font-medium hover:text-black transition-colors">
                        Categories
                      </Link>
                      <Link href="/about" className="text-sm font-medium hover:text-black transition-colors">
                        About
                      </Link>
                      <Link href="/contact" className="text-sm font-medium hover:text-black transition-colors">
                        Contact
                      </Link>
                    </nav>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <CartSidebar />
                    <Link href="/auth/signin" className="text-sm font-medium hover:text-black transition-colors">
                      Sign In
                    </Link>
                  </div>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main>{children}</main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white">
              <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Premium Ecommerce</h3>
                    <p className="text-gray-400">
                      Experience the future of online shopping with premium products and exceptional service.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-4">Quick Links</h4>
                    <ul className="space-y-2 text-gray-400">
                      <li><Link href="/products" className="hover:text-white transition-colors">Products</Link></li>
                      <li><Link href="/categories" className="hover:text-white transition-colors">Categories</Link></li>
                      <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                      <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-4">Customer Service</h4>
                    <ul className="space-y-2 text-gray-400">
                      <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                      <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping Info</Link></li>
                      <li><Link href="/returns" className="hover:text-white transition-colors">Returns</Link></li>
                      <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-4">Connect</h4>
                    <ul className="space-y-2 text-gray-400">
                      <li><Link href="/newsletter" className="hover:text-white transition-colors">Newsletter</Link></li>
                      <li><Link href="/social" className="hover:text-white transition-colors">Social Media</Link></li>
                      <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                      <li><Link href="/press" className="hover:text-white transition-colors">Press</Link></li>
                    </ul>
                  </div>
                </div>
                
                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                  <p>&copy; 2024 Premium Ecommerce. All rights reserved.</p>
                </div>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}