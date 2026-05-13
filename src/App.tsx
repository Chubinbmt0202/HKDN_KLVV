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
  const [selectedBg, setSelectedBg] = useState(() => parseInt(localStorage.getItem('selectedBg') || '1'))
  const [ownedBgs, setOwnedBgs] = useState<number[]>(() => {
    const saved = localStorage.getItem('bgOwned')
    return saved ? JSON.parse(saved) : [1]
  })

  const handleBuy = (type: 'dino' | 'bg', id: number, price: number) => {
    if (gold >= price) {
      const newGold = gold - price
      setGold(newGold)
      localStorage.setItem('dinoGold', String(newGold))
      
      if (type === 'dino') {
        const newOwned = [...ownedDinos, id]
        setOwnedDinos(newOwned)
        localStorage.setItem('dinoOwned', JSON.stringify(newOwned))
      } else {
        const newOwned = [...ownedBgs, id]
        setOwnedBgs(newOwned)
        localStorage.setItem('bgOwned', JSON.stringify(newOwned))
      }
      return true
    }
    return false
  }

  const handleSelect = (type: 'dino' | 'bg', id: number) => {
    if (type === 'dino') {
      setSelectedDino(id)
      localStorage.setItem('selectedDino', String(id))
    } else {
      setSelectedBg(id)
      localStorage.setItem('selectedBg', String(id))
    }
  }

  useGameLogic(canvasRef, isShopOpen, selectedDino, selectedBg, setGold)

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
          selectedDino={selectedDino}
          selectedBg={selectedBg}
          onSelect={handleSelect}
          onBuy={handleBuy}
          onClose={() => setIsShopOpen(false)}
          gold={gold}
          ownedDinos={ownedDinos}
          ownedBgs={ownedBgs}
        />
      )}
    </div>
  )
}
