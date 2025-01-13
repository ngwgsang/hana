// import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import Button  from 'src/components/Button'

const HomePage = () => {
  return (
    <>
      <Metadata title="Home" description="Home page" />
      <h1 className='bg-red-500 font-bold'>Hello world</h1>
      <p>
        Find me in <code>./web/src/pages/HomePage/HomePage.tsx</code>
      </p>
      <Button>Heheh</Button>
    </>
  )
}

export default HomePage
