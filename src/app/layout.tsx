import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});



export const metadata: Metadata = {
  title: "MapleStory Party Finder",
  description: "Find your perfect party for MapleStory boss fights! Connect with other players and conquer the toughest bosses together.",
  keywords: "MapleStory, party finder, boss fights, MMORPG, gaming",
  authors: [{ name: "MapleStory Community" }],
  openGraph: {
    title: "MapleStory Party Finder",
    description: "Find your perfect party for MapleStory boss fights!",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${nunito.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
