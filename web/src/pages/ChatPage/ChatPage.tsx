// import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import MainLayout from 'src/layouts/MainLayout/MainLayout'

const ChatPage = () => {
  return (
    <>
      <Metadata title="Chat" description="Chat page" />
      <MainLayout>
        <h1>ChatPage</h1>
        <p>
          Find me in <code>./web/src/pages/ChatPage/ChatPage.tsx</code>
        </p>
      </MainLayout>

    </>
  )
}

export default ChatPage
