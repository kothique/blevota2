const State = require('../state')
const World = require('../world')
const Orb = require('../orb')

describe('State', () => {
  test('empty state serialization', () => {
    const state = new State,
          buffer = state.toBuffer()

    expect(State.fromBuffer(buffer)).toEqual(state)
  })

  test('serialization with orbs added', () => {
    const state = new State

    state.orbs['a'.repeat(24)] = new Orb({
      radius: 30,
      maxHp: 100,
      hp: 90,
      maxMp: 150,
      mp: 75
    })

    state.orbs['b'.repeat(24)] = new Orb({
      radius: 30,
      maxHp: 120,
      hp: 113,
      maxMp: 120,
      mp: 91
    })

    const buffer = state.toBuffer()
    expect(State.fromBuffer(buffer)).toEqual(state)
  })

  test('serialization after having been used by World', () => {
    const state = new State,
          idA = 'a'.repeat(24),
          idB = 'b'.repeat(24),
          world = new World(null, state)
            .newOrb(idA)
            .newOrb(idB)

    for (let i = 0; i < 120; i++) {
      world
      .startIteration()
      .applyControls(idA, {
        pX: 150,
        pY: 12,
        move: true
      })
      .applyControls(idB, {
        pX: 200,
        pY: 123,
        move: false
      })
      .integrate(i * 1 / 120, 1 / 120)
      .detectCollisions()
      .applyCollisionResponse()
      .finishIteration()
    }

    const buffer = state.toBuffer()

    const deserialized = State.fromBuffer(buffer)

    // acceleration and effects should not be transmitted
    new Array(idA, idB).forEach((id) => {
      state.orbs[id].acceleration = expect.anything()
      state.orbs[id].effects = expect.anything()
    })

    expect(deserialized).toBeInstanceOf(State)
    expect(deserialized).toMatchObject(state)
  })
})