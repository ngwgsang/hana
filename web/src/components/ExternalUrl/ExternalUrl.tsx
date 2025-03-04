import { ReactNode } from 'react'

interface iExternalUrl {
  children: ReactNode
  className?: string
  href?: string
}

const ExternalUrl = ({ children, className, href }: iExternalUrl) => {
  return (
    <a
      target='_blank'
      href={href}
      className={`hover:text-slate-300 ${className}`}>
        {children}
    </a>
  )
}

export default ExternalUrl
