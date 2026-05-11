import type { Obstacle } from './type'

export function drawCactus(ctx: CanvasRenderingContext2D, obs: Obstacle) {
  const s = 2
  ctx.fillStyle = '#535353'

  const drawSingleCactus = (cx: number, cy: number, tall: boolean) => {
    const h = tall ? 14 : 10
    // stem
    for (let i = 0; i < h; i++) {
      ctx.fillRect(cx + 2 * s, cy + i * s, s * 2, s)
    }
    // top
    ctx.fillRect(cx + s, cy, s * 4, s)
    // arms
    if (tall) {
      ctx.fillRect(cx, cy + 4 * s, s * 2, s)
      ctx.fillRect(cx, cy + 3 * s, s, s * 3)
      ctx.fillRect(cx + 4 * s, cy + 3 * s, s * 2, s)
      ctx.fillRect(cx + 5 * s, cy + 2 * s, s, s * 3)
    } else {
      ctx.fillRect(cx, cy + 3 * s, s * 2, s)
      ctx.fillRect(cx, cy + 2 * s, s, s * 3)
      ctx.fillRect(cx + 4 * s, cy + 2 * s, s * 2, s)
      ctx.fillRect(cx + 5 * s, cy + s, s, s * 3)
    }
  }

  if (obs.type === 'cactus_group') {
    drawSingleCactus(obs.x, obs.y, false)
    drawSingleCactus(obs.x + 14, obs.y - 6, true)
    drawSingleCactus(obs.x + 28, obs.y, false)
  } else if (obs.type === 'cactus_l') {
    drawSingleCactus(obs.x, obs.y, true)
    drawSingleCactus(obs.x + 16, obs.y, true)
  } else if (obs.type === 'cactus_m') {
    drawSingleCactus(obs.x, obs.y, true)
  } else {
    drawSingleCactus(obs.x, obs.y, false)
  }
}
