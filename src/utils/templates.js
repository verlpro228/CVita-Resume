import { templateCatalog } from '@/data/resumeBuilder'

export const templates = templateCatalog.reduce((map, template) => {
  map[template.id] = {
    ...template,
    icon: template.tags[0],
    image: template.previewImage,
    header: {
      background: template.id === 'modern' || template.id === 'minimal' || template.id === 'academic'
        ? '#ffffff'
        : template.accent,
      textColor: template.id === 'modern' || template.id === 'minimal' || template.id === 'academic'
        ? '#111827'
        : '#ffffff',
      accentColor: template.accent,
      gradient: ['classic', 'tech', 'creative'].includes(template.id)
    },
    section: {
      borderColor: template.accent,
      titleColor: template.accent,
      titleBorderColor: template.accent
    }
  }
  return map
}, {})

export const templateOptions = Object.values(templates)

export const getTemplate = (id) => templates[id] || templates.modern
