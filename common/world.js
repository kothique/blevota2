module.exports = class World {
  constructor() {
    this.data = {
      orb: {
        hp: 2000,
        energy: {
          r: 100,
          g: 100,
          b: 100
        },
        x: 0,
        y: 0
      }
    }
  }

  // newOrb(user) {
  //   let orb = new Orb({
  //     name: user.username,
  //     x: 50,
  //     y: 50,
  //     r: Math.max(Math.min(user.username.length * 5, 50), 30)
  //   })

  //   this.data.orbs[user._id] = orb
  //   console.log(`New orb created: ${JSON.stringify(orb)}`)

  //   return orb
  // }

  // getOrb(user) {
  //   return this.data.orbs[user._id]
  // }

  // removeOrb(user) {
  //   if (this.data.orbs[user._id]) {
  //     console.log(`Orb removed: ${user._id}`)
  //   }

  //   delete this.data.orbs[user._id]
  // }
}