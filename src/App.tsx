import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800 flex items-center justify-center p-4">
      <motion.div 
        className="max-w-md w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ポケモンタイプ相性クイズ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => setCount((count) => count + 1)}
              className="w-full"
              variant="default"
            >
              count is {count}
            </Button>
            
            <Progress value={count * 10} className="w-full" />
            
            <p className="text-center text-muted-foreground">
              Shadcn/ui コンポーネントセットアップ完了！
            </p>
            
            {/* Pokemon type color demonstration with animations */}
            <motion.div 
              className="grid grid-cols-3 gap-2"
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
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default App