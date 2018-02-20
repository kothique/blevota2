export default class Keyboard {
  static keys = Object.create(null)
  static keysData = Object.create(null)
  static onchange = null
  static aliases = Object.create(null)

  static listen = (keyCode, alias = undefined, onPress = undefined, onRelease = undefined) => {
    Keyboard.addKeyListener(keyCode)

    if (alias) {
      Keyboard.aliases[keyCode] = alias
    }

    Keyboard.keysData[keyCode].onPress = onPress
    Keyboard.keysData[keyCode].onRelease = onRelease
  }

  static remove = (keyCode) => {
    Keyboard.removeKeyListener(keyCode)
  }

  static on = (event, callback) => {
    if (event === 'change') {
      Keyboard.onchange = callback
    }
  }

  static addKeyListener = (keyCode) => {
    if (Keyboard.keys[keyCode]) {
      return
    }

    Keyboard.keys[keyCode] = false
    Keyboard.keysData[keyCode] = {
      code: keyCode
    }

    Keyboard.keysData[keyCode].downHandler = (event) => {
      if (event.code === keyCode) {
        const emit = !Keyboard.keys[keyCode]
        Keyboard.keys[keyCode] = true

        if (emit) {
          Keyboard.keysData[keyCode].onPress && window.setImmediate(() => Keyboard.keysData[keyCode].onPress)
          Keyboard.onchange && window.setImmediate(() => Keyboard.onchange('down', keyCode))
        }
      }
    }

    Keyboard.keysData[keyCode].upHandler = (event) => {
      if (event.code === keyCode) {
        let emit = Keyboard.keys[keyCode]
        Keyboard.keys[keyCode] = false

        if (emit) {
          Keyboard.keysData[keyCode].onRelease && window.setImmediate(() => Keyboard.keysData[keyCode].onRelease())
          Keyboard.onchange && window.setImmediate(() => Keyboard.onchange('up', keyCode))
        }
      }
    }

    window.addEventListener('keydown', Keyboard.keysData[keyCode].downHandler)
    window.addEventListener('keyup', Keyboard.keysData[keyCode].upHandler)
  }

  static removeKeyListener = (keyCode) => {
    let { downHandler, upHandler } = Keyboard.keysData[keyCode]

    window.removeEventListener('keydown', downHandler)
    window.removeEventListener('keyup', upHandler)

    delete Keyboard.keys[keyCode]
    delete Keyboard.keysData[keyCode]
    delete Keyboard.aliases[keyCode]
  }

  static getControls() {
    let result = Object.create(null)
    for (let keyCode of Object.keys(Keyboard.keys)) {
      result[Keyboard.aliases[keyCode] || keyCode] = Keyboard.keys[keyCode]
    }

    return result
  }
}