import { Metadata, useQuery, useMutation, gql } from '@redwoodjs/web'
import { Link, useLocation, navigate } from '@redwoodjs/router'
import { useGlobal } from 'src/context/GlobalContext'
import { useState, useEffect, useRef, useCallback } from 'react'
import Papa from 'papaparse'
import { GET_ANKI_CARDS, CREATE_ANKI_CARD, UPDATE_ANKI_CARD, DELETE_ANKI_CARD, BULK_CREATE_ANKI_CARDS, UPDATE_ANKI_CARD_POINT } from 'src/graphql/AnkiCard.query'
import { GET_ANKI_TAGS, CREATE_ANKI_TAG, DELETE_ANKI_TAG } from 'src/graphql/AnkiTag.query'
import { UPDATE_STUDY_PROGRESS } from 'src/graphql/Report.query'
import useSpacedRepetition from 'src/hook/useSpacedRepetition'
import Popup from 'src/components/Popup'
import LoadingAnimation from 'src/components/LoadingAnimation'
import AnkiCard from 'src/components/AnkiCard/AnkiCard'
import NavigationPanel from 'src/components/NavigationPanel/NavigationPanel'
import SearchBox from 'src/components/SearchBox/SearchBox'
import AnkiCardCRUDPopup from 'src/components/AnkiCardCRUDPopup/AnkiCardCRUDPopup'
import BookmarkPanel from 'src/components/BookmarkPanel/BookmarkPanel'
import BasicLayout from 'src/layouts/BasicLayout/BasicLayout'


const HomePage = () => {

  // State
  const [searchTerm, setSearchTerm] = useState('')
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [isAdding, setIsAdding] = useState(false) // Kiểm tra trạng thái popup "Thêm thẻ"
  const [editingCard, setEditingCard] = useState(null)
  const [cards, setCards] = useState([]) // Danh sách thẻ hiển thị
  const [tags, setTags] = useState([])
  const [hiddenCards, setHiddenCards] = useState([]);
  const [highlightedCardId, setHighlightedCardId] = useState(null)
  const [bookmarkedFronts, setBookmarkedFronts] = useState<string[]>([])

  // Others
  const cardRefs = useRef({}) // Map front -> ref
  const global = useGlobal();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tagFromURL = searchParams.get('tag'); // Lấy giá trị tag từ URL

  // Mutation
  const [createAnkiCard] = useMutation(CREATE_ANKI_CARD, { onCompleted: () => refetch() })
  const [updateAnkiCard] = useMutation(UPDATE_ANKI_CARD, { onCompleted: () => refetch() })
  const [deleteAnkiCard] = useMutation(DELETE_ANKI_CARD, { onCompleted: () => refetch() })
  const [createAnkiCards] = useMutation(BULK_CREATE_ANKI_CARDS, { onCompleted: () => refetch() })
  const [updateStudyProgress] = useMutation(UPDATE_STUDY_PROGRESS)
  const [updateAnkiCardPoint] = useMutation(UPDATE_ANKI_CARD_POINT)

  // useEffect(() => {
  //   if (global.isAuth == false) {
  //     navigate("/login")
  //   }
  // }, [])

  useEffect(() => {
    const stored = localStorage.getItem('hana-short-term-memory')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setBookmarkedFronts(parsed)
      } catch (e) {
        console.error('Lỗi đọc bookmark:', e)
      }
    }
  }, [])

  useEffect(() => {
    const tagId = tagFromURL ? parseInt(tagFromURL, 10) : null;
    refetch({ searchTerm, tagIds: tagId ? [tagId] : [] });
  }, [tagFromURL]);

  const { data, loading, error, refetch } = useQuery(GET_ANKI_CARDS, {
    variables: { searchTerm: '', tagIds: [] }, // Không cần skip/take nữa
    onCompleted: (data) => {
      if (!data?.ankiCards) return;

      const sortedCards = data.ankiCards.map((card) => {
        const { reviewScore } = useSpacedRepetition(card.point, card.enrollAt);
        return { ...card, reviewScore };
      }).sort((a, b) => a.reviewScore - b.reviewScore); // Sắp xếp tăng dần theo reviewScore

      setCards(sortedCards);
    },
  });

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

  // Hàm tìm kiếm thủ công
  const handleSearch = () => {
    refetch({ searchTerm, tagIds: tagFromURL ? [parseInt(tagFromURL, 10)] : [] });
  };

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

  // Chọn/bỏ chọn tag
  const toggleTagSelection = (tagId) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tagId) ? prevTags.filter((id) => id !== tagId) : [...prevTags, tagId]
    )
  }

  const handleExportCSV = () => {
    if (cards.length === 0) {
      alert("Không có dữ liệu để xuất!");
      return;
    }

    // Chuyển danh sách thẻ thành định dạng CSV
    const csvData = cards.map(card => ({
      front: card.front,
      back: card.back
    }));

    // Chuyển đổi dữ liệu sang chuỗi CSV
    const csvString = Papa.unparse(csvData, { header: true });

    // Tạo Blob để tải xuống file CSV
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    // Tạo thẻ <a> để tự động tải file
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `anki_cards_${new Date().toISOString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePointUpdate = async (cardId, pointChange) => {
    setHiddenCards((prevHidden) => [...prevHidden, cardId]);
    let status = ''
    if (pointChange === 1) status = 'good'
    if (pointChange === 0) status = 'normal'
    if (pointChange === -1) status = 'bad'
    setCards((prevCards) =>
      prevCards.map((card) => {
        if (card.id !== cardId) return card;

        let newPoint = card.point;

        if (pointChange === 1) {
          // Khi nhớ, tăng điểm nhưng có giới hạn max
          newPoint = Math.min(10, card.point * 1.5);
        } else if (pointChange === -1) {
          // Khi quên, giảm theo tỷ lệ nhưng không về 0 ngay
          newPoint = Math.max(0, card.point * 0.7);
        } else {
          // Khi không chắc, giảm nhẹ hoặc giữ nguyên
          newPoint = Math.max(0, card.point - 1);
        }
        return { ...card, point: Math.round(newPoint) };
      })
    );

    try {
      await updateStudyProgress({
        variables: { status }
      })
      await updateAnkiCardPoint({
        variables: { id: cardId, pointChange },
      });
    } catch (error) {
      console.error("Lỗi cập nhật điểm:", error);
      setHiddenCards((prevHidden) => prevHidden.filter((id) => id !== cardId));
    }
  };

  const handleBookmark = (card) => {
    const key = 'hana-short-term-memory'
    const stored = JSON.parse(localStorage.getItem(key) || '[]')

    if (!stored.includes(card.front)) {
      const updatedStored = [...stored, card.front]
      localStorage.setItem(key, JSON.stringify(updatedStored))
      setBookmarkedFronts(updatedStored) // 🔥 update state ngay
    }
  }

  const handleRemoveBookmark = (frontToRemove) => {
    const key = 'hana-short-term-memory'
    const stored = JSON.parse(localStorage.getItem(key) || '[]')
    const updated = stored.filter((item) => item !== frontToRemove)
    localStorage.setItem(key, JSON.stringify(updated))
    setBookmarkedFronts(updated) // 🔥 update state ngay
  }

  const handleBookmarkClick = (front) => {
    const el = document.getElementById(`card-${front}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      el.classList.add('border-red-500') // Optional immediate feedback
      setHighlightedCardId(front) // Ghi lại để style bằng tailwind
    }
  }

  return (
    <>
    <Metadata title="Home" description="Home page" />
    <BasicLayout
      MainContent={
          <>

          <SearchBox
            tags={tagData?.ankiTags || []}
            onSearch={(searchTerm, selectedTagIds) => {
              refetch({ searchTerm, tagIds: selectedTagIds })
            }}
          />

          <LoadingAnimation state={loading} texts={['Đang tải dữ liệu...', '']} />
          {error && <p className="text-red-500">Lỗi: {error.message}</p>}


          <div className="grid grid-cols-1 gap-4 max-w-full">
            {cards.map((card) => (
              <AnkiCard
                key={card.id}
                card={card}
                hidden={hiddenCards.includes(card.id)}
                highlighted={highlightedCardId === card.front}
                onEdit={handleEdit}
                onBookmark={handleBookmark}
                onPointUpdate={handlePointUpdate}
                cardRefs={cardRefs}
              />
            ))}
          </div>

          {/* Popup chỉnh sửa/thêm thẻ */}
          <Popup title={isAdding ? 'Thêm thẻ mới' : 'Chỉnh sửa thẻ'} isOpen={isPopupOpen} onClose={handleClosePopup}>
            <AnkiCardCRUDPopup
              tags={tags}
              onClose={handleClosePopup}
              onSaveCard={async ({ front, back, tagIds }) => {
                if (isAdding) {
                  await createAnkiCard({ variables: { input: { front, back, tagIds, point: -3 } } })
                } else {
                  await updateAnkiCard({ variables: { id: editingCard.id, input: { front, back, tagIds, point: -1 } } })
                }
                refetch()
              }}
              onBulkUpload={async (cards, tagIds) => {
                await createAnkiCards({ variables: { input: { cards: cards.map(card => ({ ...card, tagIds })), tagIds } } })
                refetch()
              }}
              onDeleteCard={editingCard ? async () => {
                await deleteAnkiCard({ variables: { id: editingCard.id } })
                refetch()
              } : undefined}
              editingCard={editingCard}
              isAdding={isAdding}
            />
          </Popup>
          </>

      }
      // LeftSide={
      //   <NavigationPanel
      //     onInsert={handleAdd}
      //     onExportCSV={handleExportCSV}
      //   />
      // }
      RightSide={
        <>
          <BookmarkPanel
            bookmarkedCards={bookmarkedFronts}
            cardRefs={cardRefs}
            onRemoveBookmark={handleRemoveBookmark}
            onBookmarkClick={handleBookmarkClick}
          />
          <NavigationPanel
            onInsert={handleAdd}
            onExportCSV={handleExportCSV}
          />
        </>
      }
    />
    </>
  )
}

export default HomePage