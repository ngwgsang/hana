interface ReviewStatusTagProps {
  score?: number
  color?: string
  className?: string
}

const ReviewStatusTag = ({score, color, className}: ReviewStatusTagProps) => {
  return (
    score !== undefined && (
      <span
        className={`text-sm mt-2 py-1 px-2 rounded-md w-auto font-semibold
          ${
            score < 0
              ? 'text-red-500 bg-red-500/10 border border-red-500'
              : score === 0
              ? 'text-orange-500 bg-orange-500/10 border border-orange-500'
              : 'text-green-500 bg-green-500/10 border border-green-500'
          }`}
      >
        {score < 0
          ? 'Cần ôn'
          : score === 0
          ? 'Sắp đến hạn'
          : 'Chưa đến hạn'}
      </span>
    )
  )
}

export default ReviewStatusTag
