import { DEFAULT_SAVE, migrateSave, type GameSave } from './SaveSchema'

const STORAGE_KEY = 'qian-hui-avatar-city.save'

export interface StorageLike { getItem(key: string): string | null; setItem(key: string, value: string): void }

const memory = new Map<string, string>()
const fallbackStorage: StorageLike = { getItem: (key) => memory.get(key) ?? null, setItem: (key, value) => { memory.set(key, value) } }
const defaultStorage = typeof localStorage === 'undefined' ? fallbackStorage : localStorage

function cloneDefault(): GameSave { return structuredClone(DEFAULT_SAVE) }

export class SaveManager {
  private readonly storage: StorageLike
  private timer?: ReturnType<typeof setTimeout>

  constructor(storage: StorageLike = defaultStorage) { this.storage = storage }

  createDefault(): GameSave { return cloneDefault() }
  serialize(data: GameSave): string { return JSON.stringify(data) }
  deserialize(raw: string): GameSave | undefined {
    try { return migrateSave(JSON.parse(raw) as unknown) } catch { return undefined }
  }

  load(): GameSave {
    const raw = this.storage.getItem(STORAGE_KEY)
    if (!raw) return cloneDefault()
    // BUG-16 fix: parse the raw JSON once, then migrate, instead of parsing twice.
    let storedVersion: number | undefined
    let parsed: GameSave | undefined
    try {
      const data = JSON.parse(raw) as { saveVersion?: number }
      storedVersion = typeof data.saveVersion === 'number' ? data.saveVersion : undefined
      parsed = migrateSave(data)
    } catch {
      parsed = undefined
    }
    if (!parsed) return cloneDefault()
    if (storedVersion !== parsed.saveVersion) this.save(parsed)
    return parsed
  }

  save(data: GameSave): void {
    // An immediate purchase/gift must not be overwritten by an older queued snapshot.
    clearTimeout(this.timer)
    this.timer = undefined
    this.storage.setItem(STORAGE_KEY, this.serialize(data))
  }

  scheduleSave(data: GameSave, delay = 120): void {
    clearTimeout(this.timer)
    const snapshot = structuredClone(data)
    this.timer = setTimeout(() => this.save(snapshot), delay)
  }

  reset(): GameSave { const fresh = cloneDefault(); this.save(fresh); return fresh }
}

export const saveManager = new SaveManager()
