import Link from "next/link";
import { PageIntro } from "@/components/ui";

export default function NotFound() {
  return <div className="wrap page">
    <PageIntro title="Página não encontrada">O endereço pode ter mudado. Abra a busca para encontrar o local que você procura.</PageIntro>
    <Link href="/buscar" className="primary">Buscar locais</Link>
  </div>;
}
