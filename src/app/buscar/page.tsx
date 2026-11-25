import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";
import { categories, getLocations } from "@/data/catalog";
import { filterLocations } from "@/lib/search";
import { CategoryFilter } from "@/components/category-filter";
import { SearchForm } from "@/components/search-form";
import { EmptyState, FilterSelect, LocationList, PageIntro } from "@/components/ui";

export const metadata = { title: "Buscar locais" };
type Params = Promise<Record<string, string | string[] | undefined>>;
const single = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] ?? "" : value ?? "";

export default async function SearchPage({ searchParams }: { searchParams: Params }) {
  const params = await searchParams;
  const locations = getLocations();
  const categoryOptions = Object.entries(categories);
  const buildingOptions = [...new Set(locations.flatMap(({ building }) => building ? [building] : []))];
  const floorOptions = [...new Set(locations.flatMap(({ floor }) => floor ? [floor] : []))];
  const query = single(params.q);
  const rawCategory = single(params.categoria);
  const category = Object.hasOwn(categories, rawCategory) ? rawCategory : "";
  const rawBuilding = single(params.bloco);
  const rawFloor = single(params.andar);
  const building = buildingOptions.includes(rawBuilding) ? rawBuilding : "";
  const floor = floorOptions.includes(rawFloor) ? rawFloor : "";
  const results = filterLocations(locations, { query, category, building, floor });
  const applied = new URLSearchParams();
  if (query) applied.set("q", query);
  if (category) applied.set("categoria", category);
  if (building) applied.set("bloco", building);
  if (floor) applied.set("andar", floor);
  const returnTo = applied.size ? `/buscar?${applied}` : "/buscar";

  return <div className="wrap page">
    <PageIntro title="Buscar locais" />
    <SearchForm key={returnTo} action="/buscar" query={query}>
      <div className="search-filters">
        <CategoryFilter value={category} options={categoryOptions} />
        {buildingOptions.length || floorOptions.length ? <details className="extra-filters" open={building || floor ? true : undefined}>
          <summary><SlidersHorizontal size={17} aria-hidden="true" /> Filtros</summary>
          <div className="extra-fields">
            {buildingOptions.length ? <FilterSelect label="Bloco" name="bloco" value={building} options={buildingOptions.map((value) => [value, value])} /> : null}
            {floorOptions.length ? <FilterSelect label="Andar" name="andar" value={floor} options={floorOptions.map((value) => [value, value])} /> : null}
            <button type="submit" className="secondary">Aplicar filtros</button>
          </div>
        </details> : null}
      </div>
    </SearchForm>
    <section className="section" aria-labelledby="results-title">
      <div className="section-heading">
        <h2 id="results-title">{results.length === 1 ? "1 local encontrado" : `${results.length} locais encontrados`}</h2>
        {applied.size ? <Link href="/buscar" className="text-link">Limpar</Link> : null}
      </div>
      {results.length ? <LocationList locations={results} from={returnTo} />
        : <EmptyState>Tente outro nome, como “RH” ou “matrícula”.</EmptyState>}
    </section>
    <Link href="/setores" className="text-link">Procurar por serviço</Link>
  </div>;
}
