import { BrowserRouter } from 'react-router-dom'

import { AuthProvider } from './contexts/auth-context'
import { AppRoutes } from './routes'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
