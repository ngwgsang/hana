interface BasicLayoutProps {
  MainContent: any
  RightSide: any
  LeftSide: any
}

const BasicLayout = ({ MainContent, LeftSide, RightSide }: BasicLayoutProps) => {
  return <main className="flex gap-2">
    <div className="flex-col gap-6 min-w-[22vw] h-auto left-16 top-6 fixed bg-slate-800 p-4 rounded-md hidden lg:flex">{LeftSide}</div>

    <div className="flex-col gap-2 p-4 mx-auto my-0 w-full lg:w-[46%] ">{MainContent}</div>

    <div className="flex flex-col gap-4 min-w-[22vw] fixed bottom-0 right-2 lg:right-16 lg:top-6">{RightSide}</div>
  </main>
}

export default BasicLayout
