import { useQuery } from '@redwoodjs/web';
import { GET_ANKI_CARDS, GET_ANKI_TAGS } from '../HomePage/HomPage.query';
import { Link, navigate} from '@redwoodjs/router'
import { AcademicCapIcon } from '@heroicons/react/24/solid'
import LoadingAnimation from 'src/components/LoadingAnimation';
import { useGlobal } from 'src/context/GlobalContext';
import { useEffect, useState } from 'react';


const LibraryPage = () => {
  const [apiResponse, setApiResponse] = useState({
    "think": "Chưa suy nghĩ",
    "knowledge": "99",
    "pass_n1_rate": "99",
    "performance": "99"
  });
  const [isLoading, setIsLoading] = useState(false) // Trạng thái upload
  const [isCalcPerformance, setIsCalcPerformance] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false);

  const global = useGlobal();
  // useEffect(() => {
  //   if (global.isAuth == false) {
  //     navigate("/login")
  //   }
  // }, [])

  // Lấy danh sách Tags
  const { data: tagsData, loading: tagsLoading, error: tagsError } = useQuery(GET_ANKI_TAGS);

  // Lấy danh sách tất cả các thẻ
  const { data: cardsData, loading: cardsLoading, error: cardsError } = useQuery(GET_ANKI_CARDS);


  const tags = tagsData?.ankiTags || [];
  const cards = cardsData?.ankiCards || [];

  // Tạo bản đồ (map) đếm số lượng thẻ theo tag
  const tagCardCount = {};
  tags.forEach(tag => {
    tagCardCount[tag.id] = cards.filter(card => card.tags.some(t => t.id === tag.id)).length;
  });

  // Danh sách màu đơn sắc từ TailwindCSS (lặp lại nếu tag nhiều hơn)
  const baseColors = [
    'bg-red-500 hover:bg-red-400',
    'bg-blue-500 hover:bg-blue-400',
    'bg-green-500 hover:bg-green-400',
    'bg-yellow-500 hover:bg-yellow-400',
    'bg-purple-500 hover:bg-purple-400',
    'bg-pink-500 hover:bg-pink-400',
    'bg-orange-500 hover:bg-orange-400',
    'bg-teal-500 hover:bg-teal-400',
    'bg-teal-500 hover:bg-teal-400',
    'bg-gray-500 hover:bg-gray-400'
  ];

  // Tạo danh sách màu lặp lại khi cần
  const repeatedColors = Array.from({ length: tags.length }, (_, i) => baseColors[i % baseColors.length]);

  return (
    <main className="p-4 mx-auto w-full sm:w-[85%] md:w-[75%] lg:w-[50%]">

      <LoadingAnimation state={tagsLoading && cardsLoading} texts={['Đang tải dữ liệu...', '']} />
      {tagsError ? (<p>Lỗi khi tải tags: {tagsError.message}</p>) : ""}
      {cardsError ? (<p>Lỗi khi tải thẻ: {cardsError.message}</p>) : ""}

      <section>
        <h2 className="my-4 text-white font-semibold text-2xl">Bộ thẻ ({cards.length})</h2>
        <div className="grid grid-cols-2 gap-4">
          {tags.map((tag, idx) => {
            const colorClass = repeatedColors[idx]; // Lặp lại màu nếu cần
            const cardCount = tagCardCount[tag.id] || 0; // Lấy số lượng thẻ theo tag

            return (
              <Link
                key={tag.id}
                className={`px-4 py-14 rounded-lg text-sm sm:text-lg text-white font-bold text-center shadow-md ${colorClass}`}
                to={`/home?tag=${tag.id}`}
              >
                {tag.name} ({cardCount})
              </Link>
            );
          })}
        </div>
      </section>

      <section className='mt-4'>
        <h2 className="my-4 text-white font-semibold text-2xl ">Đánh giá</h2>
        <button
          type="button"
          onClick={async () => {
            setIsCalcPerformance(true)
            setIsLoading(true)
            try {
              const response = await fetch('http://127.0.0.1:5000/greet', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  inputs: {
                    cards: cardsData.ankiCards,
                    tags: tags,
                    tagCount: tagCardCount
                  },
                }) // Dữ liệu gửi đến API
              });

              const result = await response.json();
              setApiResponse(result); // Cập nhật state với phản hồi từ backend
            } catch (error) {
              alert(error)
              console.error("Error calling API:", error);
            }
            // setIsCalcPerformance(false)
            setIsLoading(false)
          }}
          className="text-white px-4 py-2 rounded-md border-2 border-blue-700 "
        >
          Đánh giá năng lực 🤖
        </button>
            {
              isCalcPerformance ? (
                <LoadingAnimation state={isLoading}  texts={["Đang tính toán...", (
                  <>
                    <div className='mt-4 mb-2 grid grid-cols-3 gap-2 w-full'>
                        <div className="relative flex items-center justify-center px-4 py-12 rounded-md bg-violet-600 border-4 border-violet-800 text-white text-2xl font-semibold">
                          <span className='rounded-lg border-2 borbder-violet-800 bg-violet-600 absolute top-1 left-1 text-sm px-2 py-1'>Tỉ lệ Pass</span>
                          {apiResponse.pass_n1_rate}%
                        </div>
                        <div className="relative flex items-center justify-center px-4 py-12 rounded-md bg-sky-600 border-4 border-sky-800 text-white text-2xl font-semibold">
                          <span className='rounded-lg border-2 borbder-violet-800 bg-sky-600 absolute top-1 left-1 text-sm px-2 py-1'>Kiến thức</span>
                          {apiResponse.performance}%
                        </div>
                        <div className="relative flex items-center justify-center  px-4 py-12 rounded-md bg-orange-600 border-4 border-orange-800 text-white text-2xl font-semibold">
                          <span className='rounded-lg border-2 borbder-violet-800 bg-organge-600 absolute top-1 left-1 text-sm px-2 py-1'>Hiệu suất học</span>
                          {apiResponse.knowledge}%
                        </div>
                    </div>

                    <div
                    className='bg-gray-600 border-gray-800 text-sm p-2 text-white border-4 rounded-md cursor-pointer'
                    onClick={() => setIsExpanded(!isExpanded)} // Toggle mở rộng/thu nhỏ
                    >
                    <span className="font-bold">Nhận xét:</span> {isExpanded ? apiResponse.think : " (Bấm để xem chi tiết)"}
                    </div>
                  </>
                )]}/>
              ) : ""
            }
      </section>

      <div className='fixed right-2 bottom-4 sm:bottom-2 flex gap-2 flex-col-reverse transition-transform'>
        {/* Nút thư viện */}
        <Link
          to='/home'
          className="text-white rounded bg-blue-600 hover:bg-blue-700 p-2"
        >
          <AcademicCapIcon className="h-6 w-6 text-white"/>
        </Link>
      </div>
    </main>
  );
};

export default LibraryPage;