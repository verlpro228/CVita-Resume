<template>
  <div class="template-preview-card" :class="template.id">
    <!-- 简历缩略图预览 -->
    <div class="resume-thumbnail">
      <!-- 头部区域 -->
      <div class="thumbnail-header" :style="headerStyle">
        <div class="header-name">简历示例</div>
        <div class="header-title">目标岗位</div>
      </div>
      
      <!-- 内容区域 -->
      <div class="thumbnail-body">
        <!-- 左侧栏 -->
        <div class="body-left" v-if="hasSidebar">
          <div class="section-block">
            <div class="section-title" :style="{ color: accentColor }">联系</div>
            <div class="section-line short"></div>
            <div class="section-line"></div>
          </div>
          <div class="section-block">
            <div class="section-title" :style="{ color: accentColor }">技能</div>
            <div class="skill-tags">
              <span class="skill-tag" v-for="i in 4" :key="i"></span>
            </div>
          </div>
        </div>
        
        <!-- 主内容区 -->
        <div class="body-main" :class="{ 'full-width': !hasSidebar }">
          <div class="section-block">
            <div class="section-title" :style="sectionTitleStyle">工作经验</div>
            <div class="content-block">
              <div class="content-line title"></div>
              <div class="content-line"></div>
              <div class="content-line short"></div>
            </div>
          </div>
          <div class="section-block">
            <div class="section-title" :style="sectionTitleStyle">教育背景</div>
            <div class="content-block">
              <div class="content-line title"></div>
              <div class="content-line short"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 悬停遮罩 -->
    <div class="preview-overlay">
      <span class="preview-cta">立即使用</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  template: {
    type: Object,
    required: true
  }
})

const headerStyle = computed(() => {
  const { header } = props.template
  const style = {}
  
  if (header.gradient) {
    style.background = header.background
  } else {
    style.backgroundColor = header.background
  }
  
  style.color = header.textColor
  
  return style
})

const accentColor = computed(() => {
  return props.template.header.accentColor || props.template.section.titleColor
})

const sectionTitleStyle = computed(() => {
  const { section } = props.template
  return {
    color: section.titleColor,
    borderColor: section.titleBorderColor
  }
})

const hasSidebar = computed(() => {
  // 某些模板有侧边栏设计
  return ['tech', 'creative', 'classic'].includes(props.template.id)
})
</script>

<style scoped lang="scss">
.template-preview-card {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
    
    .preview-overlay {
      opacity: 1;
    }
  }
}

.resume-thumbnail {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  font-size: 8px;
  transform-origin: top left;
}

// 头部样式
.thumbnail-header {
  padding: 12px 10px;
  text-align: center;
  
  .header-name {
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 3px;
    letter-spacing: 0.5px;
  }
  
  .header-title {
    font-size: 8px;
    opacity: 0.9;
  }
}

// 身体区域
.thumbnail-body {
  flex: 1;
  display: flex;
  padding: 8px;
  gap: 6px;
  background: #fafafa;
}

.body-left {
  width: 35%;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.body-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  
  &.full-width {
    width: 100%;
  }
}

// 区块样式
.section-block {
  background: #fff;
  border-radius: 4px;
  padding: 6px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

.section-title {
  font-size: 7px;
  font-weight: 700;
  margin-bottom: 4px;
  padding-bottom: 2px;
  border-bottom: 1px solid currentColor;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.section-line {
  height: 3px;
  background: #e0e0e0;
  border-radius: 1px;
  margin-bottom: 2px;
  
  &.short {
    width: 60%;
  }
}

// 内容块
.content-block {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.content-line {
  height: 3px;
  background: #e8e8e8;
  border-radius: 1px;
  
  &.title {
    width: 70%;
    background: #d0d0d0;
  }
  
  &.short {
    width: 50%;
  }
}

// 技能标签
.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
}

.skill-tag {
  width: 14px;
  height: 6px;
  background: #e0e0e0;
  border-radius: 1px;
}

// 遮罩层
.preview-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  backdrop-filter: blur(2px);
}

.preview-cta {
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  padding: 6px 14px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

// ========== 各模板特定样式 ==========

// 现代简约
.modern {
  .thumbnail-header {
    border-bottom: 2px solid #333;
  }
  
  .section-title {
    border-bottom-width: 2px;
  }
}

// 经典商务
.classic {
  .thumbnail-body {
    flex-direction: row-reverse;
  }
  
  .body-left {
    background: #f5f5f5;
    border-radius: 3px;
    padding: 6px 4px;
  }
  
  .section-title {
    border-bottom: none;
    font-weight: 600;
  }
}

// 技术专业
.tech {
  .thumbnail-header {
    text-align: left;
    padding: 10px;
  }
  
  .thumbnail-body {
    background: #fff;
  }
  
  .body-left {
    background: #f8f9fa;
    border-right: 2px solid #3498db;
  }
  
  .section-title {
    border-bottom: none;
    position: relative;
    padding-left: 0;
  }
}

// 创意设计
.creative {
  .thumbnail-header {
    text-align: left;
    padding: 12px;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      width: 30px;
      height: 30px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
    }
  }
  
  .thumbnail-body {
    background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
  }
  
  .section-block {
    border-left: none;
  }
}

// 时尚活力
.fashion {
  .thumbnail-header {
    position: relative;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      right: -10px;
      top: -10px;
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
    }
  }
  
  .section-title {
    border-bottom: none;
    text-decoration: underline;
    text-decoration-color: currentColor;
    text-underline-offset: 3px;
  }
}

// 学术风格
.academic {
  .thumbnail-header {
    border-bottom: 1px solid #ddd;
  }
  
  .section-title {
    font-family: serif;
    border-bottom: 1px solid #999;
    font-weight: 600;
  }
}

// 极简主义
.minimal {
  .thumbnail-header {
    padding: 15px 10px;
  }
  
  .thumbnail-body {
    background: #fff;
  }
  
  .section-title {
    border-bottom: none;
    font-size: 8px;
    letter-spacing: 1px;
    color: #999 !important;
  }
  
  .section-block {
    box-shadow: none;
    border-bottom: 1px solid #f0f0f0;
    border-radius: 0;
  }
}

// 经典简约
.elegant {
  .thumbnail-header {
    text-align: left;
    border-bottom: 1px solid #e0e0e0;
    padding: 12px 15px;
    
    .header-name {
      font-size: 16px;
      font-weight: 400;
      letter-spacing: 1px;
    }
  }
  
  .section-title {
    border-bottom: none;
    font-weight: 500;
    color: #666 !important;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 20px;
      height: 1px;
      background: currentColor;
    }
  }
}
</style>
