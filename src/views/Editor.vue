<template>
  <div class="editor-page">
    <header ref="topbarRef" class="editor-topbar">
      <button class="brand-button" type="button" @click="router.push('/')">
        <img src="/cvita-creative-icon-dark.svg" alt="CVita" />
        <span>CVita</span>
      </button>
      <label class="title-input">
        <span>简历名称</span>
        <input v-model.trim="resume.title" maxlength="28" placeholder="未命名简历" />
      </label>
      <div class="save-chip" :class="{ saving: saveState === '保存中' }"><i></i>{{ saveState }}</div>
      <div class="template-picker" @click.stop>
        <button
          type="button"
          class="template-trigger"
          :class="{ open: templateMenuOpen }"
          aria-haspopup="listbox"
          :aria-expanded="templateMenuOpen"
          @click="toggleTemplateMenu"
        >
          <span>{{ activeTemplate.name }}</span>
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path fill="currentColor" d="M7.4 8.6 12 13.2l4.6-4.6L18 10l-6 6-6-6 1.4-1.4z" />
          </svg>
        </button>
        <div v-if="templateMenuOpen" ref="templateMenuRef" class="template-menu" role="listbox">
          <button
            v-for="template in templateCatalog"
            :key="template.id"
            type="button"
            class="template-option"
            :class="{ active: resume.templateId === template.id }"
            role="option"
            :aria-selected="resume.templateId === template.id"
            @click="chooseTemplate(template.id)"
          >
            <span>{{ template.name }}</span>
          </button>
        </div>
      </div>
      <div class="toolbar-actions">
        <button type="button" @click="router.push('/')">首页</button>
        <ThemeToggle class="theme-action" />
        <button type="button" class="github-action" @click="openGithub" aria-label="打开 GitHub 主页" title="GitHub">
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path fill="currentColor" d="M12 2C6.48 2 2 6.58 2 12.26c0 4.53 2.87 8.38 6.84 9.74.5.1.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.38-3.37-1.38-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.56 2.36 1.11 2.94.85.09-.67.35-1.11.63-1.37-2.22-.26-4.55-1.14-4.55-5.05 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.72 0 0 .84-.28 2.75 1.05A9.3 9.3 0 0112 6.99c.85 0 1.7.12 2.5.34 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.46.1 2.72.64.72 1.03 1.63 1.03 2.75 0 3.92-2.34 4.78-4.57 5.04.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.15 10.15 0 0022 12.26C22 6.58 17.52 2 12 2z" />
          </svg>
        </button>
        <button type="button" @click="router.push('/templates')">模板中心</button>
        <button type="button" @click="previewPage">全屏预览</button>
        <button type="button" @click="fileInput?.click()">导入 JSON</button>
        <div class="export-picker" @click.stop>
          <button
            type="button"
            class="export-trigger primary"
            :class="{ open: exportMenuOpen }"
            :disabled="isExporting"
            aria-haspopup="menu"
            :aria-expanded="exportMenuOpen"
            @click="toggleExportMenu"
          >
            <span>{{ isExporting ? '导出中' : '导出' }}</span>
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
              <path fill="currentColor" d="M7.4 8.6 12 13.2l4.6-4.6L18 10l-6 6-6-6 1.4-1.4z" />
            </svg>
          </button>
          <div v-if="exportMenuOpen" ref="exportMenuRef" class="export-menu" role="menu">
            <button type="button" class="export-option" role="menuitem" :disabled="isExporting" @click="runExport('pdf')">导出 PDF</button>
            <button type="button" class="export-option" role="menuitem" @click="runExport('json')">导出 JSON</button>
          </div>
        </div>
      </div>
      <input ref="fileInput" class="file-input" type="file" accept="application/json" @change="importJson" />
    </header>

    <div class="mobile-tabs">
      <button :class="{ active: mobileMode === 'edit' }" type="button" @click="mobileMode = 'edit'">编辑</button>
      <button :class="{ active: mobileMode === 'preview' }" type="button" @click="mobileMode = 'preview'">预览</button>
    </div>

    <main ref="shellRef" class="editor-shell" :class="`mobile-${mobileMode}`" :style="editorLayoutStyle">
      <aside ref="moduleRef" class="module-rail">
        <div class="rail-head"><span>模块导航</span><strong>{{ resume.sections.length + 2 }}</strong></div>
        <button class="module-main" :class="{ active: activePanel === 'basics' }" type="button" @click="selectPanel('basics')"><span>人</span><b>基本信息</b></button>
        <button class="module-main" :class="{ active: activePanel === 'theme' }" type="button" @click="selectPanel('theme')"><span>模</span><b>模板设置</b></button>
        <div class="module-list">
          <div
            v-for="(section, index) in resume.sections"
            :key="section.id"
            class="module-item"
            :class="{
              active: activePanel === section.id,
              muted: section.visible === false,
              dragging: sectionDragIndex === index,
              'drop-target': sectionDropIndex === index && sectionDragIndex !== index
            }"
            draggable="true"
            @dragstart="startSectionDrag($event, index)"
            @dragenter.prevent="enterSectionDrop(index)"
            @dragover.prevent
            @drop="dropSection(index)"
            @dragend="endSectionDrag"
          >
            <div class="module-row">
              <button type="button" class="module-name" @click="selectPanel(section.id)"><span>{{ moduleIconMap[section.type] || '□' }}</span><b>{{ section.title }}</b></button>
              <span class="drag-handle" title="拖动排序" aria-hidden="true">
                <svg viewBox="0 0 18 18" width="18" height="18">
                  <circle cx="6" cy="4" r="1.25" fill="currentColor" />
                  <circle cx="12" cy="4" r="1.25" fill="currentColor" />
                  <circle cx="6" cy="9" r="1.25" fill="currentColor" />
                  <circle cx="12" cy="9" r="1.25" fill="currentColor" />
                  <circle cx="6" cy="14" r="1.25" fill="currentColor" />
                  <circle cx="12" cy="14" r="1.25" fill="currentColor" />
                </svg>
              </span>
            </div>
            <div class="module-tools">
              <button type="button" @click.stop="toggleSection(section)">{{ section.visible === false ? '显' : '隐' }}</button>
              <button type="button" :disabled="index === 0" @click.stop="moveSection(index, -1)">↑</button>
              <button type="button" :disabled="index === resume.sections.length - 1" @click.stop="moveSection(index, 1)">↓</button>
              <button type="button" @click.stop="deleteSection(section)">×</button>
            </div>
          </div>
        </div>
        <div class="add-section">
          <select v-model="sectionToAdd">
            <option v-for="definition in sectionDefinitions" :key="definition.type" :value="definition.type">{{ definition.title }}</option>
          </select>
          <button type="button" @click="addSection(sectionToAdd)">添加模块</button>
        </div>
        <div class="danger-zone">
          <button type="button" @click="createNewResume">新建空白</button>
          <button type="button" @click="restoreDemo">恢复示例</button>
        </div>
        <div class="design-panel">
          <section class="rail-card layout-card">
            <div class="rail-card-head">
              <span>布局宽度</span>
              <button type="button" @click="resetEditorLayout">重置</button>
            </div>
            <label class="control-field range-field">
              <span>左侧栏 <b>{{ editorLayout.rail }}px</b></span>
              <input v-model.number="editorLayout.rail" type="range" min="260" max="440" step="4" />
            </label>
            <label class="control-field range-field">
              <span>编辑区 <b>{{ editorLayout.form }}px</b></span>
              <input v-model.number="editorLayout.form" type="range" min="420" max="780" step="4" />
            </label>
            <label class="control-field range-field">
              <span>预览区 <b>{{ editorLayout.preview }}px</b></span>
              <input v-model.number="editorLayout.preview" type="range" min="480" max="960" step="4" />
            </label>
          </section>

          <section class="rail-card text-format-card">
            <div class="rail-card-head">
              <span>文字样式</span>
            </div>
            <div class="text-format-actions">
              <button type="button" title="加粗" aria-label="加粗" @mousedown.prevent @click="applyBold">
                <strong>B</strong>
              </button>
              <button type="button" title="斜体" aria-label="斜体" @mousedown.prevent @click="applyItalic">
                <em>I</em>
              </button>
            </div>
          </section>

          <section class="rail-card">
            <div class="rail-card-head">
              <span>主题色</span>
              <button type="button" @click="resetThemeStyle">自定义</button>
            </div>
            <div class="color-grid">
              <button
                v-for="color in colorPresets"
                :key="color"
                type="button"
                class="color-dot"
                :class="{ active: resume.theme.accent === color }"
                :style="{ background: color }"
                @click="applyAccent(color)"
              ></button>
              <label class="color-picker">
                <input v-model="resume.theme.accent" type="color" />
              </label>
            </div>
          </section>

          <section class="rail-card">
            <div class="rail-card-head">
              <span>排版</span>
            </div>
            <label class="control-field">
              <span>字体</span>
              <select v-model="resume.theme.fontFamily">
                <option v-for="font in fontOptions" :key="font.value" :value="font.value">{{ font.label }}</option>
              </select>
            </label>
            <label class="control-field range-field">
              <span>行高 <b>{{ resume.theme.lineHeight }}</b></span>
              <input v-model.number="resume.theme.lineHeight" type="range" min="1.2" max="1.9" step="0.05" />
            </label>
            <label class="control-field range-field">
              <span>全局文字缩放 <b>{{ resume.theme.textScale }}%</b></span>
              <input v-model.number="resume.theme.textScale" type="range" min="80" max="150" step="1" />
            </label>
            <label class="control-field range-field">
              <span>正文字号 <b>{{ resume.theme.baseFontSize }}px</b></span>
              <input v-model.number="resume.theme.baseFontSize" type="range" min="11" max="18" step="1" />
            </label>
            <label class="control-field range-field">
              <span>模块标题字号 <b>{{ resume.theme.sectionTitleSize }}px</b></span>
              <input v-model.number="resume.theme.sectionTitleSize" type="range" min="14" max="24" step="1" />
            </label>
            <label class="control-field range-field">
              <span>一级标题字号 <b>{{ resume.theme.itemTitleSize }}px</b></span>
              <input v-model.number="resume.theme.itemTitleSize" type="range" min="13" max="22" step="1" />
            </label>
            <label class="control-field range-field">
              <span>姓名字号 <b>{{ resume.theme.nameFontSize }}px</b></span>
              <input v-model.number="resume.theme.nameFontSize" type="range" min="26" max="42" step="1" />
            </label>
            <label class="control-field range-field">
              <span>岗位字号 <b>{{ resume.theme.positionFontSize }}px</b></span>
              <input v-model.number="resume.theme.positionFontSize" type="range" min="12" max="24" step="1" />
            </label>
            <label class="control-field range-field">
              <span>联系方式字号 <b>{{ resume.theme.contactFontSize }}px</b></span>
              <input v-model.number="resume.theme.contactFontSize" type="range" min="10" max="18" step="1" />
            </label>
            <label class="control-field range-field">
              <span>辅助信息字号 <b>{{ resume.theme.metaFontSize }}px</b></span>
              <input v-model.number="resume.theme.metaFontSize" type="range" min="10" max="18" step="1" />
            </label>
            <label class="control-field range-field">
              <span>链接字号 <b>{{ resume.theme.linkFontSize }}px</b></span>
              <input v-model.number="resume.theme.linkFontSize" type="range" min="10" max="18" step="1" />
            </label>
          </section>

          <section class="rail-card">
            <div class="rail-card-head">
              <span>间距</span>
            </div>
            <label class="control-field range-field">
              <span>页边距 <b>{{ resume.theme.pagePaddingX }}px</b></span>
              <input v-model.number="resume.theme.pagePaddingX" type="range" min="36" max="80" step="2" @input="resume.theme.pagePaddingY = resume.theme.pagePaddingX" />
            </label>
            <label class="control-field range-field">
              <span>模块间距 <b>{{ resume.theme.sectionGap }}px</b></span>
              <input v-model.number="resume.theme.sectionGap" type="range" min="12" max="38" step="1" />
            </label>
            <label class="control-field range-field">
              <span>段落间距 <b>{{ resume.theme.paragraphGap }}px</b></span>
              <input v-model.number="resume.theme.paragraphGap" type="range" min="4" max="16" step="1" />
            </label>
          </section>

          <section class="rail-card">
            <div class="rail-card-head">
              <span>模式</span>
            </div>
            <label class="toggle-line">
              <span>图标模式</span>
              <input v-model="resume.theme.iconMode" type="checkbox" />
              <i></i>
            </label>
            <label class="toggle-line">
              <span>副标题居中</span>
              <input v-model="resume.theme.centeredSubtitle" type="checkbox" />
              <i></i>
            </label>
            <label class="toggle-line">
              <span>长标题模式</span>
              <input v-model="resume.theme.compactTitle" type="checkbox" />
              <i></i>
            </label>
          </section>
        </div>
      </aside>

      <button class="column-resizer" type="button" aria-label="调整左侧栏宽度" @pointerdown="startColumnResize('rail', $event)">
        <span></span>
      </button>

      <section ref="formRef" class="form-panel" @focusin="rememberTextTarget" @mouseup="rememberTextTarget" @keyup="rememberTextTarget">
        <div class="panel-title">
          <div><span>Resume Editor</span><h1>{{ currentPanelTitle }}</h1></div>
          <button v-if="activePanel === 'basics'" type="button" class="ai-mini" @click="openAi('basicSummary')">AI 润色简介</button>
          <button v-else-if="selectedSection?.type === 'summary' || selectedSection?.type === 'custom' || selectedSection?.type === 'skills'" type="button" class="ai-mini" @click="openAi('sectionContent', selectedSection)">AI 优化内容</button>
        </div>

        <div v-if="activePanel === 'basics'" class="form-card">
          <div class="profile-layout-panel">
            <h2>布局</h2>
            <div class="profile-layout-options">
              <button
                v-for="layout in profileLayoutOptions"
                :key="layout.value"
                type="button"
                :class="{ active: resume.theme.headerLayout === layout.value }"
                :title="layout.label"
                @click="resume.theme.headerLayout = layout.value"
              >
                <span class="layout-preview" :class="layout.value"><i></i><b></b><em></em></span>
              </button>
            </div>
          </div>
          <div class="profile-data-head">
            <span>资料</span>
            <div>
              <button type="button" @click="resume.theme.headerLayout = 'balanced'" title="恢复默认布局">
                <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><path fill="currentColor" d="M19 8h-2.7a6 6 0 1 0 1.28 6.47l1.8.88A8 8 0 1 1 17 5.35V3h2v5Z" /></svg>
              </button>
              <button type="button" @click="previewPage" title="打开预览">
                <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><path fill="currentColor" d="M12 5c5 0 8.5 4.38 9.7 6.12a1.5 1.5 0 0 1 0 1.76C20.5 14.62 17 19 12 19s-8.5-4.38-9.7-6.12a1.5 1.5 0 0 1 0-1.76C3.5 9.38 7 5 12 5Zm0 2c-3.9 0-6.78 3.24-7.9 5 1.12 1.76 4 5 7.9 5s6.78-3.24 7.9-5C18.78 10.24 15.9 7 12 7Zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z" /></svg>
              </button>
            </div>
          </div>
          <div class="avatar-row profile-data-card">
            <div class="avatar-box"><img v-if="resume.basics.avatar" :src="resume.basics.avatar" alt="avatar" /><span v-else>头像</span></div>
            <label class="upload-button">上传头像<input type="file" accept="image/*" @change="uploadAvatar" /></label>
            <button v-if="resume.basics.avatar" type="button" @click="resume.basics.avatar = ''">移除头像</button>
          </div>
          <div class="field-grid two">
            <label class="field" :class="{ error: !resume.basics.name.trim() }"><span>姓名</span><input v-model.trim="resume.basics.name" placeholder="请输入姓名" /><em v-if="!resume.basics.name.trim()">姓名会影响导出文件名</em></label>
            <label class="field"><span>目标岗位</span><input v-model.trim="resume.basics.position" placeholder="前端开发工程师" /></label>
            <label class="field"><span>手机号</span><input v-model.trim="resume.basics.phone" placeholder="138 0000 0000" /></label>
            <label class="field" :class="{ error: emailError }"><span>邮箱</span><input v-model.trim="resume.basics.email" placeholder="name@example.com" /><em v-if="emailError">请输入有效邮箱</em></label>
            <label class="field"><span>所在城市</span><input v-model.trim="resume.basics.city" placeholder="上海" /></label>
            <label class="field"><span>详细地址</span><input v-model.trim="resume.basics.address" placeholder="城市 / 区域，可选" /></label>
            <label class="field"><span>个人网站</span><input v-model.trim="resume.basics.website" placeholder="https://your-site.com" /></label>
            <label class="field"><span>GitHub</span><input v-model.trim="resume.basics.github" placeholder="https://github.com/yourname" /></label>
          </div>
          <label class="field"><span>个人简介</span><textarea v-model="resume.basics.summary" rows="5" placeholder="用 2-4 句话概括岗位方向、核心能力和项目经验" @input="autoGrow"></textarea></label>
        </div>

        <div v-else-if="activePanel === 'theme'" class="form-card">
          <div class="template-grid">
            <button v-for="template in templateCatalog" :key="template.id" type="button" class="template-choice" :class="{ active: resume.templateId === template.id }" @click="applyTemplate(template.id)">
              <span :style="{ background: template.accent }"></span><strong>{{ template.name }}</strong><small>{{ template.description }}</small>
            </button>
          </div>
          <div class="field-grid two">
            <label class="field"><span>主题色</span><input v-model="resume.theme.accent" type="color" /></label>
            <label class="field"><span>内容密度</span><select v-model="resume.theme.density"><option value="comfortable">舒展</option><option value="compact">紧凑</option></select></label>
            <label class="field"><span>字体风格</span><select v-model="resume.theme.fontFamily"><option value="system">系统无衬线</option><option value="serif">衬线正式</option></select></label>
          </div>
        </div>

        <div v-else-if="selectedSection" class="form-card section-editor">
          <div class="section-meta">
            <label class="field"><span>模块标题</span><input v-model.trim="selectedSection.title" /></label>
            <label class="switch-row"><input v-model="selectedSection.visible" type="checkbox" /><span>在预览中显示</span></label>
          </div>

          <template v-if="selectedSection.type === 'summary' || selectedSection.type === 'custom' || selectedSection.type === 'skills'">
            <label class="field">
              <span>{{ selectedSection.type === 'skills' ? '技能描述' : '模块内容' }}</span>
              <textarea
                v-model="selectedSection.content"
                :rows="selectedSection.type === 'skills' ? 8 : 9"
                :placeholder="selectedSection.type === 'skills' ? '请输入技能特长描述，例如掌握的技术、能力方向和实践经验' : '请输入模块内容，支持多行文本'"
                @input="autoGrow"
              ></textarea>
            </label>
          </template>

          <template v-else>
            <div v-if="!selectedSection.items.length" class="empty-box">
              <strong>当前模块还没有内容</strong><p>添加第一条记录后，右侧预览会立即同步。</p><button type="button" @click="addItem(selectedSection)">添加一条</button>
            </div>

            <article
              v-for="(item, index) in selectedSection.items"
              :key="item.id"
              class="item-card"
              draggable="true"
              @dragstart="startItemDrag(selectedSection.id, index)"
              @dragover.prevent
              @drop="dropItem(selectedSection, index)"
            >
              <div class="item-head">
                <strong>{{ selectedSection.title }} {{ index + 1 }}</strong>
                <div>
                  <button type="button" :disabled="index === 0" @click="moveItem(selectedSection, index, -1)">↑</button>
                  <button type="button" :disabled="index === selectedSection.items.length - 1" @click="moveItem(selectedSection, index, 1)">↓</button>
                  <button type="button" @click="deleteItem(selectedSection, index)">删除</button>
                </div>
              </div>

              <div v-if="selectedSection.type === 'education'" class="field-grid two">
                <label class="field"><span>学校</span><input v-model.trim="item.school" placeholder="学校名称" /></label>
                <label class="field"><span>专业</span><input v-model.trim="item.major" placeholder="专业名称" /></label>
                <label class="field"><span>学历</span><input v-model.trim="item.degree" placeholder="本科 / 硕士" /></label>
                <label class="field"><span>起止时间</span><input v-model.trim="item.period" placeholder="2022.09 - 2026.06" /></label>
                <label class="field full"><span>主修内容</span><input v-model.trim="item.courses" placeholder="数据结构、计算机网络、软件工程" /></label>
                <label class="field full"><span>描述</span><textarea v-model="item.description" rows="4" @input="autoGrow"></textarea></label>
              </div>

              <div v-else-if="selectedSection.type === 'experience'" class="field-grid two">
                <label class="field"><span>公司</span><input v-model.trim="item.company" placeholder="公司名称" /></label>
                <label class="field"><span>职位</span><input v-model.trim="item.role" placeholder="前端开发实习生" /></label>
                <label class="field full"><span>起止时间</span><input v-model.trim="item.period" placeholder="2025.06 - 2025.09" /></label>
                <label class="field full"><span>工作内容</span><textarea v-model="item.description" rows="4" @input="autoGrow"></textarea></label>
                <label class="field full"><span>成果描述</span><textarea v-model="item.result" rows="3" @input="autoGrow"></textarea></label>
                <label class="field full"><span>亮点说明</span><textarea v-model="item.highlights" rows="3" @input="autoGrow"></textarea></label>
                <button type="button" class="ai-inline" @click="openAi('workResult', selectedSection, item)">AI 优化工作表述</button>
              </div>

              <div v-else-if="selectedSection.type === 'projects'" class="field-grid two">
                <label class="field"><span>项目名称</span><input v-model.trim="item.name" placeholder="项目名称" /></label>
                <label class="field"><span>项目角色</span><input v-model.trim="item.role" placeholder="前端负责人" /></label>
                <label class="field"><span>技术栈</span><input v-model.trim="item.stack" placeholder="Vue 3 / Vite / Element Plus" /></label>
                <label class="field"><span>起止时间</span><input v-model.trim="item.period" placeholder="2026.03 - 2026.04" /></label>
                <label class="field full"><span>项目链接</span><input v-model.trim="item.link" placeholder="https://..." /></label>
                <label class="field full"><span>项目描述</span><textarea v-model="item.description" rows="4" @input="autoGrow"></textarea></label>
                <label class="field full"><span>个人职责</span><textarea v-model="item.responsibility" rows="3" @input="autoGrow"></textarea></label>
                <label class="field full"><span>项目亮点</span><textarea v-model="item.highlights" rows="3" @input="autoGrow"></textarea></label>
                <button type="button" class="ai-inline" @click="openAi('projectHighlight', selectedSection, item)">AI 优化项目亮点</button>
              </div>

              <div v-else-if="selectedSection.type === 'certifications'" class="field-grid two">
                <label class="field"><span>证书名称</span><input v-model.trim="item.name" /></label>
                <label class="field"><span>颁发机构</span><input v-model.trim="item.issuer" /></label>
                <label class="field full"><span>获得时间</span><input v-model.trim="item.date" /></label>
              </div>

              <div v-else-if="selectedSection.type === 'awards'" class="field-grid two">
                <label class="field"><span>奖项名称</span><input v-model.trim="item.name" /></label>
                <label class="field"><span>级别</span><input v-model.trim="item.level" placeholder="国家级 / 校级" /></label>
                <label class="field full"><span>时间</span><input v-model.trim="item.date" /></label>
                <label class="field full"><span>描述</span><textarea v-model="item.description" rows="3" @input="autoGrow"></textarea></label>
              </div>

              <div v-else-if="selectedSection.type === 'campus'" class="field-grid two">
                <label class="field"><span>组织 / 活动</span><input v-model.trim="item.organization" /></label>
                <label class="field"><span>角色</span><input v-model.trim="item.role" /></label>
                <label class="field full"><span>时间</span><input v-model.trim="item.period" /></label>
                <label class="field full"><span>描述</span><textarea v-model="item.description" rows="3" @input="autoGrow"></textarea></label>
              </div>
            </article>

            <button type="button" class="add-item" @click="addItem(selectedSection)">添加一条{{ selectedSection.title }}</button>
          </template>
        </div>
      </section>

      <button class="column-resizer" type="button" aria-label="调整编辑区和预览区宽度" @pointerdown="startColumnResize('form', $event)">
        <span></span>
      </button>

      <section ref="previewRef" class="preview-panel">
        <div class="preview-toolbar">
          <div><span>实时预览</span><strong>{{ activeTemplate.name }}</strong></div>
          <div class="zoom-control">
            <button type="button" @click="previewScale = Math.max(0.52, Number((previewScale - 0.06).toFixed(2)))">−</button>
            <span>{{ Math.round(previewScale * 100) }}%</span>
            <button type="button" @click="previewScale = Math.min(0.9, Number((previewScale + 0.06).toFixed(2)))">+</button>
          </div>
        </div>
        <div class="preview-scroll">
          <ResumePreview :resume="resume" :scale="previewScale" />
        </div>
      </section>
    </main>

    <el-drawer v-model="aiDrawer" title="AI 智能优化建议" size="420px" append-to-body>
      <div ref="aiRef" class="ai-drawer">
        <div v-if="aiLoading" class="ai-loading">正在分析内容并生成更专业的表达...</div>
        <template v-else>
          <p class="ai-label">建议文案</p>
          <div class="ai-result">{{ aiResult?.suggestion }}</div>
          <p class="ai-hint">{{ aiResult?.reason }}</p>
          <div class="ai-actions">
            <button type="button" @click="applyAiResult('replace')">替换原文</button>
            <button type="button" @click="applyAiResult('append')">插入建议</button>
            <button type="button" @click="aiDrawer = false">取消</button>
          </div>
        </template>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import gsap from 'gsap'
import ResumePreview from '@/components/ResumePreview.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { exportResumePaperToPdf } from '@/utils/pdfExport'
import {
  GITHUB_URL,
  createDefaultTheme,
  createDemoResume,
  createEmptyResume,
  createItemByType,
  createSection,
  getTemplate,
  loadCurrentResume,
  normalizeResume,
  saveCurrentResume,
  sectionDefinitions,
  templateCatalog
} from '@/data/resumeBuilder'

const route = useRoute()
const router = useRouter()

const LAYOUT_STORAGE_KEY = 'cvita_editor_column_layout'
const defaultEditorLayout = () => ({
  rail: 340,
  form: 620,
  preview: 760
})
const clamp = (value, min, max) => Math.min(max, Math.max(min, Number(value) || min))
const loadEditorLayout = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(LAYOUT_STORAGE_KEY) || '{}')
    return {
      rail: clamp(saved.rail ?? 340, 260, 440),
      form: clamp(saved.form ?? 620, 420, 780),
      preview: clamp(saved.preview ?? 760, 480, 960)
    }
  } catch {
    return defaultEditorLayout()
  }
}

const resume = ref(loadCurrentResume())
const activePanel = ref('basics')
const mobileMode = ref('edit')
const previewScale = ref(0.68)
const viewportWidth = ref(typeof window === 'undefined' ? 1440 : window.innerWidth)
const editorLayout = ref(loadEditorLayout())
const saveState = ref('已保存')
const isExporting = ref(false)
const sectionToAdd = ref('education')
const templateMenuOpen = ref(false)
const exportMenuOpen = ref(false)
const fileInput = ref(null)
const shellRef = ref(null)
const topbarRef = ref(null)
const moduleRef = ref(null)
const formRef = ref(null)
const previewRef = ref(null)
const templateMenuRef = ref(null)
const exportMenuRef = ref(null)
const aiRef = ref(null)
const aiDrawer = ref(false)
const aiLoading = ref(false)
const aiResult = ref(null)
const aiTarget = ref(null)
const sectionDragIndex = ref(null)
const sectionDropIndex = ref(null)
const itemDrag = ref({ sectionId: '', index: -1 })

const colorPresets = ['#000000', '#111827', '#2f3a4a', '#475569', '#64748b', '#737373', '#a3a3a3', '#2563eb', '#991b1b', '#f97316', '#6b21a8', '#15803d']
const fontOptions = [
  { label: 'MiSans', value: 'misans' },
  { label: '系统无衬线', value: 'system' },
  { label: '衬线正式', value: 'serif' },
  { label: '等宽技术', value: 'mono' }
]
const profileLayoutOptions = [
  { label: '头像左侧，联系信息双列', value: 'balanced' },
  { label: '居中名片式', value: 'centered' },
  { label: '左右分栏紧凑', value: 'split' }
]

let saveTimer = null

const activeTextTarget = ref(null)
const formattableInputTypes = new Set(['text', 'search', 'url', 'tel', 'email'])

const canFormatTextTarget = (target) => {
  if (!target || typeof target.value !== 'string' || typeof target.selectionStart !== 'number') return false
  const tag = target.tagName?.toLowerCase()
  if (tag === 'textarea') return true
  if (tag !== 'input') return false
  const type = (target.getAttribute('type') || 'text').toLowerCase()
  return formattableInputTypes.has(type)
}

const rememberTextTarget = (event) => {
  if (canFormatTextTarget(event?.target)) {
    activeTextTarget.value = event.target
  }
}

const getActiveTextTarget = () => {
  if (activeTextTarget.value?.isConnected && canFormatTextTarget(activeTextTarget.value)) {
    return activeTextTarget.value
  }
  return canFormatTextTarget(document.activeElement) ? document.activeElement : null
}

const applyInlineMarker = (marker) => {
  const target = getActiveTextTarget()
  if (!target) {
    ElMessage.info('请先选中文本')
    return
  }

  const start = target.selectionStart
  const end = target.selectionEnd
  if (start === end) {
    ElMessage.info('请先选中文本')
    return
  }

  const value = target.value
  const hasMarkerBefore = value.slice(start - marker.length, start) === marker
  const hasMarkerAfter = value.slice(end, end + marker.length) === marker
  let nextValue = ''
  let nextStart = start
  let nextEnd = end

  if (hasMarkerBefore && hasMarkerAfter) {
    nextValue = `${value.slice(0, start - marker.length)}${value.slice(start, end)}${value.slice(end + marker.length)}`
    nextStart = start - marker.length
    nextEnd = end - marker.length
  } else {
    nextValue = `${value.slice(0, start)}${marker}${value.slice(start, end)}${marker}${value.slice(end)}`
    nextStart = start + marker.length
    nextEnd = end + marker.length
  }

  target.value = nextValue
  target.dispatchEvent(new Event('input', { bubbles: true }))
  nextTick(() => {
    target.focus()
    target.setSelectionRange(nextStart, nextEnd)
  })
  animatePreview()
}

const applyBold = () => applyInlineMarker('**')
const applyItalic = () => applyInlineMarker('_')

const moduleIconMap = {
  education: '教',
  experience: '工',
  projects: '项',
  skills: '技',
  certifications: '证',
  awards: '奖',
  campus: '校',
  summary: '评',
  custom: '自'
}

const selectedSection = computed(() => resume.value.sections.find(section => section.id === activePanel.value))
const activeTemplate = computed(() => getTemplate(resume.value.templateId))
const adaptiveEditorLayout = computed(() => {
  const layout = { ...editorLayout.value }
  if (viewportWidth.value <= 760) {
    return { rail: 0, form: 0, preview: 0 }
  }

  if (viewportWidth.value <= 1120) {
    return {
      rail: clamp(layout.rail, 260, 320),
      form: Math.max(360, viewportWidth.value - clamp(layout.rail, 260, 320) - 54),
      preview: clamp(layout.preview, 480, 760)
    }
  }

  const available = Math.max(1040, viewportWidth.value - 54)
  const chrome = 48
  const min = { rail: 260, form: 420, preview: 480 }
  const requested = layout.rail + layout.form + layout.preview + chrome

  if (requested <= available) return layout

  const extra = {
    rail: Math.max(0, layout.rail - min.rail),
    form: Math.max(0, layout.form - min.form),
    preview: Math.max(0, layout.preview - min.preview)
  }
  const extraTotal = Math.max(1, extra.rail + extra.form + extra.preview)
  const overflow = requested - available

  return {
    rail: clamp(layout.rail - overflow * (extra.rail / extraTotal), min.rail, layout.rail),
    form: clamp(layout.form - overflow * (extra.form / extraTotal), min.form, layout.form),
    preview: clamp(layout.preview - overflow * (extra.preview / extraTotal), min.preview, layout.preview)
  }
})
const editorLayoutStyle = computed(() => ({
  '--rail-width': `${Math.round(adaptiveEditorLayout.value.rail)}px`,
  '--form-width': `${Math.round(adaptiveEditorLayout.value.form)}px`,
  '--preview-width': `${Math.round(adaptiveEditorLayout.value.preview)}px`
}))
const currentPanelTitle = computed(() => {
  if (activePanel.value === 'basics') return '基本信息'
  if (activePanel.value === 'theme') return '模板与样式'
  return selectedSection.value?.title || '模块编辑'
})
const emailError = computed(() => {
  const email = resume.value.basics.email
  return Boolean(email && !/^\S+@\S+\.\S+$/.test(email))
})

watch(
  resume,
  () => {
    saveState.value = '保存中'
    window.clearTimeout(saveTimer)
    saveTimer = window.setTimeout(() => {
      saveCurrentResume(resume.value)
      saveState.value = '已保存'
      animateSave()
    }, 420)
  },
  { deep: true }
)

watch(
  editorLayout,
  () => {
    localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(editorLayout.value))
  },
  { deep: true }
)

watch(activePanel, () => {
  nextTick(() => {
    if (formRef.value) {
      gsap.fromTo(formRef.value, { opacity: 0.2, y: 12 }, { opacity: 1, y: 0, duration: 0.32, ease: 'power2.out' })
    }
  })
})

onMounted(() => {
  const queryTemplate = Array.isArray(route.query.template) ? route.query.template[0] : route.query.template
  if (queryTemplate && getTemplate(queryTemplate).id === queryTemplate) {
    applyTemplate(queryTemplate, false)
  }
  updateScale()
  window.addEventListener('resize', updateScale)
  window.addEventListener('click', closeFloatingMenus)
  animateEnter()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateScale)
  window.removeEventListener('click', closeFloatingMenus)
  window.clearTimeout(saveTimer)
})

const updateScale = () => {
  const width = window.innerWidth
  viewportWidth.value = width
  previewScale.value = width > 1500 ? 0.74 : width > 1180 ? 0.66 : 0.58
}

const resetEditorLayout = () => {
  editorLayout.value = defaultEditorLayout()
  ElMessage.success('已恢复默认三栏宽度')
}

const startColumnResize = (type, event) => {
  if (viewportWidth.value <= 1120) return
  event.preventDefault()
  const startX = event.clientX
  const start = { ...editorLayout.value }

  document.body.classList.add('is-column-resizing')

  const onMove = (moveEvent) => {
    const delta = moveEvent.clientX - startX
    if (type === 'rail') {
      editorLayout.value.rail = clamp(start.rail + delta, 260, 440)
      return
    }

    editorLayout.value.form = clamp(start.form + delta, 420, 780)
    editorLayout.value.preview = clamp(start.preview - delta, 480, 960)
  }

  const onEnd = () => {
    document.body.classList.remove('is-column-resizing')
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('pointerup', onEnd)
    window.removeEventListener('pointercancel', onEnd)
  }

  window.addEventListener('pointermove', onMove)
  window.addEventListener('pointerup', onEnd)
  window.addEventListener('pointercancel', onEnd)
}

const animateEnter = () => {
  gsap.fromTo(topbarRef.value, { y: -18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: 'power2.out' })
  gsap.fromTo([moduleRef.value, formRef.value, previewRef.value], { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, delay: 0.12, ease: 'power2.out' })
}

const animateSave = () => {
  const el = document.querySelector('.save-chip')
  if (el) gsap.fromTo(el, { scale: 0.96 }, { scale: 1, duration: 0.22, ease: 'power2.out' })
}

const animatePreview = () => {
  const paper = document.querySelector('.preview-panel .resume-paper')
  if (paper) gsap.fromTo(paper, { opacity: 0.45, y: 16 }, { opacity: 1, y: 0, duration: 0.36, ease: 'power2.out' })
}

const openGithub = () => {
  window.open(GITHUB_URL, '_blank', 'noopener,noreferrer')
}

const selectPanel = (panel) => {
  activePanel.value = panel
  mobileMode.value = 'edit'
}

const toggleTemplateMenu = () => {
  templateMenuOpen.value = !templateMenuOpen.value
  if (templateMenuOpen.value) {
    exportMenuOpen.value = false
    nextTick(() => {
      if (templateMenuRef.value) {
        gsap.fromTo(templateMenuRef.value, { opacity: 0, y: -8, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.22, ease: 'power2.out' })
      }
    })
  }
}

const closeTemplateMenu = () => {
  templateMenuOpen.value = false
}

const toggleExportMenu = () => {
  exportMenuOpen.value = !exportMenuOpen.value
  if (exportMenuOpen.value) {
    templateMenuOpen.value = false
    nextTick(() => {
      if (exportMenuRef.value) {
        gsap.fromTo(exportMenuRef.value, { opacity: 0, y: -8, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.22, ease: 'power2.out' })
      }
    })
  }
}

const closeExportMenu = () => {
  exportMenuOpen.value = false
}

const closeFloatingMenus = () => {
  closeTemplateMenu()
  closeExportMenu()
}

const chooseTemplate = (templateId) => {
  applyTemplate(templateId)
  closeTemplateMenu()
}

const runExport = (type) => {
  closeExportMenu()
  if (type === 'pdf') {
    exportPdf()
    return
  }
  exportJson()
}

const applyTemplate = (templateId, notify = true) => {
  const template = getTemplate(templateId)
  resume.value.templateId = template.id
  resume.value.theme.accent = template.accent
  animatePreview()
  if (notify) ElMessage.success(`已切换为「${template.name}」模板`)
}

const applyAccent = (color) => {
  resume.value.theme.accent = color
  animatePreview()
}

const resetThemeStyle = () => {
  const accent = resume.value.theme.accent
  resume.value.theme = {
    ...createDefaultTheme(resume.value.templateId),
    accent
  }
  animatePreview()
  ElMessage.success('已恢复默认排版')
}

const toggleSection = (section) => {
  section.visible = section.visible === false
}

const addSection = (type) => {
  const section = createSection(type)
  resume.value.sections.push(section)
  activePanel.value = section.id
  nextTick(() => {
    const items = document.querySelectorAll('.module-item')
    const el = items[items.length - 1]
    if (el) gsap.fromTo(el, { opacity: 0, x: -12 }, { opacity: 1, x: 0, duration: 0.28, ease: 'power2.out' })
  })
}

const deleteSection = async (section) => {
  try {
    await ElMessageBox.confirm(`确定删除「${section.title}」模块吗？`, '删除模块', { type: 'warning' })
    resume.value.sections = resume.value.sections.filter(item => item.id !== section.id)
    if (activePanel.value === section.id) activePanel.value = 'basics'
    ElMessage.success('模块已删除')
  } catch {
    /* user cancelled */
  }
}

const moveArrayItem = (list, from, to) => {
  if (typeof from !== 'number' || to < 0 || to >= list.length || from === to) return
  const [item] = list.splice(from, 1)
  list.splice(to, 0, item)
}

const moveSection = (index, offset) => moveArrayItem(resume.value.sections, index, index + offset)
const startSectionDrag = (event, index) => {
  sectionDragIndex.value = index
  sectionDropIndex.value = index
  if (event?.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.dropEffect = 'move'
  }
}
const enterSectionDrop = (index) => {
  if (sectionDragIndex.value === null) return
  sectionDropIndex.value = index
}
const dropSection = (index) => {
  moveArrayItem(resume.value.sections, sectionDragIndex.value, index)
  endSectionDrag()
  nextTick(() => gsap.fromTo('.module-item', { scale: 0.98 }, { scale: 1, duration: 0.22, stagger: 0.02 }))
}
const endSectionDrag = () => {
  sectionDragIndex.value = null
  sectionDropIndex.value = null
}

const addItem = (section) => {
  section.items.push(createItemByType(section.type))
}
const deleteItem = (section, index) => {
  section.items.splice(index, 1)
}
const moveItem = (section, index, offset) => moveArrayItem(section.items, index, index + offset)
const startItemDrag = (sectionId, index) => {
  itemDrag.value = { sectionId, index }
}
const dropItem = (section, index) => {
  if (itemDrag.value.sectionId !== section.id) return
  moveArrayItem(section.items, itemDrag.value.index, index)
  itemDrag.value = { sectionId: '', index: -1 }
  nextTick(() => gsap.fromTo('.item-card', { scale: 0.985 }, { scale: 1, duration: 0.2, stagger: 0.02 }))
}

const uploadAvatar = (event) => {
  const file = event.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    resume.value.basics.avatar = reader.result
  }
  reader.readAsDataURL(file)
}

const autoGrow = (event) => {
  const el = event.target
  el.style.height = 'auto'
  el.style.height = `${Math.max(el.scrollHeight, 108)}px`
}

const previewPage = () => {
  saveCurrentResume(resume.value)
  router.push('/preview')
}

const exportJson = () => {
  const payload = JSON.stringify(normalizeResume(resume.value), null, 2)
  const blob = new Blob([payload], { type: 'application/json;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${resume.value.title || resume.value.basics.name || 'cvita-resume'}.json`
  link.click()
  URL.revokeObjectURL(url)
  ElMessage.success('JSON 已导出')
}

const importJson = async (event) => {
  const file = event.target.files?.[0]
  event.target.value = ''
  if (!file) return
  try {
    const data = JSON.parse(await file.text())
    if (!data || !data.basics || !Array.isArray(data.sections)) throw new Error('invalid schema')
    resume.value = normalizeResume(data)
    activePanel.value = 'basics'
    ElMessage.success('JSON 已导入，草稿已恢复')
  } catch {
    ElMessage.error('导入失败，请检查 JSON 格式或 schema')
  }
}

const exportPdf = async () => {
  try {
    isExporting.value = true
    ElMessage.info('正在生成 PDF...')
    mobileMode.value = 'preview'
    await nextTick()
    const { default: html2canvas } = await import('html2canvas')
    const { default: jsPDF } = await import('jspdf')
    const paper = document.querySelector('.preview-panel .resume-paper')
    await exportResumePaperToPdf({
      paper,
      html2canvas,
      jsPDF,
      filename: `${resume.value.basics.name || resume.value.title || 'resume'}.pdf`
    })
    ElMessage.success('PDF 已导出')
  } catch {
    ElMessage.error('PDF 导出失败，请稍后重试')
  } finally {
    isExporting.value = false
  }
}

const createNewResume = async () => {
  try {
    await ElMessageBox.confirm('新建空白简历会覆盖当前草稿，是否继续？', '新建简历', { type: 'warning' })
    resume.value = createEmptyResume(resume.value.templateId)
    activePanel.value = 'basics'
    ElMessage.success('已创建空白简历')
  } catch {
    /* user cancelled */
  }
}

const restoreDemo = async () => {
  try {
    await ElMessageBox.confirm('恢复示例会覆盖当前草稿，是否继续？', '恢复示例', { type: 'warning' })
    resume.value = createDemoResume(resume.value.templateId)
    activePanel.value = 'basics'
    ElMessage.success('已恢复示例数据')
  } catch {
    /* user cancelled */
  }
}

const openAi = (type, section = null, item = null) => {
  aiDrawer.value = true
  aiLoading.value = true
  aiTarget.value = { type, section, item }
  window.setTimeout(() => {
    aiResult.value = buildAiSuggestion(type, section, item)
    aiLoading.value = false
    nextTick(() => {
      if (aiRef.value) gsap.fromTo(aiRef.value, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' })
    })
  }, 520)
}

const buildAiSuggestion = (type, section, item) => {
  const suggestions = {
    basicSummary: {
      suggestion: '具备扎实的前端工程能力和产品意识，熟悉 Vue 3、组件化开发、工程化构建与响应式页面实现。能够围绕业务目标拆解页面结构、设计可维护的数据模型，并推动编辑、预览、导出等关键流程形成闭环。',
      reason: '强化岗位匹配度，减少口语化表达，并突出工程化与产品交付能力。'
    },
    sectionContent: {
      suggestion: '具备良好的学习能力、协作意识和结果导向，能够主动理解业务场景，沉淀可复用方案，并在项目推进中兼顾体验、效率与代码质量。',
      reason: '让自我评价更聚焦能力证据，避免泛泛而谈。'
    },
    projectHighlight: {
      suggestion: `围绕「${item?.name || '项目'}」建立模块化数据结构和实时预览链路，统一编辑器、模板渲染与导出流程，提升功能扩展性和用户制作效率。`,
      reason: '把项目亮点从“做了什么”提升为“解决了什么问题”。'
    },
    workResult: {
      suggestion: '通过组件抽象、表单配置和状态复用降低重复开发成本，优化页面交付效率，并提升复杂业务场景下的维护性与一致性。',
      reason: '突出工作结果和可量化的工程价值。'
    }
  }
  return suggestions[type] || suggestions.sectionContent
}

const applyAiResult = (mode) => {
  const target = aiTarget.value
  const suggestion = aiResult.value?.suggestion || ''
  if (!target || !suggestion) return
  const value = mode === 'append' ? `\n${suggestion}` : suggestion
  if (target.type === 'basicSummary') {
    resume.value.basics.summary = mode === 'append' ? `${resume.value.basics.summary || ''}${value}` : value
  } else if (target.type === 'sectionContent' && target.section) {
    target.section.content = mode === 'append' ? `${target.section.content || ''}${value}` : value
  } else if (target.type === 'projectHighlight' && target.item) {
    target.item.highlights = mode === 'append' ? `${target.item.highlights || ''}${value}` : value
  } else if (target.type === 'workResult' && target.item) {
    target.item.result = mode === 'append' ? `${target.item.result || ''}${value}` : value
  }
  aiDrawer.value = false
  ElMessage.success('AI 建议已应用')
}
</script>

<style scoped lang="scss">
.editor-page {
  height: 100vh;
  padding: 14px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background:
    radial-gradient(circle at 12% 4%, rgba(75, 123, 255, 0.14), transparent 30%),
    radial-gradient(circle at 90% 12%, rgba(103, 232, 249, 0.16), transparent 28%),
    linear-gradient(135deg, #f8fbff 0%, #edf3fb 48%, #f8fbff 100%);
  color: #162033;
}

.editor-topbar,
.module-rail,
.form-panel,
.preview-panel,
.mobile-tabs {
  border: 1px solid rgba(255, 255, 255, 0.72);
  background: rgba(255, 255, 255, 0.68);
  box-shadow: 0 22px 70px rgba(43, 73, 124, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(24px) saturate(150%);
}

.editor-topbar {
  position: relative;
  top: 0;
  flex: 0 0 auto;
  z-index: 30;
  min-height: 70px;
  display: grid;
  grid-template-columns: auto minmax(190px, 300px) auto auto 1fr;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
  padding: 10px 12px;
  border-radius: 26px;

  > * {
    min-width: 0;
  }
}

button,
select,
input,
textarea {
  font: inherit;
}

button {
  border: 0;
  cursor: pointer;
  transition: transform 0.22s ease, box-shadow 0.22s ease, background 0.22s ease;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.48;
}

button:not(:disabled):hover {
  transform: translateY(-2px);
}

.brand-button,
.toolbar-actions button,
.module-main,
.add-section button,
.danger-zone button,
.add-item,
.ai-inline,
.ai-mini,
.zoom-control button,
.github-action {
  border-radius: 999px;
  border: 1px solid rgba(214, 224, 240, 0.86);
  background: rgba(255, 255, 255, 0.72);
  color: #182235;
  font-weight: 850;
}

.brand-button {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px 8px 10px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.brand-button img {
  width: 38px;
  height: 38px;
  display: block;
}

.brand-button span {
  color: #111827;
  font-size: 22px;
  font-weight: 900;
  letter-spacing: 0;
}

.title-input {
  min-width: 0;
  display: grid;
  gap: 4px;
  padding: 8px 12px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.62);
}

.title-input span,
.panel-title span,
.preview-toolbar span,
.rail-head span,
.field span {
  color: #69758b;
  font-size: 12px;
  font-weight: 850;
}

.title-input input,
.field input,
.field textarea,
.field select,
.add-section select {
  width: 100%;
  border: 1px solid rgba(206, 217, 235, 0.95);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.82);
  color: #162033;
  outline: none;
}

.title-input input {
  min-height: 24px;
  border: 0;
  background: transparent;
  font-weight: 900;
}

.template-picker {
  position: relative;
  min-width: 150px;
}

.template-trigger {
  width: 100%;
  min-height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 0 13px 0 16px;
  border: 1px solid rgba(206, 217, 235, 0.78);
  border-radius: 18px;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.72), rgba(255, 255, 255, 0.42));
  color: #162033;
  font-weight: 850;
  box-shadow: 0 12px 32px rgba(43, 73, 124, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(18px) saturate(150%);
}

.template-trigger span {
  min-width: 0;
}

.template-trigger svg {
  color: #48566c;
  transition: transform 0.2s ease;
}

.template-trigger.open svg {
  transform: rotate(180deg);
}

.template-menu {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  z-index: 80;
  width: 100%;
  min-width: 168px;
  padding: 7px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.76);
  border-radius: 22px;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.78), rgba(255, 255, 255, 0.48));
  box-shadow: 0 24px 62px rgba(43, 73, 124, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(28px) saturate(155%);
}

.template-option {
  width: 100%;
  min-height: 38px;
  display: flex;
  align-items: center;
  padding: 0 13px;
  border-radius: 15px;
  background: transparent;
  color: #253044;
  text-align: left;
  font-size: 15px;
  font-weight: 760;
}

.template-option:hover {
  background: rgba(37, 99, 235, 0.08);
  color: #1d4ed8;
  transform: translateY(0);
}

.template-option.active {
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.95), rgba(59, 130, 246, 0.88));
  color: #fff;
  box-shadow: 0 10px 24px rgba(37, 99, 235, 0.24);
}

.save-chip {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(238, 252, 244, 0.9);
  color: #047857;
  font-size: 13px;
  font-weight: 900;
}

.save-chip i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
}

.save-chip.saving {
  background: rgba(255, 247, 237, 0.92);
  color: #c2410c;
}

.toolbar-actions {
  min-width: 0;
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 8px;
}

.toolbar-actions button {
  max-width: 100%;
  min-height: 40px;
  padding: 0 14px;
  white-space: normal;
  text-align: center;
}

.toolbar-actions .primary {
  background: linear-gradient(135deg, #111827, #2563eb);
  color: #fff;
  box-shadow: 0 12px 28px rgba(37, 99, 235, 0.22);
}

.export-picker {
  position: relative;
}

.export-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 96px;
}

.export-trigger svg {
  transition: transform 0.2s ease;
}

.export-trigger.open svg {
  transform: rotate(180deg);
}

.export-menu {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  z-index: 90;
  width: 150px;
  display: grid;
  gap: 6px;
  padding: 7px;
  border: 1px solid rgba(255, 255, 255, 0.76);
  border-radius: 22px;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.78), rgba(255, 255, 255, 0.48));
  box-shadow: 0 24px 62px rgba(43, 73, 124, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(28px) saturate(155%);
}

.toolbar-actions .export-option {
  width: 100%;
  min-height: 38px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 13px;
  border: 0;
  border-radius: 15px;
  background: transparent;
  color: #253044;
  box-shadow: none;
  text-align: left;
  font-size: 15px;
  font-weight: 820;
}

.toolbar-actions .export-option:hover {
  background: rgba(37, 99, 235, 0.08);
  color: #1d4ed8;
  transform: translateY(0);
}

.github-action,
.theme-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  min-width: 42px;
  height: 42px;
  padding: 0;
  color: #111827;
  box-shadow: 0 10px 26px rgba(15, 23, 42, 0.1);
}

.file-input {
  display: none;
}

.mobile-tabs {
  display: none;
  margin-bottom: 12px;
  padding: 6px;
  border-radius: 999px;
}

.mobile-tabs button {
  flex: 1;
  min-height: 38px;
  border-radius: 999px;
  background: transparent;
  color: #64748b;
  font-weight: 900;
}

.mobile-tabs .active {
  background: #111827;
  color: #fff;
}

.editor-shell {
  flex: 1 1 auto;
  min-height: 0;
  display: grid;
  grid-template-columns:
    minmax(260px, var(--rail-width))
    10px
    minmax(420px, var(--form-width))
    10px
    minmax(480px, var(--preview-width));
  gap: 7px;
  align-items: stretch;
  overflow-x: hidden;
}

.module-rail,
.form-panel,
.preview-panel {
  border-radius: 28px;
}

.module-rail {
  position: relative;
  top: 0;
  display: grid;
  gap: 10px;
  height: 100%;
  max-height: none;
  min-height: 0;
  padding: 14px;
  overflow: auto;
}

.column-resizer {
  position: relative;
  top: 0;
  z-index: 12;
  width: 10px;
  height: 100%;
  display: grid;
  place-items: center;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: transparent;
  cursor: col-resize;
  touch-action: none;

  span {
    width: 4px;
    height: 58px;
    border-radius: 999px;
    background: rgba(148, 163, 184, 0.46);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.74);
    transition: width 0.18s ease, height 0.18s ease, background 0.18s ease, box-shadow 0.18s ease;
  }

  &:hover span,
  &:focus-visible span {
    width: 6px;
    height: 84px;
    background: rgba(17, 24, 39, 0.72);
    box-shadow: 0 12px 24px rgba(15, 23, 42, 0.18);
  }
}

:global(body.is-column-resizing) {
  cursor: col-resize;
  user-select: none;
}

:global(html.theme-dark) .column-resizer span {
  background: rgba(148, 163, 184, 0.34);
}

:global(html.theme-dark) .column-resizer:hover span,
:global(html.theme-dark) .column-resizer:focus-visible span {
  background: rgba(226, 232, 240, 0.72);
}

.rail-head,
.panel-title,
.preview-toolbar,
.item-head,
.section-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  > * {
    min-width: 0;
  }
}

.rail-head strong {
  color: #2563eb;
}

.module-main,
.module-name {
  width: 100%;
  min-height: 46px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  text-align: left;
}

.module-main span,
.module-name span {
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border-radius: 11px;
  background: rgba(37, 99, 235, 0.1);
  color: #2563eb;
  font-size: 13px;
  font-weight: 950;
}

.module-main.active,
.module-item.active {
  background: rgba(37, 99, 235, 0.1);
  box-shadow: inset 0 0 0 1px rgba(37, 99, 235, 0.16);
}

.module-list {
  display: grid;
  gap: 8px;
}

.module-item {
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(219, 229, 244, 0.8);
  overflow: hidden;
  cursor: grab;
  transition: transform 0.22s ease, border 0.22s ease, background 0.22s ease, box-shadow 0.22s ease, opacity 0.22s ease;
}

.module-item.muted {
  opacity: 0.56;
}

.module-item.dragging {
  opacity: 0.48;
  cursor: grabbing;
  transform: scale(0.98);
  border-color: rgba(37, 99, 235, 0.28);
  box-shadow: 0 18px 38px rgba(37, 99, 235, 0.12);
}

.module-item.drop-target {
  border-color: rgba(37, 99, 235, 0.48);
  background: rgba(239, 246, 255, 0.82);
  box-shadow: 0 16px 36px rgba(37, 99, 235, 0.14), inset 4px 0 0 rgba(37, 99, 235, 0.7);
}

.module-row {
  display: flex;
  align-items: center;
  gap: 4px;
}

.module-name {
  min-width: 0;
  flex: 1;
  border: 0;
  background: transparent;
}

.module-name b {
  flex: 1 1 auto;
  min-width: 0;
  line-height: 1.4;
  overflow: visible;
  text-overflow: clip;
  white-space: normal;
}

.drag-handle {
  width: 34px;
  height: 40px;
  display: grid;
  place-items: center;
  flex: 0 0 34px;
  margin-right: 6px;
  border-radius: 14px;
  color: #94a3b8;
  cursor: grab;
  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
}

.module-item:hover .drag-handle,
.module-item.drop-target .drag-handle {
  background: rgba(37, 99, 235, 0.08);
  color: #2563eb;
}

.module-item.dragging .drag-handle {
  cursor: grabbing;
  transform: scale(0.94);
}

.module-tools {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
  padding: 0 8px 8px;
}

.module-tools button {
  min-height: 26px;
  border-radius: 10px;
  background: rgba(241, 245, 249, 0.82);
  color: #64748b;
  font-size: 12px;
  font-weight: 900;
  white-space: normal;
}

.add-section,
.danger-zone {
  display: grid;
  gap: 8px;
  padding-top: 8px;
}

.add-section select {
  min-height: 42px;
  padding: 0 12px;
}

.add-section button,
.danger-zone button,
.add-item {
  min-height: 42px;
}

.danger-zone button {
  color: #b42318;
}

.design-panel {
  display: grid;
  gap: 14px;
  padding-top: 10px;
}

.rail-card {
  display: grid;
  gap: 14px;
  padding: 16px;
  border: 1px solid rgba(219, 229, 244, 0.82);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.62);
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.76);
}

.rail-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: #182235;
  font-weight: 900;
}

.rail-card-head button {
  min-height: 30px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid rgba(214, 224, 240, 0.9);
  background: rgba(255, 255, 255, 0.72);
  color: #475569;
  font-size: 12px;
  font-weight: 850;
}

.text-format-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;

  button {
    min-height: 42px;
    display: grid;
    place-items: center;
    border: 1px solid rgba(214, 224, 240, 0.9);
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.78);
    color: #182235;
    box-shadow: 0 10px 22px rgba(15, 23, 42, 0.06);
  }

  button:hover,
  button:focus-visible {
    transform: translateY(-1px);
    border-color: rgba(37, 99, 235, 0.44);
    color: #1d4ed8;
  }

  strong,
  em {
    font-size: 17px;
    line-height: 1;
  }
}

.color-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.color-dot,
.color-picker {
  width: 26px;
  height: 26px;
  border-radius: 50%;
}

.color-dot {
  padding: 0;
  border: 2px solid rgba(255, 255, 255, 0.92);
  box-shadow: 0 0 0 1px rgba(15, 23, 42, 0.1), 0 8px 18px rgba(15, 23, 42, 0.08);
}

.color-dot.active {
  box-shadow: 0 0 0 3px #fff, 0 0 0 5px rgba(17, 24, 39, 0.82), 0 12px 24px rgba(15, 23, 42, 0.14);
}

.color-picker {
  position: relative;
  display: inline-grid;
  place-items: center;
  overflow: hidden;
  border: 1px dashed rgba(15, 23, 42, 0.22);
  background: conic-gradient(#111827, #2563eb, #16a34a, #f97316, #111827);
  cursor: pointer;

  input {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }
}

.control-field {
  display: grid;
  gap: 9px;

  > span {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #475569;
    font-size: 13px;
    font-weight: 850;
  }

  b {
    color: #111827;
  }

  select,
  input[type='number'] {
    width: 100%;
    min-height: 40px;
    padding: 0 12px;
    border: 1px solid rgba(214, 224, 240, 0.92);
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.82);
    color: #182235;
    outline: none;
  }

  input[type='range'] {
    width: 100%;
    accent-color: #111827;
  }
}

.range-field {
  gap: 7px;
}

.toggle-line {
  position: relative;
  min-height: 34px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  color: #475569;
  font-size: 13px;
  font-weight: 850;
  cursor: pointer;

  input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  i {
    width: 44px;
    height: 24px;
    position: relative;
    flex: 0 0 44px;
    border-radius: 999px;
    background: rgba(226, 232, 240, 0.92);
    box-shadow: inset 0 1px 2px rgba(15, 23, 42, 0.12);
    transition: background 0.2s ease;
  }

  i::after {
    content: '';
    position: absolute;
    top: 3px;
    left: 3px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 4px 10px rgba(15, 23, 42, 0.18);
    transition: transform 0.2s ease;
  }

  input:checked + i {
    background: #111827;
  }

  input:checked + i::after {
    transform: translateX(20px);
  }
}

.form-panel {
  position: relative;
  top: 0;
  min-height: 0;
  max-height: none;
  height: 100%;
  padding: 18px;
  overflow: auto;
}

.panel-title {
  margin-bottom: 16px;
}

.panel-title h1 {
  margin: 4px 0 0;
  font-size: 24px;
}

.ai-mini,
.ai-inline {
  min-height: 38px;
  padding: 0 14px;
  color: #1d4ed8;
  background: rgba(239, 246, 255, 0.92);
}

.form-card {
  display: grid;
  gap: 16px;
}

.profile-layout-panel {
  display: grid;
  gap: 12px;

  h2 {
    margin: 0;
    color: #182235;
    font-size: 18px;
    font-weight: 850;
  }
}

.profile-layout-options {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;

  button {
    min-height: 66px;
    display: grid;
    place-items: center;
    border: 1px solid rgba(214, 224, 240, 0.82);
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.58);
  }

  button.active {
    border-color: #111827;
    background: rgba(255, 255, 255, 0.92);
    box-shadow: 0 14px 32px rgba(15, 23, 42, 0.1);
  }
}

.layout-preview {
  width: 46px;
  height: 24px;
  display: grid;
  grid-template-columns: 12px 1fr;
  gap: 5px;
  align-items: center;

  i,
  b,
  em {
    display: block;
    border-radius: 999px;
    background: #111827;
  }

  i {
    width: 12px;
    height: 12px;
    grid-row: span 2;
  }

  b,
  em {
    height: 2px;
  }

  em {
    width: 70%;
    opacity: 0.55;
  }

  &.centered {
    grid-template-columns: 1fr;
    justify-items: center;

    i {
      grid-row: auto;
    }

    b,
    em {
      width: 24px;
    }
  }

  &.split {
    grid-template-columns: 1fr 12px;

    i {
      grid-column: 2;
    }
  }
}

.profile-data-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: -8px;
  color: #182235;
  font-size: 15px;
  font-weight: 850;

  div {
    display: flex;
    gap: 8px;
  }

  button {
    width: 34px;
    height: 34px;
    display: grid;
    place-items: center;
    border: 1px solid rgba(214, 224, 240, 0.82);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.72);
    color: #475569;
  }
}

.avatar-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.profile-data-card {
  padding: 14px;
  border: 1px solid rgba(214, 224, 240, 0.82);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.58);
}

.avatar-box {
  width: 78px;
  height: 78px;
  display: grid;
  place-items: center;
  overflow: hidden;
  border-radius: 28px;
  background: linear-gradient(145deg, #f8fafc, #dbeafe);
  color: #64748b;
  font-weight: 900;
}

.avatar-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-button,
.avatar-row button {
  min-height: 38px;
  display: inline-flex;
  align-items: center;
  padding: 0 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(214, 224, 240, 0.86);
  font-weight: 850;
  cursor: pointer;
}

.upload-button input {
  display: none;
}

.field-grid {
  display: grid;
  gap: 14px;
}

.field-grid.two {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.field.full {
  grid-column: 1 / -1;
}

.field {
  position: relative;
  display: grid;
  gap: 7px;
}

.field input,
.field textarea,
.field select {
  min-height: 46px;
  padding: 11px 13px;
  transition: border 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.field textarea {
  resize: vertical;
  min-height: 108px;
  line-height: 1.65;
}

.field input:focus,
.field textarea:focus,
.field select:focus {
  border-color: rgba(37, 99, 235, 0.62);
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
}

.field.error input {
  border-color: rgba(220, 38, 38, 0.5);
}

.field em {
  color: #dc2626;
  font-size: 12px;
  font-style: normal;
}

.template-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.template-choice {
  min-height: 118px;
  display: grid;
  gap: 8px;
  align-content: start;
  padding: 15px;
  border-radius: 22px;
  text-align: left;
  border: 1px solid rgba(214, 224, 240, 0.86);
  background: rgba(255, 255, 255, 0.72);
}

.template-choice span {
  width: 34px;
  height: 8px;
  border-radius: 999px;
}

.template-choice small {
  color: #64748b;
  line-height: 1.55;
}

.template-choice.active {
  border-color: rgba(37, 99, 235, 0.46);
  box-shadow: 0 16px 34px rgba(37, 99, 235, 0.16);
}

.section-meta {
  align-items: end;
}

.switch-row {
  min-height: 46px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.7);
  font-weight: 850;
}

.empty-box,
.item-card {
  border-radius: 24px;
  border: 1px solid rgba(214, 224, 240, 0.82);
  background: rgba(255, 255, 255, 0.56);
}

.empty-box {
  padding: 24px;
  text-align: center;
}

.empty-box p {
  color: #64748b;
}

.empty-box button {
  min-height: 40px;
  padding: 0 16px;
  border-radius: 999px;
  background: #111827;
  color: #fff;
}

.item-card {
  display: grid;
  gap: 0;
  padding: 0;
  overflow: hidden;
}

.item-head {
  min-height: 68px;
  padding: 0 16px;
  border-bottom: 1px solid rgba(214, 224, 240, 0.74);
  background: rgba(248, 250, 252, 0.72);
}

.item-head strong {
  color: #111827;
  flex: 1 1 auto;
  min-width: 0;
}

.item-head div {
  display: flex;
  min-width: 0;
  gap: 6px;
}

.item-head button {
  min-height: 30px;
  padding: 0 10px;
  border-radius: 999px;
  background: rgba(241, 245, 249, 0.9);
  color: #475569;
  font-weight: 850;
}

.item-card > .field-grid {
  padding: 16px;
}

.item-card > .ai-inline {
  justify-self: start;
  margin: 0 16px 16px;
}

.add-item {
  color: #fff;
  background: linear-gradient(135deg, #111827, #2563eb);
}

.preview-panel {
  position: relative;
  top: 0;
  height: 100%;
  max-height: none;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.preview-toolbar {
  padding: 14px 16px;
  border-bottom: 1px solid rgba(214, 224, 240, 0.74);
}

.preview-toolbar strong {
  display: block;
  margin-top: 3px;
}

.zoom-control {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px;
  border-radius: 999px;
  background: rgba(241, 245, 249, 0.85);
}

.zoom-control button {
  width: 30px;
  height: 30px;
}

.zoom-control span {
  min-width: 48px;
  text-align: center;
  font-weight: 900;
}

.preview-scroll {
  flex: 1 1 auto;
  min-height: 0;
  height: auto;
  padding: 22px 24px 52px;
  overflow: auto;
  background: rgba(226, 232, 240, 0.42);
}

.ai-drawer {
  display: grid;
  gap: 16px;
}

.ai-loading,
.ai-result {
  border-radius: 24px;
  padding: 18px;
  background: linear-gradient(145deg, rgba(248, 250, 252, 0.95), rgba(239, 246, 255, 0.92));
  line-height: 1.75;
}

.ai-label {
  margin: 0;
  color: #2563eb;
  font-weight: 900;
}

.ai-hint {
  color: #64748b;
  line-height: 1.7;
}

.ai-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.ai-actions button {
  min-height: 40px;
  padding: 0 15px;
  border-radius: 999px;
  background: #111827;
  color: #fff;
  font-weight: 850;
}

@media (max-width: 1380px) {
  .editor-shell {
    grid-template-columns:
      minmax(260px, var(--rail-width))
      10px
      minmax(380px, var(--form-width))
      10px
      minmax(420px, var(--preview-width));
  }
}

@media (max-width: 1120px) {
  .editor-topbar {
    grid-template-columns: 1fr;
  }

  .toolbar-actions {
    justify-content: flex-start;
  }

  .mobile-tabs {
    display: flex;
  }

  .editor-shell {
    grid-template-columns: minmax(260px, var(--rail-width)) minmax(0, 1fr);
    gap: 14px;
  }

  .column-resizer {
    display: none;
  }

  .preview-panel {
    display: none;
    position: relative;
    top: 0;
    grid-column: 1 / -1;
  }

  .editor-shell.mobile-preview .module-rail,
  .editor-shell.mobile-preview .form-panel {
    display: none;
  }

  .editor-shell.mobile-preview .preview-panel {
    display: block;
  }
}

@media (max-width: 760px) {
  .editor-page {
    height: auto;
    min-height: 100vh;
    overflow: visible;
    padding: 10px;
  }

  .editor-topbar,
  .module-rail,
  .form-panel,
  .preview-panel {
    border-radius: 22px;
  }

  .editor-shell {
    grid-template-columns: 1fr;
  }

  .module-rail {
    position: relative;
    top: 0;
    max-height: none;
  }

  .form-panel {
    position: relative;
    top: 0;
    max-height: none;
    overflow: visible;
  }

  .field-grid.two,
  .template-grid {
    grid-template-columns: 1fr;
  }

  .section-meta,
  .panel-title {
    align-items: flex-start;
    flex-direction: column;
  }

  .preview-scroll {
    height: auto;
    min-height: 76vh;
    padding: 16px 12px 34px;
  }
}
</style>
