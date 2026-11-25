import Link from "next/link";
import { ChevronRight, Layers, MapPin, Shapes } from "lucide-react";
import { campusAreas, categories, getCampusArea, getLocationAddress, getLocations } from "@/data/catalog";
import { filterLocations } from "@/lib/search";
import { SearchForm } from "@/components/search-form";
import { EmptyState, PageIntro, Status } from "@/components/ui";

export const metadata = { title: "Mapa do campus" };
type MapParams = { q?: string; area?: string; local?: string; categoria?: string };
type Params = Promise<{ [Key in keyof MapParams]: string | string[] }>;
const areaIcons = { patio: MapPin, pendentes: Layers, exemplos: Shapes };

function mapHref(params: MapParams) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) search.set(key, value);
  }
  return `/mapa?${search}`;
}

export default async function MapPage({ searchParams }: { searchParams: Params }) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.trim() : "";
  const area = campusAreas.find(({ id }) => id === params.area)?.id;
  const category = typeof params.categoria === "string" && Object.hasOwn(categories, params.categoria) ? params.categoria : "";
  const places = filterLocations(getLocations(), { query, category });
  const chosen = places.find(({ id }) => id === params.local);
  const selectedArea = area ?? (chosen ? getCampusArea(chosen) : query && places[0] ? getCampusArea(places[0]) : campusAreas[0].id);
  const areaPlaces = places.filter((place) => getCampusArea(place) === selectedArea);
  const selected = chosen && getCampusArea(chosen) === selectedArea ? chosen : areaPlaces[0];
  const address = selected ? getLocationAddress(selected) : undefined;
  const selectable = query ? places : areaPlaces;

  return <div className="wrap page map-page">
    <PageIntro title="Mapa do campus" />
    <SearchForm action="/mapa" query={query} key={query} label="Buscar no mapa" placeholder="Busque um local no mapa" />
    <section className="map-frame" aria-labelledby="map-label">
      <div className="map-note">
        <strong id="map-label">Mapa demonstrativo</strong>
        <span>Esquema do catálogo. A planta oficial está pendente.</span>
      </div>
      <div className="map-board" role="group" aria-label="Áreas do esquema">
        {campusAreas.map(({ id, name }) => {
          const Icon = areaIcons[id as keyof typeof areaIcons] ?? MapPin;
          const active = id === selectedArea;
          return <Link className="map-area" key={id} href={mapHref({ q: query, area: id, categoria: category })}
            aria-current={active ? "true" : undefined} scroll={false}>
            <Icon size={24} aria-hidden="true" /><strong>{name}</strong>
          </Link>;
        })}
      </div>
      {selected ? <Link href={`/locais/${selected.id}`} className="map-selection" aria-label={`Ver detalhes de ${selected.name}`}>
        <MapPin size={21} aria-hidden="true" />
        <span><strong>{selected.name}</strong>
          {address ? <small>{address}</small> : <Status status={selected.verificationStatus} />}
        </span>
        <ChevronRight size={19} aria-hidden="true" />
      </Link> : <EmptyState>{places.length ? "Escolha outra área do esquema." : "Tente outro nome ou limpe a busca."}</EmptyState>}
    </section>
    {selectable.length > 1 ? <section className="section map-results" aria-labelledby="map-results-title">
      <h2 id="map-results-title">{query ? "Resultados da busca" : "Locais nesta área"}</h2>
      <ul className="location-list">{selectable.map((place) =>
        <li key={place.id}>
          <Link className="location-row" href={mapHref({ q: query, area: getCampusArea(place), local: place.id, categoria: category })}
            aria-current={selected?.id === place.id ? "true" : undefined} scroll={false}>
            <strong>{place.name}</strong><MapPin size={18} aria-hidden="true" />
          </Link>
        </li>
      )}</ul>
    </section> : null}
  </div>;
}
