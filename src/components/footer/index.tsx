import logo from "../../assets/images/logo.png";

export const Footer = () => {
  return (
    <footer className="mt-12 py-8 border-t border-border">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-12 h-12" >
            <img src={logo} alt="SAVE Logo" className="w-full h-full p-1" />
          </div>
          <span className="font-bold text-foreground">SAVE</span>
        </div>
        <p className="text-sm text-[#7B2D8B] font-medium italic mb-2">
          &ldquo;De mulheres para mulheres. Para você ir muito além do consumo inteligente.&rdquo;
        </p>
        <p className="text-xs text-muted-foreground">
          Mais que uma análise de padrões, SAVE é uma curadoria de consumo criada por mulheres.
        </p>
      </div>
    </footer>
  )
}
