import { categories, getCampusArea, serviceAssociations, type CampusLocation } from "../data/catalog.ts";

const accents = /[\u0300-\u036f]/g;
const separators = /[^\p{L}\p{N}ºª]+/gu;

export function normalize(value: string) {
  return value.normalize("NFD").replace(accents, "").toLowerCase().replace(separators, " ").trim();
}

type Filters = { query?: string; category?: string; building?: string; floor?: string; area?: string };

export function filterLocations(locations: CampusLocation[], filters: Filters) {
  const query = normalize(filters.query ?? "");
  const words = query ? query.split(" ") : [];

  return locations.filter((location) => {
    if (filters.category && location.category !== filters.category) return false;
    if (filters.building && location.building !== filters.building) return false;
    if (filters.floor && location.floor !== filters.floor) return false;
    if (filters.area && getCampusArea(location) !== filters.area) return false;
    if (!words.length) return true;

    const text = normalize([
      location.name, categories[location.category], location.description, location.location,
      location.building, location.floor, ...location.keywords, ...(location.services ?? []),
      ...(location.referencePoints ?? []),
    ].join(" "));
    return words.every((word) => text.includes(word));
  });
}

export function matchService(query: string) {
  const normalized = normalize(query);
  if (!normalized) return [];
  const text = " " + normalized + " ";
  return [...new Set(serviceAssociations.flatMap(({ locationId, phrases, verified }) =>
    verified && phrases.some((phrase) => text.includes(" " + normalize(phrase) + " ")) ? [locationId] : [],
  ))];
}
