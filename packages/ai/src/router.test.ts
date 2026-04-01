import { describe, expect, it } from 'vitest'

import { MockImageProvider } from './providers/mock-image'
import { MockTextProvider } from './providers/mock-text'
import { OpenAIImageProvider } from './providers/openai-image'
import { OpenRouterProvider } from './providers/openrouter'
import { TaskRouter } from './router'

describe('TaskRouter', () => {
  it('returns mock providers when keys are missing', () => {
    const router = new TaskRouter({
      llmModel: 'openai/gpt-4o-mini',
    })

    expect(router.getTextProvider()).toBeInstanceOf(MockTextProvider)
    expect(router.getImageProvider()).toBeInstanceOf(MockImageProvider)
  })

  it('returns configured providers when keys are available', () => {
    const router = new TaskRouter({
      llmModel: 'openai/gpt-4o-mini',
      openRouterApiKey: 'or-key',
      openAiApiKey: 'oa-key',
    })

    expect(router.getTextProvider()).toBeInstanceOf(OpenRouterProvider)
    expect(router.getImageProvider()).toBeInstanceOf(OpenAIImageProvider)
  })
})
