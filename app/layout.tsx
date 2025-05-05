import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { AuthProvider } from "@/contexts/auth-context";
import Logo1 from "../public/logo.png";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Gibraltar Private Bank & Trust",
  description: "Secure online banking for Gibraltar Private Bank & Trust clients",
    generator: 'v0.dev',
    icons: {
      icon: "../public/logo.png",
    },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
