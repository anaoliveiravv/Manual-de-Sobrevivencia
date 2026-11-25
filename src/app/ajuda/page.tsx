import Link from "next/link";
import { PageIntro, FAQList } from "@/components/ui";
import { ReportForm } from "@/components/report-form";
import { getLocations } from "@/data/catalog";
import { faq } from "@/data/faq";

export const metadata = { title: "Central de ajuda" };

export default async function Help({ searchParams }: { searchParams: Promise<{ local?: string | string[] }> }) {
  const { local } = await searchParams;
  const locations = getLocations().map(({ id, name }) => ({ id, name }));
  const selected = typeof local === "string" && locations.some(({ id }) => id === local) ? local : "";
  return <div className="wrap page">
    <PageIntro title="Central de ajuda">Saiba como usar o guia e relate informações que precisam de revisão.</PageIntro>
    <div className="detail-grid guide-grid">
      <section className="panel info"><h2>Dicas de localização</h2>
        <p>Comece pela <Link href="/buscar">busca de locais</Link>. Tente a sigla do setor, a categoria ou o nome por extenso. Confira os pontos de referência na página de detalhes.</p>
        <p>Se precisar de orientação no campus, procure o <Link href="/locais/apoio">Apoio ao Aluno</Link>.</p>
      </section>
      <section className="panel info"><h2>Como ler o status dos dados</h2>
        <p><strong>Registrado em entrevista</strong> indica um dado coletado pela equipe. <strong>Validação pendente</strong> indica que a equipe ainda precisa confirmar informações do registro.</p>
        <p>Os itens <strong>demonstrativos</strong> ilustram como o catálogo e o mapa funcionam.</p>
      </section>
    </div>
    <section className="section"><h2 className="section-title">Perguntas frequentes</h2><FAQList items={faq} /></section>
    <section id="relatar" className="panel info report">
      <h2>Relatar informação incorreta</h2>
      <p>Este formulário é demonstrativo. O último relato fica salvo apenas neste navegador.</p>
      <ReportForm key={selected} locations={locations} selected={selected} />
    </section>
  </div>;
}
