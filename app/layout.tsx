import type { Metadata } from "next";
import { Ubuntu } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Navigation } from "@/components/navigation/Navigation";

const ubuntu = Ubuntu({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-ubuntu",
});

export const metadata: Metadata = {
  title: "Codebase Narrator",
  description: "AI-powered GitHub repository analysis tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${ubuntu.variable} font-sans antialiased h-full flex flex-col`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <Navigation />
          <div className="flex-1 overflow-auto min-h-0">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
