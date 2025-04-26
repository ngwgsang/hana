import { BoltIcon, PlusIcon, CloudArrowDownIcon, Squares2X2Icon } from '@heroicons/react/24/solid'
import { Link } from '@redwoodjs/router'

interface NavigationPanelProps {
  className?: string
  onInsert?: (card: any) => void
  onExportCSV?: (card: any) => void
}

const NavigationPanel = ({className, onInsert, onExportCSV}: NavigationPanelProps) => {
  return (
    <div className='fixed right-2 bottom-4 sm:bottom-2 flex gap-2 flex-col-reverse transition-transform'>

      {/* Nút thêm thẻ */}
      <button onClick={onInsert} className=" bg-blue-600 text-white rounded hover:bg-blue-700 p-2">
        <PlusIcon className="h-6 w-6 text-white"></PlusIcon>
      </button>

      {/* Nút xuất thẻ */}
      <button
        onClick={onExportCSV}
        className="text-white rounded bg-blue-600 hover:bg-blue-700 p-2 hidden sm:flex"
      >
        <CloudArrowDownIcon className="h-6 w-6 text-white" />
      </button>

      {/* Nút thư viện */}
      <Link
        to='/library'
        className="text-white rounded bg-blue-600 hover:bg-blue-700 p-2"
      >
        <Squares2X2Icon className="h-6 w-6 text-white" />
      </Link>

      {/* Lướt thẻ  */}
      <Link
        to='/swipe-me'
        className="text-white rounded bg-blue-600 hover:bg-blue-700 p-2"
      >
        <BoltIcon className="h-6 w-6 text-white" />
      </Link>
    </div>
  )
}

export default NavigationPanel
