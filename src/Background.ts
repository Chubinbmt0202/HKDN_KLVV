import type { Cloud } from './type'

// ── Background ─────────────────────────────────────────────────────
export function drawBackground(
    ctx: CanvasRenderingContext2D,
    W: number,
    H: number,
    selectedBg: number = 1
) {
    if (selectedBg === 1) ctx.fillStyle = '#f7f7f7'
    else if (selectedBg === 2) ctx.fillStyle = '#1e1e24'
    else if (selectedBg === 3) ctx.fillStyle = '#ffdac1'
    else if (selectedBg === 4) ctx.fillStyle = '#e09f87'
    else ctx.fillStyle = '#f7f7f7'
    
    ctx.fillRect(0, 0, W, H)
}

// ── Ground ─────────────────────────────────────────────────────────
export function drawGround(
    ctx: CanvasRenderingContext2D,
    W: number,
    groundY: number,
    frame: number,
    speed: number
) {
    // ground line
    ctx.fillStyle = '#535353'
    ctx.fillRect(0, groundY, W, 2)

    // scrolling texture dots
    ctx.fillStyle = '#ccc'
    for (let i = 0; i < W; i += 30) {
        ctx.fillRect((i + frame * speed * 0.5) % W, groundY + 4, 6, 2)
        ctx.fillRect((i + 15 + frame * speed * 0.5) % W, groundY + 8, 4, 2)
    }
}

// ── Clouds ─────────────────────────────────────────────────────────
export function drawCloud(
    ctx: CanvasRenderingContext2D,
    cloud: Cloud,
    groundY: number
) {
    const y = groundY - 60 - (cloud.w % 30)
    ctx.fillStyle = '#e8e8e8'
    ctx.beginPath()
    ctx.arc(cloud.x + cloud.w * 0.3, y, 10, 0, Math.PI * 2)
    ctx.arc(cloud.x + cloud.w * 0.5, y - 6, 14, 0, Math.PI * 2)
    ctx.arc(cloud.x + cloud.w * 0.7, y, 10, 0, Math.PI * 2)
    ctx.fill()
}

export function drawClouds(
    ctx: CanvasRenderingContext2D,
    clouds: Cloud[],
    groundY: number
) {
    clouds.forEach(c => drawCloud(ctx, c, groundY))
}