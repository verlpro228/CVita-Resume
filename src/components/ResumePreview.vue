<template>
  <div
    class="resume-stage"
    :style="{ width: `${paperWidth * scale}px`, minHeight: `${paperHeight * scale}px` }"
  >
    <div class="resume-canvas" :style="{ transform: `scale(${scale})` }">
      <article
        class="resume-paper"
        :class="[
          `template-${resume.templateId || 'modern'}`,
          `density-${themeSettings.density || 'comfortable'}`,
          {
            'icon-mode': themeSettings.iconMode,
            'center-subtitle': themeSettings.centeredSubtitle,
            'compact-title-mode': themeSettings.compactTitle
          },
          `header-${themeSettings.headerLayout || 'balanced'}`
        ]"
        :style="previewStyle"
      >
        <header class="resume-header">
          <div class="identity">
            <div v-if="resume.basics?.avatar" class="avatar">
              <img :src="resume.basics.avatar" alt="avatar" />
            </div>
            <div>
              <h1>{{ resume.basics?.name || '姓名' }}</h1>
              <p>{{ resume.basics?.position || '职位意向' }}</p>
            </div>
          </div>
          <div class="contacts">
            <span v-for="item in contactItems" :key="item.key" class="contact-item">
              <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true">
                <path fill="currentColor" :d="contactIconPaths[item.icon]" />
              </svg>
              <b>{{ item.value }}</b>
            </span>
          </div>
        </header>

        <section v-if="resume.basics?.summary" class="resume-section intro-section">
          <h2>个人简介</h2>
          <p>{{ resume.basics.summary }}</p>
        </section>

        <template v-for="section in visibleSections" :key="section.id">
          <section v-if="section.type === 'summary' || section.type === 'custom'" class="resume-section">
            <h2>{{ section.title }}</h2>
            <p class="paragraph">{{ section.content }}</p>
          </section>

          <section v-else-if="section.type === 'skills'" class="resume-section">
            <h2>{{ section.title }}</h2>
            <div class="skill-list">
              <div v-for="item in filledItems(section.items)" :key="item.id" class="skill-item">
                <div class="skill-head">
                  <strong>{{ item.name }}</strong>
                  <span>{{ item.category }}</span>
                </div>
                <div class="skill-track">
                  <i :style="{ width: `${Number(item.level) || 0}%` }"></i>
                </div>
                <p v-if="item.description" class="skill-desc">{{ item.description }}</p>
              </div>
            </div>
          </section>

          <section v-else-if="section.type === 'certifications'" class="resume-section">
            <h2>{{ section.title }}</h2>
            <div class="simple-list">
              <div v-for="item in filledItems(section.items)" :key="item.id" class="simple-item">
                <strong>{{ item.name }}</strong>
                <span>{{ joinText([item.issuer, item.level, item.date], ' / ') }}</span>
              </div>
            </div>
          </section>

          <section v-else class="resume-section">
            <h2>{{ section.title }}</h2>
            <div class="timeline">
              <article v-for="item in filledItems(section.items)" :key="item.id" class="timeline-item">
                <div class="item-top">
                  <div>
                    <h3>{{ getItemTitle(section.type, item) }}</h3>
                    <p>{{ getItemSubtitle(section.type, item) }}</p>
                  </div>
                  <span>{{ item.period || item.date }}</span>
                </div>
                <p v-if="item.description" class="description">{{ item.description }}</p>
                <p v-if="item.courses" class="description"><strong>主修内容：</strong>{{ item.courses }}</p>
                <p v-if="item.responsibility" class="description"><strong>个人职责：</strong>{{ item.responsibility }}</p>
                <p v-if="item.result" class="description strong">{{ item.result }}</p>
                <p v-if="item.highlights" class="description strong">{{ item.highlights }}</p>
                <a v-if="item.link" class="item-link" :href="item.link" target="_blank" rel="noreferrer">{{ item.link }}</a>
              </article>
            </div>
          </section>
        </template>
      </article>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { createDefaultTheme, templateCatalog } from '@/data/resumeBuilder'

const props = defineProps({
  resume: {
    type: Object,
    required: true
  },
  scale: {
    type: Number,
    default: 1
  }
})

const paperWidth = 794
const paperHeight = 1123

const activeTemplate = computed(() => {
  return templateCatalog.find(item => item.id === props.resume.templateId) || templateCatalog[0]
})

const themeSettings = computed(() => ({
  ...createDefaultTheme(props.resume.templateId),
  ...(props.resume.theme || {})
}))

const accentColor = computed(() => themeSettings.value.accent || activeTemplate.value.accent)
const fontFamily = computed(() => {
  if (themeSettings.value.fontFamily === 'serif') return 'Georgia, "Times New Roman", serif'
  if (themeSettings.value.fontFamily === 'mono') return '"SFMono-Regular", Consolas, "Liberation Mono", monospace'
  if (themeSettings.value.fontFamily === 'misans') return 'MiSans, Inter, "PingFang SC", "Microsoft YaHei", Arial, sans-serif'
  return 'Inter, "PingFang SC", "Microsoft YaHei", Arial, sans-serif'
})

const previewStyle = computed(() => ({
  '--accent': accentColor.value,
  '--font-family': fontFamily.value,
  '--resume-line-height': themeSettings.value.lineHeight,
  '--resume-base-size': `${themeSettings.value.baseFontSize}px`,
  '--resume-section-title-size': `${themeSettings.value.sectionTitleSize}px`,
  '--resume-item-title-size': `${themeSettings.value.itemTitleSize}px`,
  '--resume-page-padding-x': `${themeSettings.value.pagePaddingX}px`,
  '--resume-page-padding-y': `${themeSettings.value.pagePaddingY}px`,
  '--resume-section-gap': `${themeSettings.value.sectionGap}px`,
  '--resume-item-gap': `${themeSettings.value.itemGap}px`,
  '--resume-paragraph-gap': `${themeSettings.value.paragraphGap}px`
}))

const contactIconPaths = {
  email: 'M3 5h18v14H3V5Zm2 2v.35l7 4.37 7-4.37V7H5Zm14 10V9.7l-7 4.36L5 9.7V17h14Z',
  phone: 'M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.28-.28.67-.36 1.02-.25 1.12.37 2.32.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.61 21 3 13.39 3 4c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2Z',
  location: 'M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z',
  link: 'M3.9 12a5 5 0 0 1 5-5h4v2h-4a3 3 0 0 0 0 6h4v2h-4a5 5 0 0 1-5-5Zm6.1 1v-2h4v2h-4Zm1-6h4a5 5 0 0 1 0 10h-4v-2h4a3 3 0 0 0 0-6h-4V7Z',
  user: 'M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z'
}

const contactItems = computed(() => {
  const basics = props.resume.basics || {}
  return [
    { key: 'email', icon: 'email', value: basics.email },
    { key: 'phone', icon: 'phone', value: basics.phone },
    { key: 'city', icon: 'location', value: basics.city },
    { key: 'address', icon: 'location', value: basics.address },
    { key: 'website', icon: 'link', value: basics.website },
    { key: 'github', icon: 'link', value: basics.github }
  ].filter(item => item.value)
})

const visibleSections = computed(() => {
  return (props.resume.sections || []).filter(section => section.visible !== false && hasSectionContent(section))
})

const hasSectionContent = (section) => {
  if (section.type === 'summary' || section.type === 'custom') {
    return !!section.content
  }
  return filledItems(section.items).length > 0
}

const filledItems = (items = []) => {
  return items.filter(item => {
    return Object.entries(item).some(([key, value]) => key !== 'id' && value !== '' && value !== null && value !== undefined)
  })
}

const joinText = (parts, separator = ' / ') => parts.filter(Boolean).join(separator)

const getItemTitle = (type, item) => {
  const map = {
    education: item.school,
    experience: item.company,
    projects: item.name,
    awards: item.name,
    campus: item.organization
  }
  return map[type] || item.title || item.name
}

const getItemSubtitle = (type, item) => {
  const map = {
    education: joinText([item.major, item.degree]),
    experience: item.role,
    projects: joinText([item.role, item.stack]),
    awards: item.level,
    campus: item.role
  }
  return map[type] || item.description || ''
}
</script>

<style scoped lang="scss">
.resume-stage {
  position: relative;
}

.resume-canvas {
  transform-origin: top left;
}

.resume-paper {
  width: 794px;
  min-height: 1123px;
  padding: var(--resume-page-padding-y) var(--resume-page-padding-x);
  background: #fff;
  color: #1f2937;
  box-shadow: 0 12px 40px rgba(15, 23, 42, 0.16);
  font-family: var(--font-family);
  font-size: var(--resume-base-size);
  line-height: var(--resume-line-height);
  box-sizing: border-box;
}

.resume-header {
  display: grid;
  grid-template-columns: minmax(290px, 0.94fr) minmax(330px, 1.06fr);
  align-items: center;
  gap: 22px;
  padding-bottom: 26px;
  border-bottom: 3px solid var(--accent);
}

.identity {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 18px;

  > div:last-child {
    min-width: 0;
  }

  h1 {
    margin: 0;
    color: #111827;
    font-size: 34px;
    line-height: 1.1;
    font-weight: 850;
    letter-spacing: 0;
  }

  p {
    margin-top: 8px;
    color: var(--accent);
    font-size: 16px;
    font-weight: 800;
  }
}

.avatar {
  width: 78px;
  height: 78px;
  min-width: 78px;
  max-width: 78px;
  flex: 0 0 78px;
  aspect-ratio: 1 / 1;
  position: relative;
  display: block;
  overflow: hidden;
  border-radius: 50%;
  border: 3px solid rgba(0, 0, 0, 0.08);
  clip-path: circle(50% at 50% 50%);
  background: #f8fafc;

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    max-width: none;
    max-height: none;
    display: block;
    object-fit: cover;
    object-position: center center;
    border-radius: 50%;
  }
}

.contacts {
  width: 100%;
  max-width: 370px;
  min-width: 0;
  justify-self: end;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 7px 14px;
  align-items: start;
  color: #4b5563;
  font-size: 11.5px;
}

.contact-item {
  min-width: 0;
  display: grid;
  grid-template-columns: 13px minmax(0, 1fr);
  align-items: start;
  gap: 5px;
  color: #1f2937;
  line-height: 1.32;
  overflow: visible;

  svg {
    flex: 0 0 13px;
    width: 13px;
    height: 13px;
    margin-top: 1px;
    color: #111827;
  }

  b {
    display: block;
    min-width: 0;
    overflow: visible;
    color: #374151;
    font-weight: 520;
    text-overflow: clip;
    white-space: normal;
    overflow-wrap: anywhere;
    word-break: break-word;
  }
}

.header-centered {
  .resume-header {
    grid-template-columns: 1fr;
    justify-items: center;
    text-align: center;
  }

  .identity {
    flex-direction: column;
    gap: 10px;
  }

  .contacts {
    width: min(520px, 100%);
    min-width: 0;
    justify-items: center;
  }

  .contact-item {
    justify-content: center;
  }
}

.header-split {
  .resume-header {
    grid-template-columns: minmax(260px, 1fr) minmax(220px, 0.72fr);
  }

  .contacts {
    min-width: 220px;
    grid-template-columns: 1fr;
    justify-items: end;
  }

  .contact-item {
    max-width: 240px;
    justify-content: flex-end;
  }
}

.resume-section {
  margin-top: var(--resume-section-gap);

  h2 {
    margin: 0 0 14px;
    padding-bottom: 8px;
    border-bottom: 1px solid #e5e7eb;
    color: var(--accent);
    font-size: var(--resume-section-title-size);
    font-weight: 850;
    letter-spacing: 0;
  }
}

.intro-section p,
.paragraph {
  margin: 0;
  color: #374151;
  font-size: 13px;
  white-space: pre-line;
}

.timeline {
  display: grid;
  gap: var(--resume-item-gap);
}

.timeline-item {
  padding-left: 0;
  border-left: none;
}

.item-top {
  display: flex;
  justify-content: space-between;
  gap: 20px;

  h3 {
    margin: 0;
    color: #111827;
    font-size: var(--resume-item-title-size);
    font-weight: 850;
  }

  p {
    margin-top: 4px;
    color: #4b5563;
    font-size: 13px;
  }

  > span {
    flex: 0 0 auto;
    color: #6b7280;
    font-size: 12px;
  }
}

.description {
  margin-top: var(--resume-paragraph-gap);
  color: #374151;
  font-size: 13px;
  white-space: pre-line;

  &.strong {
    color: #111827;
    font-weight: 650;
  }
}

.icon-mode {
  .resume-section h2 {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .resume-section h2::before {
    content: '';
    width: 8px;
    height: 8px;
    flex: 0 0 8px;
    border-radius: 50%;
    background: var(--accent);
  }
}

.center-subtitle {
  .resume-section h2 {
    justify-content: center;
    text-align: center;
  }
}

.compact-title-mode {
  .resume-section h2 {
    margin-bottom: 8px;
    padding-bottom: 6px;
  }

  .item-top p,
  .description {
    margin-top: 4px;
  }
}

.item-link {
  display: inline-block;
  margin-top: 8px;
  color: var(--accent);
  font-size: 12px;
  font-weight: 800;
  word-break: break-all;
  text-decoration: none;
}

.skill-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px 18px;
}

.skill-head {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 6px;

  strong {
    font-size: 13px;
  }

  span {
    color: #6b7280;
    font-size: 12px;
  }
}

.skill-track {
  height: 6px;
  overflow: hidden;
  border-radius: 999px;
  background: #eef2f7;

  i {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: var(--accent);
  }
}

.skill-desc {
  margin: 7px 0 0;
  color: #4b5563;
  font-size: 12px;
  line-height: 1.5;
}

.simple-list {
  display: grid;
  gap: 10px;
}

.simple-item {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 8px;
  border-bottom: 1px dashed #e5e7eb;

  strong {
    font-size: 13px;
  }

  span {
    color: #6b7280;
    font-size: 12px;
  }
}

.template-classic {
  .resume-header {
    margin: calc(var(--resume-page-padding-y) * -1) calc(var(--resume-page-padding-x) * -1) 30px;
    padding: 44px var(--resume-page-padding-x) 34px;
    background: #2f3a4a;
    border-bottom: none;
  }

  .identity h1,
  .identity p,
  .contacts {
    color: #fff;
  }

  .contact-item,
  .contact-item svg,
  .contact-item b {
    color: #fff;
  }

  .resume-section h2 {
    color: #2f3a4a;
    text-transform: uppercase;
  }
}

.template-tech {
  border-top: 10px solid var(--accent);

  .resume-section h2 {
    padding: 8px 10px;
    border-bottom: none;
    border-left: none;
    background: #f8fafc;
  }
}

.template-creative {
  .resume-header {
    border-radius: 18px;
    padding: 28px;
    background: linear-gradient(135deg, var(--accent), #0ea5e9);
    border-bottom: none;
  }

  .identity h1,
  .identity p,
  .contacts {
    color: #fff;
  }

  .contact-item,
  .contact-item svg,
  .contact-item b {
    color: #fff;
  }

  .resume-section h2 {
    border-bottom: 2px solid var(--accent);
  }
}

.template-academic {
  font-family: Georgia, "Times New Roman", serif;

  .resume-header {
    border-bottom: 1px solid #111827;
  }

  .identity p,
  .resume-section h2 {
    color: #111827;
  }
}

.template-minimal {
  padding: calc(var(--resume-page-padding-y) - 10px) calc(var(--resume-page-padding-x) - 8px);

  .resume-header {
    border-bottom: 1px solid #d1d5db;
  }

  .resume-section {
    margin-top: 22px;
  }

  .resume-section h2 {
    color: #111827;
    font-size: 14px;
    border-bottom-style: dashed;
  }

  .skill-list {
    grid-template-columns: repeat(3, 1fr);
  }
}

.density-compact {
  padding-top: 42px;
  padding-bottom: 42px;

  .resume-section {
    margin-top: 20px;
  }

  .timeline {
    gap: 12px;
  }
}
</style>
