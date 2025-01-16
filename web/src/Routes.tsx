// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Set, Router, Route } from '@redwoodjs/router'

import ScaffoldLayout from 'src/layouts/ScaffoldLayout'
import Home from 'src/pages/HomePage'

const Routes = () => {
  return (
    <Router>
      <Set wrap={ScaffoldLayout} title="Messages" titleTo="messages" buttonLabel="New Message" buttonTo="newMessage">
        <Route path="/messages/new" page={MessageNewMessagePage} name="newMessage" />
        <Route path="/messages/{id:Int}/edit" page={MessageEditMessagePage} name="editMessage" />
        <Route path="/messages/{id:Int}" page={MessageMessagePage} name="message" />
        <Route path="/messages" page={MessageMessagesPage} name="messages" />
      </Set>
      <Route path="/chat" page={ChatPage} name="chat" />
      <Route path="/agents" page={AgentsPage} name="agents" />
      <Route path="/home" page={Home} name="home" />
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
