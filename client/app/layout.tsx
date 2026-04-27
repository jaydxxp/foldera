import type { Metadata } from "next";
import "./globals.css";
import { Turret_Road } from "next/font/google";
import { Instrument_Serif } from "next/font/google";
const turretRoad = Turret_Road({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "700", "800"],
  variable: "--font-turret-road",
});
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-instrument-serif",
});
export const metadata: Metadata = {
  title: "Foldera",
  description: "A private drive-like workspace for nested folders and image uploads.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className={`${turretRoad.variable} ${instrumentSerif.variable}`}>{children}</body>
    </html>
  );
}
