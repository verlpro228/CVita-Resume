export const STORAGE_KEY = 'cvita_builder_current_resume'
export const GITHUB_URL = 'https://github.com/verlpro228'

export const templateCatalog = [
  {
    id: 'modern',
    name: '现代简约',
    category: '简约',
    tags: ['通用', '应届生', '清爽'],
    description: '留白充足，适合多数岗位投递。',
    accent: '#111827',
    previewImage: '/templates/modern.svg'
  },
  {
    id: 'classic',
    name: '经典商务',
    category: '商务',
    tags: ['成熟', '管理', '稳重'],
    description: '黑白灰层级清晰，适合传统行业与管理岗位。',
    accent: '#2f3a4a',
    previewImage: '/templates/classic.svg'
  },
  {
    id: 'tech',
    name: '技术专业',
    category: '技术',
    tags: ['开发', '工程化', '项目导向'],
    description: '突出技能栈与项目经历，适合技术岗位。',
    accent: '#2563eb',
    previewImage: '/templates/tech.svg'
  },
  {
    id: 'creative',
    name: '创意作品',
    category: '创意',
    tags: ['设计', '运营', '作品集'],
    description: '更有视觉识别度，适合创意与内容岗位。',
    accent: '#7c3aed',
    previewImage: '/templates/creative.svg'
  },
  {
    id: 'academic',
    name: '学术研究',
    category: '学术',
    tags: ['科研', '升学', '论文'],
    description: '结构严谨，适合科研、升学与学术申请。',
    accent: '#475569',
    previewImage: '/templates/academic.svg'
  },
  {
    id: 'minimal',
    name: '极简单页',
    category: '简约',
    tags: ['一页纸', '极简', '快速投递'],
    description: '信息密度更高，适合一页纸简历。',
    accent: '#0f766e',
    previewImage: '/templates/minimal.svg'
  }
]

export const getTemplate = (id) => templateCatalog.find(item => item.id === id) || templateCatalog[0]

export const createDefaultTheme = (templateId = 'modern') => ({
  accent: templateCatalog.find(item => item.id === templateId)?.accent || '#111827',
  density: 'comfortable',
  fontFamily: 'system',
  lineHeight: 1.5,
  baseFontSize: 13,
  sectionTitleSize: 16,
  itemTitleSize: 15,
  pagePaddingX: 62,
  pagePaddingY: 56,
  sectionGap: 28,
  itemGap: 18,
  paragraphGap: 8,
  headerLayout: 'balanced',
  iconMode: false,
  centeredSubtitle: false,
  compactTitle: false
})

export const templateCategories = ['全部', ...Array.from(new Set(templateCatalog.map(item => item.category)))]

export const sectionDefinitions = [
  { type: 'education', title: '教育背景', addLabel: '添加教育经历' },
  { type: 'experience', title: '工作经历', addLabel: '添加工作经历' },
  { type: 'projects', title: '项目经历', addLabel: '添加项目经历' },
  { type: 'skills', title: '技能特长', addLabel: '添加技能' },
  { type: 'certifications', title: '证书资质', addLabel: '添加证书' },
  { type: 'awards', title: '获奖经历', addLabel: '添加奖项' },
  { type: 'campus', title: '校园经历', addLabel: '添加校园经历' },
  { type: 'summary', title: '自我评价', addLabel: '编辑自我评价' },
  { type: 'custom', title: '自定义模块', addLabel: '添加内容' }
]

export const sectionTypeMap = sectionDefinitions.reduce((map, item) => {
  map[item.type] = item
  return map
}, {})

export const createId = (prefix = 'item') => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`

export const createItemByType = (type) => {
  const itemMap = {
    education: {
      id: createId('edu'),
      school: '',
      major: '',
      degree: '',
      period: '',
      courses: '',
      description: ''
    },
    experience: {
      id: createId('exp'),
      company: '',
      role: '',
      period: '',
      description: '',
      result: '',
      highlights: ''
    },
    projects: {
      id: createId('project'),
      name: '',
      role: '',
      stack: '',
      period: '',
      description: '',
      highlights: '',
      responsibility: '',
      link: ''
    },
    skills: {
      id: createId('skill'),
      name: '',
      category: '前端',
      level: 80,
      description: ''
    },
    certifications: {
      id: createId('cert'),
      name: '',
      issuer: '',
      date: ''
    },
    awards: {
      id: createId('award'),
      name: '',
      level: '',
      date: '',
      description: ''
    },
    campus: {
      id: createId('campus'),
      organization: '',
      role: '',
      period: '',
      description: ''
    }
  }

  return itemMap[type] ? { ...itemMap[type] } : { id: createId(type), title: '', description: '' }
}

export const createSection = (type) => {
  const definition = sectionTypeMap[type] || sectionTypeMap.custom
  const section = {
    id: createId(type),
    type,
    title: definition.title,
    visible: true
  }

  if (type === 'summary' || type === 'custom') {
    section.content = ''
  } else {
    section.items = [createItemByType(type)]
  }

  return section
}

export const createDemoResume = (templateId = 'modern') => ({
  schemaVersion: 1,
  id: createId('resume'),
  title: '前端开发工程师简历',
  templateId,
  theme: createDefaultTheme(templateId),
  basics: {
    name: '蒋三',
    position: '前端开发工程师',
    phone: '138 0000 0000',
    email: 'chenyiming@example.com',
    city: '上海',
    address: '上海市浦东新区',
    website: 'https://cvita.example.com',
    github: 'https://github.com/verlpro228',
    avatar: '',
    summary:
      '熟悉 Vue 3、组件化开发与前端工程化，具备在线编辑器、中后台页面和响应式页面开发经验。关注产品可用性、代码可维护性和交付质量。'
  },
  sections: [
    {
      id: createId('edu'),
      type: 'education',
      title: '教育背景',
      visible: true,
      items: [
        {
          id: createId('edu-item'),
          school: '上海工程技术大学',
          major: '计算机科学与技术',
          degree: '本科',
          period: '2022.09 - 2026.06',
          courses: '数据结构、计算机网络、数据库系统、Web 前端开发、软件工程',
          description: '主修数据结构、计算机网络、数据库系统、Web 前端开发、软件工程等课程。'
        }
      ]
    },
    {
      id: createId('exp'),
      type: 'experience',
      title: '工作经历',
      visible: true,
      items: [
        {
          id: createId('exp-item'),
          company: '星河科技有限公司',
          role: '前端开发实习生',
          period: '2025.06 - 2025.09',
          description:
            '参与中后台业务页面开发，负责表单配置、列表筛选、状态标签和详情弹窗等模块实现。',
          result: '沉淀 8 个通用组件，减少重复页面开发成本，提升页面交付效率。'
        }
      ]
    },
    {
      id: createId('project'),
      type: 'projects',
      title: '项目经历',
      visible: true,
      items: [
        {
          id: createId('project-item'),
          name: 'CVita 在线简历生成平台',
          role: '前端负责人',
          stack: 'Vue 3 / Element Plus / localStorage / html2canvas / jsPDF',
          period: '2026.03 - 2026.04',
          description:
            '搭建在线简历编辑器，支持模板切换、模块编辑、实时预览、本地保存、PDF 导出和 JSON 导入导出。',
          highlights:
            '设计统一 resume schema，保证编辑器、预览和导出流程使用同一份数据；使用本地存储完成无后端演示闭环。',
          responsibility: '负责产品信息架构、编辑器交互、预览渲染、导出流程和响应式适配。',
          link: 'https://github.com/verlpro228'
        }
      ]
    },
    {
      id: createId('skill'),
      type: 'skills',
      title: '技能特长',
      visible: true,
      items: [
        { id: createId('skill-item'), name: 'Vue 3 / Composition API', category: '框架', level: 88, description: '熟悉组合式 API、组件拆分和响应式状态管理。' },
        { id: createId('skill-item'), name: 'JavaScript / ES6+', category: '基础', level: 86, description: '熟悉模块化、异步流程、DOM 与浏览器 API。' },
        { id: createId('skill-item'), name: 'Vite / 工程化', category: '工程化', level: 80, description: '了解构建配置、静态资源处理和性能优化。' },
        { id: createId('skill-item'), name: 'Element Plus', category: '组件库', level: 82, description: '可快速搭建表单、弹窗、列表和工具型后台界面。' }
      ]
    },
    {
      id: createId('cert'),
      type: 'certifications',
      title: '证书资质',
      visible: true,
      items: [
        {
          id: createId('cert-item'),
          name: '大学英语四级',
          issuer: '教育部考试中心',
          date: '2024.06'
        }
      ]
    },
    {
      id: createId('summary'),
      type: 'summary',
      title: '自我评价',
      visible: true,
      content:
        '具备良好的学习能力和工程意识，能够根据业务目标拆解页面结构、整理数据模型并推进功能闭环。重视代码可维护性和用户体验。'
    }
  ],
  meta: {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
})

export const createEmptyResume = (templateId = 'modern') => ({
  schemaVersion: 1,
  id: createId('resume'),
  title: '未命名简历',
  templateId,
  theme: createDefaultTheme(templateId),
  basics: {
    name: '',
    position: '',
    phone: '',
    email: '',
    city: '',
    address: '',
    website: '',
    github: '',
    avatar: '',
    summary: ''
  },
  sections: [
    { ...createSection('education'), items: [] },
    { ...createSection('experience'), items: [] },
    { ...createSection('projects'), items: [] },
    { ...createSection('skills'), items: [] },
    { ...createSection('summary'), content: '' }
  ],
  meta: {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
})

export const normalizeResume = (input) => {
  const fallback = createDemoResume()
  const resume = input && typeof input === 'object' ? input : fallback
  const normalizeSection = (section) => {
    const base = createSection(section?.type || 'custom')
    const merged = {
      ...base,
      ...section,
      title: section?.title || base.title,
      visible: section?.visible !== false
    }

    if (merged.type === 'summary' || merged.type === 'custom') {
      merged.content = merged.content || ''
      return merged
    }

    merged.items = Array.isArray(section?.items)
      ? section.items.map(item => ({ ...createItemByType(merged.type), ...item }))
      : []
    return merged
  }

  return {
    ...fallback,
    ...resume,
    basics: {
      ...fallback.basics,
      ...(resume.basics || {})
    },
    theme: {
      ...fallback.theme,
      ...(resume.theme || {})
    },
    sections: Array.isArray(resume.sections) ? resume.sections.map(normalizeSection) : fallback.sections,
    meta: {
      ...fallback.meta,
      ...(resume.meta || {}),
      updatedAt: new Date().toISOString()
    }
  }
}

export const loadCurrentResume = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? normalizeResume(JSON.parse(saved)) : createDemoResume()
  } catch {
    return createDemoResume()
  }
}

export const saveCurrentResume = (resume) => {
  const normalized = normalizeResume({
    ...resume,
    meta: {
      ...(resume.meta || {}),
      updatedAt: new Date().toISOString()
    }
  })
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized))
  return normalized
}

export const clearCurrentResume = () => {
  localStorage.removeItem(STORAGE_KEY)
}
