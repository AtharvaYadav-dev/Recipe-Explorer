import { motion } from 'framer-motion';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: 'light' as const, icon: <Sun size={16} />, label: 'Light' },
    { value: 'dark' as const, icon: <Moon size={16} />, label: 'Dark' },
    { value: 'system' as const, icon: <Monitor size={16} />, label: 'System' },
  ];

  return (
    <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
      {themes.map((currentTheme) => (
        <motion.button
          key={currentTheme.value}
          onClick={() => setTheme(currentTheme.value)}
          className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            theme === currentTheme.value
              ? 'text-white'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="flex items-center gap-2">
            {currentTheme.icon}
            <span className="hidden sm:inline">{currentTheme.label}</span>
          </span>
          
          {theme === currentTheme.value && (
            <motion.div
              layoutId="activeTheme"
              className="absolute inset-0 bg-primary rounded-md"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
        </motion.button>
      ))}
    </div>
  );
};
