export const Footer = () => {
  return (
    <footer>
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Save. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}
