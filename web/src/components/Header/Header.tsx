import { useTheme } from 'src/context/ThemeContext'
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid'

const Header = () => {
  const { isDarkMode, toggleDarkMode } = useTheme()

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-800 shadow-md">
      <div className="text-2xl font-bold text-gray-800 dark:text-white">
        <a href="/">MyLogo</a>
      </div>

      <button
        onClick={toggleDarkMode}
        className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
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
