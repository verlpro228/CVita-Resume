<template>
  <div class="landing-page">
    <section class="hero-section">
      <div class="hero-copy">
        <span class="product-badge reveal-hero">AI Resume Builder · Free · Local First</span>
        <h1 class="reveal-hero">让简历制作变得简单而智能</h1>
        <p class="reveal-hero">
          CVita 利用 AI 辅助、模板选择和实时预览，帮助你快速创建专业简历。
          无需注册，免费使用，数据安全存储在本地。
        </p>
        <div class="hero-actions reveal-hero">
          <button type="button" class="primary-btn shine-btn" @click="router.push('/editor')">立即开始制作</button>
          <button type="button" class="secondary-btn glass-btn" @click="router.push('/templates')">浏览模板</button>
          <button type="button" class="github-hero glass-btn" @click="openGithub" aria-label="打开 GitHub 主页" title="GitHub">
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              <path fill="currentColor"
                d="M12 2C6.48 2 2 6.58 2 12.26c0 4.53 2.87 8.38 6.84 9.74.5.1.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.38-3.37-1.38-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.56 2.36 1.11 2.94.85.09-.67.35-1.11.63-1.37-2.22-.26-4.55-1.14-4.55-5.05 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.72 0 0 .84-.28 2.75 1.05A9.3 9.3 0 0112 6.99c.85 0 1.7.12 2.5.34 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.46.1 2.72.64.72 1.03 1.63 1.03 2.75 0 3.92-2.34 4.78-4.57 5.04.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.15 10.15 0 0022 12.26C22 6.58 17.52 2 12 2z" />
            </svg>
          </button>
        </div>
        <div class="trust-row reveal-hero">
          <span>免费开始</span>
          <span>本地安全存储</span>
          <span>AI 辅助 mock</span>
          <span>PDF / JSON 导出</span>
        </div>
      </div>

      <div class="hero-product reveal-hero">
        <div class="mock-editor glass-card">
          <div class="mock-top">
            <span></span><span></span><span></span>
            <strong>CVita Editor</strong>
          </div>
          <div class="mock-body">
            <div class="mock-sidebar">
              <i v-for="item in 7" :key="item"></i>
            </div>
            <div class="mock-form">
              <b></b>
              <i></i><i></i><i></i>
              <b class="short"></b>
              <i></i><i></i>
            </div>
            <div class="mock-paper">
              <ResumePreview :resume="demoResume" :scale="0.34" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="why-section">
      <div class="section-heading reveal-block">
        <h2>为什么选择 CVita？</h2>
        <i></i>
        <p>我们提供一站式简历解决方案，让你的求职之路更加顺畅。</p>
      </div>

      <div class="showcase-list">
        <article v-for="(feature, index) in showcases" :key="feature.title" class="showcase-row reveal-block" :class="{ reverse: index % 2 === 1 }">
          <div class="showcase-copy">
            <span class="product-badge">{{ feature.badge }}</span>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.desc }}</p>
            <div class="showcase-points">
              <button
                v-for="(point, pointIndex) in feature.points"
                :key="point.title"
                type="button"
                :class="{ active: pointIndex === feature.active }"
              >
                <strong>{{ point.title }}</strong>
                <small>{{ point.desc }}</small>
                <span>›</span>
              </button>
            </div>
          </div>
          <div class="showcase-visual glass-card" :class="`visual-${feature.visual}`">
            <div v-if="feature.visual === 'ai'" class="ai-visual-card">
              <span>Their</span>
              <strong>Thier</strong>
              <i></i>
              <b></b>
              <div class="ai-progress" aria-hidden="true">
                <em></em>
              </div>
            </div>
            <div v-else-if="feature.visual === 'privacy'" class="privacy-visual-card">
              <i></i>
              <span></span>
              <span></span>
              <span></span>
              <strong>PDF</strong>
            </div>
            <div v-else class="editor-visual-card">
              <div class="editor-mini-sidebar">
                <span v-for="item in 5" :key="item"></span>
              </div>
              <div class="editor-mini-form">
                <b></b>
                <i></i>
                <i></i>
                <i></i>
              </div>
              <div class="editor-mini-paper">
                <ResumePreview :resume="demoResume" :scale="0.25" />
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section class="flow-section">
      <div class="section-heading reveal-block">
        <span>Workflow</span>
        <h2>四步完成一份可导出的专业简历</h2>
      </div>
      <div class="flow-grid">
        <article v-for="(step, index) in steps" :key="step.title" class="flow-card glass-card reveal-card">
          <span>{{ String(index + 1).padStart(2, '0') }}</span>
          <h3>{{ step.title }}</h3>
          <p>{{ step.desc }}</p>
        </article>
      </div>
    </section>

    <section id="faq" class="faq-section">
      <div class="section-heading reveal-block">
        <span>FAQ</span>
        <h2>常见问题</h2>
      </div>
      <div class="faq-list reveal-block">
        <article v-for="(item, index) in faqs" :key="item.q" class="faq-item glass-card">
          <button type="button" @click="toggleFaq(index)">
            <strong>{{ item.q }}</strong>
            <span>{{ openFaq === index ? '−' : '+' }}</span>
          </button>
          <div v-show="openFaq === index" class="faq-answer">
            <p>{{ item.a }}</p>
          </div>
        </article>
      </div>
    </section>

    <footer class="landing-footer glass-card">
      <div>
        <strong>CVita Resume Builder</strong>
        <span>免费、本地优先、支持 PDF 与 JSON 导出的在线简历生成平台。</span>
      </div>
      <div class="footer-actions">
        <button type="button" class="github-icon" @click="openGithub" aria-label="打开 GitHub 主页" title="GitHub">
          <svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true">
            <path fill="currentColor"
              d="M12 2C6.48 2 2 6.58 2 12.26c0 4.53 2.87 8.38 6.84 9.74.5.1.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.38-3.37-1.38-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.56 2.36 1.11 2.94.85.09-.67.35-1.11.63-1.37-2.22-.26-4.55-1.14-4.55-5.05 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.72 0 0 .84-.28 2.75 1.05A9.3 9.3 0 0112 6.99c.85 0 1.7.12 2.5.34 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.46.1 2.72.64.72 1.03 1.63 1.03 2.75 0 3.92-2.34 4.78-4.57 5.04.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.15 10.15 0 0022 12.26C22 6.58 17.52 2 12 2z" />
          </svg>
        </button>
        <button type="button" class="primary" @click="router.push('/editor')">开始制作</button>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ResumePreview from '@/components/ResumePreview.vue'
import { createDemoResume, GITHUB_URL } from '@/data/resumeBuilder'

gsap.registerPlugin(ScrollTrigger)

const router = useRouter()
const demoResume = createDemoResume('tech')
const openFaq = ref(0)
let cardMotionCleanups = []

const showcases = [
  {
    badge: 'AI 驱动',
    title: '智能识别，专业建议',
    desc: '内置智能表达检查，自动识别不恰当表述，提供更专业的修改建议，让你的简历更有说服力。',
    visual: 'ai',
    active: 1,
    points: [
      { title: '智能润色', desc: 'AI 自动优化文案表达，让简历更专业' },
      { title: '语法检查', desc: '自动检测并修正语法和拼写错误' }
    ]
  },
  {
    badge: '免费高效制作',
    title: '模块化编辑，实时预览',
    desc: '以表单编辑简历内容，右侧 A4 预览实时同步。模板、内容、导出都在同一条清晰流程里完成。',
    visual: 'editor',
    active: 0,
    points: [
      { title: '实时预览', desc: '边写边看最终排版效果' },
      { title: '多模板切换', desc: '同一份数据快速切换不同表达' }
    ]
  },
  {
    badge: '隐私安全',
    title: '数据安全，隐私优先',
    desc: '所有简历数据完整存储在你的本地设备中，无需担心隐私泄露。支持数据导出备份，确保简历随时可用。',
    visual: 'privacy',
    active: 1,
    points: [
      { title: '本地文件存储', desc: '简历数据安全存储在你的电脑硬盘中' },
      { title: '多种导出格式', desc: '支持 PDF 和 JSON 格式导出' }
    ]
  }
]

const steps = [
  { title: '选择模板', desc: '从简约商务、现代技术、清新玻璃等模板中选择合适风格。' },
  { title: '填写内容', desc: '按模块编辑基本信息、经历、项目、技能与自定义内容。' },
  { title: '实时预览', desc: '右侧 A4 预览实时同步，边写边检查排版和层级。' },
  { title: '导出简历', desc: '导出 PDF 用于投递，或导出 JSON 继续恢复编辑。' }
]

const faqs = [
  { q: 'CVita 是否免费？', a: '当前前端版本可免费使用，无需注册即可开始制作示例简历并导出文件。' },
  { q: '我的数据是否安全？', a: '当前版本使用 localStorage 本地保存草稿，不会主动上传到服务器。' },
  { q: '是否支持 PDF 和 JSON？', a: '支持。PDF 适合投递，JSON 适合备份、恢复或后续接入云端。' },
  { q: '能否多设备同步？', a: '当前是本地优先版本，多设备同步可以作为后续账号体系和云存储能力扩展。' },
  { q: '模板自定义程度如何？', a: '支持模板切换、主题色、字体和排版密度，后续可继续扩展布局和模块样式。' }
]

const openGithub = () => {
  window.open(GITHUB_URL, '_blank', 'noopener,noreferrer')
}

const toggleFaq = async (index) => {
  openFaq.value = openFaq.value === index ? -1 : index
  await nextTick()
  const item = document.querySelectorAll('.faq-answer')[index]
  if (item && openFaq.value === index) {
    gsap.fromTo(item, { height: 0, opacity: 0 }, { height: 'auto', opacity: 1, duration: 0.28, ease: 'power2.out' })
  }
}

const setupCardMotion = () => {
  const cards = gsap.utils.toArray(
    '.landing-page .glass-card:not(.mock-editor), .landing-page .showcase-points button, .landing-page .trust-row span'
  )

  cardMotionCleanups = cards.map((card) => {
    const lift = () => {
      gsap.to(card, {
        y: -8,
        scale: 1.012,
        duration: 0.28,
        ease: 'power2.out',
        overwrite: 'auto'
      })
    }
    const reset = () => {
      gsap.to(card, {
        y: 0,
        scale: 1,
        duration: 0.28,
        ease: 'power2.out',
        overwrite: 'auto'
      })
    }
    const press = () => {
      gsap.to(card, { scale: 0.992, duration: 0.12, ease: 'power2.out', overwrite: 'auto' })
    }

    card.addEventListener('mouseenter', lift)
    card.addEventListener('mouseleave', reset)
    card.addEventListener('mousedown', press)
    card.addEventListener('mouseup', lift)

    return () => {
      card.removeEventListener('mouseenter', lift)
      card.removeEventListener('mouseleave', reset)
      card.removeEventListener('mousedown', press)
      card.removeEventListener('mouseup', lift)
    }
  })
}

onMounted(() => {
  gsap.from('.reveal-hero', {
    y: 24,
    opacity: 0,
    duration: 0.72,
    stagger: 0.09,
    ease: 'power3.out'
  })

  gsap.to('.mock-editor', {
    y: -10,
    duration: 3.2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  })

  gsap.to('.ai-visual-card', {
    y: -6,
    duration: 2.6,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  })

  gsap.fromTo(
    '.ai-progress em',
    { scaleX: 0.18 },
    {
      scaleX: 1,
      duration: 1.8,
      repeat: -1,
      yoyo: true,
      ease: 'power2.inOut'
    }
  )

  gsap.to('.ai-visual-card span', {
    boxShadow: '0 0 0 6px rgba(17, 24, 39, 0.1)',
    duration: 1.4,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  })

  gsap.to('.privacy-visual-card strong', {
    x: 8,
    duration: 1.9,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  })

  gsap.to('.editor-mini-paper', {
    y: -5,
    duration: 2.4,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  })

  gsap.to('.flow-card span', {
    y: -3,
    duration: 1.35,
    repeat: -1,
    yoyo: true,
    stagger: 0.12,
    ease: 'sine.inOut'
  })

  gsap.utils.toArray('.reveal-block').forEach((item) => {
    gsap.from(item, {
      scrollTrigger: { trigger: item, start: 'top 82%', once: true },
      y: 24,
      opacity: 0,
      duration: 0.62,
      ease: 'power2.out'
    })
  })

  gsap.utils.toArray('.reveal-card').forEach((item, index) => {
    gsap.from(item, {
      scrollTrigger: { trigger: item, start: 'top 88%', once: true },
      y: 26,
      opacity: 0,
      duration: 0.55,
      delay: (index % 6) * 0.035,
      ease: 'power2.out'
    })
  })

  setupCardMotion()
})

onBeforeUnmount(() => {
  cardMotionCleanups.forEach(cleanup => cleanup())
  cardMotionCleanups = []
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
})
</script>

<style scoped lang="scss">
.landing-page {
  min-height: 100vh;
  color: #111827;
}

.hero-section,
.why-section,
.flow-section,
.faq-section,
.landing-footer {
  width: min(1180px, calc(100% - 40px));
  margin: 0 auto;
}

.hero-section {
  min-height: calc(100vh - 112px);
  display: grid;
  gap: 48px;
  align-items: start;
  justify-items: center;
  padding: 28px 0 96px;
  text-align: center;
}

.product-badge,
.glass-card,
.glass-btn {
  border: 1px solid rgba(255, 255, 255, 0.76);
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.82), rgba(255, 255, 255, 0.56));
  box-shadow: 0 18px 54px rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(24px) saturate(1.35);
}

.glass-card {
  position: relative;
  overflow: hidden;
  isolation: isolate;
  transition:
    border-color 0.28s ease,
    box-shadow 0.28s ease,
    filter 0.28s ease;

  &::before {
    content: '';
    position: absolute;
    inset: -1px;
    z-index: 0;
    background: linear-gradient(115deg, transparent 16%, rgba(255, 255, 255, 0.58) 42%, transparent 68%);
    opacity: 0;
    transform: translateX(-130%);
    transition: opacity 0.28s ease, transform 0.72s ease;
    pointer-events: none;
  }

  &:hover {
    border-color: rgba(255, 255, 255, 0.96);
    box-shadow: 0 28px 74px rgba(15, 23, 42, 0.13), inset 0 1px 0 rgba(255, 255, 255, 0.96);
    filter: saturate(1.04);
  }

  &:hover::before {
    opacity: 1;
    transform: translateX(130%);
  }
}

.product-badge {
  display: inline-flex;
  min-height: 34px;
  align-items: center;
  padding: 0 13px;
  border-radius: 999px;
  color: #2563eb;
  font-size: 13px;
  font-weight: 900;
}

.hero-copy {
  max-width: 1120px;

  h1 {
    margin: 28px auto 18px;
    max-width: 1120px;
    font-size: 68px;
    line-height: 1.08;
    font-weight: 820;
    letter-spacing: 0;
    white-space: nowrap;
  }

  p {
    max-width: 640px;
    margin: 0 auto;
    color: #5f6b7a;
    font-size: 18px;
    line-height: 1.9;
  }
}

.hero-actions,
.trust-row,
.footer-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.hero-actions {
  justify-content: center;
  margin-top: 30px;
}

.primary-btn,
.secondary-btn,
.github-hero,
.footer-actions button {
  min-height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 18px;
  padding: 0 20px;
  font-size: 15px;
  font-weight: 900;
  cursor: pointer;
  transition: transform 0.22s ease, box-shadow 0.22s ease, background 0.22s ease;
}

.primary-btn,
.footer-actions .primary {
  border: none;
  background: linear-gradient(135deg, #111827, #263244);
  color: #fff;
  box-shadow: 0 18px 34px rgba(17, 24, 39, 0.18);
}

.secondary-btn,
.github-hero,
.footer-actions button {
  color: #111827;
  border: 1px solid rgba(17, 24, 39, 0.08);
}

.primary-btn:hover,
.secondary-btn:hover,
.github-hero:hover,
.footer-actions button:hover {
  transform: translateY(-2px);
}

.github-hero:hover {
  background: #111827;
  color: #fff;
  box-shadow: 0 18px 34px rgba(17, 24, 39, 0.18);
}

.github-hero,
.footer-actions .github-icon {
  width: 48px;
  min-width: 48px;
  padding: 0;
  border-radius: 50%;
}

.trust-row {
  justify-content: center;
  margin-top: 28px;

  span {
    padding: 8px 12px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.62);
    color: #526071;
    font-size: 13px;
    font-weight: 800;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9);
  }
}

.hero-product {
  width: min(820px, 100%);
}

.mock-editor {
  transform-origin: top center;
  overflow: hidden;
  border-radius: 30px;
  box-shadow: 0 34px 96px rgba(15, 23, 42, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.92);
}

.mock-top {
  height: 54px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 18px;
  border-bottom: 1px solid rgba(17, 24, 39, 0.06);

  span {
    width: 11px;
    height: 11px;
    border-radius: 50%;
    background: #d7deea;
  }

  strong {
    margin-left: 8px;
    color: #526071;
    font-size: 13px;
  }
}

.mock-body {
  height: 580px;
  display: grid;
  grid-template-columns: 90px 160px 1fr;
  gap: 16px;
  padding: 18px;
}

.mock-sidebar,
.mock-form,
.mock-paper {
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.72);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.85);
}

.mock-sidebar {
  display: grid;
  gap: 10px;
  align-content: start;
  padding: 16px 12px;

  i {
    height: 34px;
    border-radius: 14px;
    background: #eef2f7;
  }
}

.mock-form {
  display: grid;
  align-content: start;
  gap: 12px;
  padding: 16px;

  b,
  i {
    display: block;
    border-radius: 12px;
    background: #e8edf5;
  }

  b {
    height: 36px;

    &.short {
      width: 70%;
    }
  }

  i {
    height: 52px;
  }
}

.mock-paper {
  overflow: hidden;
  padding: 16px 0 0 18px;
}

.why-section,
.flow-section,
.faq-section {
  padding: 92px 0;
}

.section-heading {
  margin-bottom: 56px;
  text-align: center;

  >span {
    color: #2563eb;
    font-size: 13px;
    font-weight: 900;
    text-transform: uppercase;
  }

  h2 {
    margin: 8px 0 10px;
    font-size: 46px;
    font-weight: 720;
    letter-spacing: 0;
  }

  i {
    width: 72px;
    height: 3px;
    display: block;
    margin: 22px auto 34px;
    border-radius: 999px;
    background: rgba(17, 24, 39, 0.22);
  }

  p {
    color: #657184;
    line-height: 1.8;
  }
}

.row-heading {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 20px;
  text-align: left;
}

.showcase-list {
  display: grid;
  gap: 92px;
}

.showcase-row {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.2fr);
  gap: 82px;
  align-items: center;
}

.showcase-row.reverse {
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.9fr);

  .showcase-copy {
    order: 2;
  }

  .showcase-visual {
    order: 1;
  }
}

.showcase-copy {
  .product-badge {
    min-height: 30px;
    color: #111827;
    font-size: 12px;
  }

  h3 {
    margin: 18px 0 22px;
    color: #1f2937;
    font-size: 34px;
    font-weight: 650;
    line-height: 1.32;
    letter-spacing: 0;
  }

  p {
    max-width: 460px;
    color: #657184;
    font-size: 17px;
    line-height: 1.9;
  }
}

.showcase-points {
  display: grid;
  gap: 14px;
  max-width: 420px;
  margin-top: 48px;

  button {
    position: relative;
    min-height: 72px;
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 5px 14px;
    align-items: center;
    padding: 14px 18px;
    border: 1px solid transparent;
    border-radius: 18px;
    background: transparent;
    color: #111827;
    text-align: left;
    cursor: pointer;
    transition: transform 0.22s ease, box-shadow 0.22s ease, background 0.22s ease;
  }

  button:hover,
  button.active {
    background: rgba(255, 255, 255, 0.72);
    border-color: rgba(255, 255, 255, 0.78);
    box-shadow: 0 18px 42px rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9);
    transform: translateY(-2px);
  }

  strong,
  small {
    grid-column: 1;
  }

  strong {
    font-size: 16px;
    font-weight: 760;
  }

  small {
    color: #657184;
    font-size: 14px;
    line-height: 1.6;
  }

  span {
    grid-column: 2;
    grid-row: 1 / span 2;
    color: #111827;
    font-size: 28px;
    font-weight: 260;
  }
}

.showcase-visual {
  min-height: 300px;
  display: grid;
  place-items: center;
  overflow: hidden;
  border-radius: 28px;
  background:
    linear-gradient(140deg, rgba(255, 255, 255, 0.86), rgba(255, 255, 255, 0.5)),
    repeating-linear-gradient(35deg, rgba(15, 23, 42, 0.018), rgba(15, 23, 42, 0.018) 14px, transparent 14px, transparent 52px);
  box-shadow: 0 30px 86px rgba(15, 23, 42, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.92);
}

.ai-visual-card,
.privacy-visual-card,
.editor-visual-card {
  position: relative;
}

.ai-visual-card {
  width: 230px;
  height: 172px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(17, 24, 39, 0.08);
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(105deg, transparent 18%, rgba(17, 24, 39, 0.08) 50%, transparent 76%);
    transform: translateX(-120%);
    animation: aiScan 3.6s ease-in-out infinite;
    pointer-events: none;
  }

  span,
  strong {
    position: absolute;
    left: 22px;
    width: 58px;
    height: 25px;
    display: grid;
    place-items: center;
    border: 1px solid #111827;
    border-radius: 5px;
    color: #111827;
    font-size: 13px;
    font-weight: 760;
  }

  span {
    top: 52px;
    background: #f8fafc;
  }

  strong {
    top: 72px;
    background: rgba(255, 255, 255, 0.92);
    text-decoration: line-through;
  }

  i,
  b {
    position: absolute;
    left: 92px;
    right: 38px;
    height: 3px;
    border-radius: 999px;
    background: #e5e7eb;
  }

  i {
    top: 78px;
  }

  b {
    top: 96px;
  }

  .ai-progress {
    position: absolute;
    left: 22px;
    right: 22px;
    bottom: 22px;
    height: 8px;
    overflow: hidden;
    border-radius: 999px;
    background: rgba(226, 232, 240, 0.82);
    box-shadow:
      inset 0 1px 2px rgba(15, 23, 42, 0.08),
      0 1px 0 rgba(255, 255, 255, 0.9);

    em {
      display: block;
      width: 100%;
      height: 100%;
      border-radius: inherit;
      transform: scaleX(0.18);
      transform-origin: left center;
      background: linear-gradient(90deg, #111827, #020617);
      box-shadow: 0 0 18px rgba(17, 24, 39, 0.24);
    }
  }
}

@keyframes aiScan {
  0%,
  18% {
    opacity: 0;
    transform: translateX(-120%);
  }

  35%,
  70% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform: translateX(120%);
  }
}

.privacy-visual-card {
  width: 230px;
  min-height: 170px;

  i {
    width: 98px;
    height: 138px;
    display: block;
    margin: 12px auto 0 28px;
    border: 3px solid #1f2937;
    border-radius: 6px;
    background: #fff;
  }

  span {
    position: absolute;
    left: 52px;
    width: 58px;
    height: 6px;
    border-radius: 999px;
    background: #d8d8d4;
  }

  span:nth-of-type(1) {
    top: 82px;
    width: 34px;
    height: 34px;
    border-radius: 50%;
  }

  span:nth-of-type(2) {
    top: 130px;
  }

  span:nth-of-type(3) {
    top: 146px;
    width: 44px;
  }

  strong {
    position: absolute;
    top: 36px;
    right: 20px;
    min-width: 60px;
    min-height: 42px;
    display: grid;
    place-items: center;
    border-radius: 8px;
    background: #111827;
    color: #fff;
    font-weight: 900;
  }
}

.editor-visual-card {
  width: min(560px, 92%);
  height: 250px;
  display: grid;
  grid-template-columns: 110px 190px 1fr;
  gap: 10px;
  padding: 14px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
}

.editor-mini-sidebar,
.editor-mini-form,
.editor-mini-paper {
  overflow: hidden;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.82);
}

.editor-mini-sidebar,
.editor-mini-form {
  display: grid;
  align-content: start;
  gap: 9px;
  padding: 10px;

  span,
  b,
  i {
    display: block;
    border-radius: 999px;
    background: #e8edf5;
  }
}

.editor-mini-sidebar span {
  height: 24px;
}

.editor-mini-form {
  b {
    height: 32px;
  }

  i {
    height: 44px;
  }
}

.editor-mini-paper {
  padding: 10px 0 0 10px;
}

.flow-grid {
  display: grid;
  gap: 18px;
}

.flow-grid {
  grid-template-columns: repeat(4, 1fr);
}

.flow-card {
  padding: 24px;
  border-radius: 28px;

  h3 {
    margin: 18px 0 10px;
    font-size: 19px;
  }

  p {
    color: #657184;
    line-height: 1.75;
  }
}

.flow-card {
  span {
    color: #2563eb;
    font-weight: 900;
  }
}

.faq-list {
  max-width: 880px;
  display: grid;
  gap: 12px;
  margin: 0 auto;
}

.faq-item {
  overflow: hidden;
  border-radius: 26px;

  button {
    width: 100%;
    min-height: 64px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 18px;
    padding: 0 20px;
    border: none;
    background: transparent;
    color: #111827;
    text-align: left;
    cursor: pointer;

    strong {
      font-size: 16px;
    }

    span {
      color: #2563eb;
      font-size: 24px;
      font-weight: 300;
    }
  }
}

.faq-answer {
  padding: 0 20px 18px;

  p {
    color: #657184;
    line-height: 1.8;
  }
}

.landing-footer {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: center;
  margin-bottom: 36px;
  padding: 22px 24px;
  border-radius: 30px;

  strong,
  span {
    display: block;
  }

  span {
    margin-top: 6px;
    color: #657184;
  }
}

@media (max-width: 1080px) {
  .hero-section {
    grid-template-columns: 1fr;
  }

  .hero-copy h1 {
    font-size: 58px;
  }

  .hero-product {
    max-width: 650px;
  }

  .showcase-row,
  .showcase-row.reverse {
    grid-template-columns: 1fr;
    gap: 34px;

    .showcase-copy,
    .showcase-visual {
      order: initial;
    }
  }

  .showcase-copy p,
  .showcase-points {
    max-width: none;
  }

  .flow-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 720px) {
  .hero-copy h1 {
    font-size: 42px;
    white-space: normal;
  }

  .section-heading h2,
  .row-heading h2 {
    font-size: 30px;
  }

  .hero-section,
  .why-section,
  .flow-section,
  .faq-section {
    padding: 52px 0;
  }

  .flow-grid {
    grid-template-columns: 1fr;
  }

  .showcase-list {
    gap: 52px;
  }

  .showcase-copy h3 {
    font-size: 28px;
  }

  .showcase-visual {
    min-height: 250px;
  }

  .editor-visual-card {
    grid-template-columns: 80px 1fr;
    height: 330px;
  }

  .editor-mini-paper {
    grid-column: 1 / -1;
    height: 150px;
  }

  .row-heading,
  .landing-footer {
    align-items: stretch;
    flex-direction: column;
  }

  .mock-body {
    grid-template-columns: 70px 1fr;
    height: 520px;
  }

  .mock-paper {
    grid-column: 1 / -1;
    height: 330px;
  }
}
</style>
