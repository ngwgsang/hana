// src/components/BookmarkPanel/BookmarkPanel.tsx
import { useEffect, useState } from 'react'

interface BookmarkPanelProps {
  bookmarkedCards: string[]
  cardRefs: React.MutableRefObject<Record<string, HTMLElement>>
  onRemoveBookmark: (front: string) => void
  onBookmarkClick: (front: string) => void
}

const BookmarkPanel: React.FC<BookmarkPanelProps> = ({ bookmarkedCards, cardRefs, onRemoveBookmark, onBookmarkClick }) => {
  const key = 'hana-short-term-memory'

  // Load bookmarks từ localStorage khi mount
  // useEffect(() => {
  //   const stored = localStorage.getItem(key)
  //   if (stored) {
  //     try {
  //       const parsed = JSON.parse(stored)
  //       setBookmarkedCards(parsed)
  //     } catch (e) {
  //       console.error('Lỗi đọc bookmark:', e)
  //     }
  //   }
  // }, [])

  // const handleRemoveBookmark = (frontToRemove: string) => {
  //   const stored = JSON.parse(localStorage.getItem(key) || '[]')
  //   const updated = stored.filter((item: string) => item !== frontToRemove)
  //   localStorage.setItem(key, JSON.stringify(updated))
  //   setBookmarkedCards(updated)
  // }

  // const handleBookmarkClick = (front: string) => {
  //   const el = document.getElementById(`card-${front}`)
  //   if (el) {
  //     el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  //     el.classList.add('border-red-500')
  //     setTimeout(() => {
  //       el.classList.remove('border-red-500')
  //     }, 1500)
  //   }
  // }

  return (
    <div className="bg-slate-800 p-4 rounded shadow-lg max-h-[60vh] overflow-y-auto border border-blue-500">
      <h3 className="text-lg font-bold text-white mb-2">📌 Thẻ đã ghim</h3>
      {bookmarkedCards.length > 0 ? (
        <ul className="space-y-2">
          {bookmarkedCards.map((front, index) => (
            <li
              key={index}
              className="flex justify-between items-center bg-slate-700 p-2 rounded text-white group hover:bg-blue-600"
            >
              <span
                className="cursor-pointer group-hover:underline"
                onClick={() => onBookmarkClick(front)}
              >
                {front}
              </span>
              <button
                className="text-red-400 hover:text-red-600 text-sm ml-4"
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
