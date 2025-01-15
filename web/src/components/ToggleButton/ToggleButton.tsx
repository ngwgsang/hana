import { useState } from 'react'

interface ToggleButtonProps {
  isOnDefault?: boolean
  onToggle?: (isOn: boolean) => void
}

const ToggleButton = ({ isOnDefault = false, onToggle }: ToggleButtonProps) => {
  const [isOn, setIsOn] = useState(isOnDefault)

  const handleToggle = () => {
    const newState = !isOn
    setIsOn(newState)
    if (onToggle) {
      onToggle(newState)  // Gọi callback khi toggle
    }
  }

  return (
    <button
      onClick={handleToggle}
      className={`w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 transition-colors ${
        isOn ? 'bg-green-500' : 'bg-gray-400'
      }`}
    >
      <div
        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
          isOn ? 'translate-x-6' : 'translate-x-0'
        }`}
      />
    </button>
  )
}

export default ToggleButton
