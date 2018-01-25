import 'pixi.js'

const background = 0xEEEEEE

const typeRingColor = (meta) => {
  return 0xDD00DD
}

const renderTypeRing = (g, meta, first = false) => {
  if (first) {
    g.lineStyle(4, typeRingColor(meta), 1)
    g.arc(0, 0, 43, 0, 2 * Math.PI)
  }
}

const renderEnergyRing = (g, { energy: { red, green, blue } }, first = false) => {
  let total = red + green + blue,
      a = {
        red: red / total * 2 * Math.PI,
        green: green / total * 2 * Math.PI,
        blue: blue / total * 2 * Math.PI
      }

  g.clear()

  g.lineStyle(4, 0xFF0000, 1)
  g.arc(0, 0, 38, 0, a.red)

  g.lineStyle(4, 0x00FF00, 1)
  g.arc(0, 0, 38, a.red, a.red + a.green)

  g.lineStyle(4, 0x0000FF, 1)
  g.arc(0, 0, 38, a.red + a.green, 0)
}

const renderHealthCircle = (g, { hp, hpMax }, first = false) => {
  g.clear()

  let k = Math.floor(1.00 * 255),
      color = 0 * 0x10000 + k * 0x100 + 0

  g.beginFill(color)
  g.drawCircle(0, 0, 10)
  g.endFill()
}

export const renderOrb = (orb, first = false) => {
  const { typeRing, energyRing, healthCircle } = orb.meta.parts

  renderTypeRing(typeRing, orb.meta, first)
  // renderEnergyRing(energyRing, orb.meta, first)
  // renderHealthCircle(healthCircle, orb.meta, first)
}

export const createOrb = (meta) => {
  let orb = new PIXI.Container

  let typeRing = new PIXI.Graphics,
      energyRing = new PIXI.Graphics,
      healthCircle = new PIXI.Graphics

  orb.addChild(typeRing)
  orb.addChild(energyRing)
  orb.addChild(healthCircle)

  orb.meta = meta
  orb.meta.parts = {
    typeRing,
    energyRing,
    healthCircle
  }

  renderOrb(orb, true)

  return orb
}