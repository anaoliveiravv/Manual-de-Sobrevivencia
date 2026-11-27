const alphabet = "23456789CFGHJMPQRVWX";
const pairResolutions = [20, 1, 0.05, 0.0025, 0.000125];

export type PlusCodeArea = {
  south: number;
  west: number;
  north: number;
  east: number;
  latitude: number;
  longitude: number;
};

export function encodePlusCode(latitude: number, longitude: number) {
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
    throw new RangeError("A latitude deve estar entre -90 e 90.");
  }
  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    throw new RangeError("A longitude deve estar entre -180 e 180.");
  }

  let lat = latitude === 90 ? latitude - 1e-10 : latitude;
  let lon = longitude === 180 ? longitude - 1e-10 : longitude;
  let code = "";

  for (const resolution of pairResolutions) {
    const latDigit = Math.min(19, Math.floor((lat + 90) / resolution));
    const lonDigit = Math.min(19, Math.floor((lon + 180) / resolution));
    code += alphabet[latDigit] + alphabet[lonDigit];
    lat -= latDigit * resolution;
    lon -= lonDigit * resolution;
  }

  return `${code.slice(0, 8)}+${code.slice(8)}`;
}

export function decodePlusCode(code: string): PlusCodeArea {
  const normalized = code.toUpperCase();
  if (normalized.length !== 11 || normalized[8] !== "+") {
    throw new TypeError("Use um Plus Code completo de 10 dígitos.");
  }

  const digits = normalized.slice(0, 8) + normalized.slice(9);
  if ([...digits].some((digit) => !alphabet.includes(digit))) {
    throw new TypeError("O Plus Code contém caracteres inválidos.");
  }

  let south = -90;
  let west = -180;
  for (let index = 0; index < pairResolutions.length; index += 1) {
    const resolution = pairResolutions[index];
    const latDigit = alphabet.indexOf(digits[index * 2]);
    const lonDigit = alphabet.indexOf(digits[index * 2 + 1]);
    south += latDigit * resolution;
    west += lonDigit * resolution;
  }

  const resolution = pairResolutions[pairResolutions.length - 1];
  return {
    south,
    west,
    north: south + resolution,
    east: west + resolution,
    latitude: south + resolution / 2,
    longitude: west + resolution / 2,
  };
}
