import Link from "next/link";
import { Search } from "lucide-react";
import { getDepartments } from "@/data/catalog";
import { matchService } from "@/lib/search";
import { EmptyState, LocationCard, PageIntro } from "@/components/ui";

export const metadata = { title: "Diretório de setores" };

export default async function Directory({ searchParams }: { searchParams: Promise<{ servico?: string | string[] }> }) {
  const { servico } = await searchParams;
  const query = typeof servico === "string" ? servico.trim() : "";
  const departments = getDepartments();
  const matches = query ? new Set(matchService(query)) : null;
  const results = matches ? departments.filter(({ id }) => matches.has(id)) : departments;

  return <div className="wrap page">
    <PageIntro title="Diretório de setores">Encontre o atendimento administrativo ou acadêmico de que você precisa.</PageIntro>
    <section id="servicos" className="panel info service-search">
      <h2>O que você precisa resolver?</h2>
      <form key={query} action="/setores#resultados" role="search" aria-label="Buscar serviço" className="inline-form">
        <label className="field grow">Informe o serviço
          <input name="servico" type="search" defaultValue={query} placeholder="Ex. Quero resolver uma dúvida sobre matrícula" />
        </label>
        <button className="primary"><Search size={18} aria-hidden="true" /> Buscar serviço</button>
      </form>
    </section>
    <section id="resultados" className="section">
      <div className="section-heading">
        <h2 className="section-title">{query ? "Setores para o serviço" : "Setores cadastrados"}</h2>
        {query ? <Link href="/setores#resultados" className="text-link">Ver todos os setores</Link> : null}
      </div>
      {results.length ? <div className="grid-cards">{results.map((location) => <LocationCard key={location.id} location={location} directory />)}</div>
        : <EmptyState>Tente “matrícula” ou “cadastro facial”. Se precisar de orientação, procure o <Link href="/locais/apoio">Apoio ao Aluno</Link>.</EmptyState>}
    </section>
  </div>;
}
