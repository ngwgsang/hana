interface HighlightTextProps {
  children: string
  isAlwayHighlight?: boolean
  className?: string
  isUnderlined?: boolean
  color?: String
}


const HighlightText = ({children, isAlwayHighlight, className, isUnderlined, color}: HighlightTextProps) => {

  const textColor = color ? `text-${color}-500` : "text-blue-500"
  const HandleSpecialText = (text: string) => {
    if (!text) return ''
    return text
      .replace(/\n/g, '<br />')
      .replace(/\*\*(.*?)\*\*/g, `<b class='group-hover:bg-sky-500/30 rounded-sm ${isAlwayHighlight ? textColor : ''} ${isUnderlined ? 'underline underline-offset-2' : ''}'>$1</b>`)
  }

  return (
    <div
      className={`text-slate-300 ${className}`}
      dangerouslySetInnerHTML={{ __html: HandleSpecialText(children) }}
    />
  )
}

export default HighlightText
