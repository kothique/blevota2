beforeEach(() => {
  jest.resetModules()
})

describe('Entity', () => {
  test('correctly deserializes an entity after registration', done => {
    import('../entity').then(({ default: Entity }) => {
      Entity.register({
        type: 42,
        init() {
          let somePrivateData = null

          this.setData = function setData(data) {
            somePrivateData = data
          }

          this.getData = function getData() {
            return somePrivateData
          }
        },
        parse(buffer, offset) {
          this.setData(buffer.readDoubleBE(offset))
          offset += 8

          return offset
        },
        extrapolate() {
          // do nothing
        },
        render() {
          // do nothing
        }
      })

      const buffer = Buffer.alloc(10 + 1 + 24 + 8)
      buffer.writeUInt8(42, 10 + 0)
      buffer.write('a'.repeat(24), 10 + 1, 24)
      buffer.writeDoubleBE(100500, 10 + 1 + 24)

      const { entity, offset } = Entity.deserialize(buffer, 10)

      expect(offset).toBe(10 + 1 + 24 + 8)
      expect(entity.type).toBe(42)
      expect(entity.getData()).toBe(100500)

      done()
    })
  })

  test('Entity.new & Entity.remove', () => {
    import('../entity').then(({ default: Entity }) => {
      Entity.register({
        type: 42,
        init() {},
        parse(buffer, offset) { return offset },
        extrapolate() {},
        render() {}
      })

      const id = 'a'.repeat(24)

      expect(Entity.get(id)).toBeUndefined()
      Entity.new(id, 42)
      expect(Entity.get(id)).toBeDefined()
      Enttiy.remove(id)
      expect(Entity.get(id)).toBeUndefined()
    })
  })
})