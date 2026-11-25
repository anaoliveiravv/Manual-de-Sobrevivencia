export const categories = {
  salas: "Salas",
  laboratorios: "Laboratórios",
  setores: "Setores",
  banheiros: "Banheiros",
  servicos: "Serviços",
  outros: "Outros espaços",
} as const;

export type LocationCategory = keyof typeof categories;
export type VerificationStatus = "verified" | "pending" | "demo";
export type FAQ = { question: string; answer: string };

export interface CampusLocation {
  id: string;
  name: string;
  category: LocationCategory;
  description: string;
  keywords: string[];
  verificationStatus: VerificationStatus;
  area?: string;
  building?: string;
  floor?: string;
  location?: string;
  referencePoints?: string[];
  services?: string[];
  openingHours?: string;
  directions?: string[];
  faq?: FAQ[];
}

const verifiedLocations: CampusLocation[] = [
  {
    id: "apoio", name: "Apoio ao Aluno", category: "setores",
    description: "Orienta estudantes e visitantes, fornece informações sobre a universidade e encaminha para outros setores. Também realiza atividades relacionadas ao cadastro facial.",
    location: "Pátio principal",
    referencePoints: ["Próximo às quatro televisões."],
    services: ["Orientação sobre localização de espaços", "Informações sobre setores e eventos", "Encaminhamento de estudantes e visitantes", "Cadastro facial"],
    keywords: ["atendimento", "orientação", "cadastro facial"],
    area: "patio", verificationStatus: "verified",
    faq: [{ question: "De onde vem a referência de localização?", answer: "A referência às quatro televisões foi registrada em entrevista pela equipe do projeto." }],
  },
];

const pendingLocations: CampusLocation[] = [
  { id: "matriculas", name: "Central de Matrículas", category: "setores", description: "Consulte o setor para dúvidas relacionadas à matrícula.", services: ["Orientação sobre matrícula"], keywords: ["matricula", "ingresso", "inscrição"], verificationStatus: "pending" },
  { id: "rh", name: "Recursos Humanos", category: "setores", description: "Setor citado na investigação da equipe. A localização e os serviços de atendimento aguardam confirmação.", keywords: ["rh", "funcionários"], verificationStatus: "pending" },
  { id: "informatica", name: "Laboratórios de Informática", category: "laboratorios", description: "Consulte este registro ao procurar laboratórios de informática do campus.", keywords: ["computadores", "ti", "lab", "software"], verificationStatus: "pending" },
  { id: "coordenacoes", name: "Coordenações", category: "setores", description: "Consulte a coordenação do seu curso para orientações acadêmicas. As localizações aguardam confirmação.", keywords: ["curso", "coordenador", "coordenação"], verificationStatus: "pending" },
  { id: "pas", name: "PAS", category: "servicos", description: "O PAS foi um dos destinos pesquisados pela equipe. Os detalhes de atendimento aguardam confirmação.", keywords: ["pas", "atendimento"], verificationStatus: "pending" },
  { id: "central-atendimento", name: "Central de Atendimento", category: "setores", description: "Consulte este registro ao procurar a Central de Atendimento. A equipe ainda vai confirmar os serviços e a localização.", keywords: ["atendimento", "central"], verificationStatus: "pending" },
];

const demoLocations: CampusLocation[] = [
  { id: "salas-exemplo", name: "Salas de aula", category: "salas", description: "Exemplo de como as salas poderão aparecer quando o catálogo receber dados do campus.", keywords: ["aula", "turma"], verificationStatus: "demo" },
  { id: "banheiros-exemplo", name: "Banheiros e acessos", category: "banheiros", description: "Registro ilustrativo para a futura inclusão de banheiros e informações de acesso.", keywords: ["acessibilidade", "banheiro", "sanitário"], verificationStatus: "demo" },
  { id: "convivencia-exemplo", name: "Espaços de convivência", category: "outros", description: "Registro ilustrativo para a futura inclusão de espaços de convivência.", keywords: ["convivência", "intervalo"], verificationStatus: "demo" },
];

export const campusAreas = [
  { id: "patio", name: "Pátio principal", description: "Área citada nas entrevistas da equipe." },
  { id: "pendentes", name: "Locais a confirmar", description: "Registros com localização pendente." },
  { id: "exemplos", name: "Exemplos de espaços", description: "Registros demonstrativos do catálogo." },
];

export const serviceAssociations = [
  { locationId: "apoio", phrases: ["cadastro facial", "localização", "orientação"], verified: true },
  { locationId: "matriculas", phrases: ["matrícula"], verified: true },
  { locationId: "rh", phrases: ["folha de pagamento"], verified: false },
];

const locations = [...verifiedLocations, ...pendingLocations, ...demoLocations];
const featuredIds = ["apoio", "matriculas", "rh", "informatica", "coordenacoes", "pas"];

export function getLocations() { return locations; }
export function getLocation(id: string) { return locations.find((location) => location.id === id); }
export function getFeaturedLocations() { return featuredIds.flatMap((id) => getLocation(id) ?? []); }
export function getDepartments() {
  return locations.filter((location) => location.category === "setores" || location.id === "pas");
}

export function getCampusArea(location: CampusLocation) {
  return location.area ?? (location.verificationStatus === "demo" ? "exemplos" : "pendentes");
}

export function getLocationAddress(location: CampusLocation) {
  if (location.verificationStatus !== "verified") return "";
  return [location.building, location.floor, location.location].filter(Boolean).join(" · ");
}
