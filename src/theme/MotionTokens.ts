/**
 * Central Motion & Animation Tokens for Qian Hui Avatar City
 * Based on docs/art-target/05_ANIMATION_LANGUAGE.svg
 */

export const MotionTokens = {
  durations: {
    instant: 50,
    buttonDown: 70,
    buttonUp: 120,
    itemPickup: 140,
    dropSettle: 180,
    modalPop: 220,
    toastFloat: 260,
    sceneFade: 320,
    eatingBite: 350,
    idleBreathing: 2800,
    ambientSway: 3600,
  },

  scales: {
    rest: 1.0,
    buttonPressed: 0.94,
    buttonOvershoot: 1.02,
    dragLift: 1.05,
    dropSquashX: 1.07,
    dropSquashY: 0.93,
    modalStart: 0.92,
    coinPunch: 1.25,
  },

  blinking: {
    minIntervalMs: 2500,
    maxIntervalMs: 5500,
    durationMs: 120,
    doubleBlinkChance: 0.20,
  },

  easings: {
    button: 'Cubic.easeOut',
    pop: 'Back.easeOut',
    bounce: 'Bounce.easeOut',
    smooth: 'Sine.easeInOut',
    quadOut: 'Quad.easeOut',
  },

  /**
   * Helper to check if user has prefers-reduced-motion set
   */
  prefersReducedMotion(): boolean {
    if (typeof window === 'undefined' || !window.matchMedia) return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  },
} as const
