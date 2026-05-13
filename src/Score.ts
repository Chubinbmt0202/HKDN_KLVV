export function drawScore(ctx: CanvasRenderingContext2D, score: number, hiScore: number, W: number, selectedBg: number = 1) {
  ctx.fillStyle = selectedBg === 2 ? '#f7f7f7' : '#535353'
  ctx.font = 'bold 16px monospace'
  ctx.textAlign = 'right'
  const scoreStr = String(Math.floor(score / 5)).padStart(5, '0')
  const hiStr = 'Điểm cao nhất ' + String(Math.floor(hiScore / 5)).padStart(5, '0')
  ctx.fillText(hiStr + '  ' + scoreStr, W - 16, 30)
}

export function drawTitle(ctx: CanvasRenderingContext2D, W: number, H: number, blinkVisible: boolean, selectedBg: number = 1) {
  ctx.fillStyle = selectedBg === 2 ? '#f7f7f7' : '#535353'
  ctx.textAlign = 'center'

  // Chữ DINO GAME to hơn
  ctx.font = 'bold 32px monospace'
  ctx.fillText('DINO GAME', W / 2, H / 2 - 50)

  // Dòng hướng dẫn nhấp nháy
  ctx.font = '14px monospace'
  if (blinkVisible) ctx.fillText('TAP / SPACE ĐỂ BẮT ĐẦU', W / 2, H / 2 + 10)
}

export function drawGameOver(ctx: CanvasRenderingContext2D, W: number, H: number, blinkVisible: boolean, selectedBg: number = 1) {
  ctx.fillStyle = selectedBg === 2 ? '#f7f7f7' : '#535353'
  ctx.font = 'bold 22px monospace'
  ctx.textAlign = 'center'
  ctx.fillText('GAME OVER', W / 2, H / 2 - 24)
  ctx.font = '13px monospace'
  if (blinkVisible) ctx.fillText('TAP / SPACE ĐỂ CHƠI LẠI', W / 2, H / 2 + 10)
}

export function drawMilestoneFlash(ctx: CanvasRenderingContext2D, score: number, frame: number, W: number, H: number, selectedBg: number = 1) {
  if (Math.floor(score / 5) % 100 === 0 && Math.floor(score / 5) > 0 && frame % 20 < 10) {
    ctx.fillStyle = selectedBg === 2 ? 'rgba(247,247,247,0.15)' : 'rgba(83,83,83,0.15)'
    ctx.fillRect(0, 0, W, H)
  }
}
