import { useQuery } from '@redwoodjs/web';
import { GET_ANKI_CARDS, GET_ANKI_TAGS } from '../HomePage/HomPage.query';
import { Link, useLocation} from '@redwoodjs/router'
import { AcademicCapIcon } from '@heroicons/react/24/solid'


const LibraryPage = () => {
  // Lấy danh sách Tags
  const { data: tagsData, loading: tagsLoading, error: tagsError } = useQuery(GET_ANKI_TAGS);

  // Lấy danh sách tất cả các thẻ
  const { data: cardsData, loading: cardsLoading, error: cardsError } = useQuery(GET_ANKI_CARDS);

  if (tagsLoading || cardsLoading) return <p>Đang tải dữ liệu...</p>;
  if (tagsError) return <p>Lỗi khi tải tags: {tagsError.message}</p>;
  if (cardsError) return <p>Lỗi khi tải thẻ: {cardsError.message}</p>;

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
    <main className="p-4 mx-auto w-[85%] md:w-[75%] lg:w-[50%]">
      <section>
        <h2 className="my-4 text-white font-semibold text-2xl">Bộ thẻ</h2>
        <div className="grid grid-cols-2 gap-4">
          {tags.map((tag, idx) => {
            const colorClass = repeatedColors[idx]; // Lặp lại màu nếu cần
            const cardCount = tagCardCount[tag.id] || 0; // Lấy số lượng thẻ theo tag

            return (
              <Link
                key={tag.id}
                className={`px-4 py-12 rounded-lg text-white font-bold text-center shadow-md ${colorClass}`}
                to={`/home?tag=${tag.id}`}
              >
                {tag.name} ({cardCount})
              </Link>
            );
          })}
        </div>
      </section>

      <div className='fixed right-2 bottom-2 flex gap-2 flex-col-reverse transition-transform'>

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
