import type { template as featuresTemplate } from '@fiction/cards/content-features'
import type { template as heroTemplate } from '@fiction/cards/content-hero'
import type { template as callToActionTemplate } from '@fiction/cards/convert-cta'
import type { CardFactory } from '@fiction/site/cardFactory'

export async function getConfig(_args: { factory: CardFactory, templateId: string }) {
  const { factory } = _args

  return {
    demoPage: {
      cards: [
        await factory.fromTemplate<typeof heroTemplate>({
          templateId: 'contentHero',
          userConfig: {
            superTitle: {
              text: 'Text Animation System',
              icon: { class: 'i-tabler-typography' },
            },
            title: '[text_effect type=circle theme=blue]Transform[/text_effect] Your Content With [text_effect type=squiggle theme=orange]Dynamic[/text_effect] Effects',
            subTitle: 'Add visual interest to your text with animated underlines and highlights. Perfect for emphasizing key messages and creating engaging content.',
            action: {
              buttons: [
                { label: 'View Examples', design: 'ghost' },
                { label: 'Try it Now', design: 'solid', theme: 'primary' },
              ],
            },
          },
        }),
        await factory.fromTemplate<typeof featuresTemplate>({
          templateId: 'contentFeatures',
          userConfig: {
            features: [
              {
                title: '[text_effect type=line theme=blue]Simple Shortcodes[/text_effect]',
                description: 'Just wrap your text in shortcodes to add effects. Use type and theme attributes to customize the look.',
                icon: { class: 'i-tabler-code' },
              },
              {
                title: '[text_effect type=squiggle]Multiple Styles[/text_effect]',
                description: 'Choose from different animation styles: line, squiggle, circle, and scribble. Each adds its own character to your content.',
                icon: { class: 'i-tabler-brush' },
              },
              {
                title: '[text_effect type=circle theme=violet]Brand Colors[/text_effect]',
                description: 'Match your brand with theme colors. Use any color from your theme palette: primary, blue, emerald, violet, orange, and more.',
                icon: { class: 'i-tabler-palette' },
              },
              {
                title: '[text_effect type=scribble theme=rose]Attention Grabbing[/text_effect]',
                description: 'Naturally draw attention to important content. Perfect for headlines, calls-to-action, and key messages.',
                icon: { class: 'i-tabler-focus' },
              },
            ],
            layout: {
              style: 'grid',
              columns: '2',
              spacing: 'relaxed',
              align: 'left',
            },
          },
        }),
        await factory.fromTemplate<typeof callToActionTemplate>({
          templateId: 'convertCta',
          userConfig: {
            title: 'Ready to [text_effect type=circle theme=primary]Transform[/text_effect] Your Content?',
            subTitle: 'Start adding [text_effect type=line theme=emerald]eye-catching effects[/text_effect] to your text with simple shortcodes.',
            action: {
              buttons: [
                {
                  label: 'Get Started',
                  theme: 'primary',
                  design: 'solid',
                },
                {
                  label: 'Learn More',
                  design: 'ghost',
                },
              ],
            },
          },
        }),
      ],
    },
  }
}
