require('../util')

describe('Function.prototype.bindArgs', () => {
  test('should not mutate function experssions', () => {
    function f(a, b) {
      return a + b
    }

    expect(f(1, 2)).toBe(3)
    expect(f.bindArgs(-1)(-2)).toBe(-3)
    expect(f.bindArgs(1, 2)()).toBe(3)
    expect(f(1, 2)).toBe(3)
  })

  test('should not mutate arrow functions', () => {
    const f = (a, b) => a + b

    expect(f(1, 2)).toBe(3)
    expect(f.bindArgs(-1)(-2)).toBe(-3)
    expect(f.bindArgs(1, 2)()).toBe(3)
    expect(f(1, 2)).toBe(3)
  })

  test('consecutive calls should work with function expressions', () => {
    function f(a, b) {
      return a + b
    }

    expect(f.bindArgs(1).bindArgs(2)()).toBe(3)
    expect(f.bindArgs(1).bindArgs(2).bindArgs(3)()).toBe(3)
  })

  test('consecutive calls should work with arrow functions', () => {
    const f = (a, b) => a + b

    expect(f.bindArgs(1).bindArgs(2)()).toBe(3)
    expect(f.bindArgs(1).bindArgs(2).bindArgs(3)()).toBe(3)
  })
})