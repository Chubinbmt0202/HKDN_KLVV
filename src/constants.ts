export const GRAVITY = 0.6
export const JUMP_FORCE = -13
export const DINO_W = 44
export const DINO_H = 44
export const DUCK_H = 28
export const GROUND_OFFSET = 30
export const INITIAL_SPEED = 5
export const SPEED_INCREMENT = 0.0008
export const OBSTACLE_INTERVAL_MIN = 60
export const OBSTACLE_INTERVAL_MAX = 140
export const CLOUD_INTERVAL = 200

// Sprite dimensions (original pixel art was 24x24)
export const SPRITE_W = 24
export const SPRITE_H = 24

// Giá vàng để mua các mẫu khủng long
export const DINO_PRICES: Record<number, number> = {
  1: 0,    // Mặc định miễn phí
  2: 200,
  3: 500,
  4: 1000
}

// Giá vàng để mua các hình nền
export const BG_PRICES: Record<number, number> = {
  1: 0,    // Mặc định miễn phí (Day)
  2: 300,  // Night
  3: 600,  // Sunset
  4: 1000  // Mars
}

export const POWERUP_DURATION = 600 // 10 seconds at 60fps
