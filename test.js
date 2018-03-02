class A {
  static meow() {
    console.log('meow')
  }

  bark() {
    console.log('bark')
  }
}

var a = new A

console.log(a.constructor.meow())
