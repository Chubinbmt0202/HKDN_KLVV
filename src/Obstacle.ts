import type { Obstacle } from './type'

export function drawCactus(ctx: CanvasRenderingContext2D, obs: Obstacle, cactusImg: HTMLImageElement | null) {
  if (!cactusImg) {
    // Fallback if image not loaded yet
    ctx.fillStyle = '#535353'
    ctx.fillRect(obs.x, obs.y, obs.w, obs.h)
    return
  }

  // Draw the cactus image scaling it to fit the obstacle dimensions
  // The original cactus.webp is just one cactus. 
  // We can just draw it stretching or repeating depending on the obstacle type.

  if (obs.type === 'cactus_group') {
    // draw 3 cactuses
    ctx.drawImage(cactusImg, obs.x, obs.y + 20, 14, 40)
    ctx.drawImage(cactusImg, obs.x + 20, obs.y + 8, 16, 56)
    ctx.drawImage(cactusImg, obs.x + 38, obs.y + 20, 14, 40)
  } else if (obs.type === 'cactus_l') {
    // draw 2 tall cactuses
    ctx.drawImage(cactusImg, obs.x, obs.y + 8, 18, 56)
    ctx.drawImage(cactusImg, obs.x + 18, obs.y + 8, 18, 56)
  } else if (obs.type === 'cactus_m') {
    // draw 1 medium cactus
    ctx.drawImage(cactusImg, obs.x, obs.y + 8, 18, 52)
  } else {
    // draw 1 small cactus
    ctx.drawImage(cactusImg, obs.x, obs.y + 8, 14, 40)
  }
}
