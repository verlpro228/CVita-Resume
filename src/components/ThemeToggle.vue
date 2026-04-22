<template>
  <button class="theme-button" type="button" :aria-label="themeTitle" :title="themeTitle" @click="toggleTheme">
    <svg v-if="isDark" viewBox="0 0 24 24" width="19" height="19" aria-hidden="true">
      <path fill="currentColor" d="M12 4.5a1 1 0 0 1 1 1v1.1a1 1 0 1 1-2 0V5.5a1 1 0 0 1 1-1Zm0 12.9a4.4 4.4 0 1 0 0-8.8 4.4 4.4 0 0 0 0 8.8Zm6.5-4.4a1 1 0 0 1 1-1h1.1a1 1 0 1 1 0 2h-1.1a1 1 0 0 1-1-1ZM3.4 12h1.1a1 1 0 1 1 0 2H3.4a1 1 0 1 1 0-2Zm13.8-5.2a1 1 0 0 1 1.42 0l.78.78A1 1 0 0 1 18 9l-.78-.78a1 1 0 0 1 0-1.42ZM4.6 16.42a1 1 0 0 1 1.42 0l.78.78A1 1 0 1 1 5.38 18.6l-.78-.78a1 1 0 0 1 0-1.42Zm14.8 0a1 1 0 0 1 0 1.42l-.78.78A1 1 0 0 1 17.2 17.2l.78-.78a1 1 0 0 1 1.42 0ZM6.8 6.8a1 1 0 0 1 0 1.42L6.02 9A1 1 0 0 1 4.6 7.58l.78-.78a1 1 0 0 1 1.42 0ZM12 18.4a1 1 0 0 1 1 1v1.1a1 1 0 1 1-2 0v-1.1a1 1 0 0 1 1-1Z" />
    </svg>
    <svg v-else viewBox="0 0 24 24" width="19" height="19" aria-hidden="true">
      <path fill="currentColor" d="M20.1 14.43A7.9 7.9 0 0 1 9.57 3.9a.8.8 0 0 0-.74-1.33 9.75 9.75 0 1 0 12.6 12.6.8.8 0 0 0-1.33-.74ZM12.25 20A7.75 7.75 0 0 1 7.6 6.04a9.9 9.9 0 0 0 10.36 10.36A7.72 7.72 0 0 1 12.25 20Z" />
    </svg>
  </button>
</template>

<script setup>
import { useThemeMode } from '@/utils/themeMode'

const { isDark, themeTitle, toggleTheme } = useThemeMode()
</script>

<style scoped lang="scss">
.theme-button {
  width: 44px;
  min-width: 44px;
  height: 44px;
  min-height: 44px;
  display: inline-grid;
  place-items: center;
  padding: 0;
  border: 1px solid rgba(17, 24, 39, 0.08);
  border-radius: 50%;
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.58)),
    radial-gradient(circle at 30% 18%, rgba(255, 255, 255, 0.96), transparent 38%);
  color: #111827;
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px) saturate(150%);
  cursor: pointer;
  transition: transform 0.22s ease, box-shadow 0.22s ease, background 0.22s ease, color 0.22s ease, border 0.22s ease;

  svg {
    transition: transform 0.28s ease;
  }

  &:hover {
    transform: translateY(-2px);
    color: #2563eb;
    box-shadow: 0 16px 34px rgba(37, 99, 235, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.96);

    svg {
      transform: rotate(-12deg) scale(1.06);
    }
  }

  &:active {
    transform: translateY(0) scale(0.96);
  }
}

:global(html.theme-dark) .theme-button {
  border-color: rgba(148, 163, 184, 0.24);
  background:
    linear-gradient(145deg, rgba(30, 41, 59, 0.82), rgba(15, 23, 42, 0.62)),
    radial-gradient(circle at 30% 18%, rgba(96, 165, 250, 0.22), transparent 44%);
  color: #f8fafc;
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.12);
}

:global(html.theme-dark) .theme-button:hover {
  color: #facc15;
  box-shadow: 0 18px 38px rgba(37, 99, 235, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.16);
}
</style>
