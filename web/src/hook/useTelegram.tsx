import { useState } from 'react'

interface UseTelegramHook {
  sendMessage: (chatId: string, message: string) => Promise<boolean>
  loading: boolean
  error: string | null
}

const useTelegram = (botToken: string): UseTelegramHook => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = async (chatId: string, message: string): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
          }),
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      if (!data.ok) {
        throw new Error(data.description || 'Unknown error from Telegram API')
      }

      setLoading(false)
      return true // Message sent successfully
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
      return false // Failed to send message
    }
  }

  return {
    sendMessage,
    loading,
    error,
  }
}

export default useTelegram
