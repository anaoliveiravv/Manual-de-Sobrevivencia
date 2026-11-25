import assert from "node:assert/strict";
import { test } from "node:test";
import { getLocation, getLocationAddress } from "../src/data/catalog.ts";

test("exibe a referência do pátio e mantém ausentes as orientações sem validação", () => {
  const support = getLocation("apoio");
  assert.equal(getLocationAddress(support), "Pátio principal");
  assert.deepEqual(support.referencePoints, ["Próximo às quatro televisões."]);
  assert.equal(support.directions, undefined);
});

test("só divulga bloco e andar de um local validado", () => {
  const data = { ...getLocation("matriculas"), building: "Bloco A", floor: "1º andar" };
  assert.equal(getLocationAddress(data), "");
  assert.equal(getLocationAddress({ ...data, verificationStatus: "demo" }), "");
  assert.equal(getLocationAddress({ ...data, verificationStatus: "verified" }), "Bloco A · 1º andar");
});
