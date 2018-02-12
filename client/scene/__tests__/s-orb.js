import SOrb from '../s-orb'
import { Vector, V } from '../../../common/vector'

describe('SOrb', () => {
  test('SVG node should be created upon initializing', () => {
    const orb = new SOrb

    expect(orb.getNode()).toBeDefined()
  })

  test('render()', () => {
    const orb = new SOrb

    orb.render({
      radius: 30,
      position: V(100, 200),
      maxHp: 150,
      hp: 130,
      maxMp: 115,
      mp: 80
    })

    expect(orb.getNode().getAttributeNS(null, 'transform')).toMatch(/translate\(100,? 200\)/)
  })
})