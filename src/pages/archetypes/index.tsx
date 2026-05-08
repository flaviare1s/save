
import { detectarArquetipo, gerarInsights } from './../../utils/arquetipos'
import { calcularReserva, potencialEconomia } from './../../utils/calculos'
import dados from './../../data/transactions.json'
import { ArchetypeCard } from './archetype-card'
import { InsightCard } from './insight-card'
import { Progress } from './progress'
import { Recomendations } from './recomendations'

export default function ArquetipoPage() {
  const { usuario, transacoes } = dados
  
  // Detecta o arquétipo baseado nas transações
  const detectedArquetipo = detectarArquetipo(transacoes)
  const arquetipo = {
    ...detectedArquetipo,
    cor: detectedArquetipo.cor ?? '#7B2D8B',
    corSecundaria: detectedArquetipo.corSecundaria ?? '#F7F3FF',
  }
  
  // Gera insights personalizados
  const insights = gerarInsights(arquetipo, transacoes)
  
  // Calcula a reserva sugerida
  const reserva = calcularReserva(usuario.rendaMensal)
  const economia = potencialEconomia(transacoes)
  
  // Simula um valor atual de reserva (em produção viria do banco)
  const reservaAtual = economia.economiaSugerida * 0.3
  
  return (
    <div className="min-h-screen bg-background">
         
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Título da página */}
        <div className="mb-8 text-center">
          <p className="text-sm text-[#7B2D8B] font-medium mb-2">Seu resultado</p>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Meu Arquétipo SAVE
          </h1>
          <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
            Baseado na análise dos seus padrões de consumo, identificamos seu perfil único.
          </p>
        </div>
        
        {/* Card do Arquétipo - O coração do sistema */}
        <div className="mb-8 animate-fade-in-scale">
          <ArchetypeCard arquetipo={arquetipo} />
        </div>
        
        {/* Insights personalizados */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4 text-center">
            Seus Insights Personalizados
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {insights.map((insight: any, index: number) => (
              <div 
                key={index} 
                className="animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <InsightCard 
                  emoji={insight.emoji}
                  texto={insight.texto}
                  destaque={index === 0}
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Barra de progresso da reserva */}
        <div className="mb-8 animate-slide-up delay-300">
          <Progress
            nomeReserva={arquetipo.nomeDaReserva ?? 'Reserva'}
            meta={reserva.valor}
            atual={reservaAtual}
            cor={arquetipo.cor}
          />
        </div>
        
        {/* Recomendações de economia */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4 text-center">
            Recomendações para Você
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {arquetipo.recomendacoes?.map((recomendacao: any, index: number) => (
              <div 
                key={index}
                className="animate-slide-up"
                style={{ animationDelay: `${(index + 4) * 100}ms` }}
              >
                <Recomendations
                  numero={index + 1}
                  texto={recomendacao}
                  cor={arquetipo.cor}
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Seção de todos os arquétipos */}
        <div className="bg-card rounded-2xl border border-border p-6 mb-8">
          <h3 className="font-semibold text-foreground mb-4 text-center">
            Os 5 Arquétipos SAVE
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { emoji: '🕯️', nome: 'Curadora de Conforto', cor: '#c084fc' },
              { emoji: '🥂', nome: 'Arquiteta de Conexões', cor: '#b6ff00' },
              { emoji: '📚', nome: 'Visionária Pragmática', cor: '#32d6ff' },
              { emoji: '✨', nome: 'Alquimista da Estética', cor: '#c084fc' },
              { emoji: '📱', nome: 'Refugiada Digital', cor: '#b6ff00' },
            ].map((arq, index) => (
              <div 
                key={index}
                className={`text-center p-4 rounded-xl transition-all ${
                  arquetipo.emoji === arq.emoji 
                    ? 'ring-2 scale-105' 
                    : 'opacity-60 hover:opacity-100'
                }`}
                style={{ 
                  backgroundColor: arq.cor + '15',
                  borderColor: arquetipo.emoji === arq.emoji ? arq.cor : 'transparent'
                }}
              >
                <span className="text-3xl">{arq.emoji}</span>
                <p className="text-xs font-medium text-foreground mt-2 leading-tight">
                  {arq.nome}
                </p>
                {arquetipo.emoji === arq.emoji && (
                  <span className="inline-block mt-2 text-[10px] font-medium px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: arq.cor }}>
                    Você
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Mensagem inspiracional final */}
        <div 
          className="text-center p-8 rounded-2xl animate-pulse-glow"
          style={{ backgroundColor: arquetipo.corSecundaria }}
        >
          <p className="text-lg font-medium mb-2" style={{ color: arquetipo.cor }}>
            {arquetipo.emoji} Lembre-se
          </p>
          <p className="text-foreground text-sm leading-relaxed max-w-lg mx-auto">
            Seu arquétipo não é um rótulo, é um espelho. Use essa consciência para fazer 
            escolhas mais alinhadas com quem você realmente quer ser. 
            <span className="font-medium" style={{ color: arquetipo.cor }}> Você tem o poder de escolha.</span>
          </p>
        </div>
      </main>
      
      
    </div>
  )
}