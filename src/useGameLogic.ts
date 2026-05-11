import { useEffect, useRef, useCallback } from 'react'
import type { GameState, Obstacle } from './type'
import {
  GRAVITY, JUMP_FORCE, DINO_W, DINO_H, DUCK_H, GROUND_OFFSET,
  INITIAL_SPEED, SPEED_INCREMENT, OBSTACLE_INTERVAL_MIN,
  OBSTACLE_INTERVAL_MAX, CLOUD_INTERVAL
} from './constants'
import { drawDino, checkCollision } from './Dino'
import { drawCactus } from './Obstacle'
import { drawBackground, drawGround, drawClouds } from './Background'
import { drawScore, drawTitle, drawGameOver, drawMilestoneFlash } from './Score'

export function useGameLogic(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  isShopOpen: boolean = false,
  selectedDino: number = 1,
  setGold?: (val: number | ((prev: number) => number)) => void
) {
  const stateRef = useRef<GameState | null>(null)
  const rafRef = useRef<number>(0)
  const nextObstacleRef = useRef<number>(80)
  const nextCloudRef = useRef<number>(CLOUD_INTERVAL)
  const dinoImgRef = useRef<HTMLImageElement | null>(null)
  const cactusImgRef = useRef<HTMLImageElement | null>(null)
  const isLoadedRef = useRef<boolean>(false)

  const getCanvas = () => canvasRef.current!

  const initState = useCallback((W: number, H: number): GameState => {
    const groundY = H - GROUND_OFFSET
    const hiScore = parseInt(localStorage.getItem('dinoHi') || '0')
    return {
      dino: {
        x: 60,
        y: groundY - DINO_H,
        w: DINO_W,
        h: DINO_H,
        vy: 0,
        jumping: false,
        frame: 0,
        frameTimer: 0,
        ducking: false,
      },
      obstacles: [],
      clouds: [{ x: W * 0.4, y: groundY - 60, w: 60 }, { x: W * 0.75, y: groundY - 80, w: 80 }],
      score: 0,
      hiScore,
      speed: INITIAL_SPEED,
      frame: 0,
      status: 'idle',
      groundY,
      blinkTimer: 0,
      blinkVisible: true,
    }
  }, [])

  const jump = useCallback(() => {
    if (isShopOpen) return
    const s = stateRef.current
    if (!s) return
    if (s.status === 'idle') {
      s.status = 'playing'
      return
    }
    if (s.status === 'over') {
      const canvas = getCanvas()
      stateRef.current = initState(canvas.width, canvas.height)
      stateRef.current.status = 'playing'
      nextObstacleRef.current = 80
      return
    }
    if (s.status === 'playing' && !s.dino.jumping && !s.dino.ducking) {
      s.dino.vy = JUMP_FORCE
      s.dino.jumping = true
    }
  }, [initState, isShopOpen])

  const duck = useCallback((active: boolean) => {
    if (isShopOpen) return
    const s = stateRef.current
    if (!s || s.status !== 'playing') return
    s.dino.ducking = active && !s.dino.jumping
  }, [isShopOpen])

  // ── Game loop ──────────────────────────────────────────────────
  const tick = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const W = canvas.width
    const H = canvas.height
    const s = stateRef.current!

    // draw environment
    drawBackground(ctx, W, H)
    drawGround(ctx, W, s.groundY, s.frame, s.speed)

    if (!isLoadedRef.current || !dinoImgRef.current || !cactusImgRef.current) {
      // Don't start game tick until all images are loaded
      rafRef.current = requestAnimationFrame(tick)
      return
    }

    if (s.status === 'idle') {
      drawDino(ctx, s.dino.x, s.dino.y, 0, false, false, dinoImgRef.current)
      s.blinkTimer++
      if (s.blinkTimer > 30) { s.blinkVisible = !s.blinkVisible; s.blinkTimer = 0 }
      drawTitle(ctx, W, H, s.blinkVisible)
      rafRef.current = requestAnimationFrame(tick)
      return
    }

    if (s.status === 'over') {
      drawClouds(ctx, s.clouds, s.groundY)
      s.obstacles.forEach(o => drawCactus(ctx, o, cactusImgRef.current))
      drawDino(ctx, s.dino.x, s.dino.y, s.dino.frame, s.dino.ducking, true, dinoImgRef.current)
      drawScore(ctx, s.score, s.hiScore, W)
      
      s.blinkTimer++
      if (s.blinkTimer > 30) { s.blinkVisible = !s.blinkVisible; s.blinkTimer = 0 }
      drawGameOver(ctx, W, H, s.blinkVisible)
      
      rafRef.current = requestAnimationFrame(tick)
      return
    }

    // ── Update ───────────────────────────────────────────────────
    s.frame++
    s.speed += SPEED_INCREMENT

    // dino physics
    const dino = s.dino
    if (dino.jumping || dino.y < s.groundY - DINO_H) {
      dino.vy += GRAVITY
      dino.y += dino.vy
    }
    const floorY = s.groundY - (dino.ducking ? DUCK_H : DINO_H)
    if (dino.y >= floorY) {
      dino.y = floorY
      dino.vy = 0
      dino.jumping = false
    }

    // dino animation
    if (!dino.jumping && !dino.ducking) {
      dino.frameTimer++
      if (dino.frameTimer > 6) { dino.frame = dino.frame === 0 ? 1 : 0; dino.frameTimer = 0 }
    }

    // score
    s.score++
    if (s.score > s.hiScore) {
      s.hiScore = s.score
      localStorage.setItem('dinoHi', String(s.hiScore))
    }

    // spawn obstacles
    nextObstacleRef.current--
    if (nextObstacleRef.current <= 0) {
      const types: Obstacle['type'][] = ['cactus_s', 'cactus_m', 'cactus_l', 'cactus_group']
      const type = types[Math.floor(Math.random() * types.length)]
      const w = type === 'cactus_group' ? 44 : type === 'cactus_l' ? 36 : type === 'cactus_m' ? 18 : 14
      const h = type === 'cactus_l' ? 56 : type === 'cactus_group' ? 56 : type === 'cactus_m' ? 52 : 40
      s.obstacles.push({ x: W + 20, y: s.groundY - h, w, h, type })
      nextObstacleRef.current = Math.floor(
        OBSTACLE_INTERVAL_MIN + Math.random() * (OBSTACLE_INTERVAL_MAX - OBSTACLE_INTERVAL_MIN)
      )
    }

    // move & cull obstacles
    s.obstacles = s.obstacles.filter(o => o.x + o.w > -10)
    s.obstacles.forEach(o => { o.x -= s.speed })

    // clouds
    nextCloudRef.current--
    if (nextCloudRef.current <= 0) {
      s.clouds.push({ x: W + 60, y: s.groundY - 60 - Math.random() * 40, w: 60 + Math.random() * 40 })
      nextCloudRef.current = CLOUD_INTERVAL + Math.random() * 100
    }
    s.clouds = s.clouds.filter(c => c.x + c.w > -20)
    s.clouds.forEach(c => { c.x -= s.speed * 0.3 })

    // collision
    for (const obs of s.obstacles) {
      if (checkCollision(dino, obs)) {
        s.status = 'over'
        
        // Cấp vàng dựa trên điểm số (hiển thị là s.score / 5)
        const earnedGold = Math.floor(s.score / 5)
        if (earnedGold > 0 && setGold) {
          setGold(prev => {
            const newTotal = prev + earnedGold
            localStorage.setItem('dinoGold', String(newTotal))
            return newTotal
          })
        }
        break
      }
    }

    // ── Draw ─────────────────────────────────────────────────────
    drawClouds(ctx, s.clouds, s.groundY)
    s.obstacles.forEach(o => drawCactus(ctx, o, cactusImgRef.current))
    drawDino(ctx, dino.x, dino.y, dino.frame, dino.ducking, s.status === 'over', dinoImgRef.current)

    // HUD
    drawScore(ctx, s.score, s.hiScore, W)
    drawMilestoneFlash(ctx, s.score, s.frame, W, H)

    rafRef.current = requestAnimationFrame(tick)
  }, [])

  // ── Setup ──────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current!

    // Load Sprite Images
    let loadedCount = 0
    const checkLoaded = () => {
      loadedCount++
      if (loadedCount === 2) isLoadedRef.current = true
    }

    if (!dinoImgRef.current) {
      const img = new Image()
      img.src = `/assets/dino_sprites/dino_${selectedDino}.png`
      img.onload = () => {
        dinoImgRef.current = img
        checkLoaded()
      }
    } else {
      checkLoaded()
    }

    if (!cactusImgRef.current) {
      const img = new Image()
      img.src = '/assets/cactus.webp'
      img.onload = () => {
        cactusImgRef.current = img
        checkLoaded()
      }
    } else {
      checkLoaded()
    }

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      if (!stateRef.current || stateRef.current.status === 'idle') {
        stateRef.current = initState(canvas.width, canvas.height)
      } else {
        stateRef.current.groundY = canvas.height - GROUND_OFFSET
      }
    }
    resize()
    window.addEventListener('resize', resize)

    // keyboard
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') { e.preventDefault(); jump() }
      if (e.code === 'ArrowDown') duck(true)
    }
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowDown') duck(false)
    }
    // touch
    const onTouch = (e: TouchEvent) => { e.preventDefault(); jump() }

    window.addEventListener('keydown', onKey)
    window.addEventListener('keyup', onKeyUp)
    canvas.addEventListener('touchstart', onTouch, { passive: false })
    canvas.addEventListener('mousedown', jump)

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('keyup', onKeyUp)
      canvas.removeEventListener('touchstart', onTouch)
      canvas.removeEventListener('mousedown', jump)
    }
  }, [initState, jump, duck, tick]) // Restored dependencies

  // Effect to handle character changes
  useEffect(() => {
    if (!isLoadedRef.current) return // Skip if initial load hasn't finished
    
    const img = new Image()
    img.src = `/assets/dino_sprites/dino_${selectedDino}.png`
    img.onload = () => {
      dinoImgRef.current = img
    }
  }, [selectedDino])
}
