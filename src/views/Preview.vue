<template>
  <div class="preview-page">
    <header class="preview-topbar">
      <div>
        <span>Preview</span>
        <strong>{{ resume.title || '简历预览' }}</strong>
      </div>
      <div class="actions">
        <button type="button" @click="router.push('/editor')">返回编辑</button>
        <button type="button" @click="router.push('/templates')">切换模板</button>
        <ThemeToggle class="preview-theme" />
        <button type="button" class="github" @click="openGithub" aria-label="打开 GitHub 主页" title="GitHub">
          <svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true">
            <path fill="currentColor"
              d="M12 2C6.48 2 2 6.58 2 12.26c0 4.53 2.87 8.38 6.84 9.74.5.1.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.38-3.37-1.38-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.56 2.36 1.11 2.94.85.09-.67.35-1.11.63-1.37-2.22-.26-4.55-1.14-4.55-5.05 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.72 0 0 .84-.28 2.75 1.05A9.3 9.3 0 0112 6.99c.85 0 1.7.12 2.5.34 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.46.1 2.72.64.72 1.03 1.63 1.03 2.75 0 3.92-2.34 4.78-4.57 5.04.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.15 10.15 0 0022 12.26C22 6.58 17.52 2 12 2z" />
          </svg>
        </button>
        <button type="button" class="primary" @click="exportPdf">导出 PDF</button>
      </div>
    </header>

    <main class="preview-stage">
      <ResumePreview :resume="resume" :scale="previewScale" />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import ResumePreview from '@/components/ResumePreview.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { GITHUB_URL, loadCurrentResume } from '@/data/resumeBuilder'
import { exportResumePaperToPdf } from '@/utils/pdfExport'

const router = useRouter()
const resume = ref(loadCurrentResume())
const previewScale = ref(0.92)

const openGithub = () => {
  window.open(GITHUB_URL, '_blank', 'noopener,noreferrer')
}

const exportPdf = async () => {
  try {
    ElMessage.info('正在生成 PDF...')
    const { default: html2canvas } = await import('html2canvas')
    const { default: jsPDF } = await import('jspdf')
    const paper = document.querySelector('.preview-stage .resume-paper')
    if (!paper) {
      ElMessage.error('未找到预览内容')
      return
    }
    await exportResumePaperToPdf({
      paper,
      html2canvas,
      jsPDF,
      filename: `${resume.value.basics.name || resume.value.title || 'resume'}.pdf`
    })
    ElMessage.success('PDF 已导出')
  } catch (error) {
    ElMessage.error('PDF 导出失败')
  }
}
</script>

<style scoped lang="scss">
.preview-page {
  min-height: 100vh;
  padding: 14px;
  background:
    radial-gradient(circle at 14% 0%, rgba(37, 99, 235, 0.13), transparent 28%),
    linear-gradient(135deg, #f8fbff, #edf3fb);
}

.preview-topbar {
  position: sticky;
  top: 14px;
  z-index: 20;
  min-height: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 14px;
  padding: 12px 18px;
  border: 1px solid rgba(255, 255, 255, 0.76);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 18px 54px rgba(43, 73, 124, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(22px) saturate(150%);

  span,
  strong {
    display: block;
  }

  span {
    color: #667085;
    font-size: 12px;
    font-weight: 900;
    text-transform: uppercase;
  }

  strong {
    margin-top: 3px;
    color: #111827;
    font-size: 16px;
  }

  > div:first-child {
    min-width: 0;
  }
}

.actions {
  min-width: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;

  button {
    max-width: 100%;
    min-height: 36px;
    padding: 0 14px;
    border: 1px solid #e5e7eb;
    border-radius: 999px;
    background: #fff;
    color: #111827;
    font-weight: 800;
    cursor: pointer;
    white-space: normal;
    text-align: center;

    &.primary {
      border-color: #111827;
      background: #111827;
      color: #fff;
    }

    &.github,
    &.preview-theme {
      width: 38px;
      min-width: 38px;
      height: 38px;
      padding: 0;
      background: rgba(255, 255, 255, 0.72);
      box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
    }
  }
}

.preview-stage {
  min-height: calc(100vh - 92px);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 34px 20px 56px;
  overflow: auto;
}

@media (max-width: 760px) {
  .preview-topbar {
    align-items: flex-start;
    flex-direction: column;
  }

  .actions {
    justify-content: flex-start;
  }

  .preview-stage {
    justify-content: flex-start;
  }
}
</style>
