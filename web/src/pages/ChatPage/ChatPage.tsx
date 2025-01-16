import { Metadata, useQuery, useMutation, gql } from '@redwoodjs/web'
import { useState, useEffect, useRef } from 'react'
import MainLayout from 'src/layouts/MainLayout/MainLayout'

// Query lấy danh sách tin nhắn
const GET_MESSAGES = gql`
  query GetMessages {
    messages {
      id
      sender
      content
      timestamp
    }
  }
`

// Mutation thêm tin nhắn
const CREATE_MESSAGE = gql`
  mutation CreateMessage($input: CreateMessageInput!) {
    createMessage(input: $input) {
      id
      sender
      content
      timestamp
    }
  }
`

const ChatPage = () => {
  const { data, loading, error } = useQuery(GET_MESSAGES)

  const [createMessage] = useMutation(CREATE_MESSAGE, {
    update(cache, { data: { createMessage } }) {
      const existingMessages = cache.readQuery({ query: GET_MESSAGES })

      if (existingMessages) {
        cache.writeQuery({
          query: GET_MESSAGES,
          data: {
            messages: [...existingMessages.messages, createMessage],
          },
        })
      }
    },
  })

  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const prevMessageCountRef = useRef<number>(0)

  // Scroll xuống cuối khi có tin nhắn mới
  useEffect(() => {
    if (data && data.messages.length > prevMessageCountRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      prevMessageCountRef.current = data.messages.length
    }
  }, [data])

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return

    try {
      await createMessage({
        variables: {
          input: {
            sender: 'me',
            content: inputValue,
            isAct: true,
          },
        },
      })
      setInputValue('')
    } catch (error) {
      console.error('Lỗi khi gửi tin nhắn:', error)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage()
    }
  }

  if (loading) return <p>Đang tải tin nhắn...</p>
  if (error) return <p>Lỗi: {error.message}</p>

  return (
    <>
      <Metadata title="Chat" description="Chat page" />
      <MainLayout>
          <div className="w-full h-[70vh] rounded-lg overflow-y-auto gap-3 flex flex-col no-scrollbar">
            {/* Khung Chat */}
              {data.messages.length === 0 ? (
                <p className="text-center text-gray-400">Chưa có tin nhắn...</p>
              ) : (
                [...data.messages]
                  .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
                  .map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                      <div className='flex flex-col gap-1'>
                        <p className={`relative p-2 rounded-md max-w-xs ${
                          msg.sender === 'me'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>{msg.content}</p>
                        <p className="text-xs text-gray-500">{msg.sender === 'me' ? 'Bạn' : msg.sender} gửi lúc {new Date(msg.timestamp).toLocaleTimeString()}</p>
                      </div>

                    </div>
                  ))
              )}
              <div ref={messagesEndRef} />
          </div>

            <div className="flex w-[40vw] mx-auto">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập tin nhắn..."
                className="flex-1 p-2 border rounded-l-md focus:outline-none text-slate-800"
              />
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-slate-600 text-white rounded-r-md hover:bg-slate-700"
              >
                Gửi
              </button>
            </div>
      </MainLayout>
    </>
  )
}

export default ChatPage
