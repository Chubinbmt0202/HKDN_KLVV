import './App.css'
import { useRef } from 'react'
import { useGameLogic } from './useGameLogic'

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useGameLogic(canvasRef)

  return (
    <canvas
      ref={canvasRef}
      style={{ display: 'block', touchAction: 'none', userSelect: 'none' }}
    />
  )
}
