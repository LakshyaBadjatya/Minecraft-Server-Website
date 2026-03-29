import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Particles from "@/components/Particles";
import { AuthProvider } from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "BedWars | play.sukhma.in",
  description:
    "The ultimate Minecraft BedWars server. Join now at play.sukhma.in!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="min-h-screen antialiased"
        style={{
          background:
            "radial-gradient(ellipse at top, #1a1a2e 0%, #0d0d1a 40%, #050510 100%)",
        }}
      >
        <AuthProvider>
          <Particles />
          <Navbar />
          <main className="relative z-10 pt-20">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
