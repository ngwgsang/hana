interface PingDotProps {
  size?: string
  color?: string
  className?: string
}

const PingDot = ({size, color, className}: PingDotProps) => {
  return (
    // <span className={`flex size-${size} ${className}`}>
    //   <span className={`absolute inline-flex h-full w-full animate-ping rounded-full bg-${color}-400 opacity-75`}></span>
    //   <span className={`relative inline-flex size-${size} rounded-full bg-${color}-500`}></span>
    // </span>
    <span className={`flex size-${size} ${className}`}>
    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
    <span className="relative inline-flex size-3 rounded-full bg-blue-500"></span>
    </span>
  )
}

export default PingDot
