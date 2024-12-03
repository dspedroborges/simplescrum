import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Link from "next/link";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Simple Scrum",
  description: "Gere rapidamente um scrum compartilhável, sem a necessidade de criar conta. Apenas crie e compartilhe o link.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-b from-black to-gray-700 min-h-screen`}
      >
        <nav className="bg-gray-800 text-white p-4">
          <ul className="flex justify-around items-center">
            <li>
              <Link className="hover:underline" href="/">Home</Link>
            </li>
            <li>
              <Link className="hover:underline" href="/saved">Saved</Link>
            </li>
          </ul>
        </nav>
        {children}
      </body>
    </html>
  );
}
