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
  description:
    "AI-powered GitHub repository analyzer. Get instant architectural insights, code quality audits, and an interactive RAG chat interface for any public GitHub repository.",
  openGraph: {
    title: "Codebase Narrator",
    description:
      "AI-powered GitHub repository analyzer. Get instant architectural insights, code quality audits, and an interactive RAG chat interface for any public GitHub repository.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Codebase Narrator",
    description:
      "AI-powered GitHub repository analyzer. Architectural insights, code quality audits, and RAG chat — powered by Gemini.",
  },
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
