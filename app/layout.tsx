import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ClientLayout } from "./client-layout"

const plusJakartaSans = {
  variable: "--font-sans",
}

const lora = {
  variable: "--font-serif",
}

const ibmPlexMono = {
  variable: "--font-mono",
}

export const metadata: Metadata = {
  title: "Stabilisha - GigWise Platform",
  description: "Unified gig worker platform with integrated financial services",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${plusJakartaSans.variable} ${lora.variable} ${ibmPlexMono.variable}`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
