import { Outlet } from 'react-router-dom'

import { Footer } from '../../components/footer'
import { Header } from '../../components/header'
import { FloatLink } from '../../components/float-link'

export const AppLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <FloatLink />
      <Footer />
    </div>
  )
}
