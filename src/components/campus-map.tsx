"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Copy, MapPin, LocateFixed } from "lucide-react";
import campusImage from "@/assets/campus.png";
import floorMapImage from "@/assets/mapa-terreo.svg";
import { campusAreas, getCampusArea, type CampusLocation } from "@/data/catalog";
import { decodePlusCode, encodePlusCode } from "@/lib/plus-code";

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
  const selected = locations.find(({ id }) => id === selectedId);
  const areaLocations = locations.filter((location) => getCampusArea(location) === selectedArea);
  const floorLocations = areaLocations.filter((location) =>
    location.svgPinId &&
    location.svgCoords &&
    (building === "Todos" || location.building === building) &&
    (floor === "Todos" || location.floor === floor),
  );
  const mappedLocations = areaLocations.filter((location) => location.mapCoords);

  function selectLocation(location: CampusLocation) {
    const params = new URLSearchParams(window.location.search);
    params.set("local", location.id);
    params.set("area", getCampusArea(location));
    router.replace(`/mapa?${params.toString()}`, { scroll: false });
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
      { enableHighAccuracy: false, timeout: 10000 },
    );
  }

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
        <h2 id="floor-map-title">Mapa do Térreo</h2>
        <p>Mapa interativo do Térreo. Selecione um pino ou filtre os locais.</p>
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
      {selected ? <div className="campus-map-code map-location-detail">
        <div>
          <strong>{selected.name}</strong>
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
