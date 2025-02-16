import { Metadata, useQuery, useMutation, gql } from '@redwoodjs/web'
import { useState, useEffect, useRef, useCallback } from 'react'
import Popup from 'src/components/Popup'
import PingDot from 'src/components/PingDot'
import { FunnelIcon, MagnifyingGlassIcon, PlusIcon, PencilSquareIcon } from '@heroicons/react/24/solid'
import Papa from 'papaparse'

const GET_ANKI_CARDS = gql`
  query GetAnkiCards($searchTerm: String, $tagIds: [Int!], $skip: Int, $take: Int) {
    ankiCards(searchTerm: $searchTerm, tagIds: $tagIds, skip: $skip, take: $take) {
      id
      front
      back
      createdAt
      point
      tags {
        id
        name
      }
    }
  }
`

// GraphQL Query lấy danh sách tag
const GET_ANKI_TAGS = gql`
  query GetAnkiTags {
    ankiTags {
      id
      name
    }
  }
`

// Mutation tạo thẻ mới
const CREATE_ANKI_CARD = gql`
  mutation CreateAnkiCard($input: CreateAnkiCardInput!) {
    createAnkiCard(input: $input) {
      id
      front
      back
      enrollAt
      point
      tags {
        id
        name
      }
    }
  }
`

// Mutation cập nhật thẻ
const UPDATE_ANKI_CARD = gql`
  mutation UpdateAnkiCard($id: Int!, $input: UpdateAnkiCardInput!) {
    updateAnkiCard(id: $id, input: $input) {
      id
      front
      back
      tags {
        id
        name
      }
    }
  }
`

// Mutation xóa thẻ
const DELETE_ANKI_CARD = gql`
  mutation DeleteAnkiCard($id: Int!) {
    deleteAnkiCard(id: $id) {
      id
    }
  }
`

// Mutation thêm nhiều thẻ từ CSV
const BULK_CREATE_ANKI_CARDS = gql`
  mutation BulkCreateAnkiCards($input: [CreateAnkiCardInput!]!) {
    bulkCreateAnkiCards(input: $input) {
      id
      front
      back
    }
  }
`

const UPDATE_ANKI_CARD_POINT = gql`
  mutation UpdateAnkiCardPoint($id: Int!, $pointChange: Int!) {
    updateAnkiCardPoint(id: $id, pointChange: $pointChange) {
      id
      point
    }
  }
`

const CREATE_ANKI_TAG = gql`
  mutation CreateAnkiTag($input: CreateAnkiTagInput!) {
    createAnkiTag(input: $input) {
      id
      name
    }
  }
`

const DELETE_ANKI_TAG = gql`
  mutation DeleteAnkiTag($id: Int!) {
    deleteAnkiTag(id: $id) {
      id
    }
  }
`


const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [isAdding, setIsAdding] = useState(false) // Kiểm tra trạng thái popup "Thêm thẻ"
  const [editingCard, setEditingCard] = useState(null)
  const [selectedTags, setSelectedTags] = useState([])
  const [isFilterVisible, setIsFilterVisible] = useState(false) // Toggle hiển thị bộ lọc
  const [cards, setCards] = useState([]) // Danh sách thẻ hiển thị
  const [skip, setSkip] = useState(0) // Bỏ qua số lượng đã tải
  const take = 10 // Ban đầu tải 10 thẻ
  const [hasMore, setHasMore] = useState(true) // Kiểm tra còn dữ liệu không
  const isFetching = useRef(false) // Chặn việc gọi API liên tục
  const [isAddingCSV, setIsAddingCSV] = useState(false) // Kiểm tra trạng thái upload CSV
  const [parsedCards, setParsedCards] = useState([]) // Danh sách thẻ đã parse từ CSV
  const [createAnkiCards] = useMutation(BULK_CREATE_ANKI_CARDS)
  const [isUploading, setIsUploading] = useState(false) // Trạng thái upload
  const [newTagName, setNewTagName] = useState('')
  const [isAddingTag, setIsAddingTag] = useState(false)
  const [tags, setTags] = useState([])




  const { data, loading, error, fetchMore, refetch } = useQuery(GET_ANKI_CARDS, {
    variables: { searchTerm: '', tagIds: [], skip: 0, take }, // Tải 10 thẻ ban đầu
    onCompleted: (data) => {
      if (data.ankiCards.length < take) setHasMore(false)
      else setHasMore(true)

      setCards(data.ankiCards)
      setSkip(data.ankiCards.length) // Cập nhật skip
    },
  })



  const [createAnkiCard] = useMutation(CREATE_ANKI_CARD, { onCompleted: () => refetch() })
  const [updateAnkiCard] = useMutation(UPDATE_ANKI_CARD, { onCompleted: () => refetch() })
  const [deleteAnkiCard] = useMutation(DELETE_ANKI_CARD, { onCompleted: () => refetch() })
  const [updateAnkiCardPoint] = useMutation(UPDATE_ANKI_CARD_POINT)
  const { data: tagData } = useQuery(GET_ANKI_TAGS, {
    onCompleted: (data) => {
      if (data?.ankiTags) {
        setTags(data.ankiTags)
      }
    }
  })
  const [createAnkiTag] = useMutation(CREATE_ANKI_TAG, {
    onCompleted: () => refetch(), // Tải lại danh sách tag sau khi thêm
  })
  const [deleteAnkiTag] = useMutation(DELETE_ANKI_TAG, {
    onCompleted: () => refetch(), // Tải lại danh sách tag sau khi xóa
  })


  // Hàm tìm kiếm
  const handleSearch = () => {
    setCards([]) // Xóa danh sách cũ trước khi tải dữ liệu mới
    setSkip(0)   // Reset skip để tải từ đầu
    setHasMore(true) // Đảm bảo vẫn có thể tải thêm dữ liệu

    refetch({ searchTerm, tagIds: selectedTags, skip: 0, take }) // Gửi request mới
  }

  // Lazy Load khi scroll xuống cuối trang
  const handleLoadMore = () => {
    if (!hasMore || isFetching.current) return // Kiểm tra nếu hết dữ liệu hoặc đang tải thì không gọi API

    isFetching.current = true // Đánh dấu là đang fetch

    fetchMore({
      variables: { searchTerm, tagIds: selectedTags, skip, take: 5 },
      updateQuery: (prev, { fetchMoreResult }) => {
        isFetching.current = false // Reset trạng thái fetch

        if (!fetchMoreResult || fetchMoreResult.ankiCards.length === 0) {
          setHasMore(false)
          return prev
        }

        setSkip(prev => prev + fetchMoreResult.ankiCards.length)
        return {
          ...prev,
          ankiCards: [...prev.ankiCards, ...fetchMoreResult.ankiCards],
        }
      },
    })
  }


  // Lazy Load khi scroll
  const observer = useRef()
  const lastCardRef = useCallback(
    (node) => {
      if (loading) return
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          handleLoadMore() // Gọi API khi cuộn đến thẻ cuối
        }
      })

      if (node) observer.current.observe(node)
    },
    [loading, fetchMore, skip, searchTerm, selectedTags]
  )


  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 &&
        !loading
      ) {
        handleLoadMore()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loading, hasMore])


  // Mở popup chỉnh sửa
  const handleEdit = (card) => {
    setIsAdding(false) // Không phải thêm mới
    setEditingCard({ ...card }) // Set dữ liệu cho popup
    setSelectedTags(card.tags.map((tag) => tag.id)) // Set tag được chọn
    setIsPopupOpen(true)
  }

  // Mở popup thêm mới thẻ
  const handleAdd = () => {
    setIsAdding(true) // Đang thêm mới
    setEditingCard({ front: '', back: '' }) // Reset form
    setSelectedTags([]) // Reset tags
    setIsPopupOpen(true)
  }

  // Đóng popup
  const handleClosePopup = () => {
    setIsPopupOpen(false)
  }

  // Cập nhật hoặc thêm mới thẻ
  const handleSave = async () => {
    if (isAdding) {
      await createAnkiCard({
        variables: {
          input: {
            front: editingCard.front,
            back: editingCard.back,
            tagIds: selectedTags,
          },
        },
      })
    } else {
      await updateAnkiCard({
        variables: {
          id: editingCard.id,
          input: {
            front: editingCard.front,
            back: editingCard.back,
            tagIds: selectedTags, // Lưu danh sách tag được chọn
          },
        },
      })
    }
    handleClosePopup()
  }

  // Xóa thẻ
  const handleDelete = async () => {
    if (confirm('Bạn có chắc chắn muốn xóa thẻ này?')) {
      await deleteAnkiCard({ variables: { id: editingCard.id } })
      handleClosePopup()
    }
  }

  // Chọn/bỏ chọn tag
  const toggleTagSelection = (tagId) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tagId) ? prevTags.filter((id) => id !== tagId) : [...prevTags, tagId]
    )
  }

  const handleAddTag = async () => {
    if (!newTagName.trim()) return // Không thêm tag rỗng

    try {
      const { data } = await createAnkiTag({
        variables: { input: { name: newTagName } },
      })

      if (data?.createAnkiTag) {
        // Cập nhật danh sách tag ngay lập tức
        setTags([...tags, data.createAnkiTag])
        setSelectedTags([...selectedTags, data.createAnkiTag.id]) // Nếu muốn chọn tag ngay khi tạo
      }

      setNewTagName('')
      setIsAddingTag(false) // Ẩn ô nhập sau khi thêm
    } catch (error) {
      console.error('Lỗi khi thêm tag:', error)
    }
  }


  const handleDeleteTag = async (tagId) => {
    if (!confirm('Bạn có chắc chắn muốn xóa tag này?')) return

    try {
      await deleteAnkiTag({ variables: { id: tagId } })

      // Cập nhật danh sách tag ngay lập tức
      setTags(tags.filter(tag => tag.id !== tagId))
      setSelectedTags(selectedTags.filter(id => id !== tagId)) // Xóa khỏi danh sách đã chọn
    } catch (error) {
      console.error('Lỗi khi xóa tag:', error)
    }
  }



  // Xử lý khi chọn file CSV
  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const formattedCards = result.data.map((row) => ({
          front: row.front,
          back: row.back,
          tagIds: [0], // Gán mặc định tag ID = 0
        }))
        setParsedCards(formattedCards)
      },
      error: (error) => console.error('Lỗi đọc file:', error),
    })
  }

  // Gửi dữ liệu lên server để thêm vào database
  const handleUploadCSV = async () => {
    if (parsedCards.length === 0) {
      alert('Không có dữ liệu để thêm!')
      return
    }
    setIsUploading(true) // Bật trạng thái loading


    const formattedCards = parsedCards.map((card) => ({
      front: card.front,
      back: card.back,
      tagIds: [1], // Gán mặc định tag ID = 0
    }))

    try {
      await createAnkiCards({
        variables: { input: formattedCards },
      })
      alert('Đã thêm thẻ thành công!')
      setIsPopupOpen(false)
      setParsedCards([]) // Reset danh sách
    } catch (error) {
      console.error('Lỗi khi thêm thẻ:', error)
    } finally {
      setIsUploading(false) // Tắt trạng thái loading
    }
  }

  const getTimeElapsedText = (timeStamp) => {
    const now = new Date()
    const cardTimestamp = new Date(timeStamp)
    const timeDifference = now - cardTimestamp // Kết quả là số mili-giây
    const minutesAgo = Math.floor(timeDifference / 1000 / 60) // Chuyển sang phút
    const hoursAgo = Math.floor(timeDifference / 1000 / 60 / 60) // Chuyển sang giờ
    if (minutesAgo < 1) return "Vừa xong"
    if (hoursAgo < 24) return `${hoursAgo} giờ trước`
    return ""
  }

  const handlePointUpdate = async (cardId, pointChange) => {
    // Cập nhật UI ngay lập tức mà không cần reload
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === cardId ? { ...card, point: card.point + pointChange } : card
      )
    )

    try {
      await updateAnkiCardPoint({
        variables: { id: cardId, pointChange },
      })
    } catch (error) {
      console.error('Lỗi cập nhật điểm:', error)
      // Nếu có lỗi, hoàn tác điểm
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === cardId ? { ...card, point: card.point - pointChange } : card
        )
      )
    }
  }


  return (
    <main className="p-4 mx-auto my-0 w-[50%]">
      <Metadata title="Home" description="Home page" />

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
          className={`px-4 py-4  text-white rounded  text-sm ${isFilterVisible ? 'bg-blue-600 hover:bg-blue-700': 'bg-gray-600 hover:bg-gray-700'}`}
        >
          {/* {isFilterVisible ? 'Ẩn bộ lọc' : 'Bộ lọc'} */}
          <FunnelIcon className='h-6 w-6 text-white'/>
        </button>
        <button
          onClick={handleSearch}
          className="px-4 py-4 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          {/* Tìm kiếm */}
          <MagnifyingGlassIcon className="h-6 w-6 text-white" />
        </button>
      </div>

      {isFilterVisible && (
        <div className="bg-slate-800 p-4 rounded mb-4 border-2 border-blue-600">
          <h3 className="text-lg font-semibold mb-2 text-white">Bộ lọc</h3>
          <div className="grid grid-cols-2 gap-2">
            {tagData?.ankiTags.map((tag) => (
              <label key={tag.id} className="flex items-center gap-2 text-slate-300">
                <input type="checkbox" checked={selectedTags.includes(tag.id)} onChange={() => toggleTagSelection(tag.id)} />
                {tag.name}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Hiển thị danh sách thẻ */}
      {loading && <p className="text-gray-400">Đang tải dữ liệu...</p>}
      {error && <p className="text-red-500">Lỗi: {error.message}</p>}

      <div className="grid grid-cols-1 gap-4">
        {cards.map((card, index) => (
          <div
            ref={index === cards.length - 1 ? lastCardRef : null}
            key={card.id}
            className="p-4 bg-slate-700 rounded shadow relative group transition duration-300 hover:ring-2 hover:shadow-lg hover:shadow-blue-500/50 hover:bg-slate-800"
          >
            <h2 className="text-lg font-semibold text-white">{card.front}</h2>
            <span className='absolute right-2 bottom-2 rounded text-sm text-blue-500'>{getTimeElapsedText(card.createdAt)}</span>
            { card.point < 1 ? <PingDot className='absolute -left-1 top-1 -translate-y-1/2'></PingDot> : ""}
            <p className="text-slate-300">{card.back}</p>

            <div className="mt-2 text-sm text-blue-500">
              {card.tags
                .slice() // Tạo một bản sao để tránh thay đổi dữ liệu gốc
                .sort((a, b) => a.name.localeCompare(b.name)) // Sắp xếp theo thứ tự bảng chữ cái
                .map((tag) => `#${tag.name} `)}
            </div>

            {/* Điểm số */}
            <div className="text-sm text-blue-500 mt-1">Điểm: {card.point}</div>

            {/* Nút cập nhật điểm */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 flex gap-2 bg-gray-800 p-2 rounded-lg shadow-lg transition-opacity duration-300">
              <button onClick={() => handlePointUpdate(card.id, -1)} className="bg-gray-500 text-xl w-10 h-10 rounded hover:bg-gray-700">😵‍💫</button>
              <button onClick={() => handlePointUpdate(card.id, 0)} className="bg-gray-500 text-xl w-10 h-10 rounded hover:bg-gray-700">🤯</button>
              <button onClick={() => handlePointUpdate(card.id, 1)} className="bg-gray-500 text-xl w-10 h-10 rounded hover:bg-gray-700">😎</button>
            </div>

            {/* Nút chỉnh sửa (ẩn mặc định, hiển thị khi hover) */}
            <button
              onClick={() => handleEdit(card)}
              className="absolute top-2 right-2 p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <PencilSquareIcon className="h-6 w-6 text-gray-400 hover:text-gray-600" />
            </button>
          </div>
        ))}
      </div>


      {/* Popup chỉnh sửa/thêm thẻ */}
      <Popup  title={isAdding ? 'Thêm thẻ mới' : 'Chỉnh sửa thẻ'} isOpen={isPopupOpen} onClose={handleClosePopup}>

      <div className="flex flex-col gap-4">
          {/* Chọn phương thức */}
          <div className="flex gap-2">
            <button
              onClick={() => setIsAddingCSV(false)}
              className={`px-4 py-2 rounded w-full ${
                !isAddingCSV ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'
              }`}
            >
              Thêm thủ công
            </button>
            <button
              onClick={() => setIsAddingCSV(true)}
              className={`px-4 py-2 rounded w-full ${
                isAddingCSV ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'
              }`}
            >
              Upload CSV
            </button>
          </div>

          {/* Nếu chọn thêm CSV */}
          {isAddingCSV ? (
            <div className="flex flex-col gap-3">
              <input type="file" accept=".csv" onChange={handleFileUpload} className="border p-2 rounded" />
              {parsedCards.length > 0 && (
                <p className="text-sm text-gray-500">{parsedCards.length} thẻ sẽ được thêm</p>
              )}
              <button
                onClick={handleUploadCSV}
                disabled={isUploading} // Vô hiệu hóa khi đang tải
                className={`px-4 py-2 rounded text-white ${isUploading ? 'bg-gray-500' : 'bg-green-600 hover:bg-green-700'}`}
              >
                {isUploading ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0116 0"></path>
                    </svg>
                    Đang tải lên...
                  </div>
                ) : (
                  'Xác nhận thêm thẻ'
                )}
              </button>
            </div>
          ) : editingCard && (
            <div className="flex flex-col gap-4">
            <label>
              <span className="font-bold text-slate-200 mb-1">Mặt trước</span>
              <input
                type="text"
                value={editingCard.front}
                onChange={(e) => setEditingCard({ ...editingCard, front: e.target.value })}
                className="p-2 border rounded w-full text-slate-300 bg-slate-900 outline-none border-none"
              />
            </label>

            <label>
              <span className="font-bold text-slate-200 mb-1">Mặt sau</span>
              <textarea
                // type="text"
                value={editingCard.back}
                onChange={(e) => setEditingCard({ ...editingCard, back: e.target.value })}
                className="p-2 border rounded w-full text-slate-300 bg-slate-900 outline-none border-none"
              />
            </label>

            <div>
              <div className='flex justify-between items-center'>
                <span className="font-bold text-slate-200 ">Tags</span>
                <button
                  onClick={() => setIsAddingTag(prev => !prev)}
                  className="p-2"
                >
                  <PlusIcon className='w-5 h-5 text-blue-600 rounded text-bold hover:text-white hover:bg-blue-600'/>
                </button>
              </div>
              {/* Nút thêm tag */}
              {!isAddingTag ? (
                ""
              ) : (
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    className="p-2 border rounded w-full text-slate-300 bg-slate-900 outline-none"
                    placeholder="Nhập tên tag..."
                  />
                  <button
                    onClick={handleAddTag}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Lưu
                  </button>
                </div>
              )}
            </div>
              <div className="grid grid-cols-2 gap-1">
                {tags.map((tag) => (
                  <div key={tag.id} className="flex items-center justify-between bg-gray-800 p-1 rounded group hover:bg-slate-700">
                    <label className="flex items-center gap-2 text-slate-300">
                      <input
                        type="checkbox"
                        checked={selectedTags.includes(tag.id)}
                        onChange={() => toggleTagSelection(tag.id)}
                      />
                      {tag.name}
                    </label>
                    {
                      tag.id != 1 ? (
                        <button
                          onClick={() => handleDeleteTag(tag.id)}
                          className="text-red-500 hover:text-red-700 hidden group-hover:flex"
                        >
                          🗑️
                        </button>
                      ) : ""
                    }

                  </div>
                ))}
              </div>



            <div className='flex gap-1 justify-between'>
              <button onClick={handleDelete} className="w-full px-4 py-2 bg-gray-300 text-gray-500 rounded hover:bg-red-700 hover:text-white">
                Xóa
              </button>
              <button onClick={handleSave} className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Lưu
              </button>
            </div>
          </div>
          )}
        </div>

      </Popup>

      {/* Nút thêm thẻ */}
      <button onClick={handleAdd} className="fixed right-2 bottom-2 bg-blue-600 text-white rounded hover:bg-blue-700 p-2">
        <PlusIcon className="h-6 w-6 text-white"></PlusIcon>
      </button>
    </main>
  )
}

export default HomePage
