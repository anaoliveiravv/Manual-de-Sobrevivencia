import Link from "next/link";
import { Accordion, FAQList, PageIntro } from "@/components/ui";
import { faq } from "@/data/faq";

export const metadata = { title: "Guia do calouro" };

export default function Guide() {
  return <div className="wrap page">
    <PageIntro title="Guia do calouro">O essencial para os primeiros dias no campus.</PageIntro>
    <div className="faq-list">
      <Accordion title="Primeiros dias de aula">
        <p>Antes de sair, confira o horário e o nome ou número da sua sala. Chegue com tempo para encontrar o caminho e procure o <Link href="/locais/apoio">Apoio ao Aluno</Link> se precisar.</p>
      </Accordion>
      <Accordion title="Como encontrar sua sala">
        <p>Abra a <Link href="/buscar?categoria=salas">busca de salas</Link> e digite o nome ou número. Consulte o bloco e o andar quando estiverem cadastrados.</p>
      </Accordion>
      <Accordion title="Conhecendo os blocos">
        <p>Veja os pontos de referência nos detalhes de cada local e consulte o <Link href="/mapa">mapa demonstrativo</Link> para explorar os registros do campus.</p>
      </Accordion>
      <Accordion title="Laboratórios">
        <p>Pesquise pelo nome na <Link href="/buscar?categoria=laboratorios">lista de laboratórios</Link>. Se o endereço estiver pendente, confirme-o com o Apoio ao Aluno.</p>
      </Accordion>
      <Accordion title="Setores e serviços">
        <p>Use o <Link href="/setores">diretório de setores</Link> para procurar atendimento por serviço, como matrícula ou cadastro facial.</p>
      </Accordion>
      <Accordion title="Perguntas frequentes"><FAQList items={faq} /></Accordion>
    </div>
    <Link className="text-link guide-help" href="/ajuda">Central de ajuda</Link>
  </div>;
}
