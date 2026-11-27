import Link from "next/link";
import { ChevronRight, MapPin } from "lucide-react";
import { campusAreas, categories, getCampusArea, getLocationAddress, getLocations } from "@/data/catalog";
import { filterLocations } from "@/lib/search";
import { CampusMap } from "@/components/campus-map";
import { SearchForm } from "@/components/search-form";
import { EmptyState, PageIntro, Status } from "@/components/ui";

export const metadata = { title: "Mapa do campus" };
type MapParams = { q?: string; area?: string; local?: string; categoria?: string };
type Params = Promise<{ [Key in keyof MapParams]: string | string[] }>;

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
        <strong id="map-label">Mapa demonstrativo do campus</strong>
        <span>Posições e códigos são aproximados e editáveis; confirme os dados antes de usá-los como orientação.</span>
      </div>
      <CampusMap locations={places} selectedId={selected?.id} selectedArea={selectedArea} />
      {selected ? <Link href={`/locais/${selected.id}`} className="map-selection" aria-label={`Ver detalhes de ${selected.name}`}>
        <MapPin size={21} aria-hidden="true" />
        <span><strong>{selected.name}</strong>
          {selected.svgPinType === "entrance"
            ? <small>{selected.directions?.[0] ?? selected.description}</small>
            : <>
              <small>{selected.description}</small>
              {address ? <small>{address}</small> : null}
              {selected.svgPinType === "sector" && selected.openingHours ? <small>Horário: {selected.openingHours}</small> : null}
              {!address ? <Status status={selected.verificationStatus} /> : null}
            </>}
        </span>
        <ChevronRight size={19} aria-hidden="true" />
      </Link> : <EmptyState>{places.length ? "Escolha outro local nesta área." : "Tente outro nome ou limpe a busca."}</EmptyState>}
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
