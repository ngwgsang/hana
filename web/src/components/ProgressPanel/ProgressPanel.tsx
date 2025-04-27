import { Link } from '@redwoodjs/router'

interface ProgressPanelProps {
  cards: Array<{
    id: number
    front: string
    back: string
    tags: { id: number, name: string }[]
  }>
  tags: Array<{
    id: number
    name: string
  }>
}

const ProgressPanel = ({ cards, tags }: ProgressPanelProps) => {
  const tagCardCount: Record<number, number> = {}
  tags.forEach(tag => {
    tagCardCount[tag.id] = cards.filter(card => card.tags.some(t => t.id === tag.id)).length
  })

  // Các ID tag cần lấy (bạn có thể sửa nếu cần)
  const VOCAB_TAG_IDS = [2]
  const GRAMMAR_TAG_IDS = [3]

  const VOCAB_GOAL = 10000
  const GRAMMAR_GOAL = 500

  const vocabCount = VOCAB_TAG_IDS.reduce((sum, id) => sum + (tagCardCount[id] || 0), 0)
  const grammarCount = GRAMMAR_TAG_IDS.reduce((sum, id) => sum + (tagCardCount[id] || 0), 0)

  // alert(    `Từ vựng: ${vocabCount}, Ngữ pháp: ${grammarCount}`)

  const VOCAB_PROCESS = Math.round((vocabCount * 10000) / VOCAB_GOAL) / 100
  const GRAMMAR_PROCESS = Math.round((grammarCount * 10000) / GRAMMAR_GOAL) / 100
  const OVERALL_PROCESS = Math.round((VOCAB_PROCESS * 0.5 + GRAMMAR_PROCESS * 0.5) * 100) / 100

  const progressData = [
    // { label: 'Tỉ lệ Pass', currentProcess: vocabCount, goal: , value: OVERALL_PROCESS, color: 'violet' },
    { label: 'Từ vựng', value: VOCAB_PROCESS, currentProcess: vocabCount, goal: VOCAB_GOAL, color: 'sky' },
    { label: 'Ngữ pháp', value: GRAMMAR_PROCESS, currentProcess: grammarCount, goal: GRAMMAR_GOAL, color: 'orange' },
  ]
  const colorClasses = {
    violet: 'bg-violet-500',
    sky: 'bg-sky-500',
    orange: 'bg-orange-500',
  };


  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 gap-1 w-full  ">
      <h3 className="my-4 text-white font-semibold text-xl">
        Tiến độ
      </h3>
      <div className='bg-blue-500/10 rounded-md'>
        {progressData.map((item, index) => (
          <div
            key={index}
            className={`relative px-4 py-3 rounded-md text-white`}
          >
            <span className="absolute top-2 left-2 text-xs">{item.label}</span>
            <div className="flex justify-start items-center mt-4 gap-2">
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden w-full">
                <div
                  className={`h-full bg-blue-500 transition-all duration-500`}
                  style={{ width: `${item.value}%` }}
                />
              </div>
              <label className='text-white text-xs min-w-16'>{item.currentProcess}/{item.goal}</label>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProgressPanel
