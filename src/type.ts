// ── Shared types ───────────────────────────────────────────────────

export interface Rect {
    x: number
    y: number
    w: number
    h: number
}

export interface Particle {
    x: number
    y: number
    vx: number
    vy: number
    life: number
    maxLife: number
    size: number
    color: string
}

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
    type: 'cactus_s' | 'cactus_m' | 'cactus_l' | 'cactus_group' | 'bird'
}

export interface Cloud {
    x: number
    y: number
    w: number
}

export interface Coin {
    x: number
    y: number
    w: number
    h: number
    collected: boolean
}

export interface PowerUp {
    x: number
    y: number
    w: number
    h: number
    type: 'shield' | 'magnet'
    collected: boolean
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
    particles: Particle[]
    shakeTimer: number
    coins: Coin[]
    powerUps: PowerUp[]
    shieldActive: boolean
    shieldTimer: number
    magnetTimer: number
}