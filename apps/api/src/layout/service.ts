import type { AuthSession } from '../auth/types'
import type { ProjectService } from '../projects/service'

import type { LayoutStore } from './store'
import type { RoomLayoutRecord } from './types'

export class LayoutService {
  constructor(
    private readonly layoutStore: LayoutStore,
    private readonly projectService: ProjectService,
  ) {}

  async save(session: AuthSession, input: Omit<RoomLayoutRecord, 'ownerId' | 'updatedAt'>) {
    await this.projectService.getById(session, input.projectId)
    return await this.layoutStore.save({
      ...input,
      ownerId: session.userId,
      updatedAt: new Date(),
    })
  }

  async get(session: AuthSession, projectId: string) {
    await this.projectService.getById(session, projectId)
    return await this.layoutStore.get(projectId)
  }

  async exportSvg(session: AuthSession, projectId: string): Promise<string> {
    const layout = await this.get(session, projectId)
    if (!layout) {
      return '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"></svg>'
    }

    const zoneRects = layout.zones
      .map(
        (zone) =>
          `<rect x="${zone.x}" y="${zone.y}" width="${zone.width}" height="${zone.height}" fill="${zone.color}" opacity="0.3" />`,
      )
      .join('')

    const objectMarks = layout.objects
      .map(
        (obj) =>
          `<g><circle cx="${obj.x}" cy="${obj.y}" r="8" fill="#1f2937" /><text x="${obj.x + 12}" y="${obj.y}" font-size="12">${obj.label}</text></g>`,
      )
      .join('')

    return [
      `<svg xmlns="http://www.w3.org/2000/svg" width="${layout.width}" height="${layout.height}">`,
      `<rect width="${layout.width}" height="${layout.height}" fill="#f8fafc" />`,
      zoneRects,
      objectMarks,
      '</svg>',
    ].join('')
  }
}
