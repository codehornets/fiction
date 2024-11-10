<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { BrandGuide } from '../guideSchema'
import type { TableBrand } from '../schema'
import SettingsPanel from '@fiction/admin/settings/SettingsPanel.vue'
import { vue } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import FormEngine from '@fiction/ui/inputs/FormEngine.vue'
import { brandArchetypes } from '../guideSchema'

const { card, brand } = defineProps<{
  card: Card
  brand?: TableBrand
}>()

const guide = vue.computed(() => brand?.guide)

function getWordCount(text?: string) {
  if (!text)
    return 0
  return text.split(/\s+/).length
}

const options = vue.computed(() => {
  return [
    // Brand Personality Section
    new InputOption({
      key: 'personality',
      label: 'Brand Personality',
      input: 'group',
      options: [
        new InputOption({
          testId: 'brand-archetype',
          key: 'archetype',
          icon: { class: 'i-tabler-mask' },
          label: 'Brand Archetype',
          subLabel: 'Select your core archetype that reflects how you connect with others',
          input: 'InputControl',
          valueDisplay: ({ input }) => {
            const selected = brandArchetypes.find(a => a.value === guide.value?.personality?.archetype)
            return {
              status: selected ? 'ready' : 'incomplete',
              data: selected ? `${selected.name} - ${selected.desc}` : 'Select an archetype',
            }
          },
          options: [
            new InputOption({
              key: 'archetype',
              label: 'Brand Archetype',
              input: 'InputSelectCustom',
              list: brandArchetypes.map(a => ({
                name: a.name,
                value: a.value,
                description: a.desc,
              })),
              isRequired: true,
            }),
          ],
        }),

        new InputOption({
          testId: 'brand-traits',
          key: 'traits',
          icon: { class: 'i-tabler-list-details' },
          label: 'Brand Traits',
          subLabel: 'Define 3-5 distinctive personality traits',
          input: 'InputControl',
          valueDisplay: ({ input }) => {
            const traits = guide.value?.personality?.traits || []
            return {
              status: traits.length >= 3 && traits.length <= 5 ? 'ready' : 'incomplete',
              data: traits.length ? traits.join(', ') : 'Add personality traits',
              message: traits.length < 3 ? 'Add at least 3 traits' : traits.length > 5 ? 'Maximum 5 traits' : undefined,
            }
          },
          options: [
            new InputOption({
              key: 'traits',
              label: 'Brand Traits',
              input: 'InputList',
              props: {
                minItems: 3,
                maxItems: 5,
                placeholder: 'Enter a trait',
              },
            }),
          ],
        }),

        new InputOption({
          testId: 'brand-voice',
          key: 'voice',
          icon: { class: 'i-tabler-message-circle' },
          label: 'Brand Voice',
          subLabel: 'Define your communication style',
          input: 'InputControl',
          valueDisplay: ({ input }) => {
            const tone = guide.value?.personality?.voice?.tone
            const guidelines = guide.value?.personality?.voice?.guidelines
            const hasVoice = tone && getWordCount(tone) >= 10 && guidelines && getWordCount(guidelines) >= 20
            return {
              status: hasVoice ? 'ready' : 'incomplete',
              data: hasVoice ? `${getWordCount(tone)} words tone, ${getWordCount(guidelines)} words guidelines` : 'Complete voice details',
            }
          },
          options: [
            new InputOption({
              key: 'voice.tone',
              label: 'Tone of Voice',
              input: 'InputTextarea',
              isRequired: true,
              placeholder: 'Describe your authentic communication style...',
            }),
            new InputOption({
              key: 'voice.guidelines',
              label: 'Voice Guidelines',
              input: 'InputTextarea',
              isRequired: true,
              placeholder: 'Specific examples of language and phrases...',
            }),
          ],
        }),

        new InputOption({
          testId: 'brand-story',
          key: 'story',
          icon: { class: 'i-tabler-book' },
          label: 'Brand Story',
          subLabel: 'Share your journey and key moments',
          input: 'InputControl',
          valueDisplay: ({ input }) => {
            const journey = guide.value?.personality?.story?.journey
            const moments = guide.value?.personality?.story?.pivotalMoments || []
            const hasStory = journey && getWordCount(journey) >= 50 && moments.length >= 2
            return {
              status: hasStory ? 'ready' : 'incomplete',
              data: hasStory ? `${getWordCount(journey)} words, ${moments.length} key moments` : 'Complete your story',
            }
          },
          options: [
            new InputOption({
              key: 'story.journey',
              label: 'Your Journey',
              input: 'InputTextarea',
              isRequired: true,
              placeholder: 'Share your authentic personal narrative...',
            }),
            new InputOption({
              key: 'story.pivotalMoments',
              label: 'Pivotal Moments',
              input: 'InputList',
              props: {
                minItems: 2,
                placeholder: 'Describe a key moment in your journey',
              },
            }),
          ],
        }),
      ],
      format: 'control',
    }),

    // Brand Purpose Section
    new InputOption({
      key: 'purpose',
      label: 'Brand Purpose',
      input: 'group',
      options: [
        new InputOption({
          testId: 'brand-mission',
          key: 'mission',
          icon: { class: 'i-tabler-target' },
          label: 'Brand Mission',
          subLabel: 'Define your core motivation',
          input: 'InputControl',
          valueDisplay: ({ input }) => {
            const mission = guide.value?.purpose?.mission
            const wordCount = getWordCount(mission)
            return {
              status: wordCount >= 15 ? 'ready' : 'incomplete',
              data: mission || 'Define your mission',
              message: wordCount < 15 ? 'Mission should be at least 15 words' : undefined,
            }
          },
          options: [
            new InputOption({
              key: 'mission',
              label: 'Mission Statement',
              input: 'InputTextarea',
              isRequired: true,
              placeholder: 'What drives you to share and serve others?',
            }),
          ],
        }),

        new InputOption({
          testId: 'brand-vision',
          key: 'vision',
          icon: { class: 'i-tabler-eye' },
          label: 'Brand Vision',
          subLabel: 'Define the lasting impact you want to have',
          input: 'InputControl',
          valueDisplay: ({ input }) => {
            const vision = guide.value?.purpose?.vision
            const wordCount = getWordCount(vision)
            return {
              status: wordCount >= 20 ? 'ready' : 'incomplete',
              data: vision || 'Define your vision',
              message: wordCount < 20 ? 'Vision should be at least 20 words' : undefined,
            }
          },
          options: [
            new InputOption({
              key: 'vision',
              label: 'Vision Statement',
              input: 'InputTextarea',
              isRequired: true,
              placeholder: 'What lasting impact do you want your brand to have?',
            }),
          ],
        }),

        new InputOption({
          testId: 'brand-positioning',
          key: 'positioning',
          icon: { class: 'i-tabler-chart-dots' },
          label: 'Brand Positioning',
          subLabel: 'Define your unique perspective',
          input: 'InputControl',
          valueDisplay: ({ input }) => {
            const positioning = guide.value?.purpose?.positioning
            const wordCount = getWordCount(positioning)
            return {
              status: wordCount >= 15 ? 'ready' : 'incomplete',
              data: positioning || 'Define your positioning',
              message: wordCount < 15 ? 'Positioning should be at least 15 words' : undefined,
            }
          },
          options: [
            new InputOption({
              key: 'positioning',
              label: 'Positioning Statement',
              input: 'InputTextarea',
              isRequired: true,
              placeholder: 'What sets you apart in your field?',
            }),
          ],
        }),

        new InputOption({
          testId: 'brand-values',
          key: 'values',
          icon: { class: 'i-tabler-heart' },
          label: 'Brand Values',
          subLabel: 'Define your core values and how you demonstrate them',
          input: 'InputControl',
          valueDisplay: ({ input }) => {
            const values = guide.value?.purpose?.values || []
            return {
              status: values.length >= 3 ? 'ready' : 'incomplete',
              data: values.length ? `${values.length} core values defined` : 'Add core values',
              message: values.length < 3 ? 'Define at least 3 core values' : undefined,
            }
          },
          options: [
            new InputOption({
              key: 'values',
              label: 'Core Values',
              input: 'InputList',
              props: {
                template: {
                  value: '',
                  description: '',
                  inPractice: '',
                },
                minItems: 3,
                itemFormat: [
                  { key: 'value', label: 'Value', input: 'InputText', placeholder: 'Core value name' },
                  { key: 'description', label: 'Description', input: 'InputTextarea', placeholder: 'What this value means to you' },
                  { key: 'inPractice', label: 'In Practice', input: 'InputTextarea', placeholder: 'How you demonstrate this value' },
                ],
              },
            }),
          ],
        }),
      ],
      format: 'control',
    }),
    // Communities Section
    new InputOption({
      key: 'communities',
      label: 'Target Communities',
      input: 'group',
      options: [
        new InputOption({
          testId: 'audience-segments',
          key: 'communities',
          icon: { class: 'i-tabler-users' },
          label: 'Audience Segments',
          subLabel: 'Define your key audience segments',
          input: 'InputControl',
          valueDisplay: ({ input }) => {
            const communities = guide.value?.communities || []
            const isComplete = communities.every(c =>
              c.interests?.length && c.challenges?.length && c.content?.length,
            )
            return {
              status: communities.length >= 1 && isComplete ? 'ready' : 'incomplete',
              data: communities.length ? `${communities.length} segments defined` : 'Add audience segments',
              message: !isComplete ? 'Complete all segment details' : undefined,
            }
          },
          options: [
            new InputOption({
              key: 'communities',
              label: 'Audience Segments',
              input: 'InputList',
              props: {
                template: {
                  name: '',
                  interests: [],
                  challenges: [],
                  content: [],
                },
                minItems: 1,
                itemFormat: [
                  { key: 'name', label: 'Segment Name', input: 'InputText', placeholder: 'Name this audience segment' },
                  { key: 'interests', label: 'Interests', input: 'InputList', placeholder: 'Add topics that matter to this audience' },
                  { key: 'challenges', label: 'Challenges', input: 'InputList', placeholder: 'Add pain points this audience faces' },
                  { key: 'content', label: 'Content Types', input: 'InputList', placeholder: 'Add content formats that resonate' },
                ],
              },
            }),
          ],
        }),
      ],
      format: 'control',
    }),

    new InputOption({
      key: 'pillars',
      label: 'Content Pillars',
      input: 'group',
      options: [
        new InputOption({
          testId: 'content-pillars',
          key: 'pillars',
          icon: { class: 'i-tabler-layout-columns' },
          label: 'Content Themes',
          subLabel: 'Define your key content areas',
          input: 'InputControl',
          valueDisplay: ({ input }) => {
            const pillars = guide.value?.pillars || []
            const isComplete = pillars.every(p =>
              getWordCount(p.description) >= 20 && p.examples?.length >= 3 && p.audiences?.length >= 1,
            )
            return {
              status: pillars.length >= 3 && isComplete ? 'ready' : 'incomplete',
              data: pillars.length ? `${pillars.length} content pillars defined` : 'Add content pillars',
              message: pillars.length < 3 ? 'Define at least 3 pillars' : !isComplete ? 'Complete all pillar details' : undefined,
            }
          },
          options: [
            new InputOption({
              key: 'pillars',
              label: 'Content Pillars',
              input: 'InputList',
              props: {
                template: {
                  topic: '',
                  description: '',
                  examples: [],
                  audiences: [],
                },
                minItems: 3,
                itemFormat: [
                  { key: 'topic', label: 'Topic', input: 'InputText', placeholder: 'Content theme name' },
                  { key: 'description', label: 'Description', input: 'InputTextarea', placeholder: 'How this theme serves your audience' },
                  { key: 'examples', label: 'Content Examples', input: 'InputList', placeholder: 'Add specific content ideas', minItems: 3 },
                  { key: 'audiences', label: 'Target Audiences', input: 'InputList', placeholder: 'Add audience segments this serves', minItems: 1 },
                ],
              },
            }),
          ],
        }),
      ],
      format: 'control',
    }),

    // Future Pacing Section
    new InputOption({
      key: 'futurePacing',
      label: 'Future Vision',
      input: 'group',
      options: [
        new InputOption({
          testId: 'future-declaration',
          key: 'declaration',
          icon: { class: 'i-tabler-rocket' },
          label: 'Future Vision',
          subLabel: 'Write your vision as if already achieved',
          input: 'InputControl',
          valueDisplay: ({ input }) => {
            const declaration = guide.value?.futurePacing?.declaration
            const wordCount = getWordCount(declaration)
            return {
              status: wordCount >= 50 ? 'ready' : 'incomplete',
              data: declaration ? `${wordCount} word vision statement` : 'Write your vision',
              message: wordCount < 50 ? 'Vision should be at least 50 words' : undefined,
            }
          },
          options: [
            new InputOption({
              key: 'declaration',
              label: 'Vision Statement',
              input: 'InputTextarea',
              isRequired: true,
              placeholder: 'Write your ambitious future vision...',
            }),
          ],
        }),

        new InputOption({
          testId: 'next-steps',
          key: 'nextSteps',
          icon: { class: 'i-tabler-list-check' },
          label: 'Action Plan',
          subLabel: 'Define concrete steps to achieve your vision',
          input: 'InputControl',
          valueDisplay: ({ input }) => {
            const steps = guide.value?.futurePacing?.nextSteps || []
            const isComplete = steps.every(s => s.statement && s.action && s.deadline)
            return {
              status: steps.length >= 3 && isComplete ? 'ready' : 'incomplete',
              data: steps.length ? `${steps.length} action steps defined` : 'Add action steps',
              message: steps.length < 3 ? 'Define at least 3 steps' : !isComplete ? 'Complete all step details' : undefined,
            }
          },
          options: [
            new InputOption({
              key: 'nextSteps',
              label: 'Action Steps',
              input: 'InputList',
              props: {
                template: {
                  statement: '',
                  action: '',
                  deadline: '',
                },
                minItems: 3,
                itemFormat: [
                  { key: 'statement', label: 'Milestone', input: 'InputText', placeholder: 'What you want to achieve' },
                  { key: 'action', label: 'Action', input: 'InputTextarea', placeholder: 'Specific action to take' },
                  { key: 'deadline', label: 'Deadline', input: 'InputText', placeholder: 'When you\'ll achieve this' },
                ],
              },
            }),
          ],
        }),
      ],
      format: 'control',
    }),

    // Visuals Section
    new InputOption({
      key: 'visuals',
      label: 'Visual Identity',
      input: 'group',
      options: [
        new InputOption({
          testId: 'brand-color',
          key: 'primaryColor',
          icon: { class: 'i-tabler-palette' },
          label: 'Brand Color',
          subLabel: 'Choose your signature color',
          input: 'InputControl',
          valueDisplay: ({ input }) => {
            const color = guide.value?.visuals?.primaryColor
            return {
              status: color ? 'ready' : 'incomplete',
              data: color || 'Select primary color',
            }
          },
          options: [
            new InputOption({
              key: 'primaryColor',
              label: 'Primary Color',
              input: 'InputColor',
              isRequired: true,
            }),
          ],
        }),

        new InputOption({
          testId: 'typography',
          key: 'typography',
          icon: { class: 'i-tabler-typography' },
          label: 'Typography',
          subLabel: 'Define your brand fonts',
          input: 'InputControl',
          valueDisplay: ({ input }) => {
            const typography = guide.value?.visuals?.typography
            return {
              status: typography?.title && typography?.body ? 'ready' : 'incomplete',
              data: typography?.title ? `${typography.title} / ${typography.body}` : 'Set brand typography',
            }
          },
          options: [
            new InputOption({
              key: 'typography.title',
              label: 'Heading Font',
              input: 'InputFont',
              isRequired: true,
            }),
            new InputOption({
              key: 'typography.body',
              label: 'Body Font',
              input: 'InputFont',
              isRequired: true,
            }),
          ],
        }),

        new InputOption({
          testId: 'image-style',
          key: 'imageStyle',
          icon: { class: 'i-tabler-photo' },
          label: 'Image Style',
          subLabel: 'Define your visual guidelines',
          input: 'InputControl',
          valueDisplay: ({ input }) => {
            const style = guide.value?.visuals?.imageStyle
            const wordCount = getWordCount(style)
            return {
              status: wordCount >= 30 ? 'ready' : 'incomplete',
              data: style ? `${wordCount} words of guidelines` : 'Define image guidelines',
              message: wordCount < 30 ? 'Guidelines should be at least 30 words' : undefined,
            }
          },
          options: [
            new InputOption({
              key: 'imageStyle',
              label: 'Image Guidelines',
              input: 'InputTextarea',
              isRequired: true,
              placeholder: 'Describe your visual style guidelines...',
            }),
          ],
        }),
      ],
      format: 'control',
    }),

  ]
})

function updateGuide(value: Partial<BrandGuide>) {
  //
}
</script>

<template>
  <SettingsPanel
    :title="card?.title.value"
    :header="{
      title: brand?.title || 'Untitled',
      subTitle: 'Your brand guidelines helps you create assets and content that aligns with your goals',
      media: { class: `i-tabler-briefcase` },
      actions: [],
    }"
  >
    <div class="my-6 space-y-6">
      <FormEngine
        :model-value="guide"
        state-key="settingsTool"
        ui-size="lg"
        :options="options"
        :card="card"
        format="control"
        @update:model-value="updateGuide"
      />
    </div>
  </SettingsPanel>
</template>
