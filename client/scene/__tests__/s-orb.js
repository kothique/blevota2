import SOrb from '../s-orb'
import { Vector, V } from '../../../common/vector'

describe('SOrb', () => {
  test('render()', () => {
    const orb = new SOrb

    orb.render({
      radius: 30,
      position: V(100, 200)
    })

    expect(orb.element.getAttributeNS(null, 'r')).toBe('30')
    expect(orb.element.getAttributeNS(null, 'cx')).toBe('100')
    expect(orb.element.getAttributeNS(null, 'cy')).toBe('200')
  })
})