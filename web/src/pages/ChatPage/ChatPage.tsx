// import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

const ChatPage = () => {
  return (
    <>
      <Metadata title="Chat" description="Chat page" />

      <h1>ChatPage</h1>
      <p>
        Find me in <code>./web/src/pages/ChatPage/ChatPage.tsx</code>
      </p>
      {/*
          My default route is named `chat`, link to me with:
          `<Link to={routes.chat()}>Chat</Link>`
      */}
    </>
  )
}

export default ChatPage
