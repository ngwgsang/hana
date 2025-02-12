import { Metadata, useQuery, useMutation, gql } from '@redwoodjs/web'
import { useState, useEffect, useRef, useCallback } from 'react'
import Popup from 'src/components/Popup'
import { FunnelIcon, MagnifyingGlassIcon, PlusIcon, PencilSquareIcon } from '@heroicons/react/24/solid'


// GraphQL Query để lấy danh sách các thẻ
// const GET_ANKI_CARDS = gql`
//   query GetAnkiCards($searchTerm: String, $tagIds: [Int!]) {
//     ankiCards(searchTerm: $searchTerm, tagIds: $tagIds) {
//       id
//       front
//       back
//       tags {
//         id
//         name
//       }
//     }
//   }
// `
const GET_ANKI_CARDS = gql`
  query GetAnkiCards($searchTerm: String, $tagIds: [Int!], $skip: Int, $take: Int) {
    ankiCards(searchTerm: $searchTerm, tagIds: $tagIds, skip: $skip, take: $take) {
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

  const { data, loading, error, fetchMore, refetch } = useQuery(GET_ANKI_CARDS, {
    variables: { searchTerm: '', tagIds: [], skip: 0, take }, // Tải 10 thẻ ban đầu
    onCompleted: (data) => {
      if (data.ankiCards.length < take) setHasMore(false)
      else setHasMore(true)

      setCards(data.ankiCards)
      setSkip(data.ankiCards.length) // Cập nhật skip
    },
  })


  const { data: tagData } = useQuery(GET_ANKI_TAGS)
  const [createAnkiCard] = useMutation(CREATE_ANKI_CARD, { onCompleted: () => refetch() })
  const [updateAnkiCard] = useMutation(UPDATE_ANKI_CARD, { onCompleted: () => refetch() })
  const [deleteAnkiCard] = useMutation(DELETE_ANKI_CARD, { onCompleted: () => refetch() })

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
          className="p-2 border rounded w-full text-black"
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
        <div className="bg-gray-100 p-4 rounded mb-4 border-2 border-blue-600">
          <h3 className="text-lg font-semibold mb-2">Bộ lọc</h3>
          <div className="grid grid-cols-2 gap-2">
            {tagData?.ankiTags.map((tag) => (
              <label key={tag.id} className="flex items-center gap-2">
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
            className="p-4 bg-gray-400 rounded shadow relative group transition duration-300 hover:ring-2 hover:shadow-lg hover:shadow-blue-500/50 hover:bg-gray-100"
          >
            <h2 className="text-lg font-semibold">{card.front}</h2>
            <p className="text-gray-600">{card.back}</p>
            <div className="mt-2 text-sm text-blue-500">
              {card.tags
                .slice() // Tạo một bản sao để tránh thay đổi dữ liệu gốc
                .sort((a, b) => a.name.localeCompare(b.name)) // Sắp xếp theo thứ tự bảng chữ cái
                .map((tag) => `#${tag.name} `)}
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
      <Popup title={isAdding ? 'Thêm thẻ mới' : 'Chỉnh sửa thẻ'} isOpen={isPopupOpen} onClose={handleClosePopup}>
        {editingCard && (
          <div className="flex flex-col gap-4">
            <label>
              <span className="font-bold">Mặt trước</span>
              <input
                type="text"
                value={editingCard.front}
                onChange={(e) => setEditingCard({ ...editingCard, front: e.target.value })}
                className="p-2 border rounded w-full text-black"
              />
            </label>

            <label>
              <span className="font-bold">Mặt sau</span>
              <textarea
                // type="text"
                value={editingCard.back}
                onChange={(e) => setEditingCard({ ...editingCard, back: e.target.value })}
                className="p-2 border rounded w-full text-black"
              />
            </label>

            <div>
              <span className="font-bold">Tags</span>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {tagData?.ankiTags.map((tag) => (
                  <label key={tag.id} className="flex items-center gap-2">
                    <input type="checkbox" checked={selectedTags.includes(tag.id)} onChange={() => toggleTagSelection(tag.id)} />
                    {tag.name}
                  </label>
                ))}
              </div>
            </div>

            <div className='flex gap-1 justify-between'>
              <button onClick={handleDelete} className="w-full px-4 py-2 bg-gray-300 text-white rounded hover:bg-red-700">
                Xóa
              </button>
              <button onClick={handleSave} className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                Lưu
              </button>
            </div>
          </div>
        )}
      </Popup>

      {/* Nút thêm thẻ */}
      <button onClick={handleAdd} className="fixed right-2 bottom-2 bg-blue-600 text-white rounded hover:bg-blue-700 p-2">
        <PlusIcon className="h-6 w-6 text-white"></PlusIcon>
      </button>
    </main>
  )
}

export default HomePage
