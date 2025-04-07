import { Metadata, useQuery, useMutation, gql } from '@redwoodjs/web'
import { Link, useLocation , navigate} from '@redwoodjs/router'
import { useGlobal } from 'src/context/GlobalContext'
import { useState, useEffect, useRef, useCallback } from 'react'
import Popup from 'src/components/Popup'
import PingDot from 'src/components/PingDot'
import ExternalUrl from 'src/components/ExternalUrl'
import LoadingAnimation from 'src/components/LoadingAnimation'
import { BoltIcon, FunnelIcon, MagnifyingGlassIcon, PlusIcon, PencilSquareIcon, CloudArrowDownIcon, Squares2X2Icon } from '@heroicons/react/24/solid'
import Papa from 'papaparse'
import {
  BULK_CREATE_ANKI_CARDS,
  GET_ANKI_CARDS,
  GET_ANKI_TAGS,
  CREATE_ANKI_CARD,
  CREATE_ANKI_TAG,
  UPDATE_ANKI_CARD,
  UPDATE_ANKI_CARD_POINT,
  DELETE_ANKI_CARD,
  DELETE_ANKI_TAG,
  UPDATE_STUDY_PROGRESS
} from './HomPage.query'
import { Router } from '@redwoodjs/router/serverRouter'
import useSpacedRepetition from 'src/hook/useSpacedRepetition'


const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [isAdding, setIsAdding] = useState(false) // Kiểm tra trạng thái popup "Thêm thẻ"
  const [editingCard, setEditingCard] = useState(null)
  const [selectedTags, setSelectedTags] = useState([])
  const [isFilterVisible, setIsFilterVisible] = useState(false) // Toggle hiển thị bộ lọc
  const [cards, setCards] = useState([]) // Danh sách thẻ hiển thị
  const [isAddingCSV, setIsAddingCSV] = useState(false) // Kiểm tra trạng thái upload CSV
  const [parsedCards, setParsedCards] = useState([]) // Danh sách thẻ đã parse từ CSV
  const [createAnkiCards] = useMutation(BULK_CREATE_ANKI_CARDS)
  const [isUploading, setIsUploading] = useState(false) // Trạng thái upload
  const [newTagName, setNewTagName] = useState('')
  const [isAddingTag, setIsAddingTag] = useState(false)
  const [tags, setTags] = useState([])
  const [hiddenCards, setHiddenCards] = useState([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tagFromURL = searchParams.get('tag'); // Lấy giá trị tag từ URL



const [updateStudyProgress] = useMutation(UPDATE_STUDY_PROGRESS)


  const global = useGlobal();
  useEffect(() => {
    if (global.isAuth == false) {
      navigate("/login")
    }
  }, [])

  // Khi URL thay đổi, tự động refetch dữ liệu
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

  // Cập nhật hoặc thêm mới thẻ
  const handleSave = async () => {
    setIsUploading(true);
    if (selectedTags.length === 0) {
      selectedTags.push(1)
    }
    if (isAdding) {
      await createAnkiCard({
        variables: {
          input: {
            front: editingCard.front,
            back: editingCard.back,
            tagIds: selectedTags,
            point: -3, // 🔥 Đảm bảo thẻ mới có point = -3
          },
        },
      });
    } else {
      await updateAnkiCard({
        variables: {
          id: editingCard.id,
          input: {
            front: editingCard.front,
            back: editingCard.back,
            tagIds: selectedTags,
            point: -1, // 🔥 Đảm bảo update cũng có point = -3
          },
        },
      });
    }
    setIsUploading(false);
    handleClosePopup();
  };


  // Xóa thẻ
  const handleDelete = async () => {
    if (confirm('Bạn có chắc chắn muốn xóa thẻ này?')) {
      setIsUploading(true);
      await deleteAnkiCard({ variables: { id: editingCard.id } })
      setIsUploading(false);
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
      alert('Không có dữ liệu để thêm!');
      return;
    }
    setIsUploading(true); // Bật trạng thái loading

    const formattedCards = parsedCards.map((card) => ({
      front: card.front,
      back: card.back,
      tagIds: [2], // Gán mặc định tag ID = 1
      point: -3, // 🔥 Đảm bảo thẻ từ CSV cũng có point = -3
    }));

    try {
      await createAnkiCards({
        variables: { input: formattedCards },
      });
      alert('Đã thêm thẻ thành công!');
      setIsPopupOpen(false);
      setParsedCards([]); // Reset danh sách
    } catch (error) {
      console.error('Lỗi khi thêm thẻ:', error);
    } finally {
      setIsUploading(false); // Tắt trạng thái loading
    }
  };

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


  const getTimeElapsedText = (timeStamp) => {
    const now = new Date()
    const cardTimestamp = new Date(timeStamp)
    const timeDifference = now - cardTimestamp // Kết quả là số mili-giây
    const minutesAgo = Math.floor(timeDifference / 1000 / 60) // Chuyển sang phút
    const hoursAgo = Math.floor(timeDifference / 1000 / 60 / 60) // Chuyển sang giờ
    if (minutesAgo < 1) return "Vừa xong"
    if (minutesAgo < 60) return `${minutesAgo} phút trước`
    return ""
  }

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

  const HandleSpecialText = (text) => {
    if (!text) return "";

    return text
      .replace(/\n/g, "<br />") // Chuyển đổi xuống dòng thành <br />
      .replace(/\*\*(.*?)\*\*/g, "<b class='group-hover:bg-sky-500/30 rounded-sm'>$1</b>"); // Chuyển ****text**** thành <b>text</b>
  };


  return (
    <main className="p-4 mx-auto my-0 w-full sm:w-[85%] md:w-[75%] lg:w-[50%]">
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
      <LoadingAnimation state={loading} texts={['Đang tải dữ liệu...', '']} />
      {error && <p className="text-red-500">Lỗi: {error.message}</p>}

      <div className="grid grid-cols-1 gap-4">
        {cards.map((card, index) => (
          <div
            key={card.id}
            className={`p-4 bg-slate-700 rounded shadow relative group transition duration-300
              hover:ring-2 hover:shadow-lg hover:shadow-blue-500/50 hover:bg-slate-800
              ${hiddenCards.includes(card.id) ? 'hidden' : ''}`} >
            {/* <h2 className="text-lg font-semibold text-white">{card.front}</h2> */}
            <ExternalUrl className="text-lg font-semibold text-white" href={`https://mazii.net/vi-VN/search/word/javi/${card.front}`}>{card.front}</ExternalUrl>
            <span className='absolute right-2 bottom-2 rounded text-sm text-blue-500'>{getTimeElapsedText(card.createdAt)}</span>
            { getTimeElapsedText(card.createdAt) != "" ? <PingDot className='absolute -left-1 top-1 -translate-y-1/2'></PingDot> : ""}
            <div className="text-slate-300" dangerouslySetInnerHTML={{ __html: HandleSpecialText(card.back) }} />


            <div className="my-2 text-sm text-blue-500">
              {card.tags
                .slice() // Tạo một bản sao để tránh thay đổi dữ liệu gốc
                .sort((a, b) => a.name.localeCompare(b.name)) // Sắp xếp theo thứ tự bảng chữ cái
                .map((tag) => `#${tag.name} `)}
            </div>

            {/* Điểm số */}
            {
                    card.reviewScore < 0 &&
                      <span className="text-sm text-red-500 border bg-red-500/10 border-red-500  mt-2 py-1 px-2 rounded-md w-auto font-semibold">
                        <span>Cần ôn</span>
                      </span>
            }
            {
                    card.reviewScore == 0 &&
                      <span className="text-sm text-orange-500 bg-orange-500/10 border border-orange-500 mt-2 py-1 px-2 rounded-md w-auto font-semibold">
                        <span>Sắp đến hạn</span>
                      </span>
            }
            {
                    card.reviewScore > 0 &&
                      <span className="text-sm text-green-500 bg-green-500/10 border border-green-500 mt-2 py-1 px-2 rounded-md w-auto font-semibold">
                        <span>Chưa đến hạn</span>
                      </span>
            }
            {/* <span>{card.reviewScore} {card.enrollAt}</span> */}

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
              <input type="file" accept=".csv" onChange={handleFileUpload} className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-600 dark:border-gray-600 dark:placeholder-gray-400" />
              {parsedCards.length > 0 && (
                <p className="text-sm text-gray-500">{parsedCards.length} thẻ sẽ được thêm</p>
              )}
              <button
                onClick={handleUploadCSV}
                disabled={isUploading} // Vô hiệu hóa khi đang tải
                className={`px-4 py-2 rounded text-white bg-blue-600 hover:bg-blue-700`}
              >
                <LoadingAnimation state={isUploading} texts={['Đang cập nhập...', 'Xác nhận thêm thẻ']}/>
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
              <LoadingAnimation state={isUploading} texts={['Đang cập nhập...', (
                    <>
                    <button onClick={handleDelete} className="w-full px-4 py-2 bg-gray-300 text-gray-500 rounded hover:bg-red-700 hover:text-white">
                      Xóa
                    </button>
                    <button onClick={handleSave} className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                      Lưu
                    </button>
                  </>
                )]}/>
            </div>
          </div>
          )}
        </div>

      </Popup>

      <div className='fixed right-2 bottom-4 sm:bottom-2 flex gap-2 flex-col-reverse transition-transform'>
        {/* Nút thêm thẻ */}
        <button onClick={handleAdd} className=" bg-blue-600 text-white rounded hover:bg-blue-700 p-2">
          <PlusIcon className="h-6 w-6 text-white"></PlusIcon>
        </button>

        {/* Nút xuất thẻ */}
        <button
          onClick={handleExportCSV}
          className="text-white rounded bg-blue-600 hover:bg-blue-700 p-2 hidden sm:flex"
        >
          <CloudArrowDownIcon className="h-6 w-6 text-white"/>
        </button>

        {/* Nút thư viện */}
        <Link
          to='/library'
          className="text-white rounded bg-blue-600 hover:bg-blue-700 p-2"
        >
          <Squares2X2Icon className="h-6 w-6 text-white"/>
        </Link>

        <Link
          to='/swipe-me'
          className="text-white rounded bg-blue-600 hover:bg-blue-700 p-2"
        >
          <BoltIcon className="h-6 w-6 text-white"/>
        </Link>
      </div>


    </main>
  )
}

export default HomePage
