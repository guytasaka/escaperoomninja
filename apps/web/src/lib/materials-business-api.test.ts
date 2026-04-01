import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  enrichMaterials,
  generateBusinessPlan,
  generateMaterials,
  getBudgetSummary,
  listMaterials,
  updateMaterial,
} from './api'

describe('materials and business api client', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('handles materials generation and updates', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            data: {
              items: [
                {
                  id: 'm1',
                  projectId: 'p1',
                  category: 'props',
                  name: 'Cipher Wheel Kit',
                  quantity: 1,
                  unitCost: 35,
                  vendorUrl: null,
                  alternatives: [],
                  threeDPrintable: true,
                },
              ],
            },
          }),
          { status: 200 },
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            data: {
              items: [
                {
                  id: 'm1',
                  projectId: 'p1',
                  category: 'props',
                  name: 'Cipher Wheel Kit',
                  quantity: 1,
                  unitCost: 35,
                  vendorUrl: 'https://shop.test/m1',
                  alternatives: ['Alt A', 'Alt B'],
                  threeDPrintable: true,
                },
              ],
            },
          }),
          { status: 200 },
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            data: {
              item: {
                id: 'm1',
                projectId: 'p1',
                category: 'props',
                name: 'Cipher Wheel Kit',
                quantity: 2,
                unitCost: 40,
                vendorUrl: 'https://shop.test/m1',
                alternatives: ['Alt A', 'Alt B'],
                threeDPrintable: true,
              },
            },
          }),
          { status: 200 },
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            data: {
              items: [
                {
                  id: 'm1',
                  projectId: 'p1',
                  category: 'props',
                  name: 'Cipher Wheel Kit',
                  quantity: 2,
                  unitCost: 40,
                  vendorUrl: 'https://shop.test/m1',
                  alternatives: ['Alt A', 'Alt B'],
                  threeDPrintable: true,
                },
              ],
            },
          }),
          { status: 200 },
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            data: {
              summary: {
                projectId: 'p1',
                totalsByCategory: { props: 80, electronics: 0, decor: 0, tools: 0, misc: 0 },
                totalCost: 80,
                allocatedBudget: 300,
                remainingBudget: 220,
              },
            },
          }),
          { status: 200 },
        ),
      )

    const generated = await generateMaterials('https://api.test', 'token', 'p1')
    expect(generated.length).toBe(1)

    const enriched = await enrichMaterials('https://api.test', 'token', 'p1')
    expect(enriched[0]?.vendorUrl).toContain('shop.test')

    const updated = await updateMaterial('https://api.test', 'token', 'p1', 'm1', {
      quantity: 2,
      unitCost: 40,
    })
    expect(updated.quantity).toBe(2)

    const listed = await listMaterials('https://api.test', 'token', 'p1')
    expect(listed[0]?.quantity).toBe(2)

    const summary = await getBudgetSummary('https://api.test', 'token', 'p1', 300)
    expect(summary.totalCost).toBe(80)
  })

  it('loads generated business plan', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          data: {
            plan: {
              projectId: 'p1',
              pricingStrategy: 'Tiered pricing strategy.',
              financialProjection: 'Break-even in six months.',
              marketingPlan: 'Campaign via social channels.',
            },
          },
        }),
        { status: 200 },
      ),
    )

    const plan = await generateBusinessPlan('https://api.test', 'token', 'p1')
    expect(plan.projectId).toBe('p1')
    expect(plan.pricingStrategy).toContain('Tiered')
  })
})
