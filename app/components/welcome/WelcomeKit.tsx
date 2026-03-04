import { useState } from 'react'
import EraShape from './EraShape'
import EraContent from './contents/EraContent'
import ElectronContent from './contents/ElectronContent'
import ReactContent from './contents/ReactContent'
import ViteContent from './contents/ViteContent'
import ShadContent from './contents/ShadContent'
import TailwindContent from './contents/TailwindContent'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '../ui/badge'
import { useTheme } from '@/app/components/theme/ThemeProvider'
import './styles.css'

export default function WelcomeKit() {
  const [activePath, setActivePath] = useState<number>(5)

  const handlePathHover = (index: number) => {
    setActivePath(index)
  }

  const handlePathReset = () => {
    setActivePath(5)
  }

  const content = () => {
    switch (activePath) {
      case 0:
        return <ElectronContent />
      case 1:
        return <ReactContent />
      case 2:
        return <ViteContent />
      case 3:
        return <ShadContent />
      case 4:
        return <TailwindContent />
      case 5:
        return <EraContent />
      default:
        return <EraContent />
    }
  }

  return (
    <div className="welcome-content flex flex-col gap-5">
      <div className="flex gap-5 items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={'content-' + activePath}
            style={{ zIndex: 2, flex: 1 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.2,
              ease: 'easeInOut',
            }}
          >
            {content()}
          </motion.div>
        </AnimatePresence>
        <EraShape onPathHover={handlePathHover} onPathReset={handlePathReset} />
      </div>
      <div className="flex justify-center items-center gap-4 opacity-50 hover:opacity-80 transition-opacity">
        <DarkModeToggle />
      </div>
    </div>
  )
}

const DarkModeToggle = () => {
  const { theme, toggleTheme } = useTheme()
  const isDarkMode = theme === 'dark'

  return (
    <div className="flex justify-center items-center gap-2 text-sm cursor-pointer">
      <Badge variant="secondary" onClick={toggleTheme}>
        {isDarkMode ? 'Dark Mode' : 'Light Mode'}
      </Badge>
    </div>
  )
}
