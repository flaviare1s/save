export type ArquetipoDef = {
  id: string;
  nome: string;
  nomeIngles: string;
  emoji: string;
  cor: string;
  corSecundaria: string;
  gatilho: string;
  comportamento: string;
  insightEspelho: string;
  poderDeEscolha: string;
  nomeDaReserva: string;
  categoriasDominantes: string[];
  contextoGatilho: string;
  recomendacoes: string[];
};

export type ArquetipoTransaction = {
  valor: number;
  categoria: string;
  contextoEmocional?: string;
  periodo?: string;
  diaSemana?: string;
};

export type ArquetipoDetectado = ArquetipoDef & {
  percentualMatch: number;
  scores: Record<string, number>;
  detalhes: Record<string, number>;
};

export const arquetipos: ArquetipoDef[] = [
  {
    id: "curadora_conforto",
    nome: "A Curadora de Conforto",
    nomeIngles: "The Comfort Curator",
    emoji: "🕯️",
    cor: "#9B59B6",
    corSecundaria: "#F0E6FF",
    gatilho: "Sobrecarga mental e esgotamento físico",
    comportamento:
      "Gastos concentrados em delivery, itens para casa, skincare e pequenos confortos depois de dias pesados.",
    insightEspelho:
      "Você busca no consumo o abraço que o dia não te deu. Seu lar é seu santuário, mas cuidado para não mobiliar sua paz com boletos.",
    poderDeEscolha:
      "Transforme parte dos gastos de alívio imediato em uma reserva que também cuide de você amanhã.",
    nomeDaReserva: "Reserva de Sossego 🕯️",
    categoriasDominantes: ["alimentacao", "conforto"],
    contextoGatilho: "pos_trabalho_exaustivo",
    recomendacoes: [
      "Crie um ritual semanal de conforto com teto definido e transfira o restante para a reserva.",
      "Troque um delivery por semana por uma noite especial em casa.",
      "Automatize uma pequena transferência mensal para a sua Reserva de Sossego.",
    ],
  },
  {
    id: "arquiteta_conexoes",
    nome: "A Arquiteta de Conexões",
    nomeIngles: "The Connection Architect",
    emoji: "🥂",
    cor: "#E91E8C",
    corSecundaria: "#FFE6F5",
    gatilho: "Necessidade de pertencimento ou medo de ficar de fora",
    comportamento:
      "Gastos em bares, presentes, viagens rápidas e convites sociais que parecem difíceis de recusar.",
    insightEspelho:
      "Sua generosidade é vibrante. Você investe em memórias, mas sua presença é o maior presente, não o consumo em volta dela.",
    poderDeEscolha:
      "Planejar experiências com antecedência mantém a conexão viva sem atropelar sua segurança financeira.",
    nomeDaReserva: "Reserva de Conexão 🥂",
    categoriasDominantes: ["social"],
    contextoGatilho: "fomo_social",
    recomendacoes: [
      "Defina um teto mensal para programas sociais antes de aceitar novos convites.",
      "Proponha encontros em casa ou planos compartilhados de menor custo.",
      "Separe um fundo de experiências para viagens e eventos planejados.",
    ],
  },
  {
    id: "visionaria_pragmatica",
    nome: "A Visionária Pragmática",
    nomeIngles: "The Pragmatic Visionary",
    emoji: "📚",
    cor: "#2196F3",
    corSecundaria: "#E3F2FD",
    gatilho: "Insegurança com o futuro ou necessidade de controle",
    comportamento:
      "Gastos em cursos, livros, ferramentas e produtividade para sentir que está se preparando melhor.",
    insightEspelho:
      "Você é movida por evolução. O consumo foca no eu do futuro, mas liberdade também nasce do dinheiro preservado no presente.",
    poderDeEscolha:
      "Conhecimento aplicado e reserva financeira caminham juntos: um expande possibilidades, o outro sustenta escolhas.",
    nomeDaReserva: "Reserva de Liberdade 📚",
    categoriasDominantes: ["autodesenvolvimento"],
    contextoGatilho: "ansiedade_futuro",
    recomendacoes: [
      "Antes de comprar um curso, conclua ou descarte conscientemente um que já existe.",
      "Use uma lista de espera de 7 dias para compras de autodesenvolvimento.",
      "Direcione parte do orçamento de aprendizado para uma reserva de liberdade.",
    ],
  },
  {
    id: "alquimista_estetica",
    nome: "A Alquimista da Estética",
    nomeIngles: "The Aesthetic Alchemist",
    emoji: "✨",
    cor: "#c084fc",
    corSecundaria: "#FFF8E1",
    gatilho: "Baixa autoestima momentânea ou busca por validação",
    comportamento:
      "Compras em moda, beleza e procedimentos quando a autoconfiança fica dependente de uma próxima versão de si.",
    insightEspelho:
      "Você tem um olhar apurado para o belo. O desafio é não deixar que sua confiança dependa da próxima etiqueta.",
    poderDeEscolha:
      "Escolher menos e melhor pode transformar estilo em expressão, não em pressão.",
    nomeDaReserva: "Liberdade de Estilo ✨",
    categoriasDominantes: ["moda", "beleza"],
    contextoGatilho: "busca_validacao",
    recomendacoes: [
      "Espere 24 horas antes de compras ligadas a moda ou beleza.",
      "Invista em poucas peças de alta qualidade em vez de várias compras rápidas.",
      "Direcione um valor fixo mensal para a Liberdade de Estilo.",
    ],
  },
  {
    id: "refugiada_digital",
    nome: "A Refugiada Digital",
    nomeIngles: "The Digital Refugee",
    emoji: "📱",
    cor: "#00BCD4",
    corSecundaria: "#E0F7FA",
    gatilho: "Tédio, procrastinação ou escapismo",
    comportamento:
      "Pequenas compras em apps, assinaturas e carrinhos noturnos que parecem leves, mas somam rápido.",
    insightEspelho:
      "O scroll infinito virou consumo infinito. Você gasta para preencher tempo, aliviar tédio ou escapar do excesso do dia.",
    poderDeEscolha:
      "Trocar o clique automático por uma pausa consciente devolve tempo, dinheiro e atenção para você.",
    nomeDaReserva: "Reserva da Grande Viagem 📱",
    categoriasDominantes: ["digital"],
    contextoGatilho: "tedio_noturno",
    recomendacoes: [
      "Bloqueie apps de compra depois das 21h por 30 dias.",
      "Use a regra dos 7 dias para itens adicionados ao carrinho à noite.",
      "Some as pequenas compras do mês e redirecione metade para uma meta concreta.",
    ],
  },
  {
    id: "nerd_colecionadora",
    nome: "A Nerd Colecionadora",
    nomeIngles: "The Nerd Collector",
    emoji: "🎮",
    cor: "#7C3AED",
    corSecundaria: "#EDE9FE",
    gatilho: "Entusiasmo por novidades, coleções e pertencimento a universos de interesse",
    comportamento:
      "Gastos em produtos digitais, itens colecionáveis, livros, jogos, tecnologia e hobbies que alimentam identidade.",
    insightEspelho:
      "Sua curiosidade cria mundos. Só vale cuidar para que cada nova aquisição tenha espaço real na sua rotina e no seu orçamento.",
    poderDeEscolha:
      "Colecionar também pode ser curadoria: escolher melhor deixa cada compra mais significativa.",
    nomeDaReserva: "Reserva de Universo Próprio 🎮",
    categoriasDominantes: ["digital", "autodesenvolvimento"],
    contextoGatilho: "ansiedade_futuro",
    recomendacoes: [
      "Crie uma wishlist e compre apenas o item mais desejado após 15 dias.",
      "Defina um teto específico para hobbies e coleções.",
      "Revise assinaturas e produtos digitais que já não fazem parte da sua rotina.",
    ],
  },
];

const byId = new Map(arquetipos.map((arquetipo) => [arquetipo.id, arquetipo]));

const sumValues = (transactions: ArquetipoTransaction[]) => {
  return transactions.reduce((sum, transaction) => sum + transaction.valor, 0);
};

const safePercent = (part: number, total: number) => {
  return total > 0 ? (part / total) * 100 : 0;
};

const categoryValue = (
  transactions: ArquetipoTransaction[],
  categories: string[],
) => {
  return sumValues(
    transactions.filter((transaction) =>
      categories.includes(transaction.categoria),
    ),
  );
};

const contextValue = (
  transactions: ArquetipoTransaction[],
  context: string,
) => {
  return sumValues(
    transactions.filter(
      (transaction) => transaction.contextoEmocional === context,
    ),
  );
};

const contextCount = (
  transactions: ArquetipoTransaction[],
  context: string,
) => {
  return transactions.filter(
    (transaction) => transaction.contextoEmocional === context,
  ).length;
};

const periodCount = (
  transactions: ArquetipoTransaction[],
  period: string,
) => {
  return transactions.filter((transaction) => transaction.periodo === period)
    .length;
};

const getScoreDetails = (transactions: ArquetipoTransaction[]) => {
  const totalValue = sumValues(transactions);
  const totalCount = transactions.length;
  const modaBeleza = categoryValue(transactions, ["moda", "beleza"]);
  const alimentacaoConforto = categoryValue(transactions, [
    "alimentacao",
    "conforto",
  ]);
  const digital = categoryValue(transactions, ["digital"]);
  const autodesenvolvimento = categoryValue(transactions, [
    "autodesenvolvimento",
  ]);
  const social = categoryValue(transactions, ["social"]);
  const smallNightCount = transactions.filter(
    (transaction) =>
      transaction.periodo === "noite" &&
      transaction.valor > 0 &&
      transaction.valor <= 80,
  ).length;

  return {
    percentualPosTrabalho: safePercent(
      contextValue(transactions, "pos_trabalho_exaustivo"),
      totalValue,
    ),
    percentualAlimentacaoConforto: safePercent(
      alimentacaoConforto,
      totalValue,
    ),
    percentualSocial: safePercent(social, totalValue),
    percentualFomo: safePercent(
      contextCount(transactions, "fomo_social"),
      totalCount,
    ),
    percentualAutodesenvolvimento: safePercent(
      autodesenvolvimento,
      totalValue,
    ),
    percentualAnsiedade: safePercent(
      contextCount(transactions, "ansiedade_futuro"),
      totalCount,
    ),
    percentualModaBeleza: safePercent(modaBeleza, totalValue),
    percentualValidacao: safePercent(
      contextCount(transactions, "busca_validacao"),
      totalCount,
    ),
    percentualTedio: safePercent(
      contextCount(transactions, "tedio_noturno"),
      totalCount,
    ),
    percentualDigital: safePercent(digital, totalValue),
    percentualNoite: safePercent(periodCount(transactions, "noite"), totalCount),
    percentualPequenasComprasNoturnas: safePercent(smallNightCount, totalCount),
  };
};

export function detectarArquetipo(
  transacoes: ArquetipoTransaction[],
): ArquetipoDetectado {
  const detalhes = getScoreDetails(transacoes);
  const scores: Record<string, number> = {
    curadora_conforto:
      detalhes.percentualPosTrabalho * 0.45 +
      detalhes.percentualAlimentacaoConforto * 0.4 +
      detalhes.percentualNoite * 0.15,
    arquiteta_conexoes:
      detalhes.percentualSocial * 0.6 +
      detalhes.percentualFomo * 0.4,
    visionaria_pragmatica:
      detalhes.percentualAutodesenvolvimento * 0.6 +
      detalhes.percentualAnsiedade * 0.4,
    alquimista_estetica:
      detalhes.percentualModaBeleza * 0.65 +
      detalhes.percentualValidacao * 0.35,
    refugiada_digital:
      detalhes.percentualDigital * 0.35 +
      detalhes.percentualTedio * 0.3 +
      detalhes.percentualNoite * 0.2 +
      detalhes.percentualPequenasComprasNoturnas * 0.15,
    nerd_colecionadora:
      detalhes.percentualDigital * 0.25 +
      detalhes.percentualAutodesenvolvimento * 0.25 +
      detalhes.percentualAnsiedade * 0.2 +
      detalhes.percentualTedio * 0.15 +
      detalhes.percentualPequenasComprasNoturnas * 0.15,
  };

  const [arquetipoDetectado, maiorScore] = Object.entries(scores).reduce(
    (winner, current) => (current[1] > winner[1] ? current : winner),
    ["curadora_conforto", 0],
  );
  const totalScores = Object.values(scores).reduce((sum, score) => sum + score, 0);
  const percentualMatch =
    maiorScore > 0 && totalScores > 0
      ? Math.min(Math.max((maiorScore / totalScores) * 100, 45), 95)
      : 0;
  const arquetipo = byId.get(arquetipoDetectado) ?? arquetipos[0];

  return {
    ...arquetipo,
    percentualMatch,
    scores,
    detalhes,
  };
}

const formatCurrency = (value: number) => {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

const dominantCategoryValue = (
  arquetipo: Pick<ArquetipoDef, "categoriasDominantes">,
  transactions: ArquetipoTransaction[],
) => {
  return categoryValue(transactions, arquetipo.categoriasDominantes);
};

export function gerarInsights(
  arquetipo: Pick<
    ArquetipoDef,
    "id" | "contextoGatilho" | "categoriasDominantes"
  >,
  transacoes: ArquetipoTransaction[],
) {
  const totalGeral = sumValues(transacoes);

  if (!transacoes.length || totalGeral <= 0) {
    return [
      {
        emoji: "✨",
        texto:
          "Registre alguns gastos para que o SAVE identifique padrões com mais confiança.",
      },
    ];
  }

  const gastosNoite = transacoes.filter((transaction) => transaction.periodo === "noite");
  const percentualNoite = safePercent(gastosNoite.length, transacoes.length);
  const gastosContexto = transacoes.filter(
    (transaction) => transaction.contextoEmocional === arquetipo.contextoGatilho,
  );
  const valorContexto = sumValues(gastosContexto);
  const gastosCategorias = dominantCategoryValue(arquetipo, transacoes);

  switch (arquetipo.id) {
    case "curadora_conforto":
      return [
        {
          emoji: "🕯️",
          texto: `${safePercent(valorContexto, totalGeral).toFixed(0)}% dos gastos vieram depois de dias exaustivos.`,
        },
        {
          emoji: "🏠",
          texto: `Conforto e alimentação somam ${formatCurrency(gastosCategorias)} no período.`,
        },
        {
          emoji: "🌙",
          texto: `${percentualNoite.toFixed(0)}% das compras aconteceram à noite.`,
        },
      ];

    case "arquiteta_conexoes":
      return [
        {
          emoji: "🥂",
          texto: `Programas sociais e presentes somam ${formatCurrency(gastosCategorias)}.`,
        },
        {
          emoji: "💝",
          texto: `Sua vida social representa ${safePercent(gastosCategorias, totalGeral).toFixed(0)}% dos gastos.`,
        },
        {
          emoji: "📅",
          texto: `${gastosContexto.length} transações foram ligadas ao medo de ficar de fora.`,
        },
      ];

    case "visionaria_pragmatica": {
      const comprasDeAprendizado = transacoes.filter(
        (transaction) => transaction.categoria === "autodesenvolvimento",
      );

      return [
        {
          emoji: "📚",
          texto: `${comprasDeAprendizado.length} compras de autodesenvolvimento aparecem no período.`,
        },
        {
          emoji: "🎯",
          texto: `Você investiu ${formatCurrency(gastosCategorias)} no eu do futuro.`,
        },
        {
          emoji: "⏰",
          texto: `${safePercent(gastosContexto.length, transacoes.length).toFixed(0)}% das compras carregam ansiedade com o futuro.`,
        },
      ];
    }

    case "alquimista_estetica": {
      const gastosModaBeleza = transacoes.filter(
        (transaction) =>
          transaction.categoria === "moda" || transaction.categoria === "beleza",
      );
      const gastosFimDeSemana = gastosModaBeleza.filter(
        (transaction) =>
          transaction.diaSemana === "sabado" ||
          transaction.diaSemana === "domingo",
      );

      return [
        {
          emoji: "✨",
          texto: `${safePercent(gastosFimDeSemana.length, gastosModaBeleza.length).toFixed(0)}% dos gastos de moda e beleza acontecem no fim de semana.`,
        },
        {
          emoji: "💄",
          texto: `Moda e beleza somam ${formatCurrency(gastosCategorias)} no período.`,
        },
        {
          emoji: "📱",
          texto: `${gastosContexto.length} compras foram ligadas a busca de validação.`,
        },
      ];
    }

    case "refugiada_digital": {
      const pequenasCompras = transacoes.filter(
        (transaction) => transaction.valor <= 80 && transaction.periodo === "noite",
      );

      return [
        {
          emoji: "📱",
          texto: `${pequenasCompras.length} pequenas compras noturnas somam ${formatCurrency(sumValues(pequenasCompras))}.`,
        },
        {
          emoji: "🌙",
          texto: `${percentualNoite.toFixed(0)}% dos gastos acontecem à noite.`,
        },
        {
          emoji: "💸",
          texto: `Gastos digitais somam ${formatCurrency(gastosCategorias)} no período.`,
        },
      ];
    }

    case "nerd_colecionadora":
      return [
        {
          emoji: "🎮",
          texto: `Digital e autodesenvolvimento somam ${formatCurrency(gastosCategorias)} no período.`,
        },
        {
          emoji: "🧩",
          texto: `${safePercent(gastosCategorias, totalGeral).toFixed(0)}% do orçamento está ligado a interesses, hobbies e repertório.`,
        },
        {
          emoji: "🛒",
          texto: `${gastosContexto.length} compras foram motivadas por preparação, curiosidade ou ansiedade com o futuro.`,
        },
      ];

    default:
      return [
        {
          emoji: "✨",
          texto: "Seus padrões estão se formando. Continue registrando para melhorar a leitura.",
        },
      ];
  }
}
