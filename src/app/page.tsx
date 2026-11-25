import Link from "next/link";
import { Accessibility, Building2, DoorOpen, FlaskConical } from "lucide-react";
import { getFeaturedLocations } from "@/data/catalog";
import { SearchForm } from "@/components/search-form";
import { LocationList } from "@/components/ui";

const shortcuts = [
  { name: "Salas", icon: DoorOpen, href: "/buscar?categoria=salas" },
  { name: "Laboratórios", icon: FlaskConical, href: "/buscar?categoria=laboratorios" },
  { name: "Setores", icon: Building2, href: "/buscar?categoria=setores" },
  { name: "Banheiros", icon: Accessibility, href: "/buscar?categoria=banheiros" },
];

export default function Home() {
  return <div className="wrap page home">
    <section aria-labelledby="home-title">
      <div className="page-intro">
        <h1 id="home-title">Onde você quer ir?</h1>
        <p>Encontre salas, setores e serviços da CEUMA.</p>
      </div>
      <SearchForm action="/buscar" />
    </section>
    <section className="section" aria-labelledby="categories-title">
      <h2 id="categories-title">Categorias</h2>
      <div className="shortcut-grid">{shortcuts.map(({ name, icon: Icon, href }) =>
        <Link href={href} key={name} className="shortcut">
          <span><Icon size={22} aria-hidden="true" /></span>
          {name}
        </Link>
      )}</div>
    </section>
    <section className="section" aria-labelledby="useful-title">
      <h2 id="useful-title">Locais úteis</h2>
      <LocationList locations={getFeaturedLocations().slice(0, 3)} />
    </section>
  </div>;
}
