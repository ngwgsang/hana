import { ReactNode } from 'react'

interface PopupProps {
  title: string
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

const Popup = ({ title, isOpen, onClose, children }: PopupProps) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96 relative">
        <h2 className="text-xl font-bold mb-4 text-slate-800">{title}</h2>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        >
          ✖
        </button>
        {children}
      </div>
    </div>
  )
}

export default Popup
