import { ORB } from '../../../common/entities'

beforeEach(() => {
  jest.resetModules()
})

describe('World', () => {
  test('new() & remove()', done => {
    import('../world').then(({ default: World }) => {
      import('../entity').then(({ default: Entity }) => {
        import('../entities/orb').then(() => {

          const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
                info = document.createElement('div')
          World.init({ svg, info })

          expect(Object.keys(Entity.entities).length).toBe(0)

          World.new('a'.repeat(24), ORB)
          expect(Object.keys(Entity.entities).length).toBe(1)

          World.remove('a'.repeat(24))
          expect(Object.keys(Entity.entities).length).toBe(0)

          done()
        })
      })
    })
  })

  test('clear()', done => {
    import('../world').then(({ default: World }) => {
      import('../entity').then(({ default: Entity }) => {
        import('../entities/orb').then(() => {

          const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
                info = document.createElement('div')
          World.init({ svg, info })

          expect(Object.keys(Entity.entities).length).toBe(0)

          World.new('a'.repeat(24), ORB)
          World.new('b'.repeat(24), ORB)
          expect(Object.keys(Entity.entities).length).toBe(2)

          World.clear()
          expect(Object.keys(Entity.entities).length).toBe(0)

          done()
        })
      })
    })
  })

  /** @todo */
  test('parses correctly')

  /** @todo */
  test('extrapolates correctly')
})