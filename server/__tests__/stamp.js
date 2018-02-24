const { stamp, compose2, compose } = require('../stamp')

describe('stamp', () => {
  test('should call init on creation', () => {
    const init = jest.fn(function (name) {
      this.rights = [
        'right to equality',
        'freedom from discrimination',
        'freedom from slavery'
      ]

      this.name = name
    })

    const animal = stamp({ init })

    const animal1 = animal.create('Steve')
    expect(init).toBeCalled()
    expect(init).toBeCalledWith('Steve')
    expect(animal1.name).toBe('Steve')
  })

  test('prototype should be shared amongst all instances', () => {
    const animal = stamp({
      init(name) {
        this.name = name    
      },

      proto: {
        getName() {
          return this.name
        }
      }
    })

    const animal1 = animal.create('Steve'),
          animal2 = animal.create('Brent')

    expect(animal1.getName()).toBe('Steve')
    expect(animal2.getName()).toBe('Brent')

    animal1.__proto__.answer = 42
    expect(animal1.answer).toBe(42)
    expect(animal2.answer).toBe(42)

    animal1.__proto__.getName = function getName() {
      return 'Animal' + this.answer
    }
    expect(animal1.getName()).toBe('Animal42')
    expect(animal2.getName()).toBe('Animal42')
  })

  test('instance properties should be unique to each instance', () => {
    const animal = stamp({
      instance: {
        name: 'Default Name'
      }
    })

    const animal1 = animal.create(),
          animal2 = animal.create()

    expect(animal1.name).toBe('Default Name')
    expect(animal2.name).toBe('Default Name')

    animal1.name = 'Steve'
    animal2.name = 'Brent'
    expect(animal1.name).toBe('Steve')
    expect(animal2.name).toBe('Brent')
  })

  test('should call enclose', () => {
    const enclose = jest.fn(function () {
      let species = ''

      this.setSpecies = function setSpecies(species_) {
        species = species_.toLowerCase()
      }

      this.getSpecies = function getSpecies() {
        return species
      }
    })

    const animal = stamp({
      enclose
    })

    const animal1 = animal.create()
    expect(enclose).toBeCalled()
    animal1.setSpecies('Cannabis Sativa')
    expect(animal1.getSpecies()).toBe('cannabis sativa')
    expect(animal1.species).toBeUndefined()
  })
})

describe('compose2', () => {
  test('should compose inits', () => {
    const obj = compose2(
      stamp({
        init() { this.v1 = 10 }
      }),
      stamp({
        init() { this.v2 = 11 }
      })
    ).create()

    expect(obj.v1).toBe(10)
    expect(obj.v2).toBe(11)
  })

  describe('delegation', () => {
    test('the closest delegate prototype should take precedence', () => {
      const obj = compose2(
        stamp({
          proto: {
            hello() { return 'hello' }
          }
        }),
        stamp({
          proto: {
            bye() { return 'bye' }
          }
        })
      ).create()

      expect(obj.hello()).toBe('hello')
      expect(obj.bye()).toBe('bye')
    })
  })

  describe('mixins', () => {
    test('last instance should take precedence in case of collision', () => {
      const obj = compose2(
        stamp({
          instance: {
            v: 12
          }
        }),
        stamp({
          instance: {
            v: 13
          }
        })
      ).create()

      expect(obj.v).toBe(13)
    })
  })

  describe('functional inheritance', () => {
    test('enclosed variabels should not collide', () => {
      const obj = compose2(
        stamp({
          enclose() {
            let v = 13

            this.getV1 = function getV1() {
              return v
            }
          }
        }),
        stamp({
          enclose() {
            let v = 14

            this.getV2 = function getV2() {
              return v
            }
          }
        })
      ).create()

      expect(obj.getV1()).toBe(13)
      expect(obj.getV2()).toBe(14)
    })

    test('last instance property assignment should take precedence', () => {
      const obj = compose2(
        stamp({
          enclose() {
            let v = 13

            this.getV = function getV1() {
              return v
            }
          }
        }),
        stamp({
          enclose() {
            let v = 14

            this.getV = function getV2() {
              return v
            }
          }
        })
      ).create()

      expect(obj.getV()).toBe(14)
    })
  })
})

describe('compose', () => {
  test('last stamp should take precedence', () => {
    const stamp1 = stamp({
      init() {
        this.v = 1
      },
      instance: { v1: 1 }
    })

    const stamp2 = stamp({
      init() {
        this.v = 2
      },
      instance: { v2: 2 }
    })

    const stamp3 = stamp({
      init() {
        this.v = 3
      },
      instance: { v3: 3 }
    })

    const obj = compose(stamp1, stamp2, stamp3).create()
    expect(obj.v).toBe(3)
    expect(obj.v1).toBe(1)
    expect(obj.v2).toBe(2)
    expect(obj.v3).toBe(3)
  })
})