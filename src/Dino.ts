import type { Dino, Obstacle, Rect } from './type'
import { DUCK_H, SPRITE_W, SPRITE_H } from './constants'

// Sprite frame indices (assuming standard chrome dino sprite sheet layout)
const FRAMES = {
  idle: 0,
  blink: 1,
  run1: 2,
  run2: 3,
  dead: 4,
  duck1: 5,
  duck2: 6
}

export function drawDino(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  frame: number, // 0 or 1 for animation toggle
  ducking: boolean,
  isDead: boolean,
  dinoImg: HTMLImageElement | null
) {
  const s = 2 // scale multiplier
  
  if (!dinoImg) {
    // Fallback if image not loaded yet
    ctx.fillStyle = '#535353'
    ctx.fillRect(x, y, 44, ducking ? 28 : 48)
    return
  }

  let spriteFrame = FRAMES.idle

  if (isDead) {
    spriteFrame = FRAMES.dead
  } else if (ducking) {
    spriteFrame = frame === 0 ? FRAMES.duck1 : FRAMES.duck2
  } else {
    // If not ducking and playing (we use frame toggle)
    // When idle, frame is usually passed as 0 from useGameLogic.
    // If we want blinking, we can handle it via the state, but run1/run2 works for running.
    // For now we assume if frame is 0 or 1 and we're not idle, it's running.
    // In useGameLogic, we only toggle frame when NOT jumping and NOT ducking.
    spriteFrame = frame === 0 ? FRAMES.run1 : FRAMES.run2
  }

  // Jumping uses idle frame
  if (!ducking && !isDead && (spriteFrame === FRAMES.run1 || spriteFrame === FRAMES.run2)) {
      // In the air, frame doesn't toggle in useGameLogic (jumping=true stops timer), 
      // but standard is idle frame.
      // We will let useGameLogic's `jumping` state or `vy !== 0` handle it, but wait: 
      // drawDino doesn't know if jumping. Let's just pass `spriteFrame` based on what frame is.
  }

  // Draw the specific frame from the sprite sheet
  const sx = spriteFrame * SPRITE_W
  const sy = 0
  const sw = SPRITE_W
  const sh = SPRITE_H
  
  // Dest coordinates and dimensions
  // Normal dimensions are DINO_W (44), DINO_H (48). Since sprite is 24x24, 
  // scaled by 2 is 48x48.
  const dw = SPRITE_W * s
  const dh = SPRITE_H * s
  
  // For ducking, the sprite usually is wider and shorter in some sheets, 
  // but if it's uniformly 24x24, we just draw it.
  
  ctx.drawImage(dinoImg, sx, sy, sw, sh, x, y, dw, dh)
}

export function checkCollision(dino: Dino, obs: Rect): boolean {
  const margin = 8
  const dh = dino.ducking ? DUCK_H : dino.h
  // Also adjust width for collision if ducking, typically wider, but we use dino.w for now
  const dw = dino.ducking ? 59 : dino.w 
  
  return (
    dino.x + margin < obs.x + obs.w - margin &&
    dino.x + dw - margin > obs.x + margin &&
    dino.y + margin < obs.y + obs.h &&
    dino.y + dh > obs.y + margin
  )
}