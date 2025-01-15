import { navigate, routes } from '@redwoodjs/router'
import Button  from 'src/components/Button'
import {
  ChatBubbleBottomCenterIcon,
  RocketLaunchIcon,
  SparklesIcon
} from '@heroicons/react/24/solid'


const Sidebar = () => {

  return (
    <div className='flex flex-col gap-2 rounded-md bg-slate-800 p-2 h-full'>
        <Button
          className='w-22'
          onClick={() => navigate(routes.chat())}>
          <ChatBubbleBottomCenterIcon
          className="h-6 w-6 text-white"

          />
        </Button>
        <Button
          className='w-22'
          onClick={() => navigate(routes.agents())}>
          <SparklesIcon className="h-6 w-6 text-white" />
        </Button>
    </div>
  )
}

export default Sidebar
