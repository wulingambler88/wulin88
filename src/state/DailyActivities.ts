export type DailyActivity = 'shop' | 'game' | 'outfit' | 'decorate'
export const DAILY_REWARD = 25
export function localDayKey(date = new Date()): number {
  return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate()
}
// Additive namespaced fields in the existing numeric minigames map keep V1–V5 saves compatible.
export function completeActivity(records: Record<string, number>, activity: DailyActivity, day = localDayKey()): void {
  records[`world:daily:${activity}`] = day
}
export function activityComplete(records: Record<string, number>, activity: DailyActivity, day = localDayKey()): boolean {
  return records[`world:daily:${activity}`] === day
}
export function claimDailyReward(records: Record<string, number>, day = localDayKey()): number {
  const previous = records['world:daily:claimed'] ?? 0
  if (previous >= day) return 0
  records['world:daily:claimed'] = day
  return DAILY_REWARD
}

export function dailyEventComplete(records: Record<string, number>, eventId: string, day = localDayKey()): boolean {
  return records[`world:daily:event:${eventId}`] === day
}

export function completeDailyEvent(records: Record<string, number>, eventId: string, day = localDayKey()): boolean {
  if (dailyEventComplete(records, eventId, day)) return false
  records[`world:daily:event:${eventId}`] = day
  return true
}
