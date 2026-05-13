import { useEffect, useRef, useCallback } from 'react'
import type { GameState, Obstacle } from './type'
import {
  GRAVITY, JUMP_FORCE, DINO_W, DINO_H, DUCK_H, GROUND_OFFSET,
  INITIAL_SPEED, SPEED_INCREMENT, OBSTACLE_INTERVAL_MIN,
  OBSTACLE_INTERVAL_MAX, CLOUD_INTERVAL
} from './constants'
import { drawDino, checkCollision } from './Dino'
import { drawObstacle } from './Obstacle'
import { drawBackground, drawGround, drawClouds } from './Background'
import { drawScore, drawTitle, drawGameOver, drawMilestoneFlash } from './Score'
import { playJumpSound, playCrashSound } from './audio'


export function useGameLogic(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  isShopOpen: boolean = false,
  selectedDino: number = 1,
  selectedBg: number = 1,
  setGold?: (val: number | ((prev: number) => number)) => void
) {
  const stateRef = useRef<GameState | null>(null)
  const rafRef = useRef<number>(0)
  const nextObstacleRef = useRef<number>(80)
  const nextCloudRef = useRef<number>(CLOUD_INTERVAL)
  const dinoImgRef = useRef<HTMLImageElement | null>(null)
  const cactusImgRef = useRef<HTMLImageElement | null>(null)
  const isLoadedRef = useRef<boolean>(false)
  const lastTimeRef = useRef<number>(0)
  const propsRef = useRef({ isShopOpen, selectedBg })
  
  useEffect(() => {
    propsRef.current = { isShopOpen, selectedBg }
  }, [isShopOpen, selectedBg])

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
      particles: [],
      shakeTimer: 0,
      coins: [],
      powerUps: [],
      shieldActive: false,
      shieldTimer: 0,
      magnetTimer: 0,
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
      playJumpSound()
    }
  }, [initState, isShopOpen])

  const duck = useCallback((active: boolean) => {
    if (isShopOpen) return
    const s = stateRef.current
    if (!s || s.status !== 'playing') return
    s.dino.ducking = active && !s.dino.jumping
  }, [isShopOpen])

  // ── Game loop ──────────────────────────────────────────────────
  const tick = useCallback((time: number) => {
    if (time - lastTimeRef.current < 16) {
      rafRef.current = requestAnimationFrame(tick)
      return
    }
    lastTimeRef.current = time

    if (propsRef.current.isShopOpen) {
      rafRef.current = requestAnimationFrame(tick)
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const W = canvas.width
    const H = canvas.height
    const s = stateRef.current!

    // Update particles
    for (let i = s.particles.length - 1; i >= 0; i--) {
      const p = s.particles[i]
      p.x += p.vx - s.speed * 0.5 // moves left slightly with the world
      p.y += p.vy
      p.life--
      p.size *= 0.95
      if (p.life <= 0) s.particles.splice(i, 1)
    }

    if (s.shakeTimer > 0) s.shakeTimer--

    ctx.save()
    if (s.shakeTimer > 0) {
      const intensity = 6
      ctx.translate((Math.random() - 0.5) * intensity, (Math.random() - 0.5) * intensity)
    }

    // draw environment
    drawBackground(ctx, W, H, propsRef.current.selectedBg)
    drawGround(ctx, W, s.groundY, s.frame, s.speed)

    if (!isLoadedRef.current || !dinoImgRef.current || !cactusImgRef.current) {
      // Don't start game tick until all images are loaded
      ctx.restore()
      rafRef.current = requestAnimationFrame(tick)
      return
    }

    if (s.status === 'idle') {
      drawDino(ctx, s.dino.x, s.dino.y, 0, false, false, dinoImgRef.current)
      s.blinkTimer++
      if (s.blinkTimer > 30) { s.blinkVisible = !s.blinkVisible; s.blinkTimer = 0 }
      drawTitle(ctx, W, H, s.blinkVisible, propsRef.current.selectedBg)
      ctx.restore()
      rafRef.current = requestAnimationFrame(tick)
      return
    }

    if (s.status === 'over') {
      drawClouds(ctx, s.clouds, s.groundY)
      s.obstacles.forEach(o => drawObstacle(ctx, o, cactusImgRef.current, s.frame))
      drawDino(ctx, s.dino.x, s.dino.y, s.dino.frame, s.dino.ducking, true, dinoImgRef.current)
      drawScore(ctx, s.score, s.hiScore, W, propsRef.current.selectedBg)
      
      s.blinkTimer++
      if (s.blinkTimer > 30) { s.blinkVisible = !s.blinkVisible; s.blinkTimer = 0 }
      drawGameOver(ctx, W, H, s.blinkVisible, propsRef.current.selectedBg)

      // draw particles even when game over
      s.particles.forEach(p => {
        ctx.fillStyle = p.color
        ctx.globalAlpha = Math.max(0, p.life / p.maxLife)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.globalAlpha = 1.0
      
      ctx.restore()
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
      if (dino.vy > 0 && s.status === 'playing') {
        // Spawn dust when landing
        for (let i = 0; i < 6; i++) {
          s.particles.push({
            x: dino.x + 10 + Math.random() * 20,
            y: floorY + (dino.ducking ? DUCK_H : DINO_H) - 5,
            vx: (Math.random() - 0.5) * 3,
            vy: -Math.random() * 2,
            life: 15 + Math.random() * 15,
            maxLife: 30,
            size: 2 + Math.random() * 4,
            color: '#b0b0b0'
          })
        }
      }
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
      if (s.score > 300) {
        types.push('bird', 'bird') // Increased chance for bird after score 300
      }
      const type = types[Math.floor(Math.random() * types.length)]
      
      let w = 14, h = 40, y = s.groundY - 40;
      if (type === 'cactus_group') { w = 44; h = 56; y = s.groundY - h; }
      else if (type === 'cactus_l') { w = 36; h = 56; y = s.groundY - h; }
      else if (type === 'cactus_m') { w = 18; h = 52; y = s.groundY - h; }
      else if (type === 'bird') { 
        w = 42; h = 30; 
        const heights = [30, 60, 80]; // Low, Mid, High
        y = s.groundY - heights[Math.floor(Math.random() * heights.length)];
      }
      else { w = 14; h = 40; y = s.groundY - h; } // cactus_s

      s.obstacles.push({ x: W + 20, y, w, h, type })
      nextObstacleRef.current = Math.floor(
        OBSTACLE_INTERVAL_MIN + Math.random() * (OBSTACLE_INTERVAL_MAX - OBSTACLE_INTERVAL_MIN)
      )

      // Randomly spawn coins when spawning obstacle
      if (Math.random() > 0.4) {
        const coinCount = 3 + Math.floor(Math.random() * 3)
        const startX = W + 100
        const isArc = Math.random() > 0.5
        for (let i = 0; i < coinCount; i++) {
          const cy = isArc 
            ? s.groundY - 80 - Math.sin((i / (coinCount-1)) * Math.PI) * 60
            : s.groundY - 60
          s.coins.push({ x: startX + i * 35, y: cy, w: 20, h: 20, collected: false })
        }
      }

      // Randomly spawn powerup (rare)
      if (Math.random() > 0.85) {
        const type = Math.random() > 0.5 ? 'shield' : 'magnet'
        s.powerUps.push({ x: W + 300, y: s.groundY - 80, w: 30, h: 30, type, collected: false })
      }
    }

    // move & cull obstacles
    s.obstacles = s.obstacles.filter(o => o.x + o.w > -10)
    s.obstacles.forEach(o => { o.x -= s.speed })

    // move & cull coins
    s.coins = s.coins.filter(c => c.x + c.w > -10 && !c.collected)
    s.coins.forEach(c => {
      if (s.magnetTimer > 0) {
        // Attract to dino
        const dx = (s.dino.x + 20) - c.x
        const dy = (s.dino.y + 20) - c.y
        const dist = Math.sqrt(dx*dx + dy*dy)
        if (dist < 300) {
          c.x += (dx / dist) * 12
          c.y += (dy / dist) * 12
        } else {
          c.x -= s.speed
        }
      } else {
        c.x -= s.speed
      }
    })

    // move & cull powerups
    s.powerUps = s.powerUps.filter(p => p.x + p.w > -10 && !p.collected)
    s.powerUps.forEach(p => { p.x -= s.speed })

    // Timers
    if (s.shieldTimer > 0) {
      s.shieldTimer--
      if (s.shieldTimer === 0) s.shieldActive = false
    }
    if (s.magnetTimer > 0) s.magnetTimer--

    // clouds
    nextCloudRef.current--
    if (nextCloudRef.current <= 0) {
      s.clouds.push({ x: W + 60, y: s.groundY - 60 - Math.random() * 40, w: 60 + Math.random() * 40 })
      nextCloudRef.current = CLOUD_INTERVAL + Math.random() * 100
    }
    s.clouds = s.clouds.filter(c => c.x + c.w > -20)
    s.clouds.forEach(c => { c.x -= s.speed * 0.3 })

    // collision with obstacles
    for (let i = s.obstacles.length - 1; i >= 0; i--) {
      const obs = s.obstacles[i]
      if (checkCollision(dino, obs)) {
        if (s.shieldActive) {
          // Shield breaks, destroy obstacle
          s.shieldActive = false
          s.shieldTimer = 0
          s.obstacles.splice(i, 1)
          s.shakeTimer = 10
          // Spawn some particles for effect
          for (let j = 0; j < 10; j++) {
            s.particles.push({
              x: obs.x + obs.w/2, y: obs.y + obs.h/2,
              vx: (Math.random()-0.5)*10, vy: (Math.random()-0.5)*10,
              life: 20, maxLife: 20, size: 4, color: '#00BFFF'
            })
          }
          continue
        }

        s.status = 'over'
        s.shakeTimer = 20
        playCrashSound()
        
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

    // collection - coins
    s.coins.forEach(c => {
      if (!c.collected && checkCollision(dino, c)) {
        c.collected = true
        if (setGold) setGold(prev => prev + 1)
        // coin particle
        for (let j = 0; j < 5; j++) {
          s.particles.push({
            x: c.x + 10, y: c.y + 10,
            vx: (Math.random()-0.5)*5, vy: (Math.random()-0.5)*5,
            life: 15, maxLife: 15, size: 3, color: '#FFD700'
          })
        }
      }
    })

    // collection - powerups
    s.powerUps.forEach(p => {
      if (!p.collected && checkCollision(dino, p)) {
        p.collected = true
        if (p.type === 'shield') {
          s.shieldActive = true
          s.shieldTimer = 600 // 10s
        } else if (p.type === 'magnet') {
          s.magnetTimer = 600 // 10s
        }
      }
    })

    // ── Draw ─────────────────────────────────────────────────────
    drawClouds(ctx, s.clouds, s.groundY)
    s.coins.forEach(c => {
      ctx.fillStyle = '#FFD700'
      ctx.beginPath()
      ctx.arc(c.x + 10, c.y + 10, 8, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#B8860B'
      ctx.stroke()
    })
    s.powerUps.forEach(p => {
      ctx.fillStyle = p.type === 'shield' ? '#00BFFF' : '#FF00FF'
      ctx.fillRect(p.x, p.y, p.w, p.h)
      ctx.strokeStyle = '#fff'
      ctx.strokeRect(p.x, p.y, p.w, p.h)
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 12px Arial'
      ctx.fillText(p.type === 'shield' ? 'S' : 'M', p.x + 15, p.y + 20)
    })
    s.obstacles.forEach(o => drawObstacle(ctx, o, cactusImgRef.current, s.frame))
    
    // Shield aura
    if (s.shieldActive) {
      ctx.beginPath()
      ctx.arc(dino.x + 22, dino.y + 22, 35, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(0, 191, 255, ${0.3 + Math.sin(s.frame * 0.2) * 0.2})`
      ctx.lineWidth = 4
      ctx.stroke()
    }
    
    drawDino(ctx, dino.x, dino.y, dino.frame, dino.ducking, s.status === 'over', dinoImgRef.current)

    // HUD
    drawScore(ctx, s.score, s.hiScore, W, propsRef.current.selectedBg)
    drawMilestoneFlash(ctx, s.score, s.frame, W, H, propsRef.current.selectedBg)

    // draw particles
    s.particles.forEach(p => {
      ctx.fillStyle = p.color
      ctx.globalAlpha = Math.max(0, p.life / p.maxLife)
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fill()
    })
    ctx.globalAlpha = 1.0

    ctx.restore()
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
