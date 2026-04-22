import { computed, ref } from 'vue'

const STORAGE_KEY = 'cvita-theme-mode'
const isDark = ref(false)

const canUseDom = () => typeof window !== 'undefined' && typeof document !== 'undefined'

const applyThemeMode = (dark) => {
  if (!canUseDom()) return
  document.documentElement.classList.toggle('theme-dark', dark)
  document.documentElement.classList.toggle('theme-light', !dark)
  document.documentElement.dataset.theme = dark ? 'dark' : 'light'
}

export const initThemeMode = () => {
  if (!canUseDom()) return
  isDark.value = window.localStorage.getItem(STORAGE_KEY) === 'dark'
  applyThemeMode(isDark.value)
}

export const useThemeMode = () => {
  const toggleTheme = () => {
    isDark.value = !isDark.value
    if (canUseDom()) {
      window.localStorage.setItem(STORAGE_KEY, isDark.value ? 'dark' : 'light')
    }
    applyThemeMode(isDark.value)
  }

  return {
    isDark,
    themeTitle: computed(() => (isDark.value ? '切换为浅色模式' : '切换为深色模式')),
    toggleTheme
  }
}
