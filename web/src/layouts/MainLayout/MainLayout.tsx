import Header from 'src/components/Header/Header'
import Sidebar from 'src/components/Sidebar/Sidebar'


const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Header />
      <div className='flex gap-2 w-full p-2'>
        <Sidebar />
        <main className="w-full p-6 bg-slate-800 rounded-md">
          {children}
        </main>
      </div>
    </div>
  )
}

export default MainLayout
