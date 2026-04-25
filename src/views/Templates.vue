<template>
  <div class="templates-page">
    <section class="templates-hero">
      <span class="reveal-page">Template Center</span>
      <h1 class="reveal-page">选择模板，然后专注写好内容</h1>
      <p class="reveal-page">模板只负责表达方式，简历数据始终保持统一。你可以在编辑器中随时切换模板并实时查看效果。</p>
    </section>

    <section class="template-workspace">
      <div class="filter-row reveal-page">
        <button
          v-for="category in templateCategories"
          :key="category"
          type="button"
          :class="{ active: activeCategory === category }"
          @click="activeCategory = category"
        >
          {{ category }}
        </button>
      </div>

      <div class="template-grid">
        <article
          v-for="template in filteredTemplates"
          :key="template.id"
          class="template-card glass-card"
          @mouseenter="liftCard"
          @mouseleave="resetCard"
        >
          <div class="preview-wrap">
            <TemplatePreview :template="templateAdapter(template)" />
          </div>
          <div class="template-info">
            <div>
              <span>{{ template.category }}</span>
              <h3>{{ template.name }}</h3>
              <p>{{ template.description }}</p>
            </div>
            <div class="tag-list">
              <span v-for="tag in template.tags" :key="tag">{{ tag }}</span>
            </div>
            <div class="template-actions">
              <button type="button" @click="previewTemplate(template.id)">预览效果</button>
              <button type="button" class="primary" @click="useTemplate(template.id)">使用模板</button>
            </div>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'
import TemplatePreview from '@/components/TemplatePreview.vue'
import { loadCurrentResume, saveCurrentResume, templateCatalog, templateCategories } from '@/data/resumeBuilder'
import { getTemplate } from '@/utils/templates'

const router = useRouter()
const activeCategory = ref('全部')

const filteredTemplates = computed(() => {
  if (activeCategory.value === '全部') return templateCatalog
  return templateCatalog.filter(template => template.category === activeCategory.value)
})

const templateAdapter = (template) => getTemplate(template.id)

const useTemplate = (templateId) => {
  const resume = loadCurrentResume()
  resume.templateId = templateId
  resume.theme.accent = templateCatalog.find(item => item.id === templateId)?.accent || resume.theme.accent
  saveCurrentResume(resume)
  router.push({ path: '/editor', query: { template: templateId } })
}

const previewTemplate = (templateId) => {
  useTemplate(templateId)
}

const liftCard = (event) => {
  gsap.to(event.currentTarget, { y: -8, scale: 1.012, duration: 0.24, ease: 'power2.out' })
}

const resetCard = (event) => {
  gsap.to(event.currentTarget, { y: 0, scale: 1, duration: 0.24, ease: 'power2.out' })
}

onMounted(async () => {
  await nextTick()
  gsap.from('.reveal-page', {
    y: 20,
    opacity: 0,
    duration: 0.58,
    stagger: 0.08,
    ease: 'power3.out'
  })
  gsap.from('.template-card', {
    y: 28,
    opacity: 0,
    duration: 0.58,
    stagger: 0.06,
    ease: 'power2.out',
    delay: 0.12
  })
})
</script>

<style scoped lang="scss">
.templates-page {
  width: 100%;
  min-height: calc(100vh - 92px);
  background:
    radial-gradient(circle at top left, rgba(206, 228, 255, 0.65), transparent 34rem),
    linear-gradient(180deg, #fbfcff 0%, #f2f5fa 100%);
  background-attachment: fixed;
  background-repeat: no-repeat;
  background-size: cover;
  color: #111827;
}

.templates-hero,
.template-workspace {
  width: min(1180px, calc(100% - 40px));
  margin: 0 auto;
}

.templates-hero {
  padding: 72px 0 34px;
  text-align: center;

  span {
    color: #2563eb;
    font-size: 13px;
    font-weight: 900;
    text-transform: uppercase;
  }

  h1 {
    margin: 10px 0;
    font-size: 54px;
    line-height: 1.08;
    letter-spacing: 0;
  }

  p {
    max-width: 720px;
    margin: 0 auto;
    color: #657184;
    line-height: 1.85;
  }
}

.template-workspace {
  padding: 24px 0 82px;
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-bottom: 30px;

  button {
    min-height: 42px;
    padding: 0 18px;
    border: 1px solid rgba(255, 255, 255, 0.76);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.68);
    color: #667085;
    font-weight: 900;
    cursor: pointer;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(18px);

    &.active,
    &:hover {
      color: #2563eb;
      background: rgba(255, 255, 255, 0.9);
      box-shadow: 0 12px 28px rgba(37, 99, 235, 0.12);
    }
  }
}

.template-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
}

.glass-card {
  border: 1px solid rgba(255, 255, 255, 0.76);
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.82), rgba(255, 255, 255, 0.58));
  box-shadow: 0 18px 54px rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(24px) saturate(1.35);
}

.template-card {
  overflow: hidden;
  border-radius: 30px;
}

.preview-wrap {
  height: 270px;
  border-bottom: 1px solid rgba(17, 24, 39, 0.06);

  :deep(.template-preview-card) {
    height: 100%;
    border-radius: 0;
    box-shadow: none;
  }
}

.template-info {
  min-width: 0;
  display: grid;
  gap: 16px;
  padding: 20px;

  > div:first-child span {
    color: #2563eb;
    font-size: 12px;
    font-weight: 900;
  }

  h3 {
    margin: 6px 0 8px;
    font-size: 21px;
  }

  p {
    color: #657184;
    line-height: 1.7;
    font-size: 14px;
  }

  > div:first-child {
    min-width: 0;
  }
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  span {
    padding: 6px 10px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.72);
    color: #526071;
    font-size: 12px;
    font-weight: 800;
  }
}

.template-actions {
  min-width: 0;
  display: flex;
  gap: 10px;

  button {
    min-width: 0;
    min-height: 42px;
    flex: 1;
    border: 1px solid rgba(17, 24, 39, 0.08);
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.74);
    color: #111827;
    font-weight: 900;
    cursor: pointer;
    white-space: normal;
    text-align: center;

    &.primary {
      border: none;
      background: #111827;
      color: #fff;
      box-shadow: 0 14px 28px rgba(17, 24, 39, 0.16);
    }
  }
}

@media (max-width: 1040px) {
  .template-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 700px) {
  .templates-hero h1 {
    font-size: 34px;
  }

  .template-grid {
    grid-template-columns: 1fr;
  }

  .template-actions {
    flex-direction: column;
  }
}
</style>
