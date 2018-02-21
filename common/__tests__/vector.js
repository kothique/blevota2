const { Vector, V } = require('../vector')

describe('Vector', () => {
  test('new Vector(x, y) is the same as V(x, y)', () => {
    expect(new Vector(0, 0)).toEqual(V(0, 0))
    expect(new Vector(0, 1)).toEqual(V(0, 1))
    expect(new Vector(1, 0)).toEqual(V(1, 0))
    expect(new Vector(1, 1)).toEqual(V(1, 1))
  })

  test('v.clone() and v are different objects', () => {
    let v = V(1, 2)

    expect(v.clone()).not.toBe(v)
  })

  test('length()', () => {
    expect(V(0, 0).length()).toBeCloseTo(0)
    expect(V(1, 2).length()).toBeCloseTo(2.2360)
    expect(V(-1, 2).length()).toBeCloseTo(2.2360)
  })

  describe('equals()', () => {
    test('should be like (===) on vector components', () => {
      expect(V(0, 0).equals(V(0, 0))).toBeTruthy()
      expect(V(-0, +0).equals(V(0, 0))).toBeTruthy()
      expect(V(NaN, 0).equals(V(NaN, 0))).toBeFalsy()
    })

    test('Vector.equal(v1, v2) === v1.equals(v2)', () => {
      expect(Vector.equal(V(0, 0), V(0, 0))).toBeTruthy()
      expect(Vector.equal(V(-0, +0), V(0, 0))).toBeTruthy()
      expect(Vector.equal(V(NaN, 0), V(NaN, 0))).toBeFalsy()
    })

    test('with specified accuracy', () => {
      expect(V(1.234, 1.853).equals(V(1.235, 1.856), 1e-2)).toBeTruthy()
      expect(V(1.234, 1.853).equals(V(1.235, 1.856), 1e-3)).toBeFalsy()
      expect(V(-1.23, 1.85).equals(V(-1.23, 1.85), 1e-2)).toBeTruthy()
      expect(V(1.23, 1.85).equals(V(-1.23, 1.85), 1e-2)).toBeFalsy()
    })
  })

  describe('angle()', () => {
    test('some arbitrary data', () => {
      expect(V(0, 0).angle()).toBeCloseTo(0) // corner case
      expect(V(1, 0).angle()).toBeCloseTo(0)
      expect(V(0, 1).angle()).toBeCloseTo(Math.PI * 0.5)
      expect(V(-0, 1).angle()).toBeCloseTo(Math.PI * 0.5)
      expect(V(-1, 0).angle()).toBeCloseTo(Math.PI)
      expect(V(-1, +0).angle()).toBeCloseTo(Math.PI)
      expect(V(0, -1).angle()).toBeCloseTo(-Math.PI * 0.5)
      expect(V(+0, -1).angle()).toBeCloseTo(-Math.PI * 0.5)
    })

    test('the result is within [-PI, PI]', () => {
      [
        V(0, 0),
        V(-0, -0),
        V(1, 0),
        V(0, 1),
        V(-0, 1),
        V(-1, 0),
        V(0, -1),
        V(-0, -1)
      ].forEach((v) => {
        const angle = v.angle()

        expect(angle).toBeLessThanOrEqual(Math.PI)
        expect(angle).toBeGreaterThanOrEqual(-Math.PI)
      })
    })
  })

  describe('add()', () => {
    test('some arbitrary data', () => {
      expect(V(0, 0).add(V(1, 2))).toEqual(V(1, 2))
      expect(V(-1, -2).add(V(1, 2))).toEqual(V(0, 0))
    })

    test('mutates the instance', () => {
      const v = V(-1.5, 2.8)
      v.add(V(0.4, -1.9))

      expect(v).toEqual(V(-1.5 + 0.4, 2.8 + (-1.9)))
    })
  })

  describe('static add()', () => {
    test('some arbitrary data', () => {
      expect(Vector.add(V(0, 0), V(1, 2))).toEqual(V(1, 2))
      expect(Vector.add(V(-1, -2), V(1, 2))).toEqual(V(0, 0))
    })

    test('does not mutate the instance', () => {
      const v = V(-1.5, 2.8)

      expect(Vector.add(v, V(0.4, -1.9))).toEqual(V(-1.5 + 0.4, 2.8 + (-1.9)))
      expect(v).toEqual(V(-1.5, 2.8))
    })
  })

  describe('subtract()', () => {
    test('some arbitrary data', () => {
      expect(V(0, 0).subtract(V(1, 2))).toEqual(V(-1, -2))
      expect(V(-1, -2).subtract(V(1, 2))).toEqual(V(-2, -4))
    })

    test('mutates the instance', () => {
      const v = V(-1.5, 2.8)
      v.subtract(V(0.4, -1.9))

      expect(v).toEqual(V(-1.5 - 0.4, 2.8 - (-1.9)))
    })
  })

  describe('static subtract()', () => {
    test('some arbitrary data', () => {
      expect(Vector.subtract(V(0, 0), V(1, 2))).toEqual(V(-1, -2))
      expect(Vector.subtract(V(-1, -2), V(1, 2))).toEqual(V(-2, -4))
    })

    test('does not mutate the instance', () => {
      const v = V(-1.5, 2.8)

      expect(Vector.subtract(v, V(0.4, -1.9))).toEqual(V(-1.5 - 0.4, 2.8 - (-1.9)))
      expect(v).toEqual(V(-1.5, 2.8))
    })
  })

  describe('multiply()', () => {
    test('some arbitrary data', () => {
      expect(V(0, 0).multiply(-123)).toEqual(V(-0, -0))
      expect(V(1, 2).multiply(0.8)).toEqual(V(1 * 0.8, 2 * 0.8))
    })

    test('mutates the instance', () => {
      const v = V(-1.5, 2.8)
      v.multiply(-3.5)

      expect(v).toEqual(V(-1.5 * -3.5, 2.8 * -3.5))
    })
  })

  describe('static multiply()', () => {
    test('some arbitrary data', () => {
      expect(Vector.multiply(V(0, 0), -123)).toEqual(V(-0, -0))
      expect(Vector.multiply(V(1, 2), 0.8)).toEqual(V(1 * 0.8, 2 * 0.8))
    })

    test('does not mutate the instance', () => {
      const v = V(-1.5, 2.8)

      expect(Vector.multiply(v, -3.5)).toEqual(V(-1.5 * -3.5, 2.8 * -3.5))
      expect(v).toEqual(V(-1.5, 2.8))
    })
  })

  describe('divide()', () => {
    test('some arbitrary data', () => {
      expect(V(0, 0).divide(-123)).toEqual(V(-0, -0))
      expect(V(1, 2).divide(0.8)).toEqual(V(1 / 0.8, 2 / 0.8))
    })

    test('mutates the instance', () => {
      const v = V(-1.5, 2.8)
      v.divide(-3.5)

      expect(v).toEqual(V(-1.5 / -3.5, 2.8 / -3.5))
    })
  })

  describe('static divide()', () => {
    test('some arbitrary data', () => {
      expect(Vector.divide(V(0, 0), -123)).toEqual(V(-0, -0))
      expect(Vector.divide(V(1, 2), 0.8)).toEqual(V(1 / 0.8, 2 / 0.8))
    })

    test('does not mutate the instance', () => {
      const v = V(-1.5, 2.8)

      expect(Vector.divide(v, -3.5)).toEqual(V(-1.5 / -3.5, 2.8 / -3.5))
      expect(v).toEqual(V(-1.5, 2.8))
    })
  })

  test('static dot()', () => {
    expect(Vector.dot(V(0, 0), V(1, 2))).toBeCloseTo(0)
    expect(Vector.dot(V(1, 2), V(-2, 1))).toBeCloseTo(0)
    expect(Vector.dot(V(1, 2), V(3, -4))).toBeCloseTo(-5)
  })

  describe('normalize()', () => {
    test('some arbitrary data', () => {
      expect(V(0, 0).normalize().length()).toBeCloseTo(0)
      expect(V(2.11, 3).normalize().length()).toBeCloseTo(1)
      expect(V(0, -3).normalize().length()).toBeCloseTo(1)
      expect(V(-4.1, 8).normalize().length()).toBeCloseTo(1)
    })

    test('should mutate the instance', () => {
      const v = V(10, 15)

      v.normalize()
      expect(v.length()).toBeCloseTo(1)
    })
  })

  describe('normalized()', () => {
    test('some arbitrary data', () => {
      expect(V(0, 0).normalized().length()).toBeCloseTo(0)
      expect(V(2.11, 3).normalized().length()).toBeCloseTo(1)
      expect(V(0, -3).normalized().length()).toBeCloseTo(1)
      expect(V(-4.1, 8).normalized().length()).toBeCloseTo(1)
    })

    test('should not mutate the instance', () => {
      const v = V(3, 4)

      expect(v.length()).toBeCloseTo(5)
      v.normalized()
      expect(v.length()).not.toBeCloseTo(1)
    })
  })

  test('setLength()', () => {
    const v = V(3, 4)

    expect(v.length()).toBeCloseTo(5)
    v.setLength(12.3)
    expect(v.length()).toBeCloseTo(12.3)
  })

  test('isZero()', () => {
    expect(V(0, 0).isZero()).toBeTruthy()
    expect(V(1, 2).isZero()).toBeFalsy()
    expect(V(0.1, 0).isZero()).toBeFalsy()
    expect(V(0.1, 0).isZero(1e-1)).toBeTruthy()
  })

  test('static distance()', () => {
    expect(Vector.distance(V(0, 0), V(10, 5))).toBeCloseTo(V(10, 5).length())
    expect(Vector.distance(V(0, 5), V(0, 10.5))).toBeCloseTo(5.5)
    expect(Vector.distance(V(5, 0), V(10.5, 0))).toBeCloseTo(5.5)
    expect(Vector.distance(V(1, 1), V(4, 5))).toBeCloseTo(5)
  })
  
  describe('toString()', () => {
    test('without modifier', () => {
      expect(V(0, 0).toString()).toBe('{ x: 0, y: 0 }')
      expect(V(-0, +0).toString()).toBe('{ x: 0, y: 0 }')
      expect(V(1, -2).toString()).toBe('{ x: 1, y: -2 }')
    })

    test('with modifiers', () => {
      expect(V(0, 0).toString(n => 'meow')).toBe('{ x: meow, y: meow }')
      expect(V(1.123, -3.412).toString(n => n.toFixed(2)))
        .toBe('{ x: 1.12, y: -3.41 }')
    })
  })
})