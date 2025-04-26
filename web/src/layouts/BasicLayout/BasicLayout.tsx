interface BasicLayoutProps {
  MainContent: any
  RightSide: any
  LeftSide: any
}

const BasicLayout = ({ MainContent, LeftSide, RightSide }: BasicLayoutProps) => {
  return <main className="flex gap-2 relative">
    <div className="flex-col gap-2 bg-red-300 min-w-[25vw] h-auto top-0 fixed">{LeftSide}</div>

    <div className="flex-col gap-2 p-4 mx-auto my-0 w-[48vw] ">{MainContent}</div>

    <div className="flex-col gap-6 min-w-[25vw] fixed right-2 top-2">{RightSide}</div>
  </main>
}

export default BasicLayout
