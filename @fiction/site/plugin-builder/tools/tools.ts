import type { EditorTool } from '@fiction/admin'
import type { Site } from '../../site'
import { AdminEditorController } from '@fiction/admin'
import { vue } from '@fiction/core'

export type ToolKeys = 'managePages' | 'addPage' | 'editPage' | 'editLayout' | 'ai' | 'global' | 'publish' | 'editCard' | 'styling'

export const tools = [
  {
    toolId: 'editLayout',
    title: 'Edit Layout',
    icon: 'i-tabler-square-plus',
    widthClasses: 'w-[430px]',
    el: vue.defineAsyncComponent(async () => import('./ToolPageLayout.vue')),
    isPrimary: true,
  },
  {
    toolId: 'editPage',
    title: 'Edit Page Details',
    icon: 'i-tabler-file',
    widthClasses: 'w-[430px]',
    el: vue.defineAsyncComponent(async () => import('./ToolPageEdit.vue')),
    isPrimary: true,
  },
  {
    toolId: 'managePages',
    icon: 'i-tabler-stack',
    title: 'Add and Manage Pages',
    el: vue.defineAsyncComponent(async () => import('./PageToolMaster.vue')),
    isPrimary: true,
  },
  {
    toolId: 'addPage',
    title: 'Add New Page',
    icon: 'i-tabler-file-plus',
    el: vue.defineAsyncComponent(async () => import('./ToolPageAdd.vue')),
  },
  {
    toolId: 'global',
    title: 'Metatags and SEO',
    icon: 'i-tabler-tags',
    isPrimary: true,
    widthClasses: 'w-[500px]',
    el: vue.defineAsyncComponent(async () => import('./ToolPageGlobal.vue')),
  },
  {
    toolId: 'styling',
    title: 'Fonts and Colors',
    icon: 'i-tabler-palette',
    isPrimary: true,
    el: vue.defineAsyncComponent(async () => import('./ToolGlobalStyling.vue')),
  },
  {
    toolId: 'publish',
    title: 'Domain Settings',
    icon: 'i-tabler-world',
    isPrimary: true,
    widthClasses: 'w-[600px]',
    el: vue.defineAsyncComponent(async () => import('./ToolPagePublish.vue')),
  },
  {
    toolId: 'editCard',
    title: 'Edit Element',
    icon: 'i-tabler-edit-circle',
    location: 'context',
    isDefault: true,
    props: (args) => {
      const p = args as { site?: Site }
      return vue.computed(() => {
        const c = p.site?.activeCard.value
        const cardTitle = c?.title.value || c?.tpl.value?.settings.title
        const title = p.site?.editor.value.selectedCardId ? cardTitle : 'Select Element'
        const icon = c?.tpl.value?.settings.icon || 'i-tabler-click'
        const colorTheme = c?.tpl.value?.settings.colorTheme || 'theme'
        return { title, icon, colorTheme }
      })
    },
    el: vue.defineAsyncComponent(async () => import('./ToolCardEdit.vue')),
  },
] as const satisfies EditorTool<ToolKeys>[]

export const adminEditorController = new AdminEditorController<{ toolIds: ToolKeys }>({ tools })
