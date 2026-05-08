export const arquetipos = [
  {
    id: "curadora_conforto",
    nome: "A Curadora de Conforto",
    nomeIngles: "The Comfort Curator",
    emoji: "🕯️",
    cor: "#9B59B6",
    corSecundaria: "#F0E6FF",
    gatilho: "Sobrecarga mental e esgotamento físico",
    comportamento: "Gastos concentrados em delivery premium, skincare, velas e streaming após dias exaustivos.",
    insightEspelho: "Você busca no consumo o abraço que o dia não te deu. Seu lar é seu santuário, mas cuidado para não mobiliar sua paz com boletos.",
    poderDeEscolha: "Que tal transformar um desses pedidos de delivery na sua 'Reserva de Sossego'?",
    nomeDaReserva: "Reserva de Sossego 🕯️",
    categoriasDominantes: ["alimentacao", "conforto"],
    contextoGatilho: "pos_trabalho_exaustivo",
    recomendacoes: [
      "Crie um ritual de R$30/semana para conforto — e transfira o restante para sua reserva",
      "Troque 1 delivery por semana por uma 'noite gourmet em casa'. Economia: ~R$200/mês",
      "Monte sua 'Caixinha do Sossego': automatize R$100/mês"
    ]
  },
  {
    id: "arquiteta_conexoes",
    nome: "A Arquiteta de Conexões",
    nomeIngles: "The Connection Architect",
    emoji: "🥂",
    cor: "#E91E8C",
    corSecundaria: "#FFE6F5",
    gatilho: "Necessidade de pertencimento ou medo de isolamento (FOMO)",
    comportamento: "Gastos em bares badalados, presentes para amigas e eventos sociais. Ela é quem aceita viagens de última hora.",
    insightEspelho: "Sua generosidade é vibrante. Você investe em memórias, mas lembre-se: sua presença é o maior presente, não o que você consome.",
    poderDeEscolha: "Sua reserva para o futuro garantirá que você continue sendo a alma da festa por muitos anos.",
    nomeDaReserva: "Reserva de Conexão 🥂",
    categoriasDominantes: ["social"],
    contextoGatilho: "fomo_social",
    recomendacoes: [
      "Proponha encontros em casa mensalmente — a memória é a mesma, o custo não",
      "Crie um 'fundo de experiências' conjunto com amigas para viagens planejadas",
      "Defina um teto mensal para programas sociais e comemore quando cumprir"
    ]
  },
  {
    id: "visionaria_pragmatica",
    nome: "A Visionária Pragmática",
    nomeIngles: "The Pragmatic Visionary",
    emoji: "📚",
    cor: "#2196F3",
    corSecundaria: "#E3F2FD",
    gatilho: "Insegurança com o futuro ou necessidade de controle",
    comportamento: "Gastos em cursos, livros e gadgets de produtividade. O gatilho é a ansiedade de 'não estar pronta'.",
    insightEspelho: "Você é movida por evolução. Seu consumo foca no eu do futuro, mas cuidado para não comprar ferramentas que nunca terá tempo de usar.",
    poderDeEscolha: "Investir em conhecimento é ótimo, mas ter dinheiro em conta é a maior ferramenta de liberdade que existe.",
    nomeDaReserva: "Reserva de Liberdade 📚",
    categoriasDominantes: ["autodesenvolvimento"],
    contextoGatilho: "ansiedade_futuro",
    recomendacoes: [
      "Antes de comprar um curso, termine o que já tem. Seus investimentos merecem ser aplicados",
      "Crie uma lista de espera de 7 dias para compras de autodesenvolvimento",
      "Conhecimento + reserva = liberdade real. Meta: guardar até dezembro"
    ]
  },
  {
    id: "alquimista_estetica",
    nome: "A Alquimista da Estética",
    nomeIngles: "The Aesthetic Alchemist",
    emoji: "✨",
    cor: "#F5A623",
    corSecundaria: "#FFF8E1",
    gatilho: "Baixa autoestima momentânea ou busca por validação",
    comportamento: "Compras por impulso em moda e procedimentos estéticos, geralmente após comparações em redes sociais.",
    insightEspelho: "Você tem um olhar apurado para o belo. O desafio é não deixar que sua confiança dependa da próxima etiqueta.",
    poderDeEscolha: "R$150 em uma peça que você usará pouco podem ser o início da sua 'Liberdade de Estilo'.",
    nomeDaReserva: "Liberdade de Estilo ✨",
    categoriasDominantes: ["moda", "beleza"],
    contextoGatilho: "busca_validacao",
    recomendacoes: [
      "Faça um detox de redes: 24h sem stories antes de qualquer compra de moda",
      "Invista em 3 peças de qualidade por trimestre em vez de 10 rápidas",
      "Seu estilo é poderoso. Canalize R$150/mês para a 'Liberdade de Estilo'"
    ]
  },
  {
    id: "refugiada_digital",
    nome: "A Refugiada Digital",
    nomeIngles: "The Digital Refugee",
    emoji: "📱",
    cor: "#00BCD4",
    corSecundaria: "#E0F7FA",
    gatilho: "Tédio, procrastinação ou escapismo",
    comportamento: "Pequenas comprinhas em apps e sites durante a noite. Gastos fragmentados de R$20-50 que somam montantes altos.",
    insightEspelho: "O scroll infinito virou consumo infinito. Você gasta para preencher o tempo ou aliviar o tédio do dia a dia.",
    poderDeEscolha: "Essas pequenas gotas de consumo estão esvaziando o balde da sua grande viagem. Troque o clique do tédio pelo clique do investimento.",
    nomeDaReserva: "Reserva da Grande Viagem 📱",
    categoriasDominantes: ["digital"],
    contextoGatilho: "tedio_noturno",
    recomendacoes: [
      "Instale um bloqueador de apps de compra após 21h por 30 dias",
      "Regra dos 7 dias: adicionou no carrinho? Espere 7 dias antes de comprar",
      "Some todas as comprinhas do mês — o número vai te surpreender. Redirecione metade"
    ]
  }
]

/**
 * Detecta o arquétipo de consumo baseado nas transações
 * 
 * REGRAS DE DETECÇÃO DOS 5 ARQUÉTIPOS:
 * 
 * A Curadora de Conforto:
 * - contextoEmocional 'pos_trabalho_exaustivo' representa > 30% dos gastos
 * - OU categorias 'alimentacao/delivery' + 'conforto' somam > 40%
 * 
 * A Arquiteta de Conexões:
 * - categoria 'social' representa > 35% dos gastos
 * - OU contexto 'fomo_social' representa > 25% das ocorrências
 * 
 * A Visionária Pragmática:
 * - categoria 'autodesenvolvimento' representa > 30% dos gastos
 * - OU contexto 'ansiedade_futuro' representa > 30% das ocorrências
 * 
 * A Alquimista da Estética:
 * - categorias 'moda' + 'beleza' somam > 40% dos gastos
 * - OU contexto 'busca_validacao' representa > 25% das ocorrências
 * 
 * A Refugiada Digital:
 * - contexto 'tedio_noturno' representa > 30% das ocorrências
 * - OU categoria 'digital' representa > 30% dos gastos
 * - OU mais de 40% das transações ocorrem no período 'noite'
 * 
 * @param {Array} transacoes - Lista de transações da usuária
 * @returns {Object} - Arquétipo detectado com todas as informações
 */
export function detectarArquetipo(transacoes: { valor: number; categoria: string; contextoEmocional: string; periodo: string; diaSemana?: string }[]) {
  const totalGeral = transacoes.reduce((a, b) => a + b.valor, 0)
  const totalTransacoes = transacoes.length
  
  // Calcula totais por categoria
  const totaisPorCategoria: Record<string, number> = {}
  transacoes.forEach(t => {
    totaisPorCategoria[t.categoria] = (totaisPorCategoria[t.categoria] || 0) + t.valor
  })
  
  // Calcula contagem por contexto emocional
  const contagemPorContexto: Record<string, number> = {}
  const valoresPorContexto: Record<string, number> = {}
  transacoes.forEach(t => {
    contagemPorContexto[t.contextoEmocional] = (contagemPorContexto[t.contextoEmocional] || 0) + 1
    valoresPorContexto[t.contextoEmocional] = (valoresPorContexto[t.contextoEmocional] || 0) + t.valor
  })
  
  // Calcula contagem por período
  const contagemPorPeriodo: Record<string, number> = {}
  transacoes.forEach(t => {
    contagemPorPeriodo[t.periodo] = (contagemPorPeriodo[t.periodo] || 0) + 1
  })
  
  // Objeto para armazenar scores de cada arquétipo
  const scores = {
    curadora_conforto: 0,
    arquiteta_conexoes: 0,
    visionaria_pragmatica: 0,
    alquimista_estetica: 0,
    refugiada_digital: 0
  }
  
  // Calcula percentuais relevantes
  const percentualPosTrabalho = ((valoresPorContexto['pos_trabalho_exaustivo'] || 0) / totalGeral) * 100
  const percentualAlimentacaoConforto = (((totaisPorCategoria['alimentacao'] || 0) + (totaisPorCategoria['conforto'] || 0)) / totalGeral) * 100
  const percentualSocial = ((totaisPorCategoria['social'] || 0) / totalGeral) * 100
  const percentualFomo = ((contagemPorContexto['fomo_social'] || 0) / totalTransacoes) * 100
  const percentualAutodesenvolvimento = ((totaisPorCategoria['autodesenvolvimento'] || 0) / totalGeral) * 100
  const percentualAnsiedade = ((contagemPorContexto['ansiedade_futuro'] || 0) / totalTransacoes) * 100
  const percentualModaBeleza = (((totaisPorCategoria['moda'] || 0) + (totaisPorCategoria['beleza'] || 0)) / totalGeral) * 100
  const percentualValidacao = ((contagemPorContexto['busca_validacao'] || 0) / totalTransacoes) * 100
  const percentualTedio = ((contagemPorContexto['tedio_noturno'] || 0) / totalTransacoes) * 100
  const percentualDigital = ((totaisPorCategoria['digital'] || 0) / totalGeral) * 100
  const percentualNoite = ((contagemPorPeriodo['noite'] || 0) / totalTransacoes) * 100
  
  // Curadora de Conforto
  if (percentualPosTrabalho > 30) scores.curadora_conforto += percentualPosTrabalho
  if (percentualAlimentacaoConforto > 40) scores.curadora_conforto += percentualAlimentacaoConforto
  scores.curadora_conforto += percentualPosTrabalho * 0.5 + percentualAlimentacaoConforto * 0.3
  
  // Arquiteta de Conexões
  if (percentualSocial > 35) scores.arquiteta_conexoes += percentualSocial
  if (percentualFomo > 25) scores.arquiteta_conexoes += percentualFomo
  scores.arquiteta_conexoes += percentualSocial * 0.5 + percentualFomo * 0.5
  
  // Visionária Pragmática
  if (percentualAutodesenvolvimento > 30) scores.visionaria_pragmatica += percentualAutodesenvolvimento
  if (percentualAnsiedade > 30) scores.visionaria_pragmatica += percentualAnsiedade
  scores.visionaria_pragmatica += percentualAutodesenvolvimento * 0.5 + percentualAnsiedade * 0.5
  
  // Alquimista da Estética
  if (percentualModaBeleza > 40) scores.alquimista_estetica += percentualModaBeleza
  if (percentualValidacao > 25) scores.alquimista_estetica += percentualValidacao
  scores.alquimista_estetica += percentualModaBeleza * 0.5 + percentualValidacao * 0.5
  
  // Refugiada Digital
  if (percentualTedio > 30) scores.refugiada_digital += percentualTedio
  if (percentualDigital > 30) scores.refugiada_digital += percentualDigital
  if (percentualNoite > 40) scores.refugiada_digital += percentualNoite * 0.5
  scores.refugiada_digital += percentualTedio * 0.3 + percentualDigital * 0.3 + percentualNoite * 0.2
  
  // Encontra o arquétipo com maior score
  let arquetipoDetectado = 'curadora_conforto'
  let maiorScore = 0
  
  for (const [id, score] of Object.entries(scores)) {
    if (score > maiorScore) {
      maiorScore = score
      arquetipoDetectado = id
    }
  }
  
  // Busca os dados completos do arquétipo
  const arquetipo = arquetipos.find(a => a.id === arquetipoDetectado)
  
  // Calcula o percentual de match (normalizado para 0-100)
  const totalScores = Object.values(scores).reduce((a, b) => a + b, 0)
  const percentualMatch = totalScores > 0 ? (maiorScore / totalScores) * 100 : 50
  
  return {
    ...arquetipo,
    percentualMatch: Math.min(Math.max(percentualMatch, 40), 95), // Entre 40% e 95%
    scores,
    detalhes: {
      percentualPosTrabalho,
      percentualAlimentacaoConforto,
      percentualSocial,
      percentualFomo,
      percentualAutodesenvolvimento,
      percentualAnsiedade,
      percentualModaBeleza,
      percentualValidacao,
      percentualTedio,
      percentualDigital,
      percentualNoite
    }
  }
}

/**
 * Gera insights personalizados baseados no arquétipo e transações
 * @param {Object} arquetipo - Arquétipo detectado
 * @param {Array} transacoes - Lista de transações
 * @returns {Array} - Lista de insights personalizados
 */
export function gerarInsights(arquetipo: { id: string; contextoGatilho: string; categoriasDominantes: string[] }, transacoes: { valor: number; periodo: string; contextoEmocional: string; categoria: string; diaSemana?: string }[]) {
  const insights = []
  const totalGeral = transacoes.reduce((a, b) => a + b.valor, 0)
  
  // Calcula métricas para os insights
  const gastosNoite = transacoes.filter(t => t.periodo === 'noite')
  const percentualNoite = (gastosNoite.length / transacoes.length) * 100
  const valorNoite = gastosNoite.reduce((a, b) => a + b.valor, 0)
  
  const gastosContexto = transacoes.filter(t => t.contextoEmocional === arquetipo.contextoGatilho)
  const valorContexto = gastosContexto.reduce((a, b) => a + b.valor, 0)
  
  const gastosCategorias = arquetipo.categoriasDominantes.reduce((acc, cat) => {
    return acc + transacoes.filter(t => t.categoria === cat).reduce((a, b) => a + b.valor, 0)
  }, 0)
  
  switch (arquetipo.id) {
    case 'curadora_conforto':
      insights.push({
        emoji: '🕯️',
        texto: `${((valorContexto / totalGeral) * 100).toFixed(0)}% dos seus gastos acontecem após dias exaustivos`
      })
      insights.push({
        emoji: '🏠',
        texto: `Você gastou R$${gastosCategorias.toFixed(2)} em conforto esse mês. Isso é cuidado, mas também pode ser reserva.`
      })
      insights.push({
        emoji: '🌙',
        texto: `${percentualNoite.toFixed(0)}% das suas compras são no período noturno`
      })
      break
      
    case 'arquiteta_conexoes':
      insights.push({
        emoji: '🥂',
        texto: `Você foi generosa: R$${gastosCategorias.toFixed(2)} em programas sociais e presentes`
      })
      insights.push({
        emoji: '💝',
        texto: `Sua vida social representa ${((gastosCategorias / totalGeral) * 100).toFixed(0)}% do orçamento — vibrante, mas pode ser otimizada`
      })
      insights.push({
        emoji: '📅',
        texto: `${gastosContexto.length} transações motivadas por FOMO neste mês`
      })
      break
      
    case 'visionaria_pragmatica':
      const cursosLivros = transacoes.filter(t => t.categoria === 'autodesenvolvimento')
      insights.push({
        emoji: '📚',
        texto: `${cursosLivros.length} compras de autodesenvolvimento esse mês. Quantas você já usou?`
      })
      insights.push({
        emoji: '🎯',
        texto: `Você investiu R$${gastosCategorias.toFixed(2)} no eu do futuro. Mas e a reserva do eu presente?`
      })
      insights.push({
        emoji: '⏰',
        texto: `${((gastosContexto.length / transacoes.length) * 100).toFixed(0)}% das compras foram motivadas por ansiedade com o futuro`
      })
      break
      
    case 'alquimista_estetica':
      const gastosFinDeSemana = transacoes.filter(t => 
        t.diaSemana === 'sabado' || t.diaSemana === 'domingo'
      ).filter(t => t.categoria === 'moda' || t.categoria === 'beleza')
      insights.push({
        emoji: '✨',
        texto: `${((gastosFinDeSemana.length / transacoes.filter(t => t.categoria === 'moda' || t.categoria === 'beleza').length) * 100).toFixed(0)}% dos seus gastos em moda acontecem no fim de semana`
      })
      insights.push({
        emoji: '💄',
        texto: `Você tem um gosto refinado. R$${gastosCategorias.toFixed(2)}/mês podem construir um guarda-roupa de qualidade COM sobra`
      })
      insights.push({
        emoji: '📱',
        texto: `${gastosContexto.length} compras ligadas a busca de validação`
      })
      break
      
    case 'refugiada_digital':
      const pequenasCompras = transacoes.filter(t => t.valor <= 50 && t.periodo === 'noite')
      insights.push({
        emoji: '📱',
        texto: `${pequenasCompras.length} pequenas compras noturnas esse mês. Somadas: R$${pequenasCompras.reduce((a, b) => a + b.valor, 0).toFixed(2)}`
      })
      insights.push({
        emoji: '🌙',
        texto: `Seu horário de maior consumo é entre 20h e 00h. O carrinho nunca dorme.`
      })
      insights.push({
        emoji: '💸',
        texto: `${percentualNoite.toFixed(0)}% dos gastos acontecem à noite — o scroll virou consumo`
      })
      break
  }
  
  return insights
}
