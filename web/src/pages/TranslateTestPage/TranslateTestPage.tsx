import { useState } from 'react'
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai'
import LoadingAnimation from 'src/components/LoadingAnimation/LoadingAnimation'
import Popup from 'src/components/Popup/Popup'
import { Link } from '@redwoodjs/router'
import { ArrowUturnLeftIcon } from '@heroicons/react/24/solid'
import { Metadata } from '@redwoodjs/web'
import { SEED_SENTENCES } from './DokkaiSeed'

// Cập nhật interface
interface EvaluationResult {
  accuracy: number
  fluency: number
  style: number
  grammar: number
  accuracy_feedback: string
  fluency_feedback: string
  style_feedback: string
  grammar_feedback: string
  gold_answer: string
  accuracy_marked: string[]
  fluency_marked: string[]
  style_marked: string[]
  grammar_marked: string[]
}

const TranslateTestPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [generatedParagraph, setGeneratedParagraph] = useState('')
  const [paragraphTranslation, setParagraphTranslation] = useState('')
  const [highlightedSentence, setHighlightedSentence] = useState('')
  const [userTranslation, setUserTranslation] = useState('')
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null)
  const [isPopupOpen, setIsOpen] = useState(false)
  const [showGoldAnswer, setShowGoldAnswer] = useState(false)
  const [highlightedWords, setHighlightedWords] = useState<string[]>([]) // State cho các từ cần highlight

  const genAI = new GoogleGenerativeAI(process.env.REDWOOD_ENV_API_KEY)

  const handleGenerateParagraph = async () => {
    setIsLoading(true)
    setGeneratedParagraph('')
    setHighlightedSentence('')
    setParagraphTranslation('')
    setUserTranslation('')
    setEvaluationResult(null)
    setShowGoldAnswer(false)
    setHighlightedWords([])

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
      const seed = SEED_SENTENCES[Math.floor(Math.random() * SEED_SENTENCES.length)]
      const prompt = `Bạn là một nhà văn. Hãy tạo một đoạn văn tiếng Nhật tự nhiên, dài khoảng 150-200 từ, có chứa câu sau: "${seed.text}". Đoạn văn nên nói về cuộc sống hàng ngày hoặc một câu chuyện nhỏ, trình độ ở mức ${seed.tag}.`

      const result = await model.generateContent(prompt)
      const paragraph = result.response.text()

      const translatePrompt = `Hãy dịch đoạn văn tiếng Nhật sau sang tiếng Việt một cách tự nhiên và chính xác:\n\n${paragraph}`
      const translationResult = await model.generateContent(translatePrompt)
      setParagraphTranslation(translationResult.response.text())

      const sentences = paragraph.match(/[^。]+。[ ]?/g) || [paragraph]
      const sentenceToHighlight = sentences[Math.floor(Math.random() * sentences.length)]

      const highlightedParagraph = paragraph.replace(
        sentenceToHighlight,
        `<b class="text-yellow-400">${sentenceToHighlight}</b>`
      )

      setHighlightedSentence(sentenceToHighlight.trim())
      setGeneratedParagraph(highlightedParagraph)
    } catch (error) {
      console.error('Lỗi khi tạo đoạn văn:', error)
      alert('Đã có lỗi xảy ra khi tạo đoạn văn. Vui lòng thử lại.')
    }
    setIsLoading(false)
  }

  const handleCheckTranslation = async () => {
    if (!userTranslation.trim()) {
      alert('Vui lòng nhập bản dịch của bạn.')
      return
    }
    setIsChecking(true)

    try {
      // Cập nhật schema để Gemini trả về danh sách các từ cần đánh dấu
      const schema = {
        type: SchemaType.OBJECT,
        properties: {
          gold_answer: { type: SchemaType.STRING, description: 'Nghĩa tiếng việt phù hợp nhất' },
          accuracy: { type: SchemaType.NUMBER, description: 'Điểm chính xác (tối đa 40)' },
          fluency: { type: SchemaType.NUMBER, description: 'Điểm tự nhiên (tối đa 25)' },
          style: { type: SchemaType.NUMBER, description: 'Điểm phong cách/ngữ cảnh (tối đa 20)' },
          grammar: { type: SchemaType.NUMBER, description: 'Điểm ngữ pháp (tối đa 15)' },
          accuracy_feedback: { type: SchemaType.STRING, description: 'Nhận xét về độ chính xác.' },
          fluency_feedback: { type: SchemaType.STRING, description: 'Nhận xét về độ tự nhiên.' },
          style_feedback: { type: SchemaType.STRING, description: 'Nhận xét về phong cách.' },
          grammar_feedback: { type: SchemaType.STRING, description: 'Nhận xét về ngữ pháp.' },
          accuracy_marked: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING }, description: 'Danh sách các từ/cụm từ dịch chưa chính xác.'},
          fluency_marked: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING }, description: 'Danh sách các từ/cụm từ dịch chưa tự nhiên.'},
          style_marked: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING }, description: 'Danh sách các từ/cụm từ dịch chưa đúng phong cách.'},
          grammar_marked: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING }, description: 'Danh sách các từ/cụm từ sai ngữ pháp/chính tả.'},
        },
        required: [
          'gold_answer', 'accuracy', 'fluency', 'style', 'grammar',
          'accuracy_feedback', 'fluency_feedback', 'style_feedback', 'grammar_feedback',
          'accuracy_marked', 'fluency_marked', 'style_marked', 'grammar_marked'
        ],
      }

      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: schema,
        },
      })

      const prompt = `Bạn là một người đánh giá bản dịch chuyên nghiệp. Hãy đánh giá bản dịch Tiếng Việt cho câu Tiếng Nhật sau và cho điểm chi tiết. Các đánh giá không được mâu thuẫn với gold_answer. Hãy thêm một chút icon và một chút hài hước và xéo xắt vào câu feedback nhé.\n\n### Câu Tiếng Nhật:\n${highlightedSentence}\n\n### Bản dịch Tiếng Việt:\n${userTranslation}\n\n### Tiêu chí chấm điểm và nhận xét:\n1. Chính xác (Accuracy): Dịch đúng nghĩa, đủ ý. (Tối đa 40 điểm).\n2. Tự nhiên (Fluency): Câu dịch trôi chảy, tự nhiên. (Tối đa 25 điểm).\n3. Phong cách / Ngữ cảnh (Style/Context): Phù hợp văn phong. (Tối đa 20 điểm).\n4. Ngữ pháp (Grammar): Đúng ngữ pháp, chính tả. (Tối đa 15 điểm).\n\n### Yêu cầu:\n- Cung cấp điểm VÀ nhận xét ngắn gọn bằng Tiếng Việt cho TỪNG tiêu chí.\n- Với mỗi tiêu chí, cung cấp một danh sách các từ/cụm từ trong bản dịch Tiếng Việt bị mắc lỗi tương ứng (nếu có).`

      const result = await model.generateContent(prompt)
      const jsonData = JSON.parse(result.response.text())

      setEvaluationResult(jsonData)
      setIsOpen(true)
    } catch (error) {
      console.error('Lỗi khi kiểm tra bản dịch:', error)
      alert('Đã có lỗi xảy ra khi kiểm tra. Vui lòng thử lại.')
    }
    setIsChecking(false)
  }

  const handleClosePopup = () => {
    setIsOpen(false)
    setHighlightedWords([])
  }

  // Hàm render bản dịch với các từ được highlight
  const renderUserTranslationWithHighlights = (text: string, words: string[]) => {
    if (!words || words.length === 0) {
      return text;
    }
    const escapedWords = words.map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const regex = new RegExp(`(${escapedWords.join('|')})`, 'gi');
    const parts = text.split(regex);

    return (
      <p className="text-white">
        {parts.map((part, i) =>
          words.some(word => part.toLowerCase() === word.toLowerCase()) ? (
            <span key={i} className="underline text-yellow-500 underline-offset-2 rounded transition-all duration-300">
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </p>
    );
  };


  const totalScore = evaluationResult
    ? evaluationResult.accuracy + evaluationResult.fluency + evaluationResult.style + evaluationResult.grammar
    : 0

  const feedbackItems = evaluationResult ? [
    { title: 'Chính xác', score: evaluationResult.accuracy, maxScore: 40, feedback: evaluationResult.accuracy_feedback, marked: evaluationResult.accuracy_marked },
    { title: 'Tự nhiên', score: evaluationResult.fluency, maxScore: 25, feedback: evaluationResult.fluency_feedback, marked: evaluationResult.fluency_marked },
    { title: 'Phong cách', score: evaluationResult.style, maxScore: 20, feedback: evaluationResult.style_feedback, marked: evaluationResult.style_marked },
    { title: 'Ngữ pháp', score: evaluationResult.grammar, maxScore: 15, feedback: evaluationResult.grammar_feedback, marked: evaluationResult.grammar_marked },
  ] : []

  return (
    <main className="p-4 mx-auto w-full sm:w-3/4 lg:w-2/3 flex flex-col relative">
      <Metadata title="Luyện Dịch" description="Trang luyện dịch tiếng Nhật" />
      <Link to="/home">
        <ArrowUturnLeftIcon className="h-6 w-6 text-white mb-2" />
      </Link>

      <div className="bg-gray-800 text-white p-4 rounded mb-4 flex flex-col gap-4">
        <h2 className="text-lg font-bold">Tạo đoạn văn luyện dịch</h2>
        <LoadingAnimation
          state={isLoading}
          texts={['Đang tạo đoạn văn...', <button
            onClick={handleGenerateParagraph}
            className="bg-blue-600 px-4 flex w-full py-2 rounded text-white hover:bg-blue-700 justify-center"
          >
            Tạo đoạn văn 📄
          </button>]} />
      </div>

      {generatedParagraph && (
        <div className="bg-gray-800 text-white p-4 sm:p-10 rounded mb-4 flex flex-col gap-4">
          <div>
            <h3 className="text-lg font-bold mb-2">Đoạn văn tiếng Nhật</h3>
            <p
              className="text-gray-300 leading-loose"
              dangerouslySetInnerHTML={{ __html: generatedParagraph }}
            ></p>
                 {evaluationResult ? (
                 <div className="mt-4 border-t border-gray-700 pt-4">
                    <h4 className="font-semibold text-blue-400">Bản dịch toàn đoạn văn (tham khảo):</h4>
                    <p className="text-sm text-gray-300 mt-1">{paragraphTranslation}</p>
                 </div>
              ) : ""}
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">
              Dịch câu được tô đậm sang tiếng Việt
            </h3>
            <textarea
              value={userTranslation}
              onChange={(e) => setUserTranslation(e.target.value)}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
              rows={3}
              maxLength={256}
              placeholder="Nhập bản dịch của bạn ở đây..." />
          </div>
          <LoadingAnimation
            state={isChecking}
            texts={['Đang chấm điểm...', <button
              onClick={handleCheckTranslation}
              disabled={!userTranslation.trim()}
              className="bg-green-500 px-4 flex w-full py-2 rounded text-white hover:bg-green-700 justify-center disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              Kiểm tra
            </button>]} />
        </div>
      )}

      {evaluationResult && (
        <Popup title={"Kết quả chi tiết"} isOpen={isPopupOpen} onClose={handleClosePopup}>
          <div className="text-white p-4 sm:p-6 w-full flex flex-col gap-4">
            <div className="text-center mb-4">
              <span className="text-5xl font-bold">{totalScore}</span>
              <span className="text-2xl text-gray-400">/100</span>
            </div>
            <div className='flex flex-col bg-gray-900/50 border border-gray-700 rounded-md p-4 gap-2'>
              <div>
                <h4 className="font-semibold text-gray-400 text-sm mb-1">Bản dịch của bạn:</h4>
                {/* Thay thế HighlightText bằng hàm render mới */}
                {renderUserTranslationWithHighlights(userTranslation, highlightedWords)}
              </div>

              {showGoldAnswer ? (
                <div className="mt-1">
                   <span className="text-sm text-blue-400">Đáp án tham khảo (câu): </span>
                   <span className="text-sm text-blue-300">{evaluationResult.gold_answer}</span>
                </div>
              ) : (
                <button
                    onClick={() => setShowGoldAnswer(true)}
                    className="text-left text-sm text-blue-400 hover:text-blue-300 p-1 rounded hover:bg-blue-500/10 -ml-1"
                >
                    Xem đáp án tham khảo (câu)...
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              {feedbackItems.map(item => (
                <div key={item.title}
                     className="bg-gray-700/50 p-3 rounded-lg w-full cursor-pointer"
                     onMouseEnter={() => setHighlightedWords(item.marked)}
                     onMouseLeave={() => setHighlightedWords([])}
                >
                  <div className="flex justify-between items-center font-semibold">
                    <span>{item.title}</span>
                    <span>{item.score}/{item.maxScore}</span>
                  </div>
                  <p className="text-sm text-gray-300 mt-1">{item.feedback}</p>
                </div>
              ))}
            </div>
          </div>
        </Popup>
      )}
    </main>
  )
}

export default TranslateTestPage
