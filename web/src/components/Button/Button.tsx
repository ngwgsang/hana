import { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void  // Tùy chọn: thêm sự kiện onClick nếu cần
  className?: string    // Tùy chọn: mở rộng thêm class
}

const Button = ({ children, onClick, className }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`bg-blue-600 text-white p-2 rounded w-10 h-10 ${className}`}
    >
      {children}
    </button>
  )
}

export default Button
