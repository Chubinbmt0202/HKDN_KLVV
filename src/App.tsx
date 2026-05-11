import './App.css'
import { useRef, useState } from 'react'
import { useGameLogic } from './useGameLogic'
import { Shop } from './Shop'

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isShopOpen, setIsShopOpen] = useState(false)
  const [selectedDino, setSelectedDino] = useState(1)

  useGameLogic(canvasRef, isShopOpen, selectedDino)

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
          onSelect={setSelectedDino}
          onClose={() => setIsShopOpen(false)}
        />
      )}
    </div>
  )
}
