import type { Metadata } from "next";
// Removed: import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppProvider from "@/components/providers/AppProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ModalManager from "@/components/modals/ModalManager"; // Using ModalManager

// Removed font configurations
// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Orbe Nerd - Hub de Entretenimento",
  description: "O seu hub completo para lançamentos de filmes, séries, animes e jogos. Descubra, acompanhe e organize seu entretenimento favorito.",
  keywords: "filmes, séries, animes, jogos, lançamentos, entretenimento, streaming",
  authors: [{ name: "Orbe Nerd" }],
  creator: "Orbe Nerd",
  publisher: "Orbe Nerd",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://orbenerd.com'),
  openGraph: {
    title: "Orbe Nerd - Hub de Entretenimento",
    description: "O seu hub completo para lançamentos de filmes, séries, animes e jogos.",
    url: "https://orbenerd.com",
    siteName: "Orbe Nerd",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Orbe Nerd - Hub de Entretenimento",
    description: "O seu hub completo para lançamentos de filmes, séries, animes e jogos.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`antialiased`} // Removed font variables
      >
        <AppProvider>
          <div className="min-h-screen bg-background text-foreground">
            <Header />
            <main className="pt-16 min-h-screen">
              {children}
            </main>
            <Footer />
            <ModalManager /> {/* Using ModalManager */}
          </div>
        </AppProvider>
      </body>
    </html>
  );
}