// config.ts
import type { CardFactory } from '@fiction/site/cardFactory'
import { MediaDisplaySchema } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'

// Schema defines all configurable options
export const schema = z.object({
  account: z.object({
    handle: z.string().optional(),
    isGridView: z.boolean().optional(),
    postCount: z.number().min(1).max(20).optional(),
  }).optional(),

  display: z.object({
    layout: z.enum(['grid', 'masonry', 'carousel']).optional(),
    showCaption: z.boolean().optional(),
    showLikes: z.boolean().optional(),
    showComments: z.boolean().optional(),

    imageSize: z.enum(['small', 'medium', 'large']).optional(),
    gap: z.enum(['none', 'sm', 'md', 'lg']).optional(),
  }).optional(),

  header: z.object({
    show: z.boolean().optional(),
    style: z.enum(['minimal', 'standard']).optional(),
    media: MediaDisplaySchema.optional(),
    showBio: z.boolean().optional(),
    showFollowers: z.boolean().optional(),
    showPostCount: z.boolean().optional(),
  }).optional(),

  action: z.object({
    show: z.boolean().optional(),
    text: z.string().optional(),
    link: z.string().optional(),
  }).optional(),
})

export type UserConfig = z.infer<typeof schema>

function getOptions(): InputOption[] {
  return [
    new InputOption({
      key: 'account',
      label: 'Instagram Account',
      input: 'group',
      options: [
        new InputOption({
          key: 'handle',
          label: 'Username',
          input: 'InputText',
          placeholder: '@username',
          isRequired: true,
        }),
        new InputOption({
          key: 'postCount',
          label: 'Number of Posts',
          input: 'InputNumber',
          props: {
            min: 1,
            max: 20,
          },
        }),
      ],
    }),

    new InputOption({
      key: 'display',
      label: 'Display Settings',
      input: 'group',
      options: [
        new InputOption({
          key: 'layout',
          label: 'Layout Style',
          input: 'InputRadio',
          props: {
            options: [
              { label: 'Grid', value: 'grid' },
              { label: 'Masonry', value: 'masonry' },
              { label: 'Carousel', value: 'carousel' },
            ],
          },
        }),
        new InputOption({
          key: 'showCaption',
          label: 'Show Captions',
          input: 'InputToggle',
        }),
        new InputOption({
          key: 'showLikes',
          label: 'Show Like Count',
          input: 'InputToggle',
        }),
        new InputOption({
          key: 'showComments',
          label: 'Show Comment Count',
          input: 'InputToggle',
        }),
        new InputOption({
          key: 'imageSize',
          label: 'Image Size',
          input: 'InputRadio',
          props: {
            options: [
              { label: 'Small', value: 'small' },
              { label: 'Medium', value: 'medium' },
              { label: 'Large', value: 'large' },
            ],
          },
        }),
        new InputOption({
          key: 'gap',
          label: 'Grid Spacing',
          input: 'InputRadio',
          props: {
            options: [
              { label: 'None', value: 'none' },
              { label: 'Small', value: 'sm' },
              { label: 'Medium', value: 'md' },
              { label: 'Large', value: 'lg' },
            ],
          },
        }),
      ],
    }),

    new InputOption({
      key: 'header',
      label: 'Profile Header',
      input: 'group',
      options: [
        new InputOption({
          key: 'show',
          label: 'Show Header',
          input: 'InputToggle',
        }),
        new InputOption({
          key: 'style',
          label: 'Header Style',
          input: 'InputRadio',
          props: {
            options: [
              { label: 'Minimal', value: 'minimal' },
              { label: 'Standard', value: 'standard' },
            ],
          },
        }),
        new InputOption({
          key: 'media',
          label: 'Custom Logo',
          input: 'InputMedia',
        }),
      ],
    }),

    new InputOption({
      key: 'action',
      label: 'Call to Action',
      input: 'group',
      options: [
        new InputOption({
          key: 'show',
          label: 'Show Follow Button',
          input: 'InputToggle',
        }),
        new InputOption({
          key: 'text',
          label: 'Button Text',
          input: 'InputText',
          placeholder: 'Follow on Instagram',
        }),
        new InputOption({
          key: 'link',
          label: 'Custom Link',
          input: 'InputUrl',
          placeholder: 'https://instagram.com/username',
        }),
      ],
    }),
  ]
}

export function getDefaultConfig(): UserConfig {
  return {
    account: {
      handle: '',
      postCount: 9,
    },
    display: {
      layout: 'grid',
      showCaption: true,
      showLikes: true,
      showComments: true,
      imageSize: 'medium',
      gap: 'md',
    },
    header: {
      show: true,
      style: 'standard',
    },
    action: {
      show: true,
      text: 'Follow on Instagram',
    },
  }
}

export function getDemoConfigs(templateId: string): Record<string, { templateId: string, userConfig: UserConfig }> {
  return {
    default: {
      templateId,
      userConfig: getDefaultConfig(),
    },
    minimal: {
      templateId,
      userConfig: {
        account: {
          handle: 'fiction',
          postCount: 6,
        },
        display: {
          layout: 'grid',
          showCaption: false,
          showLikes: false,
          showComments: false,
          imageSize: 'medium',
          gap: 'sm',
        },
        header: {
          show: false,
        },
        action: {
          show: false,
        },
      },
    },
    masonry: {
      templateId,
      userConfig: {
        account: {
          handle: 'fiction',
          postCount: 12,
        },
        display: {
          layout: 'masonry',
          showCaption: true,
          showLikes: true,
          showComments: true,
          imageSize: 'large',
          gap: 'lg',
        },
        header: {
          show: true,
          style: 'minimal',
        },
        action: {
          show: true,
          text: 'View More on Instagram',
        },
      },
    },
  }
}

export async function getConfig(args: { templateId: string, factory: CardFactory }) {
  return {
    schema,
    options: getOptions(),
    userConfig: getDefaultConfig(),
    demoPage: {
      cards: [
        ...Object.values(getDemoConfigs(args.templateId)),
      ],
    },
  }
}
