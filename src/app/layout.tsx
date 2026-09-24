import type { Metadata } from "next";
import { Caveat_Brush, DM_Sans, Fraunces } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Toast } from "@/components/Toast";
import { getCurrentUser } from "@/lib/auth";
import "./globals.css";

const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], axes: ["opsz"] });
const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"] });
const caveat = Caveat_Brush({ variable: "--font-caveat", subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: { default: "MoodBox · Regalos según cómo te sientes", template: "%s · MoodBox" },
  description: "Cajas de regalo pensadas según cómo te sientes. Hechas con cariño en Colombia.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const user = await getCurrentUser();
  return (
    <html lang="es-CO" className={`${fraunces.variable} ${dmSans.variable} ${caveat.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col">
        <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-white">
          Saltar al contenido
        </a>
        <Header signedIn={!!user} />
        <Toast />
        <main id="contenido" className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
