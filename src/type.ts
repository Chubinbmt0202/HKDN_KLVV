// ── Shared types ───────────────────────────────────────────────────

export interface Dino {
    x: number
    y: number
    w: number
    h: number
    vy: number
    jumping: boolean
    frame: number
    frameTimer: number
    ducking: boolean
}

export interface Obstacle {
    x: number
    y: number
    w: number
    h: number
    type: 'cactus_s' | 'cactus_m' | 'cactus_l' | 'cactus_group'
}

export interface Cloud {
    x: number
    y: number
    w: number
}

export interface GameState {
    dino: Dino
    obstacles: Obstacle[]
    clouds: Cloud[]
    score: number
    hiScore: number
    speed: number
    frame: number
    status: 'idle' | 'playing' | 'over'
    groundY: number
    blinkTimer: number
    blinkVisible: boolean
}