import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-lg p-8 max-w-md w-full">
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
          
          {/* Pokemon type color demonstration */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="h-8 rounded" style={{backgroundColor: 'var(--pokemon-fire)'}} title="ほのお"></div>
            <div className="h-8 rounded" style={{backgroundColor: 'var(--pokemon-water)'}} title="みず"></div>
            <div className="h-8 rounded" style={{backgroundColor: 'var(--pokemon-grass)'}} title="くさ"></div>
            <div className="h-8 rounded" style={{backgroundColor: 'var(--pokemon-electric)'}} title="でんき"></div>
            <div className="h-8 rounded" style={{backgroundColor: 'var(--pokemon-psychic)'}} title="エスパー"></div>
            <div className="h-8 rounded" style={{backgroundColor: 'var(--pokemon-dragon)'}} title="ドラゴン"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App