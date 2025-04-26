// components/SearchBox/SearchBox.tsx
import { FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import React, { useState } from 'react'

interface Tag {
  id: number
  name: string
}

interface SearchBoxProps {
  tags: Tag[]
  onSearch: (searchTerm: string, selectedTagIds: number[]) => void
}

const SearchBox: React.FC<SearchBoxProps> = ({ tags, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [isFilterVisible, setIsFilterVisible] = useState(false)
  const [selectedTags, setSelectedTags] = useState<number[]>([])

  const toggleTagSelection = (tagId: number) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    )
  }

  const handleSearchClick = () => {
    onSearch(searchTerm, selectedTags)
  }

  return (
    <>
      {/* Thanh tìm kiếm + nút lọc */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm thẻ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-blue-600 rounded w-full text-white bg-slate-800 focus:outline-blue-700"
        />
        <button
          onClick={() => setIsFilterVisible(!isFilterVisible)}
          className={`px-4 py-4 text-white rounded text-sm ${
            isFilterVisible ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'
          }`}
        >
          <FunnelIcon className="h-6 w-6 text-white" />
        </button>
        <button
          onClick={handleSearchClick}
          className="px-4 py-4 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          <MagnifyingGlassIcon className="h-6 w-6 text-white" />
        </button>
      </div>

      {/* Bộ lọc */}
      {isFilterVisible && (
        <div className="bg-slate-800 p-4 rounded mb-4 border-2 border-blue-600">
          <h3 className="text-lg font-semibold mb-2 text-white">Bộ lọc</h3>
          <div className="grid grid-cols-2 gap-2">
            {tags.map((tag) => (
              <label key={tag.id} className="flex items-center gap-2 text-slate-300">
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag.id)}
                  onChange={() => toggleTagSelection(tag.id)}
                />
                {tag.name}
              </label>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default SearchBox
