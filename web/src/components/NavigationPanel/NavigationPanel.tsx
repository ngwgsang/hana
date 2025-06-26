import { BoltIcon, PlusIcon, CloudArrowDownIcon, Squares2X2Icon } from '@heroicons/react/24/solid'
import { Link, useLocation } from '@redwoodjs/router'

interface NavigationPanelProps {
  className?: string
  onInsert?: (card: any) => void
  onExportCSV?: (card: any) => void
}

const NavigationPanel = ({className, onInsert, onExportCSV}: NavigationPanelProps) => {

  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const tagFromURL = searchParams.get('tag')
  const tagIds = tagFromURL ? [parseInt(tagFromURL, 10)] : [0]

  return (
    <div className='flex-col gap-2  p-4 rounded shadow-lg max-h-[60vh] overflow-y-auto bg-slate-800/40 lg:bg-slate-800'>

      <h3 className="text-lg font-bold text-white mb-2 hidden lg:flex">Chức năng</h3>
      <div className="gap-2 hidden lg:flex">
        <button onClick={onInsert} className="bg-blue-600 text-white rounded hover:bg-blue-700 p-2">
          <PlusIcon className="h-6 w-6 text-white"></PlusIcon>
        </button>

        <button
          onClick={onExportCSV}
          className="text-white rounded bg-blue-600 hover:bg-blue-700 p-2 hidden sm:flex"
        >
          <CloudArrowDownIcon className="h-6 w-6 text-white" />
        </button>
      </div>


      <h3 className="mt-4 text-lg font-bold text-white mb-2 hidden lg:flex">Lối tắt</h3>
      <div className='flex flex-col gap-2'>
        <span onClick={onInsert} className='cursor-pointer rounded text-blue-600 hover:text-blue-700 hover:underline text-xs lg:hidden lg:pl-2'>Thêm thẻ</span>
        <Link
          to={`/swipe-me?tag=${tagIds[0]}`}
          className="rounded text-blue-600 hover:text-blue-700 hover:underline text-xs lg:text-md lg:pl-2"
        >
          Luyện thẻ
        </Link>
        <Link
          to='/mocktest'
          className="rounded text-blue-600 hover:text-blue-700 hover:underline text-xs lg:text-md lg:pl-2"
        >
          Luyện đề
        </Link>
        <Link
          to='/translatetest'
          className="rounded text-blue-600 hover:text-blue-700 hover:underline text-xs lg:text-md lg:pl-2"
        >
          Luyện dịch
        </Link>
        <Link
          to='/report'
          className="rounded text-blue-600 hover:text-blue-700 hover:underline text-xs lg:text-md lg:pl-2"
        >
          Xem báo cáo
        </Link>
      </div>

    </div>
  )
}

export default NavigationPanel
