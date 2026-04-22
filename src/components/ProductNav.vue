<template>
  <header class="product-nav">
    <button class="brand glass-focus" type="button" @click="router.push('/')">
      <img src="/cvita-creative-icon-dark.svg" alt="CVita" />
      <span>CVita</span>
    </button>

    <nav :class="{ open: menuOpen }">
      <RouterLink to="/">首页</RouterLink>
      <RouterLink to="/templates">模板</RouterLink>
      <RouterLink to="/editor">编辑器</RouterLink>
      <button type="button" @click="goFaq">FAQ</button>
    </nav>

    <div class="nav-actions">
      <ThemeToggle />
      <button class="github-btn" type="button" @click="openGithub" aria-label="打开 GitHub 主页" title="GitHub">
        <svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true">
          <path fill="currentColor"
            d="M12 2C6.48 2 2 6.58 2 12.26c0 4.53 2.87 8.38 6.84 9.74.5.1.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.38-3.37-1.38-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.56 2.36 1.11 2.94.85.09-.67.35-1.11.63-1.37-2.22-.26-4.55-1.14-4.55-5.05 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.72 0 0 .84-.28 2.75 1.05A9.3 9.3 0 0112 6.99c.85 0 1.7.12 2.5.34 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.46.1 2.72.64.72 1.03 1.63 1.03 2.75 0 3.92-2.34 4.78-4.57 5.04.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.15 10.15 0 0022 12.26C22 6.58 17.52 2 12 2z" />
        </svg>
      </button>
      <button class="primary-btn" type="button" @click="router.push('/editor')">开始制作</button>
      <button class="menu-btn" type="button" aria-label="打开菜单" @click="menuOpen = !menuOpen">
        <span></span>
        <span></span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { nextTick, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { GITHUB_URL } from '@/data/resumeBuilder'
import ThemeToggle from '@/components/ThemeToggle.vue'

const router = useRouter()
const route = useRoute()
const menuOpen = ref(false)

const openGithub = () => {
  window.open(GITHUB_URL, '_blank', 'noopener,noreferrer')
}

const goFaq = async () => {
  menuOpen.value = false
  if (route.path !== '/') {
    await router.push('/')
  }
  await nextTick()
  document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<style scoped lang="scss">
.product-nav {
  position: fixed;
  top: 14px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  width: min(1180px, calc(100% - 32px));
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 22px;
  margin: 0;
  padding: 0 14px 0 18px;
  border: 1px solid rgba(255, 255, 255, 0.62);
  border-radius: 24px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.66), rgba(255, 255, 255, 0.34));
  box-shadow: 0 16px 54px rgba(15, 23, 42, 0.07), inset 0 1px 0 rgba(255, 255, 255, 0.76);
  backdrop-filter: blur(28px) saturate(1.55);
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border: none;
  background: transparent;
  color: #111827;
  cursor: pointer;

  img {
    width: 38px;
    height: 38px;
  }

  span {
    font-size: 22px;
    font-weight: 900;
    letter-spacing: 0;
  }
}

nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  flex: 1;

  a,
  button {
    min-height: 38px;
    display: inline-flex;
    align-items: center;
    padding: 0 14px;
    border: none;
    border-radius: 14px;
    background: transparent;
    color: #667085;
    font-size: 14px;
    font-weight: 800;
    cursor: pointer;
    transition: transform 0.2s ease, background 0.2s ease, color 0.2s ease;
  }

  a:hover,
  button:hover,
  .router-link-active {
    color: #111827;
    background: rgba(255, 255, 255, 0.72);
    transform: translateY(-1px);
  }
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.github-btn,
.primary-btn,
.menu-btn {
  min-height: 40px;
  border-radius: 16px;
  cursor: pointer;
  transition: transform 0.22s ease, box-shadow 0.22s ease, background 0.22s ease;
}

.github-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  padding: 0;
  border: 1px solid rgba(17, 24, 39, 0.08);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.82);
  color: #111827;
  font-weight: 900;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9);

  &:hover {
    transform: translateY(-2px);
    background: #111827;
    color: #fff;
    box-shadow: 0 14px 28px rgba(17, 24, 39, 0.18);
  }
}

.primary-btn {
  padding: 0 18px;
  border: none;
  background: linear-gradient(135deg, #111827, #263244);
  color: #fff;
  font-size: 14px;
  font-weight: 900;
  box-shadow: 0 12px 28px rgba(17, 24, 39, 0.18);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 18px 34px rgba(17, 24, 39, 0.22);
  }
}

.menu-btn {
  display: none;
  width: 42px;
  border: 1px solid rgba(17, 24, 39, 0.08);
  background: rgba(255, 255, 255, 0.8);

  span {
    display: block;
    width: 17px;
    height: 2px;
    margin: 4px auto;
    border-radius: 999px;
    background: #111827;
  }
}

@media (max-width: 900px) {
  nav {
    position: fixed;
    top: 92px;
    left: 16px;
    right: 16px;
    z-index: 120;
    display: none;
    flex-direction: column;
    align-items: stretch;
    padding: 12px;
    border: 1px solid rgba(255, 255, 255, 0.78);
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.88);
    box-shadow: 0 20px 48px rgba(15, 23, 42, 0.14);
    backdrop-filter: blur(24px);

    &.open {
      display: flex;
    }
  }

  .menu-btn {
    display: block;
  }
}

@media (max-width: 560px) {
  .product-nav {
    width: min(100% - 20px, 1180px);
    padding-left: 12px;
  }

  .primary-btn {
    display: none;
  }

  .github-btn {
    width: 42px;
  }
}
</style>
