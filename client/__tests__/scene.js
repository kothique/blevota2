import Scene from '../scene'
import { Vector, V } from '../../common/vector'

function visibleChildren(node) {
  let visible = []

  for (let i = 0; i < node.children.length; i++) {
    if (node.children.item(i).getAttributeNS(null, 'visibility') === 'visible') {
      visible.push(node.children.item(i))
    }
  }

  return visible
}

describe('Scene', () => {
  test('should append new orbs to the SVG element', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
          scene = new Scene(svg),
          idA = 'a'.repeat(24),
          idB = 'b'.repeat(24)

    scene.newOrb(idA)
    scene.newOrb(idB)

    expect(visibleChildren(svg).length).toBe(2)
  })

  test('should render objects', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
          scene = new Scene(svg),
          id = 'a'.repeat(24)

    scene.newOrb(id)
    scene.updateOrb(id, {
      radius: 40,
      position: V(50, 100)
    })

    expect(visibleChildren(svg).length).toBe(1)

    const element = scene.getOrb(id).element
    expect(element.getAttributeNS(null, 'r')).toBe('40')
    expect(element.getAttributeNS(null, 'cx')).toBe('50')
    expect(element.getAttributeNS(null, 'cy')).toBe('100')
  })

  test('should remove objects', () => {
    const svg = document.createElementNS(null, 'svg'),
          scene = new Scene(svg),
          idA = 'a'.repeat(24),
          idB = 'b'.repeat(24),
          idC = 'c'.repeat(24)

    scene.newOrb(idA)
    scene.newOrb(idB)
    scene.newOrb(idC)

    scene.removeOrb(idB)
    expect(visibleChildren(svg).length).toBe(2)

    scene.removeOrb(idB)
    expect(visibleChildren(svg).length).toBe(2)

    scene.newOrb(idB)
    expect(visibleChildren(svg).length).toBe(3)

    scene.removeOrb(idC)
    expect(visibleChildren(svg).length).toBe(2)
  })
})