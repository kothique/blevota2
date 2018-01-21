class Entity {
  constructor({ x = 0, y = 0, r = 0 } = { x: 0, y: 0, r: 0 }) {
    this.x = x
    this.y = y
    this.r = r
  }
}
module.exports.Entity = Entity

class Orb extends Entity {
  constructor({ name, x = 0, y = 0, r = 0 }) {
    super({ x, y, r })

    this.name = name
  }
}
module.exports.Orb = Orb

class World {
  constructor() {
    this.data = {
      orbs: {} // { [ userId: string ]: Orb }
    }
  }

  newOrb(user) {
    let orb = new Orb({
      name: user.username,
      x: 50,
      y: 50,
      r: Math.max(Math.min(user.username.length * 5, 50), 30)
    })

    this.data.orbs[user._id] = orb
    console.log(`New orb created: ${JSON.stringify(orb)}`)

    return orb
  }

  getOrb(user) {
    return this.data.orbs[user._id]
  }

  removeOrb(user) {
    if (this.data.orbs[user._id]) {
      console.log(`Orb removed: ${user._id}`)
    }

    delete this.data.orbs[user._id]
  }
}
module.exports.World = World