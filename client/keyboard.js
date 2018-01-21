let keys = {},
    keysData = {}

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
      if (!keys[keyCode]) {
        keysData[keyCode].onPress && keysData[keyCode].onPress()
      }
      keys[keyCode] = true
    }
  }

  keysData[keyCode].upHandler = (event) => {
    if (event.code === keyCode) {
      if (keys[keyCode]) {
        keysData[keyCode].onRelease && keysData[keyCode].onRelease()
      }
      keys[keyCode] = false
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
}