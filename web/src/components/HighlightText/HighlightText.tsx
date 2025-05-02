interface HighlightTextProps {
  children: string
  isAlwayHighlight?: boolean
  className?: string
}


const HighlightText = ({children, isAlwayHighlight, className}: HighlightTextProps) => {

  const HandleSpecialText = (text: string) => {
    if (!text) return ''
    return text
      .replace(/\n/g, '<br />')
      .replace(/\*\*(.*?)\*\*/g, `<b class='group-hover:bg-sky-500/30 rounded-sm ${isAlwayHighlight ? 'text-blue-500' : ''}'>$1</b>`)
  }

  return (
    <div
      className={`text-slate-300 ${className}`}
      dangerouslySetInnerHTML={{ __html: HandleSpecialText(children) }}
    />
  )
}

export default HighlightText
