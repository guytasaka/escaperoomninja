import { describe, expect, it } from 'vitest'

import { validateCreateProjectInput } from './create-project-flow'

describe('create project flow validation', () => {
  it('accepts valid inputs', () => {
    const parsed = validateCreateProjectInput({
      name: 'Ninja Crypt',
      genre: 'mystery',
      roomType: 'single-room',
    })

    expect(parsed.name).toBe('Ninja Crypt')
  })

  it('rejects invalid inputs', () => {
    expect(() => {
      validateCreateProjectInput({
        name: 'A',
        genre: '',
        roomType: '',
      })
    }).toThrow()
  })
})
