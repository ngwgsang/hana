import { useTheme } from 'src/context/ThemeContext'
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid'

const Header = () => {
  const { isDarkMode, toggleDarkMode } = useTheme()

  return (
    <header className="flex justify-between items-center px-6 py-4  bg-gray-800 shadow-md">
      <div className="text-2xl font-bold  text-white flex items-center gap-2">
        <a href="/" className='w-10 h-10 flex rounded-full overflow-hidden p-1 bg-gradient-to-tr from-cyan-500 via-violet-600 to-indigo-600'><img className='rounded-full block w-full h-full' src="/logo.jpg" /></a>
        <span className='bg-gradient-to-tr from-cyan-500 via-violet-600 to-indigo-600 bg-clip-text text-transparent'>Hana</span>
      </div>

      <button
        onClick={toggleDarkMode}
        className="p-2 rounded-full  bg-gray-700 hover:bg-gray-600"
      >
        {isDarkMode ? (
          <SunIcon className="h-6 w-6 text-yellow-400" />
        ) : (
          <MoonIcon className="h-6 w-6 text-gray-800" />
        )}
      </button>
    </header>
  )
}

export default Header
