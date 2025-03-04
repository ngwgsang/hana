import { ReactNode } from 'react'

interface iLoadingAnimation {
  className?: string
  state?: boolean
  texts: Array<any>
}


const LoadingAnimation = ({ className, state, texts }: iLoadingAnimation) => {
  return (
    <>
        {state ? (
          <div className="flex items-center gap-2 text-white">
            <span className='animate-bounce text-white'>🐳</span>
            <span className='animate-pulse'>{texts[0]}</span>
          </div>
        ) : (
          texts[1]
        )}
    </>
  )
}

export default LoadingAnimation
