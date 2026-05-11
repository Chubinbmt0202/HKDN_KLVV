import './App.css'
import { useRef, useState } from 'react'
import { useGameLogic } from './useGameLogic'
import { Shop } from './Shop'

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isShopOpen, setIsShopOpen] = useState(false)
  const [selectedDino, setSelectedDino] = useState(() => parseInt(localStorage.getItem('selectedDino') || '1'))
  const [gold, setGold] = useState(() => parseInt(localStorage.getItem('dinoGold') || '0'))
  const [ownedDinos, setOwnedDinos] = useState<number[]>(() => {
    const saved = localStorage.getItem('dinoOwned')
    return saved ? JSON.parse(saved) : [1] // Mặc định luôn có mẫu 1
  })

  const handleBuy = (id: number, price: number) => {
    if (gold >= price) {
      const newGold = gold - price
      const newOwned = [...ownedDinos, id]
      
      setGold(newGold)
      setOwnedDinos(newOwned)
      
      localStorage.setItem('dinoGold', String(newGold))
      localStorage.setItem('dinoOwned', JSON.stringify(newOwned))
      return true
    }
    return false
  }

  const handleSelect = (id: number) => {
    setSelectedDino(id)
    localStorage.setItem('selectedDino', String(id))
  }

  useGameLogic(canvasRef, isShopOpen, selectedDino, setGold)

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <canvas
        ref={canvasRef}
        style={{ display: 'block', touchAction: 'none', userSelect: 'none' }}
      />

      {!isShopOpen && (
        <button
          onClick={() => setIsShopOpen(true)}
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            padding: '10px 20px',
            backgroundColor: '#535353',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          CỬA HÀNG
        </button>
      )}

      {isShopOpen && (
        <Shop
          selected={selectedDino}
          onSelect={handleSelect}
          onBuy={handleBuy}
          onClose={() => setIsShopOpen(false)}
          gold={gold}
          ownedDinos={ownedDinos}
        />
      )}
    </div>
  )
}
