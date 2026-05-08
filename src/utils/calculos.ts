/**
 * Representa uma transação básica
 */
type Transacao = {
  valor: number
  categoria?: string
  contextoEmocional?: string
  periodo?: 'manha' | 'tarde' | 'noite'
  diaSemana?: 'segunda' | 'terca' | 'quarta' | 'quinta' | 'sexta' | 'sabado' | 'domingo'
}

/**
 * Calcula o total gasto por categoria
 * @param {Array} transacoes - Lista de transações
 * @returns {Object} - Objeto com totais por categoria
 */
export function totalPorCategoria(transacoes: Array<Transacao & { categoria: string }>) {
  return transacoes.reduce<Record<string, number>>((acc, transacao) => {
    const categoria = transacao.categoria
    acc[categoria] = (acc[categoria] || 0) + transacao.valor
    return acc
  }, {})
}

/**
 * Identifica a categoria dominante (maior % do total)
 * @param {Array} transacoes - Lista de transações
 * @returns {Object} - Categoria dominante com nome e percentual
 */
export function categoriaDominante(transacoes: Array<Transacao & { categoria: string }>) {
  const totais = totalPorCategoria(transacoes)
  const totalGeral = Object.values(totais).reduce((a, b) => a + b, 0)
  
  let maior = { categoria: '', valor: 0, percentual: 0 }
  
  for (const [categoria, valor] of Object.entries(totais)) {
    if (valor > maior.valor) {
      maior = {
        categoria,
        valor,
        percentual: totalGeral > 0 ? (valor / totalGeral) * 100 : 0
      }
    }
  }
  
  return maior
}

/**
 * Calcula o percentual de gastos por contexto emocional
 * @param {Array} transacoes - Lista de transações
 * @returns {Object} - Objeto com percentuais por contexto
 */
export function percentualPorContexto(transacoes: Array<Transacao & { contextoEmocional: string }>) {
  const contagem: Record<string, number> = {}
  const valores: Record<string, number> = {}
  const totalTransacoes = transacoes.length
  const totalValor = transacoes.reduce((a, b) => a + b.valor, 0)
  
  transacoes.forEach(transacao => {
    const contexto = transacao.contextoEmocional
    contagem[contexto] = (contagem[contexto] || 0) + 1
    valores[contexto] = (valores[contexto] || 0) + transacao.valor
  })
  
  const resultado: Record<string, {
    ocorrencias: number
    percentualOcorrencias: number
    valorTotal: number
    percentualValor: number
  }> = {}
  for (const contexto of Object.keys(contagem)) {
    resultado[contexto] = {
      ocorrencias: contagem[contexto],
      percentualOcorrencias: totalTransacoes > 0 ? (contagem[contexto] / totalTransacoes) * 100 : 0,
      valorTotal: valores[contexto],
      percentualValor: totalValor > 0 ? (valores[contexto] / totalValor) * 100 : 0
    }
  }
  
  return resultado
}

/**
 * Calcula gastos por período do dia
 * @param {Array} transacoes - Lista de transações
 * @returns {Object} - Objeto com totais por período
 */
export function gastosPorPeriodo(transacoes: Array<Transacao & { periodo: 'manha' | 'tarde' | 'noite' }>) {
  const periodos = { manha: 0, tarde: 0, noite: 0 }
  const contagem = { manha: 0, tarde: 0, noite: 0 }
  
  transacoes.forEach(transacao => {
    periodos[transacao.periodo] += transacao.valor
    contagem[transacao.periodo]++
  })
  
  const total = Object.values(periodos).reduce((a, b) => a + b, 0)
  
  return {
    manha: {
      valor: periodos.manha,
      percentual: total > 0 ? (periodos.manha / total) * 100 : 0,
      quantidade: contagem.manha
    },
    tarde: {
      valor: periodos.tarde,
      percentual: total > 0 ? (periodos.tarde / total) * 100 : 0,
      quantidade: contagem.tarde
    },
    noite: {
      valor: periodos.noite,
      percentual: total > 0 ? (periodos.noite / total) * 100 : 0,
      quantidade: contagem.noite
    }
  }
}

/**
 * Calcula a média de gasto semanal
 * @param {Array} transacoes - Lista de transações
 * @returns {number} - Média semanal
 */
export function mediaSemanal(transacoes: Transacao[]) {
  const totalGasto = transacoes.reduce((a, b) => a + b.valor, 0)
  // Assumindo 4 semanas no mês
  return totalGasto / 4
}

/**
 * Calcula a variação percentual de uma categoria em relação ao total
 * @param {Array} transacoes - Lista de transações
 * @param {string} categoria - Nome da categoria
 * @returns {number} - Percentual da categoria
 */
export function variacaoCategoria(transacoes: Array<Transacao & { categoria: string }>, categoria: string) {
  const totais = totalPorCategoria(transacoes)
  const totalGeral = Object.values(totais).reduce((a, b) => a + b, 0)
  
  return totalGeral > 0 ? ((totais[categoria] || 0) / totalGeral) * 100 : 0
}

/**
 * Calcula a reserva sugerida (20% da renda)
 * @param {number} rendaMensal - Renda mensal da usuária
 * @returns {Object} - Objeto com valor da reserva e detalhes
 */
export function calcularReserva(rendaMensal: number) {
  const valorReserva = rendaMensal * 0.2
  return {
    valor: valorReserva,
    percentual: 20,
    metaAnual: valorReserva * 12
  }
}

/**
 * Calcula o potencial de economia mensal
 * @param {Array} transacoes - Lista de transações
 * @returns {Object} - Potencial de economia identificado
 */
export function potencialEconomia(transacoes: Array<Transacao & { contextoEmocional: string }>) {
  // Identifica gastos por impulso (tedio_noturno e busca_validacao)
  const gastosImpulso = transacoes.filter(t => 
    t.contextoEmocional === 'tedio_noturno' || 
    t.contextoEmocional === 'busca_validacao'
  )
  
  const totalImpulso = gastosImpulso.reduce((a, b) => a + b.valor, 0)
  const totalGeral = transacoes.reduce((a, b) => a + b.valor, 0)
  
  // Sugerimos economizar 30% dos gastos por impulso
  const economiasugerida = totalImpulso * 0.3
  
  return {
    gastosImpulso: totalImpulso,
    percentualImpulso: totalGeral > 0 ? (totalImpulso / totalGeral) * 100 : 0,
    economiaSugerida: economiasugerida,
    quantidadeTransacoes: gastosImpulso.length
  }
}

/**
 * Calcula o total gasto no mês
 * @param {Array} transacoes - Lista de transações
 * @returns {number} - Total gasto
 */
export function totalGasto(transacoes: { valor: number }[]) {
  return transacoes.reduce((a, b) => a + b.valor, 0)
}

/**
 * Retorna os maiores gastos do mês
 * @param {Array} transacoes - Lista de transações
 * @param {number} quantidade - Quantidade de gastos a retornar
 * @returns {Array} - Lista dos maiores gastos
 */
export function maioresGastos(transacoes: { valor: number }[], quantidade = 5) {
  return [...transacoes]
    .sort((a, b) => b.valor - a.valor)
    .slice(0, quantidade)
}

/**
 * Calcula gastos por dia da semana
 * @param {Array} transacoes - Lista de transações
 * @returns {Object} - Gastos agrupados por dia
 */
export function gastosPorDiaSemana(transacoes: Array<Transacao & { diaSemana: 'segunda' | 'terca' | 'quarta' | 'quinta' | 'sexta' | 'sabado' | 'domingo' }>) {
  const dias = {
    segunda: { valor: 0, quantidade: 0 },
    terca: { valor: 0, quantidade: 0 },
    quarta: { valor: 0, quantidade: 0 },
    quinta: { valor: 0, quantidade: 0 },
    sexta: { valor: 0, quantidade: 0 },
    sabado: { valor: 0, quantidade: 0 },
    domingo: { valor: 0, quantidade: 0 }
  }
  
  transacoes.forEach(t => {
    const diaSemana = t.diaSemana as keyof typeof dias
    if (diaSemana in dias) {
      dias[diaSemana].valor += t.valor
      dias[diaSemana].quantidade++
    }
  })
  
  return dias
}

/**
 * Formata valor em Real brasileiro
 * @param {number} valor - Valor a ser formatado
 * @returns {string} - Valor formatado
 */
export function formatarMoeda(valor: number) {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

/**
 * Formata percentual
 * @param {number} valor - Valor do percentual
 * @returns {string} - Percentual formatado
 */
export function formatarPercentual(valor: number) {
  return `${valor.toFixed(1)}%`
}
