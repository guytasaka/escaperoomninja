import { z } from 'zod'

import { AIProvider, type TextGenerationConfig, type TextGenerationResult } from './base'

const chatResponseSchema = z.object({
  choices: z.array(
    z.object({
      message: z.object({
        content: z.string().nullable(),
      }),
    }),
  ),
  usage: z
    .object({
      prompt_tokens: z.number().optional(),
      completion_tokens: z.number().optional(),
    })
    .optional(),
  model: z.string().optional(),
})

type FetchFn = typeof fetch

export class OpenRouterProvider extends AIProvider {
  constructor(
    private readonly apiKey: string,
    private readonly fetchFn: FetchFn = fetch,
    private readonly apiUrl = 'https://openrouter.ai/api/v1/chat/completions',
  ) {
    super()
  }

  async generateText(config: TextGenerationConfig): Promise<TextGenerationResult> {
    const response = await this.fetchFn(this.apiUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        temperature: config.temperature,
        max_tokens: config.maxTokens,
        messages: [
          { role: 'system', content: config.systemPrompt },
          { role: 'user', content: config.userPrompt },
        ],
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenRouter request failed: ${response.status}`)
    }

    const payload = chatResponseSchema.parse(await response.json())
    const content = payload.choices[0]?.message.content ?? ''

    return {
      content,
      model: payload.model ?? config.model,
      usage: {
        inputTokens: payload.usage?.prompt_tokens ?? 0,
        outputTokens: payload.usage?.completion_tokens ?? 0,
      },
    }
  }

  async *generateTextStream(config: TextGenerationConfig): AsyncGenerator<string> {
    const response = await this.fetchFn(this.apiUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        temperature: config.temperature,
        max_tokens: config.maxTokens,
        stream: true,
        messages: [
          { role: 'system', content: config.systemPrompt },
          { role: 'user', content: config.userPrompt },
        ],
      }),
    })

    if (!response.ok || !response.body) {
      throw new Error(`OpenRouter stream request failed: ${response.status}`)
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffered = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        break
      }

      buffered += decoder.decode(value, { stream: true })
      const lines = buffered.split('\n')
      buffered = lines.pop() ?? ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed.startsWith('data:')) {
          continue
        }

        const data = trimmed.replace('data:', '').trim()
        if (data === '[DONE]') {
          return
        }

        try {
          const json = JSON.parse(data) as {
            choices?: Array<{ delta?: { content?: string } }>
          }
          const token = json.choices?.[0]?.delta?.content
          if (token) {
            yield token
          }
        } catch {}
      }
    }
  }
}
