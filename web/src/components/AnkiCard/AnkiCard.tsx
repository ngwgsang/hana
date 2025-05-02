import ExternalUrl from 'src/components/ExternalUrl'
import { PencilSquareIcon, BookmarkIcon, InformationCircleIcon } from '@heroicons/react/24/solid'
import PingDot from 'src/components/PingDot'
import ReviewStatusTag from 'src/components/ReviewStatusTag'
import HighlightText from '../HighlightText/HighlightText'

interface AnkiCardProps {
  card: {
    id: number
    front: string
    back: string
    createdAt: string
    reviewScore: number
    tags: { id: number; name: string }[]
  }
  hidden?: boolean
  highlighted?: boolean
  onEdit?: (card: any) => void
  onBookmark?: (card: any) => void
  onPointUpdate?: (id: number, change: number) => void
  cardRefs?: React.MutableRefObject<Record<string, HTMLDivElement>>
}

const AnkiCard = ({
  card,
  hidden = false,
  highlighted = false,
  onEdit,
  onBookmark,
  onPointUpdate,
  cardRefs,
}: AnkiCardProps) => {

  const getTimeElapsedText = (timeStamp: string) => {
    const now = new Date()
    const cardTimestamp = new Date(timeStamp)
    const diff = now.getTime() - cardTimestamp.getTime()
    const minutes = Math.floor(diff / 1000 / 60)
    if (minutes < 1) return 'Vừa xong'
    if (minutes < 60) return `${minutes} phút trước`
    return ''
  }

  return (
    <div
      id={`card-${card.front}`}
      ref={(el) => {
        if (el && cardRefs) cardRefs.current[card.front] = el
      }}
      className={`p-4 bg-slate-700 rounded shadow relative group transition duration-300
        hover:ring-2 hover:shadow-lg hover:shadow-blue-500/50 hover:bg-slate-800
        ${highlighted ? 'border-2 border-yellow-400' : ''}
        ${hidden ? 'hidden' : ''}`}
    >
      {/* <ExternalUrl
        className="text-lg font-semibold text-white"
        href={`https://mazii.net/vi-VN/search/word/javi/${card.front}`}
      >
        {card.front}
      </ExternalUrl> */}
      <span
        className="text-lg font-semibold text-white"
      >
        {card.front}
      </span>

      <span className="absolute right-2 bottom-2 rounded text-sm text-blue-500">
        {getTimeElapsedText(card.createdAt)}
      </span>

      {getTimeElapsedText(card.createdAt) !== '' && (
        <PingDot className="absolute -left-1 top-1 -translate-y-1/2" />
      )}

      <HighlightText>{card.back}</HighlightText>

      <div className="my-2 text-sm text-blue-500">
        {card.tags
          .slice()
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((tag) => `#${tag.name} `)}
      </div>

      <ReviewStatusTag score={card.reviewScore} />

      {/* Nút cập nhật điểm */}
      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 flex gap-2 bg-gray-800 p-2 rounded-lg shadow-lg transition-opacity duration-300">
        <button onClick={() => onPointUpdate?.(card.id, -1)} className="bg-gray-500 text-xl w-10 h-10 rounded hover:bg-gray-700">
          😵‍💫
        </button>
        <button onClick={() => onPointUpdate?.(card.id, 0)} className="bg-gray-500 text-xl w-10 h-10 rounded hover:bg-gray-700">
          🤯
        </button>
        <button onClick={() => onPointUpdate?.(card.id, 1)} className="bg-gray-500 text-xl w-10 h-10 rounded hover:bg-gray-700">
          😎
        </button>
      </div>

      {/* Nút edit + bookmark */}
      <div className="absolute top-2 right-2 flex gap-1">
        <button
          onClick={() => onEdit?.(card)}
          className="rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <PencilSquareIcon className="h-6 w-6 text-gray-400 hover:text-gray-600" />
        </button>
        <ExternalUrl className='rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300' href={`https://mazii.net/vi-VN/search/word/javi/${card.front}`}>
        <InformationCircleIcon className='h-6 w-6 text-gray-400 hover:text-gray-600'/></ExternalUrl>
        <button
          onClick={() => onBookmark?.(card)}
          className="rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <BookmarkIcon className="h-6 w-6 text-gray-400 hover:text-gray-600" />
        </button>
      </div>
    </div>
  )
}

export default AnkiCard
