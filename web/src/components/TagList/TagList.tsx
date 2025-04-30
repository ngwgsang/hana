import { Link } from '@redwoodjs/router'

interface Tag {
  id: number
  name: string
}

interface Card {
  id: number
  tags: { id: number; name: string }[]
}

interface TagListProps {
  tags: Tag[]
  cards: Card[]
}

const repeatedColors = [
  'bg-blue-600',
  'bg-green-600',
  'bg-purple-600',
  'bg-pink-600',
  'bg-yellow-600',
  'bg-red-600',
  'bg-indigo-600',
]

const TagList = ({ tags, cards }: TagListProps) => {
  // ✅ Tính số lượng thẻ cho mỗi tag
  const tagCardCount = {}
  tags.forEach((tag) => {
    tagCardCount[tag.id] = cards.filter((card) =>
      card.tags.some((t) => t.id === tag.id)
    ).length
  })

  return (
    <section className=''>
      <h3 className="my-4 text-white font-semibold text-xl">
        Bộ thẻ
      </h3>
      <div className="flex flex-col gap-2 ">

        <Link
          key={0}
          to={`/home?tag=${0}`}
          className={`px-4 text-sm rounded-lg text-white text-left hover:brightness-110 transition`}
        >
          Tất cả ({cards.length})
        </Link>
        {tags.map((tag, idx) => {
          return (
            <Link
              key={tag.id}
              to={`/home?tag=${tag.id}`}
              className={`px-4 text-sm rounded-lg text-white text-left hover:brightness-110 transition`}
            >
              {tag.name} ({tagCardCount[tag.id] || 0})
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export default TagList
