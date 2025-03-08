import { ReactNode } from 'react'
import { XMarkIcon } from '@heroicons/react/24/solid'



interface PopupProps {
  title: string
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

const Popup = ({ title, isOpen, onClose, children }: PopupProps) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
      <div className="bg-slate-800 p-6 rounded shadow-lg sm:w-[60vw] md:[50vw] 2xl:w-[30vw] relative">
        <h2 className="text-xl font-bold mb-4 text-white">{title}</h2>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        >
          <XMarkIcon className='w-6 h-6 '/>
        </button>
        {children}
      </div>
    </div>
  )
}

export default Popup
