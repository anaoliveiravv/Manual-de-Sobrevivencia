"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, House, Map, Search } from "lucide-react";

const tabs = [
  { href: "/", label: "Início", icon: House },
  { href: "/buscar", label: "Buscar", icon: Search },
  { href: "/mapa", label: "Mapa", icon: Map },
  { href: "/guia-do-calouro", label: "Guia", icon: BookOpen },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const active = pathname.startsWith("/locais/") || pathname === "/setores" ? "/buscar"
    : pathname === "/ajuda" ? "/guia-do-calouro" : pathname;

  return <nav className="bottom-nav" aria-label="Navegação principal">
    <div className="bottom-nav-inner">
      {tabs.map(({ href, icon: Icon, label }) => <Link href={href} key={href}
        aria-current={active === href ? (pathname === href ? "page" : "location") : undefined}>
        <Icon size={21} strokeWidth={2} aria-hidden="true" />
        <span>{label}</span>
      </Link>)}
    </div>
  </nav>;
}
