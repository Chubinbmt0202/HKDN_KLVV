import type { Obstacle } from './type'

export function drawObstacle(ctx: CanvasRenderingContext2D, obs: Obstacle, cactusImg: HTMLImageElement | null, frame: number) {
  if (obs.type === 'bird') {
    // Draw a simple vector bird (Pterodactyl)
    ctx.save()
    ctx.translate(obs.x, obs.y)
    ctx.fillStyle = '#535353'
    
    // Animate flapping based on global frame
    const isFlappingDown = Math.floor(frame / 15) % 2 === 0
    
    ctx.beginPath()
    // Body
    ctx.rect(10, 10, 20, 10)
    // Head & beak
    ctx.rect(4, 6, 8, 8)
    ctx.rect(0, 8, 4, 4) // beak
    // Eye
    ctx.fillStyle = 'white'
    ctx.fillRect(8, 8, 2, 2)
    ctx.fillStyle = '#535353'

    // Wings
    if (isFlappingDown) {
      // Wing down
      ctx.rect(14, 20, 14, 8)
      ctx.rect(20, 28, 6, 6)
    } else {
      // Wing up
      ctx.rect(14, 0, 14, 10)
      ctx.rect(20, -6, 6, 6)
    }
    
    // Tail
    ctx.rect(30, 12, 10, 6)
    
    ctx.fill()
    ctx.restore()
    return
  }

  if (!cactusImg) {
    // Fallback if image not loaded yet
    ctx.fillStyle = '#535353'
    ctx.fillRect(obs.x, obs.y, obs.w, obs.h)
    return
  }

  // Draw the cactus image scaling it to fit the obstacle dimensions
  if (obs.type === 'cactus_group') {
    ctx.drawImage(cactusImg, obs.x, obs.y + 20, 14, 40)
    ctx.drawImage(cactusImg, obs.x + 20, obs.y + 8, 16, 56)
    ctx.drawImage(cactusImg, obs.x + 38, obs.y + 20, 14, 40)
  } else if (obs.type === 'cactus_l') {
    ctx.drawImage(cactusImg, obs.x, obs.y + 8, 18, 56)
    ctx.drawImage(cactusImg, obs.x + 18, obs.y + 8, 18, 56)
  } else if (obs.type === 'cactus_m') {
    ctx.drawImage(cactusImg, obs.x, obs.y + 8, 18, 52)
  } else {
    ctx.drawImage(cactusImg, obs.x, obs.y + 8, 14, 40)
  }
}

