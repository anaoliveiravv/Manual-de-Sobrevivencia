"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Copy, MapPin, LocateFixed, Route } from "lucide-react";
import campusImage from "@/assets/campus.png";
import floorMapImage from "@/assets/mapa-terreo.svg";
import { campusAreas, getCampusArea, type CampusLocation } from "@/data/catalog";
import { decodePlusCode, encodePlusCode } from "@/lib/plus-code";
import {
  calculateTerreoRoute,
  CURRENT_LOCATION_ID,
  projectGpsToTerreoSvg,
  type TerreoPoint,
} from "@/lib/terreo-routing";

const buildings = ["Todos", "Pátio Principal", "Prédio I", "Prédio II", "Prédio III", "Prédio IV", "Prédio V"];
const floors = ["Todos", "Subsolo", "Térreo", "Sobreloja", "1º Andar", "2º Andar", "3º Andar", "4º Andar", "5º Andar"];

type Props = {
  locations: CampusLocation[];
  selectedId?: string;
  selectedArea: string;
};

export function CampusMap({ locations, selectedId, selectedArea }: Props) {
  const router = useRouter();
  const [building, setBuilding] = useState("Todos");
  const [floor, setFloor] = useState("Todos");
  const [imageFailed, setImageFailed] = useState(false);
  const [userPlusCode, setUserPlusCode] = useState("");
  const [feedback, setFeedback] = useState("");
  const [locating, setLocating] = useState(false);
  const [routeOrigin, setRouteOrigin] = useState("");
  const [routeDestination, setRouteDestination] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [userSvgPos, setUserSvgPos] = useState<TerreoPoint | null>(null);
  const [trackingWarning, setTrackingWarning] = useState("");
  const watchId = useRef<number | null>(null);
  const selected = locations.find(({ id }) => id === selectedId);
  const areaLocations = locations.filter((location) => getCampusArea(location) === selectedArea);
  const floorLocations = areaLocations.filter((location) =>
    location.svgPinId &&
    location.svgCoords &&
    (building === "Todos" || location.building === building) &&
    (floor === "Todos" || location.floor === floor),
  );
  const mappedLocations = areaLocations.filter((location) => location.mapCoords);
  const activeRoute = routeOrigin && routeDestination
    ? calculateTerreoRoute(routeOrigin, routeDestination, floorLocations, userSvgPos)
    : null;
  const routeOriginName = routeOrigin === CURRENT_LOCATION_ID
    ? "Minha localização atual"
    : floorLocations.find(({ id }) => id === routeOrigin)?.name ?? "Origem";
  const routeDestinationName = floorLocations.find(({ id }) => id === routeDestination)?.name ?? "Destino";

  function selectLocation(location: CampusLocation) {
    const params = new URLSearchParams(window.location.search);
    params.set("local", location.id);
    params.set("area", getCampusArea(location));
    router.replace(`/mapa?${params.toString()}`, { scroll: false });
    if (location.svgCoords && floorLocations.some(({ id }) => id === location.id) && routeOrigin && !routeDestination) {
      setRouteDestination(location.id);
    }
  }

  function selectArea(area: string) {
    const params = new URLSearchParams(window.location.search);
    params.set("area", area);
    const firstLocation = locations.find((location) => getCampusArea(location) === area);
    if (firstLocation) params.set("local", firstLocation.id);
    else params.delete("local");
    router.replace(`/mapa?${params.toString()}`, { scroll: false });
  }

  async function copyPlusCode() {
    if (!selected?.plusCode) return;
    try {
      await navigator.clipboard.writeText(selected.plusCode);
      setFeedback("Plus Code copiado.");
    } catch {
      setFeedback("Não foi possível copiar o Plus Code neste navegador.");
    }
  }

  function locateUser() {
    if (!navigator.geolocation) {
      setFeedback("Este navegador não disponibiliza localização.");
      return;
    }
    setLocating(true);
    setFeedback("");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setUserPlusCode(encodePlusCode(coords.latitude, coords.longitude));
        setLocating(false);
      },
      () => {
        setFeedback("Não foi possível obter sua localização. Verifique a permissão do navegador.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  function stopTracking() {
    if (watchId.current !== null) {
      navigator.geolocation?.clearWatch(watchId.current);
      watchId.current = null;
    }
    setIsTracking(false);
    setUserSvgPos(null);
    setRouteOrigin((current) => current === CURRENT_LOCATION_ID ? "" : current);
    setTrackingWarning("");
  }

  function startTracking() {
    if (!navigator.geolocation) {
      setTrackingWarning("Este navegador não disponibiliza localização.");
      return;
    }
    setTrackingWarning("Aguardando sinal GPS...");
    if (!routeOrigin) setRouteOrigin(CURRENT_LOCATION_ID);
    try {
      watchId.current = navigator.geolocation.watchPosition(
        ({ coords }) => {
          setUserPlusCode(encodePlusCode(coords.latitude, coords.longitude));
          const position = projectGpsToTerreoSvg(coords.latitude, coords.longitude);
          setUserSvgPos(position);
          setTrackingWarning(position ? "" : "Sua localização foi detectada fora da área navegável do Térreo.");
        },
        () => {
          if (watchId.current !== null) {
            navigator.geolocation.clearWatch(watchId.current);
            watchId.current = null;
          }
          setIsTracking(false);
          setUserSvgPos(null);
          setRouteOrigin((current) => current === CURRENT_LOCATION_ID ? "" : current);
          setTrackingWarning("Não foi possível acompanhar sua posição. Verifique a permissão de localização do navegador.");
        },
        { enableHighAccuracy: true, maximumAge: 1000, timeout: 10000 },
      );
      setIsTracking(true);
    } catch {
      watchId.current = null;
      setTrackingWarning("Não foi possível iniciar o rastreamento de localização.");
    }
  }

  function toggleTracking() {
    if (isTracking) stopTracking();
    else startTracking();
  }

  useEffect(() => () => {
    if (watchId.current !== null) navigator.geolocation?.clearWatch(watchId.current);
  }, []);

  const userArea = userPlusCode ? decodePlusCode(userPlusCode) : undefined;

  return <div className="campus-map">
    <nav className="campus-area-filter" aria-label="Filtrar por área do campus">
      {campusAreas.map(({ id, name }) => <button
        key={id}
        type="button"
        className="secondary"
        aria-current={selectedArea === id ? "true" : undefined}
        onClick={() => selectArea(id)}
      >{name}</button>)}
    </nav>
    <section className="campus-map-section" aria-labelledby="external-map-title">
      <div className="campus-map-heading">
        <h2 id="external-map-title">Visão externa · Campus</h2>
        <p>Selecione um pino para consultar o código da entrada.</p>
      </div>
      <div className={`campus-map-canvas${imageFailed ? " campus-map-fallback" : ""}`} role="group" aria-label="Mapa externo do campus">
        {!imageFailed ? <Image
          src={campusImage}
          alt="Planta externa do campus"
          fill
          sizes="(max-width: 46rem) 100vw, 46rem"
          onError={() => setImageFailed(true)}
          className="campus-map-image"
        /> : <div className="campus-map-schematic" aria-hidden="true">
          <span className="schematic-green" />
          <span className="schematic-block schematic-block-one">Prédio I</span>
          <span className="schematic-block schematic-block-two">Prédio II</span>
          <span className="schematic-block schematic-block-three">Prédio III</span>
          <span className="schematic-block schematic-block-four">Prédio IV</span>
          <span className="schematic-block schematic-block-five">Prédio V</span>
          <span className="schematic-patio">Pátio Principal</span>
        </div>}
        {mappedLocations.map((location) => <button
          key={location.id}
          type="button"
          className="campus-map-pin"
          style={{ left: `${location.mapCoords?.x}%`, top: `${location.mapCoords?.y}%` }}
          aria-label={`Selecionar ${location.name}`}
          aria-current={selected?.id === location.id ? "true" : undefined}
          onClick={() => selectLocation(location)}
        >
          <MapPin size={20} aria-hidden="true" />
          <span>{location.name}</span>
        </button>)}
      </div>
    </section>

    <section className="campus-map-section" aria-labelledby="floor-map-title">
      <div className="campus-map-heading">
        <h2 id="floor-map-title">Navegação interativa · Térreo</h2>
        <p>Trace uma rota entre os espaços ou acompanhe sua posição em tempo real.</p>
      </div>
      <div className="campus-map-filters">
        <label className="field">
          Prédio
          <select value={building} onChange={(event) => setBuilding(event.target.value)} aria-label="Filtrar por prédio">
            {buildings.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="field">
          Andar
          <select value={floor} onChange={(event) => setFloor(event.target.value)} aria-label="Filtrar por andar">
            {floors.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
      </div>
      <div className="route-planner">
        <label className="field">
          Origem
          <select value={routeOrigin} onChange={(event) => setRouteOrigin(event.target.value)} aria-label="Origem da rota">
            <option value="">Selecione a origem...</option>
            {isTracking ? <option value={CURRENT_LOCATION_ID}>Minha localização atual</option> : null}
            {floorLocations.map((location) => <option key={location.id} value={location.id}>{location.name}</option>)}
          </select>
        </label>
        <label className="field">
          Destino
          <select value={routeDestination} onChange={(event) => setRouteDestination(event.target.value)} aria-label="Destino da rota">
            <option value="">Selecione o destino...</option>
            {floorLocations.map((location) => <option key={location.id} value={location.id}>{location.name}</option>)}
          </select>
        </label>
        <div className="route-planner-actions">
          <button type="button" className="secondary" onClick={toggleTracking}>
            <LocateFixed size={17} aria-hidden="true" />
            {isTracking ? "Parar rastreamento" : "Acompanhar minha posição"}
          </button>
          {routeDestination ? <button
            type="button"
            className="secondary"
            onClick={() => {
              setRouteOrigin("");
              setRouteDestination("");
              setTrackingWarning("");
            }}
          >Limpar rota</button> : null}
        </div>
        {trackingWarning ? <p className="tracking-warning" role="status">{trackingWarning}</p> : null}
      </div>
      <div className="floor-map-legend" aria-label="Legenda das cores dos pinos">
        <span><i className="legend-entrance" />Entradas do campus</span>
        <span><i className="legend-sector" />Setores principais</span>
        <span><i className="legend-reference" />Pontos de referência e serviços</span>
        <span><i className="legend-bathroom" />Banheiros</span>
      </div>
      <div className="floor-map" role="group" aria-label="Mapa vetorial interativo do Térreo">
        <div className="floor-map-svg">
          <Image
            src={floorMapImage}
            alt="Planta vetorial do Térreo com pinos de entradas, setores, serviços e banheiros"
            fill
            sizes="(max-width: 46rem) 100vw, 430px"
          />
          {activeRoute?.points.length ? <svg className="floor-map-overlay" viewBox="0 0 430 720" aria-hidden="true">
            <polyline
              className="floor-route-outline"
              points={activeRoute.points.map(({ x, y }) => `${x},${y}`).join(" ")}
            />
            <polyline
              className="floor-route-line"
              points={activeRoute.points.map(({ x, y }) => `${x},${y}`).join(" ")}
            />
            <circle className="floor-route-start" cx={activeRoute.points[0].x} cy={activeRoute.points[0].y} r="6" />
            <circle
              className="floor-route-end"
              cx={activeRoute.points[activeRoute.points.length - 1].x}
              cy={activeRoute.points[activeRoute.points.length - 1].y}
              r="6"
            />
          </svg> : null}
          {isTracking && userSvgPos ? <svg className="floor-map-overlay user-position-overlay" viewBox="0 0 430 720" aria-hidden="true">
            <circle className="user-position-pulse" cx={userSvgPos.x} cy={userSvgPos.y} r="9" />
            <circle className="user-position-dot" cx={userSvgPos.x} cy={userSvgPos.y} r="5" />
          </svg> : null}
          {floorLocations.map((location) => <button
            key={location.id}
            type="button"
            className="floor-map-svg-pin"
            style={{
              left: `${(location.svgCoords!.x / 430) * 100}%`,
              top: `${(location.svgCoords!.y / 720) * 100}%`,
              color: location.svgPinType === "entrance" ? "#EF4444"
                : location.svgPinType === "sector" ? "#6366F1"
                  : location.svgPinType === "bathroom" ? "#6EE7B7" : "#F59E0B",
            }}
            data-svg-pin-id={location.svgPinId}
            title={location.name}
            aria-label={`Selecionar ${location.name}`}
            aria-current={selected?.id === location.id ? "true" : undefined}
            onClick={() => selectLocation(location)}
          />)}
        </div>
        {!floorLocations.length ? <p className="floor-map-empty">Nenhum local cadastrado neste prédio e andar.</p> : null}
      </div>
      {activeRoute ? <section className="route-summary" aria-labelledby="route-summary-title">
        <h3 id="route-summary-title">Rota: {routeOriginName} → {routeDestinationName}</h3>
        {activeRoute.waypoints.length ? <p><strong>Pontos de referência:</strong> {activeRoute.waypoints.map(({ name }) => name).join(" · ")}</p> : null}
        <ol>{activeRoute.steps.map((step, index) => <li key={`${index}-${step}`}>{step}</li>)}</ol>
      </section> : null}
      {selected ? <div className="campus-map-code map-location-detail">
        <div>
          <strong>{selected.name}</strong>
          {selected.image ? <div className="location-photo-frame">
            <Image
              src={selected.image}
              alt={selected.imageAlt ?? selected.name}
              fill
              sizes="(max-width: 46rem) 100vw, 46rem"
              className="location-photo"
            />
          </div> : null}
          {selected.svgPinType === "entrance" ? <>
            <span>Plus Code aproximado da entrada</span>
            <code>{selected.plusCode ?? "Plus Code indisponível"}</code>
            {selected.directions?.map((direction) => <p key={direction}>{direction}</p>)}
          </> : <>
            <p>{selected.description}</p>
            {selected.location ? <p><strong>Localização:</strong> {selected.location}</p> : null}
            {selected.svgPinType === "sector" ? <>
              {selected.openingHours ? <p><strong>Horário:</strong> {selected.openingHours}</p> : null}
              {selected.services?.length ? <div><strong>Serviços</strong><ul>{selected.services.map((service) => <li key={service}>{service}</li>)}</ul></div> : null}
              {selected.directions?.length ? <div><strong>Como chegar</strong><ul>{selected.directions.map((direction) => <li key={direction}>{direction}</li>)}</ul></div> : null}
            </> : null}
          </>}
        </div>
        <div className="campus-map-actions">
          {selected.plusCode ? <button type="button" className="secondary" onClick={copyPlusCode}>
            <Copy size={17} aria-hidden="true" /> Copiar Plus Code
          </button> : null}
          {floorLocations.some(({ id }) => id === selected.id) ? <button
            type="button"
            className="secondary"
            onClick={() => setRouteDestination(selected.id)}
          >
            <Route size={17} aria-hidden="true" /> Traçar rota até aqui
          </button> : null}
          <button type="button" className="secondary" onClick={locateUser} disabled={locating}>
            <LocateFixed size={17} aria-hidden="true" /> {locating ? "Localizando…" : "Minha localização (Plus Code)"}
          </button>
          {selected.svgPinType === "sector" ? <Link className="secondary" href={`/locais/${selected.id}`}>
            <MapPin size={17} aria-hidden="true" /> Ver detalhes do local
          </Link> : null}
        </div>
        {userPlusCode ? <p className="user-plus-code" aria-live="polite">
          Sua localização aproximada: <code>{userPlusCode}</code>
          {userArea ? <small>Área: {userArea.latitude.toFixed(5)}, {userArea.longitude.toFixed(5)}</small> : null}
        </p> : null}
        {feedback ? <p className="map-feedback" role="status">{feedback}</p> : null}
      </div> : null}
      {!selected ? <div className="campus-map-actions">
        <button type="button" className="secondary" onClick={locateUser} disabled={locating}>
          <LocateFixed size={17} aria-hidden="true" /> {locating ? "Localizando…" : "Minha localização (Plus Code)"}
        </button>
        {userPlusCode ? <p className="user-plus-code" aria-live="polite">Sua localização aproximada: <code>{userPlusCode}</code></p> : null}
        {feedback ? <p className="map-feedback" role="status">{feedback}</p> : null}
      </div> : null}
    </section>
  </div>;
}
