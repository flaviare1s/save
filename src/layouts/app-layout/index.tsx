import { Outlet } from 'react-router-dom'

import { Footer } from '../../components/footer'
import { Header } from '../../components/header'
import { FloatLink } from '../../components/float-link'
import { ScrollToTop } from '../../components/scroll-to-top'

export const AppLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <FloatLink />
      <Footer />
    </div>
  )
}
