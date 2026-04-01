export interface LayoutZone {
  id: string
  name: string
  x: number
  y: number
  width: number
  height: number
  color: string
}

export interface LayoutObject {
  id: string
  kind: string
  label: string
  x: number
  y: number
}

export interface LayoutOverlays {
  lighting: boolean
  sound: boolean
  emergency: boolean
}

export interface RoomLayoutRecord {
  projectId: string
  ownerId: string
  width: number
  height: number
  zones: LayoutZone[]
  objects: LayoutObject[]
  overlays: LayoutOverlays
  updatedAt: Date
}
