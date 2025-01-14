// import { Link, routes } from '@redwoodjs/router'
import { Metadata, useQuery, gql  } from '@redwoodjs/web'
import Button  from 'src/components/Button'
import SideBarLayout from 'src/layouts/SideBarLayout/SideBarLayout'
import {
  ChatBubbleBottomCenterIcon,
  RocketLaunchIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/solid'
import { useState } from 'react'


const GET_AGENTS = gql`
  query GetAgents {
    agents {
      id
      name
      avatar
      settings
    }
  }
`

const HomePage = () => {

  const [ count, setCount ] = useState(0)
  const { data, loading, error } = useQuery(GET_AGENTS)

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
      {data && data.agents && data.agents.length > 0 ? (
        <ul className="absolute left-1/2 mt-4 grid grid-cols-2 gap-4">
          {data.agents.map((agent) => (
            <li key={agent.id} className="flex items-center p-4 bg-gray-100 rounded shadow">
              <img
                src={agent.avatar}
                alt={agent.name}
                className="w-12 h-12 rounded-full mr-4 object-cover"
              />
              <div>
                <p className="font-bold">{agent.name}</p>
                <p className="text-sm text-gray-600">Settings: {agent.settings}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 mt-4">Không có Agent nào.</p>
      )}
    </main>
  )
}

export default HomePage
