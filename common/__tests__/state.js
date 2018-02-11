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
      radius: 30
    })

    state.orbs['b'.repeat(24)] = new Orb({
      radius: 30
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
            .startIteration()

    for (let i = 0; i < 120; i++) {
      world.applyControls(idA, {
        mX: 150,
        mY: 12,
        lmb: true,
        rmb: true,
        wheel: false
      })
      .applyControls(idB, {
        mX: 200,
        mY: 123,
        lmb: false,
        rmb: true,
        wheel: true
      })
      .integrate(i * 1 / 120, 1 / 120)
      .detectCollisions()
      .applyCollisionResponse()
      .finishIteration()
    }

    const buffer = state.toBuffer()

    // acceleration should not be transmitted
    state.orbs[idA].acceleration = expect.anything()
    state.orbs[idB].acceleration = expect.anything()

    expect(State.fromBuffer(buffer)).toMatchObject(state)
  })
})