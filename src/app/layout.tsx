import type { Metadata, Viewport } from "next";
import { Header } from "@/components/header";
import { BottomNav } from "@/components/bottom-nav";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Manual de Sobrevivência CEUMA", template: "%s | Manual CEUMA" },
  description: "Guia de orientação universitária do campus Renascença, em São Luís.",
};

export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>
    <a className="skip" href="#conteudo">Ir para o conteúdo</a>
    <Header />
    <main id="conteudo" tabIndex={-1}>{children}</main>
    <BottomNav />
  </body></html>;
}
