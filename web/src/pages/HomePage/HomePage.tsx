// import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import Button  from 'src/components/Button'
import SideBarLayout from 'src/layouts/SideBarLayout/SideBarLayout'
import {
  ChatBubbleBottomCenterIcon,
  RocketLaunchIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/solid'
import { useState } from 'react'



const HomePage = () => {

  const [ count, setCount ] = useState(0)

  return (
    <main>
      <Metadata title="Home" description="Home page" />
      <h1 className='text-2xl text-black font-bold absolute left-1/2 right-1/2'>{count}</h1>
      <SideBarLayout className="fixed left-2 top-2">
        <Button className='w-22' onClick={() => setCount(e => e + 1)}>
          <ChatBubbleBottomCenterIcon className="h-6 w-6 text-white" />
        </Button>
        <Button className='w-22'>
          <RocketLaunchIcon className="h-6 w-6 text-white" />
        </Button>
        <Button className='w-22'>
          <AdjustmentsHorizontalIcon className="h-6 w-6 text-white" />
        </Button>
      </SideBarLayout>
    </main>
  )
}

export default HomePage
