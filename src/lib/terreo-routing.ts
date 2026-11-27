import type { CampusLocation } from "../data/catalog";
import { decodePlusCode } from "./plus-code.ts";

export type TerreoPoint = { x: number; y: number };
export type TerreoRoute = {
  points: TerreoPoint[];
  waypoints: CampusLocation[];
  steps: string[];
};

export const CURRENT_LOCATION_ID = "current-location";

type GraphNode = TerreoPoint & { id: string; locationId?: string };
type GraphEdge = { from: string; to: string; corridor?: boolean };
type Link = { to: string; weight: number };

const spineNodes: GraphNode[] = [
  { id: "patio-centro", x: 142, y: 195 },
  { id: "corredor-norte", x: 142, y: 245 },
  { id: "corredor-auditorio", x: 142, y: 270 },
  { id: "corredor-caa", x: 142, y: 313 },
  { id: "corredor-matricula", x: 142, y: 381 },
  { id: "corredor-cafe", x: 145, y: 432 },
  { id: "corredor-quadra", x: 145, y: 500 },
  { id: "corredor-sul", x: 145, y: 615 },
];

const pinLocations: Record<string, TerreoPoint> = {
  "entrada-rua": { x: 68, y: 189 },
  "estatua-pensador": { x: 142, y: 171 },
  "entrada-estacionamento": { x: 182, y: 187 },
  apoio: { x: 92, y: 224 },
  "loja-1": { x: 111, y: 270 },
  auditorio: { x: 168, y: 267 },
  "wc-1": { x: 112, y: 306 },
  "central-atendimento": { x: 172, y: 313 },
  "loja-2": { x: 116, y: 345 },
  banco: { x: 177, y: 345 },
  matriculas: { x: 143, y: 381 },
  "cafe-cb": { x: 165, y: 432 },
  "ginasio-quadra": { x: 190, y: 500 },
  "wc-2": { x: 124, y: 608 },
  "sala-cix": { x: 135, y: 662 },
};

const pinToSpine: Record<string, string> = {
  "entrada-rua": "patio-centro",
  "estatua-pensador": "patio-centro",
  "entrada-estacionamento": "patio-centro",
  apoio: "patio-centro",
  "loja-1": "corredor-auditorio",
  auditorio: "corredor-auditorio",
  "wc-1": "corredor-caa",
  "central-atendimento": "corredor-caa",
  "loja-2": "corredor-matricula",
  banco: "corredor-matricula",
  matriculas: "corredor-matricula",
  "cafe-cb": "corredor-cafe",
  "ginasio-quadra": "corredor-quadra",
  "wc-2": "corredor-sul",
  "sala-cix": "corredor-sul",
};

const spineEdges: GraphEdge[] = spineNodes.slice(1).map((node, index) => ({
  from: spineNodes[index].id,
  to: node.id,
  corridor: true,
}));

const landmarksBySpine: Record<string, string[]> = {
  "patio-centro": ["estatua-pensador"],
  "corredor-caa": ["central-atendimento"],
  "corredor-matricula": ["matriculas"],
  "corredor-cafe": ["cafe-cb"],
  "corredor-quadra": ["ginasio-quadra"],
};
const preferredLandmarks = ["estatua-pensador", "matriculas", "cafe-cb", "central-atendimento", "ginasio-quadra"];

const referencePoints = [
  { code: "689QFPX7+4X", x: 68, y: 189 },
  { code: "689QFPW7+VV", x: 142, y: 171 },
  { code: "689QFPW7+WV", x: 92, y: 224 },
  { code: "689QFPW7+RP", x: 172, y: 313 },
  { code: "689QFPW7+VJ", x: 143, y: 381 },
  { code: "689QFPW7+WP", x: 165, y: 432 },
  { code: "689QFPW7+R8", x: 135, y: 662 },
].map(({ code, x, y }) => ({ ...decodePlusCode(code), x, y }));

const referenceLatitude = referencePoints.reduce((sum, point) => sum + point.latitude, 0) / referencePoints.length;
const referenceLongitude = referencePoints.reduce((sum, point) => sum + point.longitude, 0) / referencePoints.length;
const longitudeScale = Math.cos((referenceLatitude * Math.PI) / 180) * 111_320;

const spineNodeById = new Map(spineNodes.map((node) => [node.id, node]));
const corridorSegments = spineEdges.map(({ from, to }) => ({
  from: spineNodeById.get(from)!,
  to: spineNodeById.get(to)!,
}));

function distance(a: TerreoPoint, b: TerreoPoint) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function closestPointOnSegment(point: TerreoPoint, start: TerreoPoint, end: TerreoPoint): TerreoPoint {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const lengthSquared = dx * dx + dy * dy;
  const t = lengthSquared === 0
    ? 0
    : Math.max(0, Math.min(1, ((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSquared));
  return { x: start.x + t * dx, y: start.y + t * dy };
}

export function projectGpsToTerreoSvg(latitude: number, longitude: number): TerreoPoint | null {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || Math.abs(latitude) > 90 || Math.abs(longitude) > 180) {
    return null;
  }

  const gps = {
    x: (longitude - referenceLongitude) * longitudeScale,
    y: (latitude - referenceLatitude) * 111_320,
  };
  let totalWeight = 0;
  let x = 0;
  let y = 0;
  let nearestDistance = Number.POSITIVE_INFINITY;
  let exactReference: typeof referencePoints[number] | undefined;

  for (const reference of referencePoints) {
    const refX = (reference.longitude - referenceLongitude) * longitudeScale;
    const refY = (reference.latitude - referenceLatitude) * 111_320;
    const meters = Math.hypot(gps.x - refX, gps.y - refY);
    nearestDistance = Math.min(nearestDistance, meters);
    if (meters < 0.5) {
      exactReference = reference;
      break;
    }
    const weight = 1 / (meters * meters);
    totalWeight += weight;
    x += reference.x * weight;
    y += reference.y * weight;
  }

  if (nearestDistance > 65) return null;
  const projected = exactReference
    ? { x: exactReference.x, y: exactReference.y }
    : { x: x / totalWeight, y: y / totalWeight };
  if (projected.x < 35 || projected.x > 225 || projected.y < 145 || projected.y > 690) return null;

  let nearestCorridor: TerreoPoint | undefined;
  let corridorDistance = Number.POSITIVE_INFINITY;
  for (const segment of corridorSegments) {
    const candidate = closestPointOnSegment(projected, segment.from, segment.to);
    const candidateDistance = distance(projected, candidate);
    if (candidateDistance < corridorDistance) {
      corridorDistance = candidateDistance;
      nearestCorridor = candidate;
    }
  }
  if (!nearestCorridor || corridorDistance > 90) return null;

  const snapStrength = Math.min(0.85, corridorDistance / 32);
  return {
    x: projected.x + (nearestCorridor.x - projected.x) * snapStrength,
    y: projected.y + (nearestCorridor.y - projected.y) * snapStrength,
  };
}

function buildGraph(locations: CampusLocation[]) {
  const nodes = new Map<string, GraphNode>();
  const adjacency = new Map<string, Link[]>();
  const locationsById = new Map(locations.map((location) => [location.id, location]));
  const locationNodes = Object.keys(pinToSpine).flatMap((id) => {
    const location = locationsById.get(id);
    const point = location?.svgCoords ?? pinLocations[id];
    return point ? [{ id, locationId: id, ...point }] : [];
  });

  for (const node of [...spineNodes, ...locationNodes]) {
    nodes.set(node.id, node);
    adjacency.set(node.id, []);
  }

  const pinEdges = locationNodes.map(({ id }) => ({ from: id, to: pinToSpine[id] }));
  for (const edge of [...spineEdges, ...pinEdges]) {
    const from = nodes.get(edge.from);
    const to = nodes.get(edge.to);
    if (!from || !to) continue;
    const weight = distance(from, to);
    adjacency.get(edge.from)?.push({ to: edge.to, weight });
    adjacency.get(edge.to)?.push({ to: edge.from, weight });
  }

  return { nodes, adjacency };
}

export function calculateTerreoRoute(
  originId: string,
  destinationId: string,
  locations: CampusLocation[],
  currentPosition?: TerreoPoint | null,
): TerreoRoute | null {
  if (!originId || !destinationId || originId === destinationId) return null;
  const { nodes, adjacency } = buildGraph(locations);
  const destination = nodes.get(destinationId);
  if (!destination) return null;

  const startId = originId;
  if (originId === CURRENT_LOCATION_ID) {
    if (!currentPosition) return null;
    const originNode: GraphNode = { id: CURRENT_LOCATION_ID, ...currentPosition };
    nodes.set(CURRENT_LOCATION_ID, originNode);
    adjacency.set(CURRENT_LOCATION_ID, []);

    let closestSegment: typeof corridorSegments[number] | undefined;
    let snappedPoint: TerreoPoint | undefined;
    let closestDistance = Number.POSITIVE_INFINITY;
    for (const segment of corridorSegments) {
      const point = closestPointOnSegment(currentPosition, segment.from, segment.to);
      const candidateDistance = distance(currentPosition, point);
      if (candidateDistance < closestDistance) {
        closestDistance = candidateDistance;
        closestSegment = segment;
        snappedPoint = point;
      }
    }
    if (!closestSegment || !snappedPoint) return null;

    const snapId = "current-location-snap";
    nodes.set(snapId, { id: snapId, ...snappedPoint });
    adjacency.set(snapId, []);
    const connect = (from: string, to: string, weight: number) => {
      adjacency.get(from)?.push({ to, weight });
      adjacency.get(to)?.push({ to: from, weight });
    };
    connect(CURRENT_LOCATION_ID, snapId, distance(currentPosition, snappedPoint));
    connect(snapId, closestSegment.from.id, distance(snappedPoint, closestSegment.from));
    connect(snapId, closestSegment.to.id, distance(snappedPoint, closestSegment.to));
  }

  if (!nodes.has(startId)) return null;
  const distances = new Map<string, number>([[startId, 0]]);
  const previous = new Map<string, string>();
  const unvisited = new Set(nodes.keys());

  while (unvisited.size) {
    let current: string | undefined;
    let currentDistance = Number.POSITIVE_INFINITY;
    for (const candidate of unvisited) {
      const candidateDistance = distances.get(candidate) ?? Number.POSITIVE_INFINITY;
      if (candidateDistance < currentDistance) {
        current = candidate;
        currentDistance = candidateDistance;
      }
    }
    if (!current || !Number.isFinite(currentDistance)) break;
    if (current === destinationId) break;
    unvisited.delete(current);

    for (const link of adjacency.get(current) ?? []) {
      if (!unvisited.has(link.to)) continue;
      const nextDistance = currentDistance + link.weight;
      if (nextDistance < (distances.get(link.to) ?? Number.POSITIVE_INFINITY)) {
        distances.set(link.to, nextDistance);
        previous.set(link.to, current);
      }
    }
  }

  if (!distances.has(destinationId)) return null;
  const path = [destinationId];
  while (path[0] !== startId) {
    const predecessor = previous.get(path[0]);
    if (!predecessor) return null;
    path.unshift(predecessor);
  }

  const routePoints = simplifyPolyline(path
    .map((id) => nodes.get(id))
    .filter((node): node is GraphNode => Boolean(node))
    .map(({ x: pointX, y: pointY }) => ({ x: pointX, y: pointY }))
    .filter((point, index, points) => index === 0 || distance(point, points[index - 1]) > 0.1));
  const locationById = new Map(locations.map((location) => [location.id, location]));
  const spinePath = path.filter((id) => spineNodeById.has(id));
  const landmarkIds = spinePath.flatMap((id) => landmarksBySpine[id] ?? []);
  const waypoints = preferredLandmarks
    .filter((id) => landmarkIds.includes(id))
    .map((id) => locationById.get(id))
    .filter((location): location is CampusLocation =>
      location !== undefined && location.id !== originId && location.id !== destinationId)
    .slice(0, 3);
  const originName = originId === CURRENT_LOCATION_ID ? "sua localização atual" : locationById.get(originId)?.name ?? "o ponto de origem";
  const destinationLocation = locationById.get(destinationId);
  const steps = [`Saia de ${originName} em direção ao corredor principal do Térreo.`];

  if (spinePath.length > 1 && waypoints.length) {
    steps.push(`Siga reto pelo corredor principal passando próximo a ${waypoints.map(({ name }) => name).join(", ")}.`);
  }
  if (destinationLocation) {
    const firstDirection = destinationLocation.directions?.[0];
    steps.push(`Siga até ${destinationLocation.name}${firstDirection ? `. ${firstDirection}` : ""}`);
  }

  return { points: routePoints, waypoints, steps };
}

function simplifyPolyline(points: TerreoPoint[]): TerreoPoint[] {
  const simplified: TerreoPoint[] = [];
  for (const point of points) {
    while (simplified.length >= 2) {
      const a = simplified[simplified.length - 2];
      const b = simplified[simplified.length - 1];
      const ab = { x: b.x - a.x, y: b.y - a.y };
      const bc = { x: point.x - b.x, y: point.y - b.y };
      const cross = ab.x * bc.y - ab.y * bc.x;
      const continuesForward = ab.x * bc.x + ab.y * bc.y >= 0;
      if (Math.abs(cross) > 0.1 || !continuesForward) break;
      simplified.pop();
    }
    simplified.push(point);
  }
  return simplified;
}
