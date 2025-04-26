// src/components/AnkiCardCRUDPopup/AnkiCardCRUDPopup.tsx
import { useState } from 'react'
import { PlusIcon } from '@heroicons/react/24/solid'
import ExternalUrl from 'src/components/ExternalUrl'
import LoadingAnimation from 'src/components/LoadingAnimation'
import Papa from 'papaparse'

interface AnkiCardCRUDPopupProps {
  tags: { id: number; name: string }[]
  onClose: () => void
  onSaveCard: (card: { front: string; back: string; tagIds: number[] }) => Promise<void>
  onBulkUpload: (cards: { front: string; back: string; tagIds: number[] }[], selectedTagIds: number[]) => Promise<void>
  onDeleteCard?: () => Promise<void>
  editingCard?: { id?: number; front: string; back: string }
  isAdding: boolean
}

const AnkiCardCRUDPopup = ({
  tags,
  onClose,
  onSaveCard,
  onBulkUpload,
  onDeleteCard,
  editingCard,
  isAdding,
}: AnkiCardCRUDPopupProps) => {
  const [front, setFront] = useState(editingCard?.front || '')
  const [back, setBack] = useState(editingCard?.back || '')
  const [selectedTags, setSelectedTags] = useState<number[]>([])
  const [isAddingCSV, setIsAddingCSV] = useState(false)
  const [parsedCards, setParsedCards] = useState<{ front: string; back: string }[]>([])
  const [selectedBulkTagIds, setSelectedBulkTagIds] = useState<number[]>([])
  const [newTagName, setNewTagName] = useState('')
  const [dynamicTags, setDynamicTags] = useState(tags)
  const [isUploading, setIsUploading] = useState(false)

  const toggleTagSelection = (tagId: number) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    )
  }

  const handleAddNewTag = () => {
    if (newTagName.trim()) {
      const newTag = { id: Date.now(), name: newTagName } // tạm id fake
      setDynamicTags((prev) => [...prev, newTag])
      setSelectedTags((prev) => [...prev, newTag.id])
      setNewTagName('')
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const formatted = result.data.map((row: any) => ({
          front: row.front,
          back: row.back,
        }))
        setParsedCards(formatted)
      },
    })
  }

  const handleSaveSingle = async () => {
    setIsUploading(true)
    await onSaveCard({ front, back, tagIds: selectedTags.length ? selectedTags : [1] }) // default tag id = 1
    setIsUploading(false)
    onClose()
  }

  const handleBulkUpload = async () => {
    if (parsedCards.length === 0) {
      alert('Không có dữ liệu!')
      return
    }
    setIsUploading(true)
    await onBulkUpload(parsedCards, selectedBulkTagIds)
    setIsUploading(false)
    onClose()
  }

  const handleDelete = async () => {
    if (!onDeleteCard) return
    if (confirm('Bạn có chắc chắn muốn xóa thẻ này?')) {
      setIsUploading(true)
      await onDeleteCard()
      setIsUploading(false)
      onClose()
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Chọn chế độ */}
      <div className="flex gap-4">
        <button onClick={() => setIsAddingCSV(false)} className={`px-4 py-2 rounded w-full ${!isAddingCSV ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-300'}`}>
          Thêm thủ công
        </button>
        <button onClick={() => setIsAddingCSV(true)} className={`px-4 py-2 rounded w-full ${isAddingCSV ? 'bg-blue-600 text-white' : 'bg-slate-900 text-white'}`}>
          Tải lên CSV
        </button>
      </div>

      <hr className='my-1 opacity-0'/>

      {/* Thêm bằng CSV */}
      {isAddingCSV ? (
        <>
          <label className="text-white border-2 border-gray-600 px-2 py-1 rounded-md hover:bg-blue-500/10 hover:border-blue-500 cursor-pointer">
            <input type="file" accept=".csv" onChange={handleFileUpload} />
              📄 Tải lên file CSV
          </label>
          {/* <input type="file" accept=".csv" onChange={handleFileUpload} className='p-2 w-full text-sm text-gray-900 border rounded-lg cursor-pointer dark:text-gray-400 focus:outline-none bg-gray-700 border-gray-600 dark:placeholder-gray-400'/> */}
          {parsedCards.length > 0 && (
            <>
              <p className="text-sm text-gray-400">{parsedCards.length} thẻ sẽ được thêm</p>
              <div className="grid grid-cols-2 gap-2 p-4 rounded-md border-2 border-blue-500 bg-blue-500/10">
                {dynamicTags.map((tag) => (
                  <label key={tag.id} className="flex items-center gap-2 text-white">
                    <input
                      type="checkbox"
                      checked={selectedBulkTagIds.includes(tag.id)}
                      onChange={() => setSelectedBulkTagIds((prev) =>
                        prev.includes(tag.id) ? prev.filter((id) => id !== tag.id) : [...prev, tag.id]
                      )}
                    />
                    {tag.name}
                  </label>
                ))}
              </div>
              <div className='pr-2 my-2 flex gap-1 flex-wrap overflow-y-scroll max-h-[36vh]'>
                {parsedCards.map( (e, index) => (
                  <ExternalUrl
                    href={`https://mazii.net/vi-VN/search/word/javi/${e.front}`}
                    key={index}
                    className="text-white border-2 border-gray-600 px-2 py-1 rounded-md hover:bg-blue-500/10 hover:border-blue-500 cursor-pointer">
                  {e.front}
                </ExternalUrl>                      )
                )}
              </div>
            </>
          )}
          <button onClick={handleBulkUpload} className="bg-blue-600 p-2 rounded text-white hover:bg-blue-700">
            Upload
          </button>
        </>
      ) : (
        <>
          {/* Thêm thủ công */}
          <input
            type="text"
            placeholder="Mặt trước"
            value={front}
            onChange={(e) => setFront(e.target.value)}
            className="p-4 border rounded w-full text-slate-300 bg-slate-900 outline-none border-none"
          />
          <textarea
            placeholder="Mặt sau"
            value={back}
            onChange={(e) => setBack(e.target.value)}
            className="p-4 border rounded w-full text-slate-300 bg-slate-900 outline-none border-none"
          />
          <div className="grid grid-cols-2 flex-wrap gap-1 bg-slate-900 p-4 rounded-md ">
            {dynamicTags.map((tag) => (
              <label key={tag.id} className="flex items-center gap-1 text-white">
                <input
                  className="flex items-center gap-2 text-slate-200"
                  type="checkbox"
                  checked={selectedTags.includes(tag.id)}
                  onChange={() => toggleTagSelection(tag.id)}
                />
                {tag.name}
              </label>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <input
              type="text"
              placeholder="Tag mới..."
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              className="h-14 p-4 border rounded w-full text-slate-300 bg-slate-900 outline-none border-none"
            />
            <button onClick={handleAddNewTag} className="h-12 w-12 flex items-center justify-center bg-blue-600 rounded text-white hover:bg-blue-700">
              <PlusIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Save + Delete */}
          <div className="flex justify-between mt-4 gap-2">
            {!isAdding && onDeleteCard && (
              <button onClick={handleDelete} className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700">
                Xóa
              </button>
            )}
            <button onClick={handleSaveSingle} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
              {isAdding ? 'Thêm mới' : 'Lưu thay đổi'}
            </button>
          </div>
        </>
      )}
      {isUploading && <LoadingAnimation state={true} texts={['Đang xử lý...', '']} />}
    </div>
  )
}

export default AnkiCardCRUDPopup
