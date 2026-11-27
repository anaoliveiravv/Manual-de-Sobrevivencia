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
  plusCode?: string;
  mapCoords?: { x: number; y: number };
  svgPinId?: string;
  svgCoords?: { x: number; y: number };
  svgPinType?: "entrance" | "sector" | "reference" | "bathroom";
  location?: string;
  image?: string;
  imageAlt?: string;
  referencePoints?: string[];
  services?: string[];
  openingHours?: string;
  directions?: string[];
  faq?: FAQ[];
}

const verifiedLocations: CampusLocation[] = [
  {
    id: "apoio",
    name: "Apoio ao Aluno",
    image: "/locais/apoio.jpeg",
    imageAlt: "Balcão Posso Ajudar com 4 telas de TV no Pátio Principal",
    category: "setores",
    description:
      "Central de acolhimento e triagem presencial no Pátio Principal. Realiza cadastro e validação de reconhecimento facial para catracas, orienta sobre localização de espaços e encaminha demandas específicas.",
    location: "Pátio Principal (balcão 'Posso Ajudar?' com 4 telas de TV) · Térreo",
    building: "Pátio Principal",
    floor: "Térreo",
    plusCode: "689QFPW7+WV",
    mapCoords: { x: 49, y: 36 },
    svgPinId: "pino-posso-ajudar",
    svgCoords: { x: 92, y: 224 },
    svgPinType: "sector",
    openingHours: "Segunda a sexta-feira, das 8h às 19h (atendimento presencial por ordem de chegada).",
    referencePoints: [
      "Balcão de madeira com a identificação 'POSSO AJUDAR?' e 4 telas de TV no Pátio Principal.",
      "Localizado logo à direita de quem está olhando de frente para a Estátua do Pensador.",
    ],
    services: [
      "Cadastro e validação de Reconhecimento Facial para acesso às catracas",
      "Orientação sobre localização de salas, blocos e setores",
      "Informações sobre rotina acadêmica e eventos",
      "Triagem e encaminhamento para setores responsáveis",
    ],
    directions: [
      "Ao entrar pela Rua Anapurus e avistar a Estátua do Pensador, olhe à direita para localizar o balcão 'Posso Ajudar?' com 4 telas de TV.",
      "Tenha o número do seu RA (Registro Acadêmico) em mãos antes de iniciar o atendimento.",
    ],
    keywords: ["atendimento", "orientação", "cadastro facial", "biometria", "catraca", "ra", "pátio"],
    area: "patio",
    verificationStatus: "verified",
    faq: [
      {
        question: "O que preciso levar para fazer o cadastro facial?",
        answer: "É indispensável informar ou saber de cor o número do seu RA (Registro Acadêmico). Sem o RA não é possível consultar o sistema nem liberar o cadastro.",
      },
      {
        question: "Dúvidas de matrícula são resolvidas aqui?",
        answer: "Não. Questões de matrícula, rematrícula ou contrato são encaminhadas para a Central de Matrícula.",
      },
    ],
  },
  {
    id: "matriculas",
    name: "Central de Matrícula",
    image: "/locais/matriculas.jpeg",
    imageAlt: "Entrada da Central de Matrícula ao lado da Praça da Gratidão",
    category: "setores",
    description:
      "Formaliza o vínculo do estudante com a universidade, realiza atendimento presencial dedicado a bolsas PROUNI e FIES, emite crachás institucionais e esclarece dúvidas sobre contratos e mensalidades iniciais.",
    location: "Térreo · Em frente à Praça da Gratidão, ao lado do Banco e da rampa principal",
    building: "Pátio Principal",
    floor: "Térreo",
    plusCode: "689QFPW7+VJ",
    mapCoords: { x: 25, y: 42 },
    svgPinId: "pino-central-matricula",
    svgCoords: { x: 143, y: 381 },
    svgPinType: "sector",
    openingHours: "Segunda a sexta-feira, das 08h às 20h (atenção: atendimento presencial encerra a partir do dia 15 de cada mês).",
    referencePoints: [
      "Térreo — em frente à Praça da Gratidão.",
      "Localizada imediatamente ao lado do Banco Santander e do início da rampa que segue reto pelo corredor.",
    ],
    services: [
      "Formalização de matrícula de ingressantes",
      "Atendimento presencial PROUNI e FIES em sala dedicada",
      "Emissão e entrega de crachás institucionais (aulas, laboratórios e estágios)",
      "Atualização cadastral, troca de e-mail/telefone e senhas do portal",
      "Esclarecimento sobre mensalidades, contratos e alteração de matriz inicial",
    ],
    directions: [
      "No Térreo, vá até a Praça da Gratidão; a entrada da Central de Matrícula fica em frente à praça, ao lado do Banco e da rampa.",
      "Canais remotos: WhatsApp (98) 99178-1978 ou e-mail matricula.vestibular@ceuma.br.",
    ],
    keywords: ["matricula", "ingresso", "inscrição", "prouni", "fies", "crachá", "senha", "cadastro"],
    area: "patio",
    verificationStatus: "verified",
    faq: [
      {
        question: "O setor funciona presencialmente o mês inteiro?",
        answer: "Não. O atendimento presencial da Central de Matrícula encerra suas atividades mensais a partir do dia 15 de cada mês.",
      },
      {
        question: "Quais são os canais de contato remoto?",
        answer: "WhatsApp oficial (98) 99178-1978 e e-mail matricula.vestibular@ceuma.br.",
      },
    ],
  },
  {
    id: "central-atendimento",
    name: "Central de Atendimento ao Estudante (CAA)",
    image: "/locais/central-atendimento.jpeg",
    imageAlt: "Entrada de vidro da Central de Atendimento ao Estudante (CAA)",
    category: "setores",
    description:
      "Porta de entrada oficial para protocolos institucionais, entrega e retirada de provas (inclusive de semestres anteriores) e trâmites acadêmico-financeiros presenciais.",
    location: "Térreo · Corredor principal após o Apoio ao Aluno, próximo à Praça da Gratidão e ao Banco",
    building: "Pátio Principal",
    floor: "Térreo",
    plusCode: "689QFPW7+RP",
    mapCoords: { x: 68, y: 46 },
    svgPinId: "pino-central-atendimento",
    svgCoords: { x: 172, y: 313 },
    svgPinType: "sector",
    openingHours: "Segunda a sexta-feira, das 8h às 17h. Sábados específicos (com agendamento prévio), das 8h às 13h.",
    referencePoints: [
      "Térreo, seguindo reto após o balcão do Apoio ao Aluno (à esquerda do corredor), próximo à Praça da Gratidão.",
      "Ao lado do Banco Santander e da Central de Matrícula (o atendimento virtual funciona no 2º Andar).",
    ],
    services: [
      "Triagem e abertura de protocolos institucionais",
      "Entrega, recebimento e retirada de provas e avaliações",
      "Transferência de bolsa e alteração de contratante/responsável financeiro",
      "Assinatura de renovação semestral ProUni e suporte a aditamento FIES",
      "Orientação sobre serviços migrados para o Portal do Aluno",
    ],
    directions: [
      "Seguindo reto pelo corredor principal depois do Apoio ao Aluno ('Posso Ajudar?'), olhe para a esquerda perto da Praça da Gratidão para encontrar a porta de vidro da Central de Atendimento.",
      "O atendimento presencial funciona por senhas ou agendamento prévio em calendly.com/central-renascenca/atendimentodiversos.",
      "Canais remotos: Telefone 4020-7525 | WhatsApp (61) 4042-5125.",
    ],
    keywords: ["caa", "atendimento", "protocolo", "prova", "avaliação", "boleto", "bolsa", "contratante", "agendamento"],
    area: "patio",
    verificationStatus: "verified",
    faq: [
      {
        question: "Preciso agendar para ser atendido na CAA?",
        answer: "Sim, o atendimento presencial ocorre por senhas ou agendamento prévio pelo link calendly.com/central-renascenca/atendimentodiversos.",
      },
      {
        question: "Quais serviços já são feitos direto no Portal do Aluno?",
        answer: "Alteração de dados pessoais, envio de atividades complementares, entrega de TCC, estágio, kit formando, regime domiciliar, retificação de notas/faltas (gratuitos) e emissão de declarações, 2ª via de carteira ou histórico escolar.",
      },
    ],
  },
  {
    id: "biblioteca",
    name: "Biblioteca Universitária",
    category: "servicos",
    description:
      "Espaço de estudo e apoio à pesquisa acadêmica com empréstimo de livros físicos, acesso digital pelo Meu Pérgamo, agendamento de salas de estudo e emissão de Nada Consta.",
    location: "Subsolo · Centro do campus, descendo as escadas ao lado do Café CB (perto da quadra)",
    building: "Pátio Principal",
    floor: "Subsolo",
    plusCode: "689QGP68+9H",
    mapCoords: { x: 55, y: 56 },
    openingHours: "Segunda a sexta-feira, das 8h às 21h30. Sábado, das 8h às 12h30.",
    referencePoints: [
      "Subsolo — no meio da universidade, ao lado da entrada da quadra.",
      "Acesso descendo as escadas ao lado do Café CB.",
    ],
    services: [
      "Empréstimo e devolução de livros físicos (prazo inicial de 10 dias, renovável até 50 dias)",
      "Acesso a artigos e e-books pelo sistema Meu Pérgamo",
      "Agendamento de salas de estudo (períodos de 2 horas)",
      "Orientação com bibliotecária para pesquisas, artigos e TCC",
      "Emissão de certidão Nada Consta",
    ],
    directions: [
      "Vá até o centro do campus e localize o Café CB próximo à entrada da quadra.",
      "Desça as escadas ao lado do Café CB até o Subsolo para acessar a recepção da biblioteca.",
      "Leve documento oficial com foto (físico ou digital — não é aceita foto tirada do documento).",
    ],
    keywords: ["biblioteca", "livro", "empréstimo", "sala de estudo", "pérgamo", "ebook", "nada consta", "tcc", "café cb", "subsolo"],
    area: "patio",
    verificationStatus: "verified",
    faq: [
      {
        question: "Como funciona o agendamento das salas de estudo?",
        answer: "Agende com pelo menos 1 hora de antecedência para blocos de 2 horas (8h–10h, 10h–12h, 12h–14h, 14h–16h, 16h–18h, 18h–20h ou 20h–21h30), apresentando documento com foto e sua senha de 6 caracteres.",
      },
      {
        question: "Qual documento é aceito para empréstimo?",
        answer: "Documento oficial com foto ou documento digital oficial com foto. Fotografia comum do documento na galeria do celular não é aceita.",
      },
    ],
  },
  {
    id: "financeiro",
    name: "Financeiro (Atendimento via CAA e Portal)",
    category: "setores",
    description:
      "As demandas financeiras presenciais são atendidas na Central de Atendimento ao Aluno (CAA) no Térreo, enquanto boletos ficam no Portal do Aluno e renegociações antigas ocorrem via Cobrafix.",
    location: "Térreo · Integrado à CAA (ao lado da Central de Matrículas)",
    building: "Pátio Principal",
    floor: "Térreo",
    plusCode: "689QGP68+8F",
    mapCoords: { x: 49, y: 66 },
    openingHours: "Segunda a sexta-feira, das 8h às 17h (via CAA).",
    referencePoints: [
      "Térreo — mesmo espaço físico da Central de Atendimento ao Aluno (CAA), próximo à rampa principal.",
    ],
    services: [
      "Emissão de boletos e declarações financeiras (via Portal do Aluno)",
      "Concessão de bolsa (Convênio/Portaria), PRAVALER e aditamento FIES",
      "Abono de multa da biblioteca e regularização financeira",
      "Alteração de contratante/responsável financeiro",
    ],
    directions: [
      "Para boletos do mês vigente, acesse a aba Financeiro no Portal do Aluno (limpe o cache do navegador se a tela ficar em branco).",
      "Para atendimento presencial, dirija-se à CAA no Térreo, ao lado da Central de Matrículas.",
    ],
    keywords: ["financeiro", "boleto", "mensalidade", "vencimento", "desconto", "renegociação", "cobrafix", "fies", "pravaler"],
    area: "patio",
    verificationStatus: "verified",
    faq: [
      {
        question: "Qual é a data limite para pagar com desconto de pontualidade?",
        answer: "O vencimento com desconto segue o 5º dia útil do mês (não é um dia fixo do calendário).",
      },
      {
        question: "Boleto em atraso impede de fazer prova?",
        answer: "Não. Boletos em atraso não bloqueiam o aluno na ata de prova; o bloqueio ocorre apenas por falta de matrícula acadêmica ou erro de enturmação.",
      },
      {
        question: "Consigo renegociar parcelas antigas no balcão?",
        answer: "Não. Parcelas antigas em atraso são terceirizadas e devem ser negociadas diretamente com a assessoria Cobrafix.",
      },
    ],
  },
  {
    id: "coordenacoes",
    name: "Coordenação de Curso / Estágio",
    category: "setores",
    description:
      "Localizadas no 1º Andar (junto à Central de Estágio), atendem estudantes matriculados em demandas acadêmicas: TCC, atividades complementares, reingresso, regimes especiais e estágios.",
    location: "1º Andar · Corredores das Coordenações (direita/esquerda) e Central de Estágio",
    building: "Prédio Principal",
    floor: "1º Andar",
    plusCode: "689QGP68+FP",
    mapCoords: { x: 34, y: 55 },
    referencePoints: [
      "1º Andar — corredores das coordenações de curso (à direita e à esquerda) e Central de Estágio.",
      "Atenção: na Sobreloja ficam apenas as salas dos professores; o atendimento ao aluno é no 1º Andar.",
    ],
    services: [
      "Regras e inscrição de Trabalho de Conclusão de Curso (TCC)",
      "Validação de horas de Atividades Complementares (ex.: 80h ADS; 160h Eng. Software/Ciência da Computação)",
      "Processos de Reingresso, Regime Domiciliar (atestado >= 7 dias) e Regime Especial",
      "Esclarecimento sobre Kit Formando (documentação para diploma) e Colação de Grau",
      "Trâmites de Estágio Obrigatório e Extracurricular na Central de Estágio (1º Andar)",
    ],
    directions: [
      "Suba até o 1º Andar e siga pelos corredores das coordenações (primeira/segunda à direita ou à esquerda, conforme o curso).",
      "Para contratos, seguros e relatórios de estágio, procure a Central de Estágio também no 1º Andar.",
    ],
    keywords: ["curso", "coordenador", "coordenação", "estágio", "central de estágio", "tcc", "horas complementares", "reingresso", "1º andar"],
    area: "patio",
    verificationStatus: "verified",
    faq: [
      {
        question: "O atendimento das coordenações é na Sobreloja ou no 1º Andar?",
        answer: "No 1º Andar (onde também fica a Central de Estágio). A Sobreloja reúne apenas as salas dos professores.",
      },
      {
        question: "O que é o Kit Formando?",
        answer: "É a documentação obrigatória digitalizada que deve ser entregue no portal para emissão do diploma digital (não é o pacote festivo de formatura).",
      },
    ],
  },
  {
    id: "nadd",
    name: "NADD e Apoio Psicológico ao Aluno",
    category: "setores",
    description:
      "O Núcleo de Apoio ao Docente e ao Discente (NADD), localizado no 1º Andar, oferece suporte pedagógico, nivelamento e acolhimento/apoio psicológico aos estudantes.",
    location: "1º Andar · Núcleo de Apoio ao Docente e ao Discente (NADD)",
    building: "Prédio Principal",
    floor: "1º Andar",
    plusCode: "689QGP68+JX",
    mapCoords: { x: 68, y: 42 },
    referencePoints: [
      "1º Andar — mesmo pavimento das Coordenações de Curso e do Núcleo de Relações Internacionais.",
    ],
    services: [
      "Acolhimento e apoio psicológico ao aluno",
      "Aulas e atividades de nivelamento (Português e Matemática)",
      "Suporte pedagógico e orientação de hábitos de estudo",
      "Acompanhamento acadêmico de discentes e docentes",
    ],
    directions: [
      "Suba até o 1º Andar e procure a sinalização do NADD (Núcleo de Apoio ao Docente e ao Discente).",
    ],
    keywords: ["nadd", "nad", "psicológico", "psicologia", "acolhimento", "saúde mental", "pedagógico", "nivelamento", "português", "matemática", "1º andar"],
    area: "patio",
    verificationStatus: "verified",
  },
  {
    id: "achados-perdidos",
    name: "Achados e Perdidos & Segurança Patrimonial",
    category: "servicos",
    description:
      "Atuação integrada entre dois pavimentos: a base administrativa da Segurança Patrimonial e Patrimônio fica no Subsolo (registro de ocorrências e câmeras), enquanto a sala de Achados e Perdidos fica no 3º Andar (guarda e retirada de itens).",
    location: "Achados e Perdidos: 3º Andar · Base da Segurança Patrimonial / Patrimônio: Subsolo",
    building: "Prédio Principal",
    floor: "3º Andar",
    plusCode: "689QGP69+P3",
    mapCoords: { x: 48, y: 46 },
    referencePoints: [
      "3º Andar: sala do Achados e Perdidos (retirada de objetos encontrados e não reclamados).",
      "Subsolo: base administrativa de Patrimônio e Segurança Patrimonial (registro de perdas e checagem de câmeras junto ao Monitoramento).",
    ],
    services: [
      "Guarda e devolução de objetos encontrados no campus (3º Andar)",
      "Registro formal de perda de pertences junto à Segurança Patrimonial (Subsolo / equipes do campus)",
      "Verificação de imagens de câmeras junto ao setor de Monitoramento",
      "Articulação no Centro de Operações para recuperação de objetos",
    ],
    directions: [
      "1. Se acabou de perder um item: acione a Segurança Patrimonial (base no Subsolo ou equipe nos postos do campus) para registrar local/horário e verificar as câmeras no Monitoramento.",
      "2. Para consultar ou retirar objetos já encontrados: dirija-se diretamente ao setor de Achados e Perdidos no 3º Andar.",
    ],
    keywords: ["achados e perdidos", "perdi", "objeto", "pertence", "segurança", "patrimônio", "monitoramento", "câmera", "3º andar", "subsolo"],
    area: "patio",
    verificationStatus: "verified",
    faq: [
      {
        question: "Devo ir direto ao 3º Andar ou ao Subsolo quando perco algo?",
        answer: "São setores complementares em andares diferentes: a Segurança Patrimonial e o Patrimônio têm base administrativa no Subsolo (onde se registra a ocorrência e se aciona o Monitoramento de câmeras), enquanto os objetos encontrados ficam guardados no Achados e Perdidos no 3º Andar.",
      },
    ],
  },
  {
    id: "entrada-rua",
    name: "Entrada Principal (Rua Anapurus)",
    image: "/locais/entrada-rua.jpeg",
    imageAlt: "Fachada e catracas da entrada principal pela Rua Anapurus",
    category: "outros",
    description: "Acesso principal ao campus pela Rua Anapurus, através das catracas principais.",
    keywords: ["entrada", "rua anapurus", "catraca", "acesso principal"],
    area: "patio",
    building: "Pátio Principal",
    floor: "Térreo",
    plusCode: "689QFPX7+4X",
    location: "Rua Anapurus · Catracas principais de entrada e saída",
    directions: ["Acesse o campus pela entrada principal na Rua Anapurus e passe pelas catracas de identificação."],
    svgPinId: "pino-entrada-rua",
    svgCoords: { x: 68, y: 189 },
    svgPinType: "entrance",
    verificationStatus: "verified",
  },
  {
    id: "entrada-estacionamento",
    name: "Entrada do Estacionamento",
    category: "outros",
    description: "Acesso ao campus vindo do estacionamento interno.",
    keywords: ["entrada", "estacionamento", "acesso"],
    area: "patio",
    building: "Pátio Principal",
    floor: "Térreo",
    plusCode: "689QGP69+P3",
    location: "Acesso interno pelo estacionamento",
    directions: ["Vindo do estacionamento interno, siga a sinalização até a entrada do campus."],
    svgPinId: "pino-entrada-estacionamento",
    svgCoords: { x: 182, y: 187 },
    svgPinType: "entrance",
    verificationStatus: "verified",
  },
  {
    id: "estatua-pensador",
    name: "Estátua do Pensador",
    image: "/locais/estatua-pensador.jpeg",
    imageAlt: "Estátua dourada do Pensador no pátio central do Térreo",
    category: "outros",
    description: "Estátua dourada do Pensador no centro do pátio do Térreo, principal ponto de referência visual logo após a entrada.",
    keywords: ["estátua", "pensador", "referência", "pátio"],
    area: "patio",
    building: "Pátio Principal",
    floor: "Térreo",
    plusCode: "689QFPW7+VV",
    location: "Centro do pátio · Térreo (logo à frente da entrada da Rua Anapurus)",
    directions: ["Seguindo reto a partir das catracas da entrada da Rua Anapurus, você encontra a Estátua do Pensador no centro do pátio."],
    svgPinId: "pino-pensador",
    svgCoords: { x: 142, y: 171 },
    svgPinType: "reference",
    verificationStatus: "verified",
  },
  {
    id: "auditorio",
    name: "Auditório",
    category: "outros",
    description: "Espaço para palestras, recepção de calouros e eventos institucionais no Térreo.",
    keywords: ["auditório", "palestra", "recepção", "evento"],
    area: "patio",
    building: "Pátio Principal",
    floor: "Térreo",
    location: "Térreo · acesso indicado no mapa",
    svgPinId: "pino-auditorio",
    svgCoords: { x: 168, y: 267 },
    svgPinType: "reference",
    verificationStatus: "verified",
  },
  {
    id: "banco",
    name: "Banco (Santander / Banco24Horas)",
    image: "/locais/banco.jpeg",
    imageAlt: "Agência Santander e caixas Banco24Horas no corredor do Térreo",
    category: "servicos",
    description: "Agência/posto do Santander interligado à rede Banco24Horas no corredor do Térreo, ao lado da Central de Atendimento e próximo à Praça da Gratidão.",
    keywords: ["banco", "caixa eletrônico", "autoatendimento"],
    area: "patio",
    building: "Pátio Principal",
    floor: "Térreo",
    plusCode: "689QFPW7+VM",
    location: "Corredor do Térreo · Entre a Central de Atendimento (CAA) e a Central de Matrícula, perto da Praça da Gratidão",
    directions: ["Siga pelo corredor principal após o Apoio ao Aluno; o Banco Santander fica à esquerda, logo ao lado da Central de Atendimento e próximo à Praça da Gratidão."],
    svgPinId: "pino-banco",
    svgCoords: { x: 177, y: 345 },
    svgPinType: "reference",
    verificationStatus: "verified",
  },
  {
    id: "cafe-cb",
    name: "Café (CB to Go)",
    image: "/locais/cafe-cb.jpeg",
    imageAlt: "Cafeteria CB to Go no corredor central do Térreo",
    category: "servicos",
    description: "Cafeteria e lanchonete CB to Go no corredor central do Térreo, ao lado da rampa e da escada de acesso à Biblioteca (Subsolo).",
    keywords: ["café", "cafeteria", "cb to go", "lanchonete", "quadra", "biblioteca"],
    area: "patio",
    building: "Pátio Principal",
    floor: "Térreo",
    plusCode: "689QFPW7+WP",
    location: "Corredor central do Térreo · Ao lado da rampa e da escada da Biblioteca",
    directions: ["Seguindo reto depois da Central de Matrícula e descendo a rampa do corredor principal, olhe para a esquerda para localizar o Café CB to Go."],
    svgPinId: "pino-cafe",
    svgCoords: { x: 165, y: 432 },
    svgPinType: "reference",
    verificationStatus: "verified",
  },
  {
    id: "ginasio-quadra",
    name: "Ginásio / Quadra Poliesportiva",
    image: "/locais/ginasio-quadra.jpeg",
    imageAlt: "Rampa e escadaria de acesso ao Ginásio e Quadra Poliesportiva",
    category: "outros",
    description: "Área esportiva do campus no Térreo, acessada pela rampa com corrimão e paredes de azulejos logo após o Café CB to Go.",
    keywords: ["ginásio", "quadra", "esporte", "poliesportiva", "café cb"],
    area: "patio",
    building: "Pátio Principal",
    floor: "Térreo",
    plusCode: "689QFPW7+VG",
    location: "Térreo · Rampa de acesso à esquerda logo após o Café CB to Go",
    directions: ["Andando reto pelo corredor principal após passar pelo Café CB to Go, olhe para a esquerda para encontrar a rampa e escadaria de acesso à quadra."],
    svgPinId: "pino-quadra",
    svgCoords: { x: 190, y: 500 },
    svgPinType: "reference",
    verificationStatus: "verified",
  },
  {
    id: "loja-1",
    name: "Loja 1 (Conveniência / Serviços)",
    category: "servicos",
    description: "Ponto comercial e de conveniência no corredor do Térreo.",
    keywords: ["loja 1", "conveniência", "serviços", "loja"],
    area: "patio",
    building: "Pátio Principal",
    floor: "Térreo",
    location: "Corredor do Térreo · Loja 1",
    svgPinId: "pino-loja-1",
    svgCoords: { x: 111, y: 270 },
    svgPinType: "reference",
    verificationStatus: "verified",
  },
  {
    id: "loja-2",
    name: "Loja 2 (Conveniência / Serviços)",
    category: "servicos",
    description: "Ponto comercial e de conveniência no corredor do Térreo.",
    keywords: ["loja 2", "conveniência", "serviços", "loja"],
    area: "patio",
    building: "Pátio Principal",
    floor: "Térreo",
    location: "Corredor do Térreo · Loja 2",
    svgPinId: "pino-loja-2",
    svgCoords: { x: 116, y: 345 },
    svgPinType: "reference",
    verificationStatus: "verified",
  },
  {
    id: "wc-1",
    name: "Banheiro (WC 1)",
    category: "banheiros",
    description: "Banheiro no corredor do Térreo, no ponto indicado como WC 1 no mapa.",
    keywords: ["banheiro", "wc", "sanitário", "wc 1"],
    area: "patio",
    building: "Pátio Principal",
    floor: "Térreo",
    location: "Corredor do Térreo · WC 1 (pino no mapa)",
    svgPinId: "pino-banheiro-1",
    svgCoords: { x: 112, y: 306 },
    svgPinType: "bathroom",
    verificationStatus: "verified",
  },
  {
    id: "wc-2",
    name: "Banheiro (WC 2)",
    category: "banheiros",
    description: "Banheiro no corredor do Térreo, no ponto indicado como WC 2 no mapa.",
    keywords: ["banheiro", "wc", "sanitário", "wc 2"],
    area: "patio",
    building: "Pátio Principal",
    floor: "Térreo",
    location: "Corredor do Térreo · WC 2 (pino no mapa)",
    svgPinId: "pino-banheiro-2",
    svgCoords: { x: 124, y: 608 },
    svgPinType: "bathroom",
    verificationStatus: "verified",
  },
  {
    id: "sala-cix",
    name: "Sala CIX",
    image: "/locais/sala-cix.jpeg",
    imageAlt: "Porta de vidro da Sala CIX e Pós-Graduação no fundo do corredor do Térreo",
    category: "setores",
    description: "Espaço institucional no fundo do corredor do Térreo (junto à área de Pós-Graduação / Comitê de Ética em Pesquisa), utilizado para eventos acadêmicos e atividades estudantis.",
    keywords: ["sala cix", "eventos", "acadêmico", "atividades estudantis"],
    area: "patio",
    building: "Pátio Principal",
    floor: "Térreo",
    plusCode: "689QFPW7+R8",
    location: "Fundo do corredor principal do Térreo · Porta de vidro (Pós-Graduação / Espaço CIX)",
    services: ["Realização de eventos acadêmicos", "Atividades estudantis"],
    openingHours: "Funcionamento conforme a programação de eventos e atividades acadêmicas.",
    referencePoints: [
      "Final do corredor reto do Térreo, na entrada de vidro da Pós-Graduação / Espaço CIX.",
      "Ao lado da escada com a placa indicativa 'Comitê de Ética em Pesquisa'.",
    ],
    directions: ["A partir da entrada da Rua Anapurus, siga sempre reto pelo corredor principal até o final sem desviar para as laterais; a porta de vidro da Sala CIX / Pós-Graduação estará bem à sua frente."],
    svgPinId: "pino-sala-cix",
    svgCoords: { x: 135, y: 662 },
    svgPinType: "sector",
    verificationStatus: "verified",
  },
];

const pendingLocations: CampusLocation[] = [
  {
    id: "emergencia",
    name: "Apoio de Emergência (Pronto Atendimento)",
    category: "servicos",
    description:
      "Equipe de bombeiros civis de plantão no campus para atendimento de urgências, primeiros socorros, proteção e prevenção contra incêndio e triagem inicial de ocorrências.",
    location: "Posto do Pronto Atendimento (confirmar bloco/andar exato no campus)",
    building: "Prédio I",
    floor: "Térreo",
    plusCode: "689QGP68+9H",
    mapCoords: { x: 64, y: 58 },
    openingHours: "Plantão diurno com equipe de bombeiros (horário noturno a confirmar).",
    referencePoints: [
      "Equipe identificada com uniforme vermelho dos bombeiros da CEUMA.",
    ],
    services: [
      "Primeiros socorros e atendimento pré-hospitalar no campus",
      "Proteção e prevenção contra incêndio",
      "Atendimento inicial e encaminhamento em ocorrências de saúde",
    ],
    keywords: ["emergência", "pronto atendimento", "bombeiro", "primeiros socorros", "acidente", "passando mal", "urgência", "incêndio"],
    verificationStatus: "pending",
  },
  {
    id: "ouvidoria",
    name: "Ouvidoria",
    category: "setores",
    description:
      "Canal institucional para registro de elogios, sugestões, reclamações e denúncias. A localização física no campus e os horários presenciais aguardam confirmação pela equipe.",
    location: "Localização e canais a confirmar",
    building: "Prédio I",
    floor: "Térreo",
    plusCode: "689QGP69+P3",
    mapCoords: { x: 31, y: 28 },
    services: [
      "Registro de sugestões, elogios, reclamações e manifestações institucionais",
    ],
    keywords: ["ouvidoria", "reclamação", "sugestão", "elogio", "denúncia", "manifestação"],
    verificationStatus: "pending",
  },
];

const demoLocations: CampusLocation[] = [
  {
    id: "salas-exemplo",
    name: "Salas de aula",
    category: "salas",
    description: "Exemplo de como as salas poderão aparecer quando o catálogo receber dados detalhados dos blocos.",
    keywords: ["aula", "turma", "sala"],
    verificationStatus: "demo",
  },
  {
    id: "banheiros-exemplo",
    name: "Banheiros e acessos",
    category: "banheiros",
    description: "Registro ilustrativo para a futura inclusão de banheiros e informações de acessibilidade.",
    keywords: ["acessibilidade", "banheiro", "sanitário"],
    verificationStatus: "demo",
  },
];

export const campusAreas = [
  { id: "patio", name: "Setores mapeados", description: "Setores com andar, serviços e referências confirmados." },
  { id: "pendentes", name: "Locais a confirmar", description: "Setores cujo ponto exato no mapa aguarda validação." },
  { id: "exemplos", name: "Exemplos de espaços", description: "Registros demonstrativos do catálogo." },
];

export const serviceAssociations = [
  { locationId: "apoio", phrases: ["cadastro facial", "localização", "orientação", "catraca"], verified: true },
  { locationId: "matriculas", phrases: ["matrícula", "crachá", "prouni", "fies"], verified: true },
  { locationId: "central-atendimento", phrases: ["protocolo", "prova", "avaliação", "agendamento"], verified: true },
  { locationId: "biblioteca", phrases: ["livro", "empréstimo", "sala de estudo", "nada consta"], verified: true },
  { locationId: "financeiro", phrases: ["boleto", "mensalidade", "desconto", "cobrafix"], verified: true },
  { locationId: "coordenacoes", phrases: ["tcc", "horas complementares", "reingresso", "estágio"], verified: true },
  { locationId: "nadd", phrases: ["apoio psicológico", "nivelamento", "apoio pedagógico"], verified: true },
  { locationId: "achados-perdidos", phrases: ["objeto perdido", "segurança patrimonial"], verified: true },
  { locationId: "emergencia", phrases: ["primeiros socorros", "bombeiro", "urgência"], verified: true },
];

const locations = [...verifiedLocations, ...pendingLocations, ...demoLocations];
const featuredIds = [
  "apoio",
  "matriculas",
  "central-atendimento",
  "biblioteca",
  "financeiro",
  "coordenacoes",
];

export function getLocations() {
  return locations;
}
export function getLocation(id: string) {
  return locations.find((location) => location.id === id);
}
export function getFeaturedLocations() {
  return featuredIds.flatMap((id) => getLocation(id) ?? []);
}
export function getDepartments() {
  return locations.filter((location) => location.verificationStatus !== "demo");
}

export function getCampusArea(location: CampusLocation) {
  return location.area ?? (location.verificationStatus === "demo" ? "exemplos" : "pendentes");
}

export function getLocationAddress(location: CampusLocation) {
  if (location.verificationStatus !== "verified") return "";
  return location.location || [location.building, location.floor].filter(Boolean).join(" · ");
}