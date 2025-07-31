import { useState } from 'react'
import { motion } from 'framer-motion'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800 flex items-center justify-center p-4">
      <motion.div 
        className="bg-card rounded-lg shadow-lg p-8 max-w-md w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          ポケモンタイプ相性クイズ
        </h1>
        
        <div className="space-y-4">
          <button 
            onClick={() => setCount((count) => count + 1)}
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            count is {count}
          </button>
          
          <p className="text-center text-muted-foreground">
            Tailwind CSS + PostCSSのセットアップが完了しました。
          </p>
          
          {/* Pokemon type color demonstration with animations */}
          <motion.div 
            className="grid grid-cols-3 gap-2 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {[
              { color: 'var(--pokemon-fire)', title: 'ほのお' },
              { color: 'var(--pokemon-water)', title: 'みず' },
              { color: 'var(--pokemon-grass)', title: 'くさ' },
              { color: 'var(--pokemon-electric)', title: 'でんき' },
              { color: 'var(--pokemon-psychic)', title: 'エスパー' },
              { color: 'var(--pokemon-dragon)', title: 'ドラゴン' }
            ].map((type, index) => (
              <motion.div
                key={type.title}
                className="h-8 rounded cursor-pointer"
                style={{ backgroundColor: type.color }}
                title={type.title}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  delay: 0.5 + index * 0.1, 
                  duration: 0.3,
                  type: "spring",
                  stiffness: 260,
                  damping: 20
                }}
                whileHover={{ 
                  scale: 1.1,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
              />
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default App