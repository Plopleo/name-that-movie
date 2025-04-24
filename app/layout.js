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

const title = "Name That Movie - Guess Movies from Letterboxd Reviews";
const description = "Test your movie knowledge! Guess the movie title based on Letterboxd reviews. A fun and challenging game for film enthusiasts.";
const websiteName = "Name That Movie";

export const metadata = {
  title: title,
  applicationName: websiteName,
  description: description,
  keywords: ['movie game', 'letterboxd', 'film quiz', 'movie guessing game', 'film trivia'],
  openGraph: {
    title: title,
    description: description,
    url: 'https://name-that-movie.leopold.dev',
    type: "website",
    siteName: websiteName,
    images: [
      {
        url: 'https://name-that-movie.leopold.dev/img/og.png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: title,
    description: description,
    images: [
      {
        url: 'https://name-that-movie.leopold.dev/img/og.png',
      },
    ],
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
