import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Fonte padrão (depois podemos mudar para Space Grotesk)
import "./globals.css"; // 👈 O IMPORT MAIS IMPORTANTE!
import { cn } from "@/lib/utils"; // Utilitário do ShadCN para juntar classes

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ENEM CYBER-ARENA",
  description: "Survival Quiz Gamificado para o Vestibular",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" className="dark"> 
      {/* 👆 Forçamos a classe 'dark' aqui no HTML */}
      
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased text-foreground overflow-x-hidden",
          inter.className
        )}
      >
        {/* O children é onde o seu page.tsx vai ser renderizado */}
        {children}
      </body>
    </html>
  );
}