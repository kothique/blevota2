beforeEach(() => {
  jest.resetModules()
})

describe('Effect', () => {
  test('should correctly deserialize an effect after registration', done => {
    import('../effect').then(({ default: Effect }) => {
      Effect.register({
        type: 42,
        parse(buffer, offset) {
          this.someData = buffer.readInt32BE(offset)
          offset += 4

          return offset
        }
      })

      const buffer = Buffer.alloc(10 + 1 + 4)
      buffer.writeUInt8(42, 10 + 0)
      buffer.writeInt32BE(24, 10 + 1)

      const { effect, offset } = Effect.deserialize(buffer, 10)

      expect(offset).toBe(10 + 1 + 4)
      expect(effect.type).toBe(42)
      expect(effect.someData).toBe(24)

      done()
    })
  })
})