// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Set, Router, Route } from '@redwoodjs/router'
import Home from 'src/pages/HomePage'
import LibraryPage from './pages/LibraryPage'

const Routes = () => {
  return (
    <Router>
      <Route path="/login" page={LoginPage} name="login" />
      {/* <Route path="/chat" page={ChatPage} name="chat" />
      <Route path="/agents" page={AgentsPage} name="agents" /> */}
      <Route path="/home" page={Home} name="home" />
      <Route path="/library" page={LibraryPage} name="library" />
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
