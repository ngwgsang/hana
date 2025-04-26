import { BoltIcon, PlusIcon, CloudArrowDownIcon, Squares2X2Icon } from '@heroicons/react/24/solid'
import { Link } from '@redwoodjs/router'

interface NavigationPanelProps {
  className?: string
  onInsert?: (card: any) => void
  onExportCSV?: (card: any) => void
}

const NavigationPanel = ({className, onInsert, onExportCSV}: NavigationPanelProps) => {
  return (
    <div className='flex-col gap-2 bg-slate-800 p-4 rounded shadow-lg max-h-[60vh] overflow-y-auto mt-4'>


      <h3 className="text-lg font-bold text-white mb-2">Chức năng</h3>
      <div className="flex gap-2">
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


      <h3 className="mt-4 text-lg font-bold text-white mb-2">Lối tắt</h3>
      <div>
        <Link
          to='/swipe-me'
          className="rounded text-blue-600 hover:text-blue-700 hover:underline p-2 hidden sm:flex"
        >
          Luyện tập
        </Link>
      </div>

    </div>
  )
}

export default NavigationPanel
