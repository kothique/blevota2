import SPool from '../s-pool'

describe('SPool', () => {
  test('should pre-allocate objects on creation', () => {
    const pool = new SPool(document.createElementNS('http://www.w3.org/2000/svg', 'svg'), 42)

    expect(pool.length()).toBe(42)
  })

  test('should reuse objects', () => {
    const pool = new SPool(document.createElementNS('http://www.w3.org/2000/svg', 'svg'), 1),
          orb1 = pool.getOrb()

    pool.returnOrb(orb1)
    const orb2 = pool.getOrb()

    expect(orb1).toBe(orb2)
  })

  test('can provide more objects than was allocated at creation', () => {
    const pool = new SPool(document.createElementNS('http://www.w3.org/2000/svg', 'svg'), 2)

    let orbs = []

    function getOrbs(n = 4) {
      while (n-- > 0) {
        orbs.push(pool.getOrb())
      }
    }

    expect(getOrbs).not.toThrow()
    orbs.forEach((orb) => expect(orb).toBeDefined())
  })
})