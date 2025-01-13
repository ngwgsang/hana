type SideBarLayoutProps = {
  children?: React.ReactNode
  className?: String
}

const SideBarLayout = ({ children, className }: SideBarLayoutProps) => {
  return <div className={`flex flex-col bg-slate-800 w-auto gap-4 rounded-md p-2 ${className}`}>
    {children}
  </div>
}

export default SideBarLayout
