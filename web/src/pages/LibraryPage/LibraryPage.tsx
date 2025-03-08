import { useQuery } from '@redwoodjs/web';
import { GET_ANKI_CARDS, GET_ANKI_TAGS } from '../HomePage/HomPage.query';
import { Link, navigate } from '@redwoodjs/router'
import { useState, useEffect, useRef, useCallback } from 'react'
import { Together } from "together-ai"; // Import Together AI
import LoadingAnimation from 'src/components/LoadingAnimation';
import { useGlobal } from 'src/context/GlobalContext';
import { AcademicCapIcon, FireIcon } from '@heroicons/react/24/solid'


const LibraryPage = () => {



  const [apiResponse, setApiResponse] = useState({
    think: "Chưa suy nghĩ",
    knowledge: "99",
    pass_n1_rate: "99",
    performance: "99"
  });

  const [activeTab, setActiveTab] = useState('performance'); // Mặc định hiển thị tab A

  const [isLoading, setIsLoading] = useState(false);
  const [isCalcPerformance, setIsCalcPerformance] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const global = useGlobal();
  const [question, setQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);

  const { data: tagsData, loading: tagsLoading, error: tagsError } = useQuery(GET_ANKI_TAGS);
  const { data: cardsData, loading: cardsLoading, error: cardsError } = useQuery(GET_ANKI_CARDS);

  const tags = tagsData?.ankiTags || [];
  const cards = cardsData?.ankiCards || [];

  const tagCardCount = {};
  tags.forEach(tag => {
    tagCardCount[tag.id] = cards.filter(card => card.tags.some(t => t.id === tag.id)).length;
  });

  useEffect(() => {
    if (global.isAuth == false) {
      navigate("/login")
    }
  }, [])

  const together = new Together({ apiKey: process.env.REDWOOD_ENV_TOGETHER_AI });

  const calculatePerformance = async () => {

    setActiveTab('performance')
    setIsCalcPerformance(true);
    setIsLoading(true);

    try {
      const vocab = cards.map(card => card.front);
      const tagsFormatted = tags.map(tag => ({
        tag: tag.name,
        count: tagCardCount[tag.id] || 0
      }));

      const messageContent = `
        Dưới đây là dữ liệu về quá trình học của tôi với các bộ thẻ Anki.
        Tôi thi N2 được 100/180 điểm và đang ôn luyện N1.
        TARGET-LEVEL: Để đỗ N1 cần 10,000 từ vựng, 2,000 chữ Hán và 1,000 cấu trúc ngữ pháp.

        Cards: ${vocab.join(', ')}
        Tags: ${JSON.stringify(tagsFormatted)}

        TASK: Hãy đánh giá năng lực học tập của tôi và trả kết quả theo format:
        <knowledge>{int}</knowledge>
        <performance>{int}</performance>
        <pass_n1_rate>{int}</pass_n1_rate>
        <think>{string}</think>
      `;

      const response = await together.chat.completions.create({
        model: process.env.REDWOOD_ENV_REASONING_MODEL,
        messages: [{ role: "user", content: messageContent }]
      });

      const textResponse = response.choices[0].message.content;

      const extractData = (label, text) => {
        const match = text.match(new RegExp(`<${label}>(.*?)</${label}>`, "s"));
        return match ? match[1].trim() : "N/A";
      };

      setApiResponse({
        knowledge: extractData("knowledge", textResponse),
        performance: extractData("performance", textResponse),
        pass_n1_rate: extractData("pass_n1_rate", textResponse),
        think: extractData("think", textResponse),
      });

    } catch (error) {
      console.error("Error calling Together AI:", error);
      alert("Lỗi khi gọi API Together AI");
    }

    setIsLoading(false);
  };


  // Function to generate a random question
  const generateRandomQuestion = async () => {

    setActiveTab('quiz')

    if (cards.length === 0) {
      alert("Không có thẻ nào để tạo câu hỏi!");
      return;
    }

    setIsGeneratingQuestion(true);
    setSelectedAnswer(null);
    setExplanation(null);

    const randomCard = cards[Math.floor(Math.random() * cards.length)];

    try {
      const questionPrompt = `
        Hãy tạo một câu hỏi trắc nghiệm dựa trên từ vựng sau:
        Từ: "${randomCard.front}"
        Nghĩa: "${randomCard.back}"
        Các thể loại câu hỏi được tôi cho phép:
        - Cách đọc Kanji
        - Nghĩa của từ
        - Lựa chọn từ đồng nghĩa, trái nghĩa

        Hãy trả về câu hỏi theo format sau:
        <question>{string}</question>
        <optionA>{string}</optionA>
        <optionB>{string}</optionB>
        <optionC>{string}</optionC>
        <optionD>{string}</optionD>
        <correct>{char}</correct> (A, B, C, hoặc D)
        <explanation>{string}</explanation> (Giải thích vì sao đáp án đúng)

        # Lưu ý:
        Câu hỏi , đáp án là tiếng Nhật
        Giải thích là tiếng Việt
        `;

      const response = await together.chat.completions.create({
        model: process.env.REDWOOD_ENV_REASONING_MODEL,
        messages: [{ role: "user", content: questionPrompt }]
      });

      const textResponse = response.choices[0].message.content;

      const extractData = (label) => {
        const match = textResponse.match(new RegExp(`<${label}>(.*?)</${label}>`, "s"));
        return match ? match[1].trim() : "N/A";
      };

      setQuestion({
        text: extractData("question"),
        options: {
          A: extractData("optionA"),
          B: extractData("optionB"),
          C: extractData("optionC"),
          D: extractData("optionD"),
        },
        correct: extractData("correct"),
        explanation: extractData("explanation"),
      });

    } catch (error) {
      console.error("Error generating question:", error);
      alert("Lỗi khi tạo câu hỏi!");
    }

    setIsGeneratingQuestion(false);
  };

  const handleAnswerSelection = (option) => {
    setSelectedAnswer(option);
    setExplanation(question.explanation);
  };


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

  const repeatedColors = Array.from({ length: tags.length }, (_, i) => baseColors[i % baseColors.length]);

  return (
    <main className="p-4 mx-auto w-full sm:w-[85%] md:w-[75%] lg:w-[50%]">
      <LoadingAnimation state={tagsLoading && cardsLoading} texts={['Đang tải dữ liệu...', '']} />
      {tagsError && <p>Lỗi khi tải tags: {tagsError.message}</p>}
      {cardsError && <p>Lỗi khi tải thẻ: {cardsError.message}</p>}

      <section>
        <h2 className="my-4 text-white font-semibold text-2xl">Bộ thẻ ({cards.length})</h2>
        <div className="grid grid-cols-2 gap-4">
          {
            tags.map((tag, idx) => {
              const colorClass = repeatedColors[idx]; // Lặp lại màu nếu cần
              return (
                <Link key={tag.id} className={`${colorClass} px-4 py-14 rounded-lg text-white font-bold text-center shadow-md`} to={`/home?tag=${tag.id}`}>
                  {tag.name} ({tagCardCount[tag.id] || 0})
                </Link>
              )
            })
          }
        </div>
      </section>

      <section className='mt-4'>
        <h2 className="my-4 text-white font-semibold text-2xl ">Tính năng 💫</h2>

        <div className='grid grid-cols-2 gap-1'>
          <button
            type="button"
            onClick={calculatePerformance}
            className="text-white px-4 py-2 rounded-md border-2 border-blue-700"
          >
            {isCalcPerformance ? "Đánh giá lại 🤖" : "Đánh giá năng lực 🤖"}
          </button>
          <button
            type="button"
            onClick={generateRandomQuestion}
            className="text-white px-4 py-2 rounded-md border-2 border-blue-700 "
          >
            {isGeneratingQuestion && activeTab == "quiz" ? "Đang tạo câu hỏi..." : "Tạo câu hỏi ngẫu nhiên 🎲"}
          </button>
        </div>


        {isCalcPerformance && activeTab == "performance" && (
          <LoadingAnimation state={isLoading} texts={[
            "Đang tính toán...",
            <>
              <div className='mt-4 mb-2 grid grid-cols-3 gap-2 w-full'>
                <div className="relative flex items-center justify-center px-4 py-12 rounded-md bg-violet-600 border-4 text-white text-2xl font-semibold">
                  <span className='absolute top-1 left-1 text-sm px-2 py-1'>Tỉ lệ Pass</span>
                  {apiResponse.pass_n1_rate}%
                </div>
                <div className="relative flex items-center justify-center px-4 py-12 rounded-md bg-sky-600 border-4 text-white text-2xl font-semibold">
                  <span className='absolute top-1 left-1 text-sm px-2 py-1'>Kiến thức</span>
                  {apiResponse.knowledge}%
                </div>
                <div className="relative flex items-center justify-center px-4 py-12 rounded-md bg-orange-600 border-4 text-white text-2xl font-semibold">
                  <span className='absolute top-1 left-1 text-sm px-2 py-1'>Hiệu suất học</span>
                  {apiResponse.performance}%
                </div>
              </div>
              <div className='bg-gray-600 border-gray-800 text-sm p-2 text-white border-4 rounded-md cursor-pointer' onClick={() => setIsExpanded(!isExpanded)}>
                <span className="font-bold">Nhận xét:</span> {isExpanded ? apiResponse.think : " (Bấm để xem chi tiết)"}
              </div>
            </>
          ]} />
        )}

        {question && activeTab == "quiz" && (
          <div className="mt-4 p-4 bg-gray-600 border-gray-800 border-4 text-white rounded-md">
            <h3 className="text-lg font-bold">{question.text}</h3>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {Object.entries(question.options).map(([key, value]) => (
                <button
                  key={key}
                  className={`px-4 py-8 rounded-md text-white font-medium ${selectedAnswer === key ? (key === question.correct ? 'bg-green-600' : 'bg-red-600') : 'bg-blue-500 hover:bg-blue-400'}`}
                  onClick={() => handleAnswerSelection(key)}
                  disabled={selectedAnswer !== null}
                >
                  {key}. {value}
                </button>
              ))}
            </div>

            {selectedAnswer && (
              <p className="mt-4 text-yellow-300">
                <strong>{selectedAnswer === question.correct ? "✅ Đúng rồi!" : "❌ Sai rồi!"}</strong>
                <br />
                <span className="text-sm">{explanation}</span>
              </p>
            )}
          </div>
        )}

      </section>

      <div className='fixed right-2 bottom-4 sm:bottom-2 flex gap-2 flex-col-reverse transition-transform'>
        {/* Nút thư viện */}
        <Link
          to='/home'
          className="text-white rounded bg-blue-600 hover:bg-blue-700 p-2"
        >
          <AcademicCapIcon className="h-6 w-6 text-white"/>
        </Link>
        <Link
          to='/report'
          className="text-white rounded bg-blue-600 hover:bg-blue-700 p-2"
        >
          <FireIcon className="h-6 w-6 text-white"/>
        </Link>
      </div>
    </main>
  );
};

export default LibraryPage;
