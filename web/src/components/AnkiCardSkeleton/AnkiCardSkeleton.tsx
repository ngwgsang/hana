const AnkiCardSkeleton = () => {
  return (
    <div
      className="p-2 bg-slate-700 rounded shadow relative animate-pulse
        hover:ring-2 hover:shadow-lg hover:shadow-blue-500/50 hover:bg-slate-800 w-full bg-red-300"
    >
      {/* Front title placeholder */}
      <div className="h-6 bg-gray-600 rounded w-3/5 mb-4"></div>

      {/* Created time placeholder */}
      <div className="absolute right-2 bottom-2 h-4 bg-gray-600 rounded w-16"></div>

      {/* Back content placeholder */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-600 rounded"></div>
        <div className="h-4 bg-gray-600 rounded w-5/6"></div>
        <div className="h-4 bg-gray-600 rounded w-4/6"></div>
      </div>

      {/* Tags placeholder */}
      <div className="my-2">
        <div className="h-3 bg-blue-500/50 rounded w-32"></div>
      </div>

      {/* ReviewStatusTag giả */}
      <div className="h-6 bg-green-600/30 rounded w-24 mt-4"></div>

      {/* Điểm số button fake */}
      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 flex gap-2 bg-gray-800 p-2 rounded-lg shadow-lg transition-opacity duration-300">
        <div className="bg-gray-600 w-10 h-10 rounded"></div>
        <div className="bg-gray-600 w-10 h-10 rounded"></div>
        <div className="bg-gray-600 w-10 h-10 rounded"></div>
      </div>

      {/* Nút edit/bookmark giả */}
      <div className="absolute top-2 right-2 flex gap-1">
        <div className="bg-gray-600 w-6 h-6 rounded"></div>
        <div className="bg-gray-600 w-6 h-6 rounded"></div>
      </div>
    </div>
  )
}

export default AnkiCardSkeleton
