import { describe, expect, it } from 'vitest'
import { activityComplete, claimDailyReward, completeActivity, completeDailyEvent, dailyEventComplete, localDayKey } from '../src/state/DailyActivities'

describe('optional daily activities', () => {
  it('works with existing numeric progress without replacing unrelated values', () => {
    const records = { parkSandbox: 3 }
    completeActivity(records, 'shop', 20260905)
    expect(activityComplete(records, 'shop', 20260905)).toBe(true)
    expect(activityComplete(records, 'shop', 20260906)).toBe(false)
    expect(records.parkSandbox).toBe(3)
  })
  it('tracks playing a game separately from trying an outfit', () => {
    const records = {}
    completeActivity(records, 'game', 20260905)
    expect(activityComplete(records, 'game', 20260905)).toBe(true)
    expect(activityComplete(records, 'outfit', 20260905)).toBe(false)
  })
  it('awards a fixed gift once per day, including after serializing and reloading', () => {
    const records = {}
    expect(claimDailyReward(records, 20260905)).toBe(25)
    expect(claimDailyReward(JSON.parse(JSON.stringify(records)), 20260905)).toBe(0)
    expect(claimDailyReward(records, 20260904)).toBe(0)
    expect(claimDailyReward(records, 20260906)).toBe(25)
  })
  it('uses the player local calendar day', () => {
    expect(localDayKey(new Date(2026, 8, 5, 23, 59))).toBe(20260905)
  })
  it('persists named daily events and allows them again on a new day', () => {
    const records = {}
    expect(completeDailyEvent(records, 'park-sandbox-1', 20260905)).toBe(true)
    expect(completeDailyEvent(records, 'park-sandbox-1', 20260905)).toBe(false)
    expect(dailyEventComplete(JSON.parse(JSON.stringify(records)), 'park-sandbox-1', 20260905)).toBe(true)
    expect(completeDailyEvent(records, 'park-sandbox-1', 20260906)).toBe(true)
  })
})
