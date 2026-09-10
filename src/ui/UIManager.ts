let toastTimer: number | undefined

export function setHelper(text: string): void {
  if (typeof document === 'undefined') return
  const element = document.querySelector<HTMLElement>('#helper-copy')
  if (element) element.textContent = text
}

export function showToast(text: string): void {
  if (typeof document === 'undefined') return
  const element = document.querySelector<HTMLElement>('#toast')
  if (!element) return
  window.clearTimeout(toastTimer)
  element.textContent = text
  element.classList.add('show')
  toastTimer = window.setTimeout(() => element.classList.remove('show'), 1500)
}
