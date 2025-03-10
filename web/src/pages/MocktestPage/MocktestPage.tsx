import { useQuery } from '@redwoodjs/web'
import { useState, useEffect } from 'react'
import { Metadata } from '@redwoodjs/web'
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { GET_ANKI_CARDS } from '../HomePage/HomPage.query';
import LoadingAnimation from 'src/components/LoadingAnimation/LoadingAnimation';
import Popup from 'src/components/Popup/Popup';
import { Link, navigate } from '@redwoodjs/router'
import { AcademicCapIcon, Squares2X2Icon } from '@heroicons/react/24/solid'
import { useGlobal } from 'src/context/GlobalContext'


const MocktestPage = () => {

  const global = useGlobal();
  useEffect(() => {
    if (global.isAuth == false) {
      navigate("/login")
    }
  }, [])


  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [randomWords, setRandomWords] = useState([]);
  const [isPopupOpen, setIsOpen] = useState(false)
  const [correctCount, setCorrectCount] = useState(0);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);


  const { data: cardsData, loading: cardsLoading, error: cardsError } = useQuery(GET_ANKI_CARDS);

  const handleShuffle = () => {
    const shuffled = [...cardsData.ankiCards].sort(() => 0.5 - Math.random());
    setRandomWords(shuffled.slice(0, 10).map(card => card.front));
  }

  const handleClosePopup = () => {
    setIsOpen(false)
  }

  const handleOpenPopup = () => {
    setIsOpen(true)
  }

  useEffect(() => {
    if (cardsData?.ankiCards?.length > 0) {
      handleShuffle()
    }
  }, [cardsData]);

  useEffect(() => {
    // Kiểm tra xem tất cả các câu hỏi đã được chọn hay chưa
    setIsSubmitDisabled(questions.length === 0 || Object.keys(selectedAnswers).length < questions.length);
  }, [selectedAnswers, questions]);


  const genAI = new GoogleGenerativeAI(process.env.REDWOOD_ENV_API_KEY);

  const makeRequest = async () => {
    setIsLoading(true)
    try {
      const schema = {
        description: "List of JLPT quiz questions with explanations",
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            questionType: { type: SchemaType.STRING, nullable: false },
            question: { type: SchemaType.STRING, nullable: false, description: "Câu hỏi JLPT, được viết bằng Tiếng Nhật" },
            choices: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING }, nullable: false },
            correctAnswer: { type: SchemaType.STRING, nullable: false },
            explanation: { type: SchemaType.STRING, nullable: false },
          },
          required: ["questionType", "question", "choices", "correctAnswer", "explanation"],
        },
      };

      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: schema,
        },
      });

      const prompt = `###
Bạn là một người tạo đề thi tiếng Nhật chuyên về luyện thi JLPT. Hãy tạo **10 câu hỏi trắc nghiệm** dựa trên các từ vựng sau: **${randomWords.join(", ")}**.

Mỗi câu hỏi phải thuộc **một trong 5 dạng bài JLPT**:
1. **Ngữ pháp** - Chọn cách sử dụng ngữ pháp đúng.
2. **Đọc hiểu** - Chọn cách giải thích đúng nhất cho một đoạn văn.
3. **Từ vựng theo ngữ cảnh** - Chọn từ thích hợp nhất để hoàn thành câu.
4. **Ý nghĩa của Kanji** - Chọn nghĩa chính xác của chữ Hán.
5. **Hoàn thành câu** - Chọn từ thích hợp nhất để hoàn thành câu.

Các phần giải thích phải được viết bằng tiếng Việt.

### **Ví dụ về 5 dạng bài JLPT (Few-Shot Examples)**:
#### Ví dụ 1 - Ngữ pháp
**Câu hỏi:** この仕事は＿＿＿＿がある人でなければできません。
**Đáp án:** ① 経験 ② 知識 ③ 能力 ④ 自信
**Đáp án đúng:** ① 経験
**Giải thích:** Cụm "なければできません" mang nghĩa **điều kiện bắt buộc**, vì vậy "kinh nghiệm" (経験) là lựa chọn phù hợp nhất.

#### Ví dụ 2 - Đọc hiểu
**Câu hỏi:** 「彼の話はうそばかりだ」とはどういう意味ですか？
**Đáp án:** ① 彼は正直な人だ ② 彼の話は信用できない ③ 彼は面白い話をする ④ 彼の話は本当のことばかりだ
**Đáp án đúng:** ② 彼の話は信用できない
**Giải thích:** "うそばかり" có nghĩa là "chỉ toàn nói dối", nên đáp án đúng là "彼の話は信用できない" (Câu chuyện của anh ta không đáng tin cậy).

#### Ví dụ 3 - Từ vựng theo ngữ cảnh
**Câu hỏi:** Chọn từ phù hợp nhất với nghĩa của câu sau: 「この商品はとても人気があり、＿＿＿します。」
**Đáp án:** ① 売り切れ ② 買い物 ③ 注文 ④ 割引
**Đáp án đúng:** ① 売り切れ
**Giải thích:** Cụm "とても人気があり" (rất phổ biến) gợi ý rằng sản phẩm **đã được bán hết** (売り切れ).

#### Ví dụ 4 - Ý nghĩa của Kanji
**Câu hỏi:** 「温暖化」の意味は何ですか？
**Đáp án:** ① 暖かくなること ② 冷たくなること ③ 風が強くなること ④ 空気がきれいになること
**Đáp án đúng:** ① 暖かくなること
**Giải thích:** "温暖化" (biến đổi khí hậu) có nghĩa là "trở nên ấm hơn".

#### Ví dụ 5 - Hoàn thành câu
**Câu hỏi:** 彼女は＿＿＿日本語を話すことができます。
**Đáp án:** ① ぺらぺら ② じっと ③ そろそろ ④ たっぷり
**Đáp án đúng:** ① ぺらぺら
**Giải thích:** "ぺらぺら" có nghĩa là **"trôi chảy"**, nên đây là lựa chọn chính xác.

### **Hãy tạo 10 câu hỏi mới dựa trên từ vựng sau: ${randomWords.join(", ")}.**`;

      const result = await model.generateContent(prompt);
      const jsonData = JSON.parse(result.response.text());

      setQuestions(jsonData);
      setSelectedAnswers({});
      setSubmitted(false);
    } catch (error) {
      console.error("Lỗi khi tạo câu hỏi:", error);
    }
    handleShuffle()
    setIsLoading(false)
  };

  const handleSelectAnswer = (questionIndex, choice) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionIndex]: choice }));
  };

  const handleSubmit = () => {
    if (isSubmitDisabled) {
      alert("⚠️ Bạn cần chọn tất cả các câu trả lời trước khi nộp bài!");
      return;
    }

    let correct = 0;
    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswer) {
        correct += 1;
      }
    });

    setCorrectCount(correct);
    setSubmitted(true);
    handleOpenPopup(); // Mở popup hiển thị kết quả
  };


  return (
    <main className="p-4 mx-auto w-full sm:w-3/4 lg:w-1/2 flex flex-col relative">
      <Metadata title="Mock Test" description="JLPT Practice Quiz" />

      <h1 className="text-xl font-bold mb-4 text-white">☕ JLPT</h1>

      <div className="bg-gray-800 text-white p-4 rounded mb-4">
        <h2 className="text-lg font-bold mb-2">Tạo câu hỏi JLPT</h2>

        <LoadingAnimation state={isLoading} texts={["Đang tạo câu hỏi...", (
          <button
            onClick={makeRequest}
            className="bg-blue-500 px-4 py-2 rounded text-white hover:bg-blue-700"
            disabled={randomWords.length === 0}
          >
            🔄 Tạo Quiz (Từ: {randomWords.join(", ") || "Đang tải..."})
          </button>
        )]} />

      </div>

      {questions.length > 0 && (
        <div className="bg-gray-800 text-white p-4 sm:p-10 rounded mb-4">
          <h2 className="text-lg font-bold mb-2">📝 Bài kiểm tra</h2>
          {questions.map((q, index) => (
            <div key={index} className="relative mb-4 p-4 pt-12 border border-gray-600 rounded">
              <span className='absolute border border-blue-500 bg-blue-500/10 rounded-md px-2 py-1 text-blue-500 font-semibold text-sm left-4 top-2'>{q.questionType}</span>
              <p className="text-white font-semibold">{index + 1}. {q.question}</p>
              <div className="mt-2 space-y-2">
                {q.choices.map((choice, choiceIndex) => (
                  <label
                    key={choiceIndex}
                    className={`block p-2 rounded cursor-pointer transition-colors duration-200 ${
                      selectedAnswers[index] === choice ? "bg-blue-500 text-white" : "bg-gray-700 hover:bg-gray-600"
                    }`}
                    onClick={() => handleSelectAnswer(index, choice)}
                  >
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={choice}
                      checked={selectedAnswers[index] === choice}
                      onChange={() => handleSelectAnswer(index, choice)}
                      className="hidden"
                    />
                    {choice}
                  </label>
                ))}
              </div>

              {submitted && (
                <>
                  <p className={`mt-2 font-semibold ${selectedAnswers[index] === q.correctAnswer ? 'text-green-400' : 'text-red-400'}`}>
                    {selectedAnswers[index] === q.correctAnswer ? "✅ Đúng!" : `❌ Sai! Đáp án đúng: ${q.correctAnswer}`}
                  </p>
                  <p className="mt-2 text-gray-300">📝 <strong>Giải thích:</strong> {q.explanation}</p>
                </>
              )}
            </div>
          ))}

          <button
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            className={`px-4 py-2 rounded mt-4 ${
              isSubmitDisabled ? "bg-gray-500 cursor-not-allowed" : "bg-green-500 hover:bg-green-700 text-white"
            }`}
          >
            ✅ Nộp bài
          </button>
        </div>
      )}
      {/* Popup thông báo kết quả */}
      <Popup title={""} isOpen={isPopupOpen} onClose={handleClosePopup}>
        <p className="text-xl text-center my-16 font-bold text-white">🎉 Bạn đã làm đúng {correctCount}/{questions.length} câu!</p>
      </Popup>

      <div className='fixed right-2 bottom-4 sm:bottom-2 flex gap-2 flex-col-reverse transition-transform'>
        {/* Nút thư viện */}
        <Link
          to='/home'
          className="text-white rounded bg-blue-600 hover:bg-blue-700 p-2"
        >
          <AcademicCapIcon className="h-6 w-6 text-white"/>
        </Link>
        <Link
          to='/library'
          className="text-white rounded bg-blue-600 hover:bg-blue-700 p-2"
        >
          <Squares2X2Icon className="h-6 w-6 text-white"/>
        </Link>
      </div>
    </main>


  );
};

export default MocktestPage;
