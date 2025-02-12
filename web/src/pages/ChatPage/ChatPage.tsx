import { Metadata, useQuery, useMutation, gql } from '@redwoodjs/web'
import { useState, useEffect, useRef } from 'react'
import MainLayout from 'src/layouts/MainLayout/MainLayout'
import { GoogleGenerativeAI } from "@google/generative-ai";
import Popup from 'src/components/Popup'
import ToggleButton from 'src/components/ToggleButton/ToggleButton';
import useTelegram from 'src/hook/useTelegram';

// Query lấy danh sách tin nhắn
const GET_MESSAGES = gql`
  query GetMessages {
    messages {
      id
      sender
      content
      timestamp
      isAct
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
      isAct
    }
  }
`

// Query lấy danh sách agent
const GET_AGENTS = gql`
  query GetAgents {
    agents {
      id
      name
      avatar
      settings
    }
  }
`
const GET_MESSAGES_AND_AGENTS = gql`
  query GetMessagesAndAgents {
    messages {
      id
      sender
      content
      timestamp
      isAct
    }
    agents {
      id
      name
      avatar
      settings
    }
  }
`



const ChatPage = () => {


const sendToTelegram = {
  name: 'sendToTelegram',
  description: 'Send a message to a specific my Telegram.',
  parameters: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        description: 'The content of the message to send.',
      },
    },
    required: ['message'],
  },
  execute: async ({ message }) => {
    const botToken = process.env.REDWOOD_ENV_TELEGRAM_BOT_TOKEN
    try {
      const response = await fetch(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: process.env.REDWOOD_ENV_USERID,
            text: message,
          }),
        }
      )
      if (!response.ok) {
        throw new Error('Failed to send message')
      }
      return { success: true }
    } catch (error) {
      console.error('Error sending message to Telegram:', error)
      return { success: false, error: error.message }
    }
  },
}


  const { data, loading, error } = useQuery(GET_MESSAGES_AND_AGENTS)
  const [avatars, setAvatars] = useState({})
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [threadConfig, setThreadConfig] = useState({}) // Lưu trạng thái toggle của từng agent
  const telegram = useTelegram(process.env.REDWOOD_ENV_TELEGRAM_BOT_TOKEN)


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

  const handleToggle = (agentName) => {
    setThreadConfig((prevConfig) => ({
      ...prevConfig,
      [agentName]: { active: !prevConfig[agentName]?.active }, // Đảo ngược trạng thái
    }))
  }

  useEffect(() => {
    if (data && data.agents) {
      // Chuyển danh sách agents thành object { name: avatar_url }
      const avatarMapping = data.agents.reduce((acc, agent) => {
        acc[agent.name] = agent.avatar
        return acc
      }, {})
      const initialConfig = data.agents.reduce((acc, agent) => {
        acc[agent.name] = { active: true } // Mặc định tất cả agents bật
        return acc
      }, {})
      setAvatars(avatarMapping)
      setThreadConfig(initialConfig)
    }
  }, [])


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
            isAct: false,
          },
        },
      })
      setInputValue('')
      // telegram.sendMessage(process.env.REDWOOD_ENV_USERID, inputValue)
      data.agents.map(agent => {
        if (threadConfig[agent.name].active) {
          handleReplyMessage(agent.name, JSON.parse(agent.settings).prompt, inputValue)
        }
      })
    } catch (error) {
      console.error('Lỗi khi gửi tin nhắn:', error)
    }
  }

  const handleReplyMessage = async (agentName, agentPrompt, userMessage: string) => {
    console.log(agentPrompt)
    if (inputValue.trim() === '') return
    try {
      const genAI = new GoogleGenerativeAI(process.env.REDWOOD_ENV_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" ,   tools: {sendToTelegramTool: [sendToTelegram]}});
      const prompt = `
      # SYSTEM PROMPT
      ${agentPrompt}
      Bạn có thể sử dụng tool nếu cần. Đây là danh sách các tool:
        1. Sử dụng 'sendToTelegram' để gửi tin nhắn đến telegram của tôi.

      # TASK
      ${agentPrompt}
      `;
      const result = await model.generateContent(prompt);
      await createMessage({
        variables: {
          input: {
            sender: agentName,
            content: result.response.text(),
            isAct: false,
          },
        },
      })
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
  // console.log(data.messages)

  return (
    <>
      <Metadata title="Chat" description="Chat page" />
      <MainLayout>
        <div className="w-full h-[75vh] rounded-lg overflow-y-auto gap-5 flex flex-col no-scrollbar">
          {/* Khung Chat */}
          {data.messages.length === 0 ? (
            <p className="text-center text-gray-400">Chưa có tin nhắn...</p>
          ) : (
            [...data.messages]
              .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
              .map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                  {msg.isAct === true ?
                    (<div className='flex flex-col gap-1'>
                      <p className="relative p-2 rounded-md max-w-xs text-blue-500">🅰️ [{new Date(msg.timestamp).toLocaleTimeString()}] {msg.sender} {msg.content}</p>
                    </div>)
                    :
                    (<div className={`flex gap-1 ${msg.sender == 'me' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <img
                        className='w-8 h-8 rounded-full relative -translate-y-4 border-2'
                        src={`${avatars[msg.sender]}`}
                        onError={(e) => {
                          e.currentTarget.onerror = null // Ngăn chặn vòng lặp vô hạn
                          e.currentTarget.src = '/spy.png' // Ảnh mặc định
                        }} />
                      <div className={`flex gap-1 flex-col`}>
                        <p className={`relative p-2 rounded-md max-w-xs ${msg.sender === 'me'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                          }`}>
                          {msg.content}
                        </p>
                        <p className="text-xs text-gray-500">{msg.sender === 'me' ? 'Bạn' : msg.sender} gửi lúc {new Date(msg.timestamp).toLocaleTimeString()}</p>
                      </div>
                    </div>)
                  }
                </div>
              ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex w-[40vw] mx-auto">
          <button type="button" onClick={()=> setIsPopupOpen(true)}>Hi</button>
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
        <Popup title={'Cài đặt đoạn chat'} isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)}>
          <div className="flex flex-col gap-4">
            <h4 className="text-md font-bold text-slate-800">Agents</h4>
            {data.agents.map((agent) => (
              <div key={agent.id} className="flex items-center justify-between">
                {/* Avatar và tên agent */}
                <div className="flex items-center gap-3">
                  <img src={agent.avatar} alt={agent.name} className="w-8 h-8 rounded-full" onError={(e) => {
                          e.currentTarget.onerror = null // Ngăn chặn vòng lặp vô hạn
                          e.currentTarget.src = '/spy.png' // Ảnh mặc định
                        }}/>
                  <span className="text-sm font-medium">{agent.name}</span>
                </div>

                {/* Nút Toggle */}
                <ToggleButton
                  isOnDefault={threadConfig[agent.name]?.active || false} // Trạng thái mặc định
                  onToggle={(isOn) => {
                    // Cập nhật trạng thái vào threadConfig
                    setThreadConfig((prevConfig) => ({
                      ...prevConfig,
                      [agent.name]: { active: isOn },
                    }))
                  }}
                />
              </div>
            ))}
          </div>
        </Popup>
      </MainLayout>
    </>
  )
}

export default ChatPage
