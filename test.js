class Parent {
  bar() {
    this.foo()
  }

  foo() {
    console.log('parent')
  }
}

class Child extends Parent {
  constructor() {
    super()
  }

  foo() {
    super.foo()
    console.log('child')
  }
}

new Parent().bar()
new Child().bar()
