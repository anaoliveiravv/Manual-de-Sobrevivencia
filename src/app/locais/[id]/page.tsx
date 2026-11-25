import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Route } from "lucide-react";
import { categories, getLocation, getLocationAddress, getLocations } from "@/data/catalog";
import { Accordion, FAQList, Status } from "@/components/ui";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ voltar?: string | string[] }> };

export function generateStaticParams() {
  return getLocations().map(({ id }) => ({ id }));
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  return { title: getLocation(id)?.name ?? "Local não encontrado" };
}

export default async function LocationPage({ params, searchParams }: Props) {
  const [{ id }, { voltar }] = await Promise.all([params, searchParams]);
  const location = getLocation(id);
  if (!location) notFound();

  const back = typeof voltar === "string" && voltar.startsWith("/buscar?") ? voltar : "/buscar";
  const address = getLocationAddress(location);
  const references = location.verificationStatus === "verified" ? location.referencePoints : undefined;
  const directions = location.verificationStatus === "verified" ? location.directions : undefined;

  return <div className="wrap page">
    <Link className="text-link back-link" href={back}><ArrowLeft size={17} aria-hidden="true" /> Voltar à busca</Link>
    <div className="page-intro detail-intro">
      <h1>{location.name}</h1>
      <p>{location.description}</p>
    </div>
    <section className="detail-section" aria-labelledby="location-title">
      <h2 id="location-title"><MapPin size={20} aria-hidden="true" /> Localização</h2>
      {address ? <p>{address}</p> : null}
      <Status status={location.verificationStatus} />
      {references?.length ? <>
        <h3>Pontos de referência</h3>
        <ul>{references.map((point) => <li key={point}>{point}</li>)}</ul>
      </> : null}
    </section>
    {location.services?.length ? <section className="detail-section" aria-labelledby="services-title">
      <h2 id="services-title">Serviços oferecidos</h2>
      <ul>{location.services.map((service) => <li key={service}>{service}</li>)}</ul>
    </section> : null}
    {directions?.length ? <section className="detail-section">
      <a href="#como-chegar" className="primary"><Route size={18} aria-hidden="true" /> Como chegar</a>
      <ol id="como-chegar" tabIndex={-1}>{directions.map((step) => <li key={step}>{step}</li>)}</ol>
    </section> : null}
    {location.faq?.length || location.openingHours ? <section className="detail-section">
      <Accordion title="Informações complementares">
        <p>{categories[location.category]}</p>
        {location.openingHours ? <p>Horário de funcionamento · {location.openingHours}</p> : null}
        {location.faq?.length ? <FAQList items={location.faq} /> : null}
      </Accordion>
    </section> : null}
    <Link className="text-link" href={`/ajuda?local=${location.id}#relatar`}>Relatar informação incorreta</Link>
  </div>;
}
