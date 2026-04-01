import { describe, expect, it } from 'vitest'

import { OpenRouterProvider } from './openrouter'

describe('OpenRouterProvider', () => {
  it('parses non-stream completion response', async () => {
    const provider = new OpenRouterProvider(
      'test-key',
      async () => {
        return new Response(
          JSON.stringify({
            choices: [{ message: { content: 'Generated concept' } }],
            usage: { prompt_tokens: 10, completion_tokens: 20 },
            model: 'openrouter/model-a',
          }),
          { status: 200 },
        )
      },
      'https://example.test',
    )

    const result = await provider.generateText({
      model: 'openrouter/model-a',
      systemPrompt: 'You are a game designer',
      userPrompt: 'Create a concept',
    })

    expect(result.content).toBe('Generated concept')
    expect(result.usage.inputTokens).toBe(10)
    expect(result.usage.outputTokens).toBe(20)
  })

  it('streams token chunks from sse response', async () => {
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        const encoder = new TextEncoder()
        controller.enqueue(
          encoder.encode(
            'data: {"choices":[{"delta":{"content":"Hello"}}]}\n' +
              'data: {"choices":[{"delta":{"content":" world"}}]}\n' +
              'data: [DONE]\n',
          ),
        )
        controller.close()
      },
    })

    const provider = new OpenRouterProvider(
      'test-key',
      async () => {
        return new Response(stream, { status: 200 })
      },
      'https://example.test',
    )

    const collected: string[] = []
    for await (const token of provider.generateTextStream({
      model: 'openrouter/model-a',
      systemPrompt: 'x',
      userPrompt: 'y',
      stream: true,
    })) {
      collected.push(token)
    }

    expect(collected.join('')).toBe('Hello world')
  })
})
