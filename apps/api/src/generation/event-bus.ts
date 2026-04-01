import { EventEmitter } from 'node:events'

import type { GenerationEvent } from './types'

export class GenerationEventBus {
  private readonly emitter = new EventEmitter()

  publish(event: GenerationEvent): void {
    this.emitter.emit(this.channel(event.projectId), event)
  }

  subscribe(projectId: string, listener: (event: GenerationEvent) => void): () => void {
    const channel = this.channel(projectId)
    this.emitter.on(channel, listener)
    return () => {
      this.emitter.off(channel, listener)
    }
  }

  private channel(projectId: string): string {
    return `generation:${projectId}`
  }
}
