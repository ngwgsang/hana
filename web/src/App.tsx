import type { ReactNode } from 'react'
import { ThemeProvider } from 'src/context/ThemeContext'
import { GlobalProvider } from 'src/context/GlobalContext'
import { FatalErrorBoundary, RedwoodProvider } from '@redwoodjs/web'
import { RedwoodApolloProvider } from '@redwoodjs/web/apollo'
import FatalErrorPage from 'src/pages/FatalErrorPage'

import './index.css'
import './scaffold.css'


interface AppProps {
  children?: ReactNode
}

const App = ({ children }: AppProps) => {

  return (
  <FatalErrorBoundary page={FatalErrorPage}>
    <ThemeProvider>
      <GlobalProvider>
      <RedwoodProvider titleTemplate="%AppTitle">
        <RedwoodApolloProvider>{children}</RedwoodApolloProvider>
      </RedwoodProvider>
      </GlobalProvider>
    </ThemeProvider>
  </FatalErrorBoundary>
)
}
export default App
