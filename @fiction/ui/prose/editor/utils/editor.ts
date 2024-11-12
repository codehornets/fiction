import type { EndpointResponse } from '@fiction/core'

export type EditorSupplementary = Partial<{
  title: string
  subTitle: string
  outline: string
  description: string
  tags: string[]
  category: string
  author: string
  publishDate: string
  estimatedReadTime: number
  featuredImage: string
  keywords: string[]
}>

export function generateAutocompleteObjectives(supplementary: EditorSupplementary): Record<string, string> {
  const objectives: Record<string, string> = {}

  if (supplementary.title) {
    objectives.title = `Reference title of content: ${supplementary.title}`
  }

  if (supplementary.subTitle) {
    objectives.subTitle = `Consider the subtitle: ${supplementary.subTitle}`
  }

  if (supplementary.outline) {
    objectives.outline = `Follow the general outline: ${supplementary.outline}`
  }

  if (supplementary.description) {
    objectives.description = `Keep in mind the overall description: ${supplementary.description}`
  }

  if (supplementary.tags && supplementary.tags.length > 0) {
    objectives.tags = `Incorporate relevant concepts from these tags: ${supplementary.tags.join(', ')}`
  }

  if (supplementary.category) {
    objectives.category = `Align content with the category: ${supplementary.category}`
  }

  if (supplementary.keywords && supplementary.keywords.length > 0) {
    objectives.keywords = `Incorporate these key SEO terms naturally: ${supplementary.keywords.join(', ')}`
  }

  // Add a general instruction if any supplementary information is provided
  if (Object.keys(objectives).length > 0) {
    objectives.general = 'Use the provided supplementary information to guide your suggestions. Ensure they are contextually relevant, coherent with the overall content structure, and appropriate for a blog post format.'
  }

  return objectives
}

export function shouldSuggest(args: {
  previousText: string
  nextText: string
  minContextLength?: number
}): EndpointResponse {
  const {
    previousText,
    nextText,
    minContextLength = 12,
  } = args

  // Check for minimum context
  if (previousText.trim().length < minContextLength) {
    return {
      status: 'error',
      message: 'Not suggesting: insufficient context.',
    }
  }

  // Rule 1: Don't suggest if cursor is between parts of a word
  const isBetweenWord = /\w$/.test(previousText) && /^\w/.test(nextText)
  if (isBetweenWord) {
    return {
      status: 'error',
      message: '(mid word) Not suggesting: cursor is in the middle of a word.',
    }
  }

  // Rule 3: Only suggest when cursor is at specific positions
  const nextParagraph = nextText.split('\n')[0]
  const isEndOfLine = nextParagraph.trim().length === 0
  const isAtNewLine = previousText.endsWith('\n')
  const data = { nextParagraphLength: nextParagraph.trim().length, isAtNewLine }

  // Check if we're at a valid suggestion point
  if (isAtNewLine) {
    return {
      status: 'success',
      message: 'Suggesting(new line): cursor is at a new line',
      data,
    }
  }

  if (isEndOfLine) {
    return {
      status: 'success',
      message: 'Suggesting(end of line): cursor is at the end of a line with no additional text before next paragraph.',
      data,
    }
  }

  // If none of the valid suggestion conditions are met
  return {
    status: 'error',
    message: 'Not suggesting: cursor is not at a valid suggestion point.',
    data,
  }
}
