import Link from "next/link";
import { ArrowRight, ChevronDown, ChevronRight, MapPin } from "lucide-react";
import type { ReactNode } from "react";
import { categories, getLocationAddress, type CampusLocation, type FAQ } from "@/data/catalog";

export function PageIntro({ title, children }: { title: string; children?: ReactNode }) {
  return <div className="page-intro"><h1>{title}</h1>{children ? <p>{children}</p> : null}</div>;
}

export function Status({ status }: { status: CampusLocation["verificationStatus"] }) {
  const names = { verified: "Registrado em entrevista", pending: "Informação pendente de validação", demo: "Demonstrativo" };
  return <span className={"status " + status}>{names[status]}</span>;
}

export function LocationList({ locations, from }: { locations: CampusLocation[]; from?: string }) {
  return <ul className="location-list">{locations.map((location) => {
    const address = getLocationAddress(location);
    const href = from ? { pathname: `/locais/${location.id}`, query: { voltar: from } } : `/locais/${location.id}`;
    return <li key={location.id}>
      <Link href={href} className="location-row">
        <span>
          <strong>{location.name}</strong>
          <small>{categories[location.category]}{address ? ` · ${address}` : ""}</small>
          {location.verificationStatus !== "verified" ? <Status status={location.verificationStatus} /> : null}
        </span>
        <ChevronRight size={20} aria-hidden="true" />
      </Link>
    </li>;
  })}</ul>;
}

export function LocationCard({ location, directory = false }: { location: CampusLocation; directory?: boolean }) {
  const address = getLocationAddress(location);
  return <article className="panel location-card">
    <div className="card-meta"><span>{categories[location.category]}</span><Status status={location.verificationStatus} /></div>
    <h3>{location.name}</h3>
    <p>{location.description}</p>
    {address ? <p className="address"><MapPin size={17} aria-hidden="true" />{address}</p> : null}
    {directory ? <dl className="directory-meta">
      {location.services?.length ? <><dt>Serviços</dt><dd>{location.services.join(" · ")}</dd></> : null}
      {location.referencePoints?.length ? <><dt>Referências</dt><dd>{location.referencePoints.join(" · ")}</dd></> : null}
      {location.openingHours ? <><dt>Horário</dt><dd>{location.openingHours}</dd></> : null}
    </dl> : null}
    <Link className="text-link" href={`/locais/${location.id}`} aria-label={`Ver detalhes de ${location.name}`}>
      Ver detalhes <ArrowRight size={17} aria-hidden="true" />
    </Link>
  </article>;
}

export function Accordion({ title, children }: { title: string; children: ReactNode }) {
  return <details className="accordion">
    <summary>{title}<ChevronDown size={19} aria-hidden="true" /></summary>
    <div>{children}</div>
  </details>;
}

export function FAQList({ items }: { items: FAQ[] }) {
  return <div className="faq-list">{items.map(({ question, answer }) =>
    <Accordion key={question} title={question}><p>{answer}</p></Accordion>
  )}</div>;
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <div className="empty"><strong>Nenhum resultado encontrado</strong><p>{children}</p></div>;
}

export function FilterSelect({ label, name, value, options, emptyLabel = "Todas as opções" }: {
  label: string; name: string; value: string; options: readonly (readonly [string, string])[]; emptyLabel?: string;
}) {
  return <label className="field">{label}
    <select name={name} defaultValue={value}>
      <option value="">{emptyLabel}</option>
      {options.map(([id, title]) => <option value={id} key={id}>{title}</option>)}
    </select>
  </label>;
}
