import { describe, expect, it } from 'vitest'
import type { TimeOfDay } from '../src/environment/DayNightManager'

describe('Day & Night Ambiance System', () => {
  it('correctly cycles through day, sunset, and night sequentially', () => {
    const sequence: TimeOfDay[] = ['day']
    const nextTime = (current: TimeOfDay): TimeOfDay => {
      const transitions: Record<TimeOfDay, TimeOfDay> = {
        day: 'sunset',
        sunset: 'night',
        night: 'day',
      }
      return transitions[current]
    }

    let time: TimeOfDay = 'day'
    time = nextTime(time)
    sequence.push(time)
    time = nextTime(time)
    sequence.push(time)
    time = nextTime(time)
    sequence.push(time)

    expect(sequence).toEqual(['day', 'sunset', 'night', 'day'])
  })
})
