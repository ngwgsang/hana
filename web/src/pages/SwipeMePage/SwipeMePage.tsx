import { useQuery, useMutation } from '@redwoodjs/web'
import { useState } from 'react'
import { GET_ANKI_CARDS, UPDATE_ANKI_CARD_POINT } from '../HomePage/HomPage.query'
import { ArrowUturnLeftIcon } from '@heroicons/react/24/solid'
import { Link } from '@redwoodjs/router'


const SwipeMePage = () => {
  // const { data, loading, error } = useQuery(GET_ANKI_CARDS)
  const [cards, setCards] = useState([]) // Danh sách thẻ hiển thị

  const { data, loading, error, refetch } = useQuery(GET_ANKI_CARDS, {
    variables: { searchTerm: '', tagIds: [] }, // Không cần skip/take nữa
    onCompleted: (data) => {
      if (!data?.ankiCards) return;

      const currentDate = new Date();
      const alpha = 0.7;
      const sortedCards = data.ankiCards.map((card) => {
        const enrollDate = card.enrollAt ? new Date(card.enrollAt) : new Date();
        const daysSinceEnroll = isNaN(enrollDate) ? 0 : (currentDate - enrollDate) / (1000 * 60 * 60 * 24);
        const point = card.point !== null && !isNaN(card.point) ? parseInt(card.point, 10) : 0;

        return { ...card, reviewScore: point + alpha * daysSinceEnroll };
      }).sort((a, b) => a.reviewScore - b.reviewScore); // Sắp xếp tăng dần theo reviewScore

      setCards(sortedCards);
    },
  });

  const [updateAnkiCardPoint] = useMutation(UPDATE_ANKI_CARD_POINT)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [swipeX, setSwipeX] = useState(0)
  const [isSwiping, setIsSwiping] = useState(false)
  const [isFlipped, setIsFlipped] = useState(false) // Trạng thái lật thẻ

  if (loading) return <p className="text-white">Đang tải...</p>
  if (error) return <p className="text-red-500">Lỗi khi tải dữ liệu!</p>

  // const cards = data?.ankiCards || []

  const handleTouchStart = (e) => {
    setIsSwiping(true)
    setSwipeX(e.touches[0].clientX)
  }

  const handleTouchMove = (e) => {
    if (!isSwiping) return
    const diff = e.touches[0].clientX - swipeX
    setSwipeX(diff)
  }

  const handleTouchEnd = async () => {
    if (swipeX > 100) {
      await handleSwipe('right')
    } else if (swipeX < -100) {
      await handleSwipe('left')
    } else {
      setSwipeX(0)
    }
    setIsSwiping(false)
  }

  const handleSwipe = async (direction) => {
    if (currentIndex >= cards.length) return

    const currentCard = cards[currentIndex]
    const pointChange = direction === 'right' ? 1 : -1

    try {
      await updateAnkiCardPoint({
        variables: { id: currentCard.id, pointChange }
      })
    } catch (error) {
      console.error('Lỗi cập nhật điểm:', error)
    }

    setSwipeX(direction === 'right' ? 300 : -300)
    setTimeout(() => {
      setSwipeX(0)
      setCurrentIndex((prev) => prev + 1)
      setIsFlipped(false) // Reset về mặt trước khi chuyển thẻ mới
    }, 300)
  }


  const HandleSpecialText = (text) => {
    if (!text) return "";

    return text
      .replace(/\n/g, "<br />") // Chuyển đổi xuống dòng thành <br />
      .replace(/\*\*(.*?)\*\*/g, "<b class='group-hover:bg-sky-500/30 rounded-sm'>$1</b>");
  };

  return (
    <main className="p-4 w-full sm:w-3/4 lg:w-1/2 flex flex-col items-start sm:m-auto">
      <Link to="/home">
        <ArrowUturnLeftIcon className="h-6 w-6 text-white mb-2"/>
      </Link>
      <div className="relative w-full h-[80vh] sm:h-96 flex items-center justify-center overflow-hidden">
        {currentIndex < cards.length ? (
          <div
            className={`absolute w-full h-full flex items-center justify-center rounded-xl shadow-lg transition-transform duration-300 transform ${isFlipped ? 'rotate-y-90' : ''} ${swipeX < -100 ? 'border border-red-400': ''} ${swipeX > 100 ? 'border border-green-400': ''}`}
            style={{ transform: `translateX(${swipeX}px)`, opacity: Math.abs(swipeX) > 100 ? 0.5 : 1 }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={() => setIsFlipped(!isFlipped)} // Lật khi chạm vào thẻ
          >
            <div className="relative w-full h-full flex items-center justify-center bg-gray-800 text-white p-8 rounded-xl">
              {/* Mặt trước */}
              <div className={`absolute w-full h-full flex items-center justify-center transition-all duration-500 ${isFlipped ? 'opacity-0' : 'opacity-100'}`}>
                <p className="text-2xl font-bold">{cards[currentIndex].front}</p>
              </div>

              {/* Mặt sau */}
              <div className={`absolute w-full h-full flex items-center justify-center transition-all duration-500 ${isFlipped ? 'opacity-100' : 'opacity-0'}`}>
                <div className="text-2xl font-medium text-center" dangerouslySetInnerHTML={{ __html: HandleSpecialText(cards[currentIndex].back) }}></div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-white text-lg">🎉 Hết thẻ! Bạn đã hoàn thành.</p>
        )}
      </div>

      <div className="flex justify-between mt-6 w-full gap-2">
        <button
          onClick={() => handleSwipe('left')}
          className="px-6 py-3 border bg-red-500/10 border-red-500 text-white rounded-md w-full"
        >
          😱
        </button>
        <button
          onClick={() => handleSwipe('right')}
          className="px-6 py-3 border bg-orange-500/10 border-orange-500 text-white rounded-md w-full"
        >
          😳
        </button>
        <button
          onClick={() => handleSwipe('right')}
          className="px-6 py-3 border bg-green-500/10 border-green-500 text-white rounded-md w-full"
        >
          🤗
        </button>
      </div>
    </main>
  )
}

export default SwipeMePage
