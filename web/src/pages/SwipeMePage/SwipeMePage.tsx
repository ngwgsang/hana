import { useQuery, useMutation } from '@redwoodjs/web'
import { useState } from 'react'
import { GET_ANKI_CARDS, UPDATE_ANKI_CARD_POINT } from '../HomePage/HomPage.query'
import { ArrowUturnLeftIcon } from '@heroicons/react/24/solid'
import { Link } from '@redwoodjs/router'

const SwipeMePage = () => {
  const { data, loading, error } = useQuery(GET_ANKI_CARDS, {
    variables: { searchTerm: '', tagIds: [] },
    onCompleted: (data) => {
      if (!data?.ankiCards) return

      const currentDate = new Date()
      const alpha = 0.7
      const sortedCards = data.ankiCards
        .map((card) => {
          const enrollDate = card.enrollAt ? new Date(card.enrollAt) : new Date()
          const daysSinceEnroll = isNaN(enrollDate)
            ? 0
            : (currentDate - enrollDate) / (1000 * 60 * 60 * 24)
          const point = card.point !== null && !isNaN(card.point) ? parseInt(card.point, 10) : 0

          return { ...card, reviewScore: point + alpha * daysSinceEnroll }
        })
        .sort((a, b) => a.reviewScore - b.reviewScore) // Sắp xếp tăng dần theo reviewScore

      setCards(sortedCards)
    },
  })

  const [updateAnkiCardPoint] = useMutation(UPDATE_ANKI_CARD_POINT)

  const [cards, setCards] = useState([]) // Danh sách thẻ hiển thị
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false) // Trạng thái lật thẻ
  const [animation, setAnimation] = useState("") // Animation trượt thẻ
  const [borderColor, setBorderColor] = useState("") // Border color

  if (loading) return <p className="text-white">Đang tải...</p>
  if (error) return <p className="text-red-500">Lỗi khi tải dữ liệu!</p>

  const handleSelect = async (status) => {
    if (currentIndex >= cards.length) return

    const currentCard = cards[currentIndex]
    let pointChange = 0
    let animClass = ""
    let borderClass = ""

    if (status === "bad") {
      pointChange = -1
      animClass = "opacity-0"
      borderClass = "border-red-500 bg-red-600/10"
    } else if (status === "normal") {
      pointChange = 0
      animClass = ""
      borderClass = "border-orange-500 bg-orange-600/10"
    } else if (status === "good") {
      pointChange = 1
      animClass = "opacity-0"
      borderClass = "border-green-500 bg-green-600/10"
    }

    setBorderColor(borderClass)
    setAnimation(animClass)

    try {
      await updateAnkiCardPoint({
        variables: { id: currentCard.id, pointChange },
      })
    } catch (error) {
      console.error("Lỗi cập nhật điểm:", error)
    }

    // Chuyển thẻ sau 300ms
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1)
      setIsFlipped(false) // Reset về mặt trước khi chuyển thẻ mới
      setAnimation("") // Reset animation
      setBorderColor("") // Reset border
    }, 300)
  }

  const HandleSpecialText = (text) => {
    if (!text) return ""

    return text
      .replace(/\n/g, "<br />") // Chuyển đổi xuống dòng thành <br />
      .replace(/\*\*(.*?)\*\*/g, "<b class='group-hover:bg-sky-500/30 rounded-sm'>$1</b>")
  }

  return (
    <main className="p-4 w-full sm:w-3/4 lg:w-1/2 flex flex-col items-start sm:m-auto">
      <Link to="/home">
        <ArrowUturnLeftIcon className="h-6 w-6 text-white mb-2" />
      </Link>

      <div className="relative w-full h-[80vh] sm:h-96 flex items-center justify-center overflow-hidden">
        {currentIndex < cards.length ? (
          <div
            className={`absolute w-full h-full flex items-center justify-center rounded-xl shadow-lg transition-all duration-1000 ${animation}`}
            onClick={() => setIsFlipped(!isFlipped)} // Lật khi chạm vào thẻ
          >
            <div className={`relative w-full h-full flex items-center justify-center text-white p-8 rounded-xl ${borderColor == "" ? "bg-gray-800" : borderColor + " border-2 "}`}>
              {/* Mặt trước */}
              <div className={`absolute w-full h-full flex items-center justify-center transition-all duration-500 ${isFlipped ? "opacity-0" : "opacity-100"}`}>
                <p className="text-3xl font-bold">{cards[currentIndex].front}</p>
              </div>

              {/* Mặt sau */}
              <div className={`absolute w-full h-full flex items-center justify-center transition-all duration-500 ${isFlipped ? "opacity-100" : "opacity-0"}`}>
                <div className="text-xl font-medium text-center" dangerouslySetInnerHTML={{ __html: HandleSpecialText(cards[currentIndex].back) }}></div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-white text-lg">🎉 Hết thẻ! Bạn đã hoàn thành.</p>
        )}
      </div>

      {/* Nút chọn kết quả */}
      <div className="flex justify-between mt-6 w-full gap-2">
        <button
          onClick={() => handleSelect("bad")}
          className="px-6 py-3 border bg-red-500/10 border-red-500 text-white rounded-md w-full"
        >
          😱
        </button>
        <button
          onClick={() => handleSelect("normal")}
          className="px-6 py-3 border bg-orange-500/10 border-orange-500 text-white rounded-md w-full"
        >
          😳
        </button>
        <button
          onClick={() => handleSelect("good")}
          className="px-6 py-3 border bg-green-500/10 border-green-500 text-white rounded-md w-full"
        >
          🤗
        </button>
      </div>
    </main>
  )
}

export default SwipeMePage
