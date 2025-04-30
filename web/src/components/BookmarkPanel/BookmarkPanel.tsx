// src/components/BookmarkPanel/BookmarkPanel.tsx
import { useEffect, useState } from 'react'

interface BookmarkPanelProps {
  bookmarkedCards: string[]
  cardRefs: React.MutableRefObject<Record<string, HTMLElement>>
  onRemoveBookmark: (front: string) => void
  onBookmarkClick: (front: string) => void
}

const BookmarkPanel: React.FC<BookmarkPanelProps> = ({ bookmarkedCards, cardRefs, onRemoveBookmark, onBookmarkClick }) => {
  return (
    <div className={`bg-slate-800 p-4 rounded shadow-lg hidden lg:block ${bookmarkedCards.length > 0 ? 'border border-blue-500': ''}`}>
      <h3 className="text-lg font-bold text-white mb-2">📌 Thẻ đã ghim</h3>
      {bookmarkedCards.length > 0 ? (
        <ul className="space-y-2 max-h-[52vh] pr-2 overflow-y-auto">
          {bookmarkedCards.map((front, index) => (
            <li
              key={index}
              className="flex justify-between items-center bg-slate-700 p-2 rounded text-white group hover:bg-blue-600 group"
            >
              <span
                className="cursor-pointer group-hover:underline"
                onClick={() => onBookmarkClick(front)}
              >
                {front}
              </span>
              <button
                className="text-red-400 hover:text-red-600 text-sm ml-4 hidden group-hover:block"
                onClick={() => onRemoveBookmark(front)}
              >
                ❌
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-slate-400">Chưa có thẻ nào được lưu.</p>
      )}
    </div>
  )
}

export default BookmarkPanel
