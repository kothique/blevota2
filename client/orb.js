import 'pixi.js'

export const createOrb = (meta = {}) => {
  // const {
  //   hp,
  //   energy: {
  //     red,
  //     green,
  //     blue
  //   }
  // } = meta

  let orb = new PIXI.Graphics
  orb.beginFill(0x0000AA)
  orb.drawCircle(0, 0, 35)
  orb.endFill()

  orb.meta = meta

  // draw border, energy bar, and health indicator

  return orb
}