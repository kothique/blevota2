let keys = {},
    keysData = {}

let onchange = []

const addKeyListener = (keyCode) => {
  if (keys[keyCode]) {
    return
  }

  keys[keyCode] = false
  keysData[keyCode] = {
    code: keyCode
  }

  keysData[keyCode].downHandler = (event) => {
    if (event.code === keyCode) {
      const emit = !keys[keyCode]
      keys[keyCode] = true

      if (emit) {
        keysData[keyCode].onPress && keysData[keyCode].onPress()
        onchange && onchange('down', keyCode)
      }
    }
  }

  keysData[keyCode].upHandler = (event) => {
    if (event.code === keyCode) {
      let emit = keys[keyCode]
      keys[keyCode] = false

      if (emit) {
        keysData[keyCode].onRelease && keysData[keyCode].onRelease()
        onchange && onchange('up', keyCode)
      }
    }
  }

  window.addEventListener('keydown', keysData[keyCode].downHandler)
  window.addEventListener('keyup', keysData[keyCode].upHandler)
}

const removeKeyListener = (keyCode) => {
  let { downHandler, upHandler } = keysData[keyCode]

  window.removeEventListener('keydown', downHandler)
  window.removeEventListener('keyup', upHandler)

  delete keys[keyCode]
  delete keysData[keyCode]
}

export default class Keyboard {
  static listen = (keyCode, onPress = undefined, onRelease = undefined) => {
    addKeyListener(keyCode)

    keysData[keyCode].onPress = onPress
    keysData[keyCode].onRelease = onRelease
  }

  static remove = (keyCode) => {
    removeKeyListener(keyCode)
  }

  static get controls() {
    return keys
  }

  static on = (event, callback) => {
    if (event === 'change') {
      onchange = callback
    }
  }
}