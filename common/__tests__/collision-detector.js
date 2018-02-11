const CollisionDetector = require('../collision-detector')
const { V } = require('../vector')

describe('CollisionDetector', () => {
  test('no collisions in empty detector', () => {
    expect(
      new CollisionDetector().detect().length
    ).toBe(0)
  })

  test('collisions with walls', () => {
    const data = [
      {
        wall: 'left',
        box: {
          p1: V(-50, 50),
          p2: V(50, 150)
        }
      },
      {
        wall: 'right',
        box: {
          p1: V(150, 50),
          p2: V(250, 150)
        }
      },
      {
        wall: 'top',
        box: {
          p1: V(50, -50),
          p2: V(150, 50)
        }
      },
      {
        wall: 'bottom',
        box: {
          p1: V(50, 150),
          p2: V(150, 250)
        }
      }
    ].forEach(({ wall, box }) => {
      const detector = new CollisionDetector(V(200, 200)),
            id = 'a'.repeat(24)

      detector.add(id, box)

      const collisions = detector.detect()
      expect(collisions.length).toBe(1)

      const collision = collisions[0]
      expect(collision).toEqual({
        type: 'wall',
        wall,
        id
      })
    })
  })

  test('collisions with walls after moving', () => {
    const data = [
      {
        wall: 'left',
        box: {
          p1: V(-50, 50),
          p2: V(50, 150)
        }
      },
      {
        wall: 'right',
        box: {
          p1: V(150, 50),
          p2: V(250, 150)
        }
      },
      {
        wall: 'top',
        box: {
          p1: V(50, -50),
          p2: V(150, 50)
        }
      },
      {
        wall: 'bottom',
        box: {
          p1: V(50, 150),
          p2: V(150, 250)
        }
      }
    ].forEach(({ wall, box }) => {
      const detector = new CollisionDetector(V(200, 200)),
            id = 'a'.repeat(24)

      detector.add(id, {
        p1: V(50, 50),
        p2: V(150, 150)
      })
      detector.set(id, box)

      const collisions = detector.detect()
      expect(collisions.length).toBe(1)

      const collision = collisions[0]
      expect(collision).toEqual({
        type: 'wall',
        wall,
        id
      })
    })
  })

  test('no collisions with walls if they are none', () => {
    const detector = new CollisionDetector,
          id = 'a'.repeat(24)

    detector.add(id, {
      p1: V(-20, -20),
      p2: V(20, 20)
    })

    const collisions = detector.detect()
    expect(collisions.length).toBe(0)
  })

  test('no collisions with walls if the object is deleted', () => {
    const detector = new CollisionDetector,
          id = 'a'.repeat(24)

    detector.add(id, {
      p1: V(-20, -20),
      p2: V(20, 20)
    })

    detector.remove(id)

    const collisions = detector.detect()
    expect(collisions.length).toBe(0)
  })

  test('collisions between objects', () => {
    const detector = new CollisionDetector,
          idA = 'a'.repeat(24),
          idB = 'b'.repeat(24)

    detector.add(idA, {
      p1: V(200, 200),
      p2: V(300, 300)
    })

    detector.add(idB, {
      p1: V(250, 250),
      p2: V(350, 350)
    })

    let collisions = detector.detect()
    expect(collisions.length).toBe(1)

    let collision = collisions[0],
          hasBothIDs = collision.id1 === idA && collision.id2 === idB
                    || collision.id1 === idB && collision.id2 === idA

    expect({
      type: collision.type,
      'has both IDs': hasBothIDs
    }).toEqual({
      type: 'object',
      'has both IDs': true
    })
  })

  test('collisions between objects after moving', () => {
    const detector = new CollisionDetector,
          idA = 'a'.repeat(24),
          idB = 'b'.repeat(24)

    detector.add(idA, {
      p1: V(100, 100),
      p2: V(200, 200)
    })

    detector.add(idB, {
      p1: V(250, 250),
      p2: V(350, 350)
    })

    detector.set(idA, {
      p1: V(200, 200),
      p2: V(300, 300)
    })

    let collisions = detector.detect()
    expect(collisions.length).toBe(1)

    let collision = collisions[0],
          hasBothIDs = collision.id1 === idA && collision.id2 === idB
                    || collision.id1 === idB && collision.id2 === idA

    expect({
      type: collision.type,
      'has both IDs': hasBothIDs
    }).toEqual({
      type: 'object',
      'has both IDs': true
    })
  })

  test('no collisions after deleting objects', () => {
    const detector = new CollisionDetector(V(400, 400)),
          idA = 'a'.repeat(24),
          idB = 'b'.repeat(24)

    detector.add(idA, {
      p1: V(-50, -50),
      p2: V(300, 300)
    })

    detector.add(idB, {
      p1: V(250, 250),
      p2: V(350, 350)
    })

    detector.remove(idA)

    let collisions = detector.detect()
    expect(collisions.length).toBe(0)
  })
})