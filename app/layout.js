import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react"
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Name That Movie - Guess Movies from Letterboxd Reviews",
  description: "Test your movie knowledge! Guess the movie title based on Letterboxd reviews. A fun and challenging game for film enthusiasts.",
  keywords: "movie game, letterboxd, film quiz, movie guessing game, film trivia",
  openGraph: {
    title: "Name That Movie - Guess Movies from Letterboxd Reviews",
    description: "Test your movie knowledge! Guess the movie title based on Letterboxd reviews. A fun and challenging game for film enthusiasts.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="abyss">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
