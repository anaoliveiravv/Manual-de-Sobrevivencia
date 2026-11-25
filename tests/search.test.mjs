import assert from "node:assert/strict";
import { test } from "node:test";
import { filterLocations, matchService } from "../src/lib/search.ts";
import { getLocations } from "../src/data/catalog.ts";

const locations = getLocations();
const ids = (results) => results.map(({ id }) => id);

test("busca ignora caixa, acentos e espaços extras", () => {
  assert.deepEqual(ids(filterLocations(locations, { query: "  MATRICULA " })), ["matriculas"]);
  assert.deepEqual(ids(filterLocations(locations, { query: "matrícula" })), ["matriculas"]);
});

test("busca termos em campos diferentes e combina os filtros", () => {
  const item = { ...locations[0], building: "Bloco Z", floor: "2º andar" };
  assert.deepEqual(ids(filterLocations([item], { query: "cadastro z 2º", building: "Bloco Z", floor: "2º andar", category: "setores" })), [item.id]);
  assert.deepEqual(filterLocations([item], { building: "Bloco Y" }), []);
  assert.deepEqual(filterLocations(locations, { query: "informática", category: "banheiros" }), []);
});

test("filtros por categoria e área preservam o status de validação", () => {
  assert.deepEqual(ids(filterLocations(locations, { category: "laboratorios" })), ["informatica"]);
  assert.deepEqual(ids(filterLocations(locations, { area: "patio" })), ["apoio"]);
  assert.equal(filterLocations(locations, { category: "salas" })[0].verificationStatus, "demo");
});

test("serviços aceitam frases e só encaminham para associações validadas", () => {
  assert.deepEqual(matchService("Quero resolver uma dúvida sobre matrícula."), ["matriculas"]);
  assert.deepEqual(matchService("cadastro facial"), ["apoio"]);
  assert.deepEqual(matchService("quero folha de pagamento"), []);
  assert.deepEqual(matchService("  "), []);
});
