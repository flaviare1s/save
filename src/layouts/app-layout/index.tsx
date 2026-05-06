import { Outlet } from 'react-router-dom'

import { Footer } from '../../components/footer'
import { Header } from '../../components/header'

export const AppLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
