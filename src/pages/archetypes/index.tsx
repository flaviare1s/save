import { detectarArquetipo, gerarInsights } from "./../../utils/arquetipos";
import { calcularReserva, potencialEconomia } from "./../../utils/calculos";
import dados from "./../../data/transactions.json";
import { ArchetypeCard } from "./archetype-card";
import { InsightCard } from "./insight-card";
import { Progress } from "./progress";
import { Recomendations } from "./recomendations";

// Imports de imagens
import theAestheticAlchemist from "../../assets/images/theAestheticAlchemist.png";
import theComfortCurator from "../../assets/images/theComfortCurator.png";
import theConnectionArchitect from "../../assets/images/theConnectionArchitect.png";
import theDigitalRefugee from "../../assets/images/theDigitalRefugee.png";
import thePragmaticVisionary from "../../assets/images/thePragmaticVisionary.png";
import theNerdColleccor from "../../assets/images/theNerdColleccor.png";

export default function ArquetipoPage() {
  const { usuario, transacoes } = dados;

  const imagensArquetipos: Record<string, string> = {
    "Alquimista da Estética": theAestheticAlchemist,
    "Curadora de Conforto": theComfortCurator,
    "Arquiteta de Conexões": theConnectionArchitect,
    "Refugiada Digital": theDigitalRefugee,
    "Visionária Pragmática": thePragmaticVisionary,
    "Nerd Collector": theNerdColleccor,
  };

  // Lógica de detecção e dados
  const detectedArquetipo = detectarArquetipo(transacoes);

  // CORREÇÃO: Adicionamos a propriedade 'imagem' ao objeto arquetipo para o card usar
  const arquetipo = {
    ...detectedArquetipo,
    imagem: imagensArquetipos[detectedArquetipo.nome] || "",
    cor: detectedArquetipo.cor ?? "#7B2D8B",
    corSecundaria: detectedArquetipo.corSecundaria ?? "#F7F3FF",
  };

  const insights = gerarInsights(arquetipo, transacoes);
  const reserva = calcularReserva(usuario.rendaMensal);
  const economia = potencialEconomia(transacoes);
  const reservaAtual = economia.economiaSugerida * 0.3;

  return (
    <div className="min-h-screen bg-[#07110c] text-white">
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <p className="text-sm text-[#32d6ff] font-medium mb-2 uppercase tracking-widest">
            Seu resultado
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-[#f5ffe7]">
            Meu Arquétipo SAVE
          </h1>
        </div>

        <div className="mb-12">
          <ArchetypeCard arquetipo={arquetipo} />
        </div>

        {/* Seção de Seleção dos Arquétipos */}
        <div className="bg-white/5 rounded-3xl p-8 mb-12 border border-white/10">
          <h3 className="font-semibold text-[#f5ffe7] mb-8 text-center text-lg">
            Os Arquétipos SAVE
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(imagensArquetipos).map(([nome, img], index) => {
              const isSelected = arquetipo.nome === nome;
              return (
                <div
                  key={index}
                  className={`text-center p-4 rounded-2xl border transition-all duration-300 ${
                    isSelected
                      ? "border-[#c084fc] bg-[#c084fc]/10 scale-105 shadow-lg shadow-[#c084fc]/50"
                      : "border-transparent hover:shadow-md hover:shadow-white/20"
                  }`}
                >
                  <img
                    src={img}
                    alt={nome}
                    className="w-24 h-24 mx-auto mb-2 object-contain filter brightness-100 hover:brightness-125"
                  />
                  <p className="text-[9px] font-bold text-[#9fb0a3] mt-2 uppercase leading-tight">
                    {nome}
                  </p>
                  {isSelected && (
                    <span className="text-[8px] bg-[#c084fc] text-[#07110c] px-2 py-0.5 rounded-full mt-2 inline-block font-bold">
                      VOCÊ
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* --- O QUE ESTAVA FALTANDO ABAIXO --- */}

        {/* Insights Personalizados */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-[#f5ffe7] mb-6 text-center">
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

        {/* Barra de progresso */}
        <div className="mb-12">
          <Progress
            nomeReserva={arquetipo.nomeDaReserva ?? "Reserva"}
            meta={reserva.valor}
            atual={reservaAtual}
            cor={arquetipo.cor}
          />
        </div>

        {/* Recomendações */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-[#f5ffe7] mb-6 text-center">
            Recomendações para Você
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {arquetipo.recomendacoes?.map(
              (recomendacao: any, index: number) => (
                <Recomendations
                  key={index}
                  numero={index + 1}
                  texto={recomendacao}
                  cor={arquetipo.cor}
                />
              ),
            )}
          </div>
        </div>

        {/* Mensagem inspiracional final */}
        <div className="text-center p-10 rounded-3xl bg-white/5 border border-white/10">
          <p
            className="text-lg font-medium mb-3"
            style={{ color: arquetipo.cor }}
          >
            {arquetipo.emoji} Lembre-se
          </p>
          <p className="text-[#9fb0a3] text-sm leading-relaxed max-w-lg mx-auto italic">
            "Seu arquétipo não é um rótulo, é um espelho. Use essa consciência
            para fazer escolhas mais alinhadas com quem você realmente quer
            ser."
          </p>
        </div>
      </main>
    </div>
  );
}
