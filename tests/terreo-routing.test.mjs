import assert from "node:assert/strict";
import { test } from "node:test";
import { getLocations } from "../src/data/catalog.ts";
import { decodePlusCode } from "../src/lib/plus-code.ts";
import {
  calculateTerreoRoute,
  CURRENT_LOCATION_ID,
  projectGpsToTerreoSvg,
} from "../src/lib/terreo-routing.ts";

const locations = getLocations().filter((location) => location.svgCoords && location.floor === "Térreo");

test("calcula rota pelo corredor e inclui referências na ordem percorrida", () => {
  const route = calculateTerreoRoute("entrada-rua", "sala-cix", locations);

  assert.ok(route);
  assert.deepEqual(route.points[0], { x: 68, y: 189 });
  assert.deepEqual(route.points.at(-1), { x: 135, y: 662 });
  assert.deepEqual(
    route.waypoints.map(({ id }) => id),
    ["estatua-pensador", "matriculas", "cafe-cb"],
  );
  assert.equal(route.steps.length, 3);
  assert.match(route.steps[0], /^Saia de Entrada Principal/);
  assert.match(route.steps[1], /Estátua do Pensador, Central de Matrícula, Café/);
  assert.match(route.steps[2], /^Siga até Sala CIX\./);
  assert.ok(route.points.length < 8);
  assert.ok(!route.points.some(({ x, y }) => x === 142 && [245, 270, 313].includes(y)));
});

test("usa a posição projetada como origem de uma rota", () => {
  const route = calculateTerreoRoute(
    CURRENT_LOCATION_ID,
    "cafe-cb",
    locations,
    { x: 68, y: 189 },
  );

  assert.ok(route);
  assert.deepEqual(route.points[0], { x: 68, y: 189 });
  assert.deepEqual(route.points.at(-1), { x: 165, y: 432 });
  assert.match(route.steps[0], /localização atual/);
});

test("projeta referências medidas e rejeita posições fora do campus", () => {
  const entrance = decodePlusCode("689QFPX7+4X");
  const entrancePosition = projectGpsToTerreoSvg(entrance.latitude, entrance.longitude);
  assert.ok(entrancePosition && entrancePosition.x > 120 && entrancePosition.x < 145);
  assert.ok(entrancePosition && entrancePosition.y > 189 && entrancePosition.y < 200);
  const studentSupport = decodePlusCode("689QFPW7+RP");
  const snapped = projectGpsToTerreoSvg(studentSupport.latitude, studentSupport.longitude);
  assert.ok(snapped && snapped.x < 160 && snapped.y < 315);
  assert.equal(projectGpsToTerreoSvg(0, 0), null);
});
