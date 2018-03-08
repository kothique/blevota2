/**
 * @module client/game/index
 */

import EventEmitter from 'events'
import ioc from 'socket.io-client'
import { Buffer } from 'buffer-browserify'
import _ from 'lodash'

import Keyboard      from '@client/keyboard'
import PlayoutBuffer from '@client/playoutbuffer'
import World         from '@client/game/world'
import EntityFactory from '@client/game/entity-factory'
import Decorator     from '@client/game/decorator'

import * as entities from '@common/entities'
import SkillState    from '@common/skill-state'
import { Vector, V } from '@common/vector'

import '@client/game/registerWorldObjects'

/**
 * @class
 */
class Game extends EventEmitter {
  constructor(options) {
    super()

    const { svg, host, token, user, regionName } = options
    this.user = user
    this.orbID = null
    this.regionName = regionName
    this.host = host

    this.lastP = V(0, 0) // last pointer position
    this.skills = Object.create(null)

    World.init({ svg })
    Decorator.init({ svg })

    svg.addEventListener('mousemove', ({ offsetX, offsetY }) => {
      this.sendControls({
        pX: World.viewport.x + offsetX,
        pY: World.viewport.y + offsetY
      })

      this.lastP = V(offsetX, offsetY)
    })

    svg.addEventListener('mouseup', ({ offsetX, offsetY, button }) => {
      const controls = {
        pX: World.viewport.x + offsetX,
        pY: World.viewport.y + offsetY
      }

      if (button === 0) {
        controls.move = false
      }

      this.sendControls(controls)
    })

    svg.addEventListener('mousedown', ({ offsetX, offsetY, button }) => {
      const controls = {
        pX: World.viewport.x + offsetX,
        pY: World.viewport.y + offsetY
      }

      if (button === 0) {
        controls.move = true
      }

      this.sendControls(controls)
    })

    svg.addEventListener('mouseleave', () => {
      this.sendControls({ move: false })
    })

    const keymap = {
      'q': 'skillA1',
      'w': 'skillA2',
      'e': 'skillA3',

      'r': 'skillA4',
      't': 'skillA5',
      'y': 'skillA6',

      'a': 'skillB1',
      's': 'skillB2',
      'd': 'skillB3',

      'f': 'skillB4',
      'g': 'skillB5',
      'h': 'skillB6',

      'z': 'skillC1',
      'x': 'skillC2',
      'c': 'skillC3',

      'v': 'skillC4',
      'b': 'skillC5',
      'n': 'skillC6',
    }

    document.addEventListener('keyup', (event) => {
      const controls = Object.create(null)

      const skill = keymap[event.key]
      if (skill) {
        controls[skill] = false
        event.preventDefault()
      }

      if (Object.keys(controls).length !== 0) {
        this.sendControls(controls)
      }
    })

    document.addEventListener('keydown', (event) => {
      const controls = Object.create(null)

      const skill = keymap[event.key]
      if (skill) {
        controls[skill] = true
        event.preventDefault()
      }

      if (Object.keys(controls).length !== 0) {
        this.sendControls(controls)
      }
    })

    /*
      Configure playout buffer
    */
    this.buffer = new PlayoutBuffer()
    this.buffer.on('frame', ({ previousFrame, frame, currentTimestamp }) => {
      if (!frame) {
        return
      }

      if (frame.skills) {
        this.parseSkills(frame.skills)
      }

      World.parse(frame.world)

      /**
       * Even though World.viewport has changed, pointer position has not,
       * so, mousemove will not be triggered. Hence send new position manually.
       */
      this.sendControls({
        pX: World.viewport.x + this.lastP.x,
        pY: World.viewport.y + this.lastP.y
      })

      // if (previousFrame) {
      //   World.extrapolate({
      //     prev: previousFrame.timestamp,
      //     curr: frame.timestamp,
      //     next: currentTimestamp
      //   })
      // }

      World.render()
      Decorator.render({
        worldSize: World.size,
        viewport: World.viewport
      })

      if (EntityFactory.entities[this.orbID]) {
        this.emit('orb', EntityFactory.entities[this.orbID])
      }
    })

    /*
      Configure keyboard listener
    */
    Keyboard.on('change', () => {
      this.sendControls(Keyboard.getControls())
    })

    /*
      Connect to the game host with socket.io
    */
    const socket = this.socket = ioc(this.host, {
      query: {
        token,
        regionName: this.regionName
      }
    })

    socket.on('connect', () => {
      this.emit('connect')
    })

    socket.on('connect_error', (err) => {
      this.emit('connect_error', err)
    })

    socket.on('error', (err) => {
      this.emit('error', err)
    })

    socket.on('disconnect', () => {
      this.emit('disconnect')
    })

    socket.on('frame', (frame) => {
      this.buffer.put({
        world: new Buffer(frame.world.data),
        skills: frame.skills && new Buffer(frame.skills.data),
        timestamp: frame.timestamp
      })
    })

    socket.on('orb-id', (orbID) => {
      this.orbID = orbID
    })

    socket.on('new-orb', (orbID) => {
      const options = {
        isPlayer: orbID === this.orbID
      }

      World.new(orbID, entities.ORB, options)
    })

    socket.on('remove-orb', (orbID) => {
      World.remove(orbID)
    })

    socket.on('event:death', (data) => {
      const { id, username } = data.user

      this.emit('event', 'Player <strong>' + _.escape(username) + '</strong> died :( <br />')
    })
  }

  sendControls = (controls) => {
    this.socket.emit('controls', controls)
  }

  stop = () => {
    World.clear()
    Decorator.clear()
    this.socket.disconnect()

    this.svg = null
  }

  /**
   * Read skills from a bfufer to render them.
   *
   * @param {Buffer} buffer
   * @param {number} offset
   */
  parseSkills(buffer, offset = 0) {
    const parseSkill = (buffer, offset = 0) => {
      const skill = {
        type: buffer.readUInt8(offset)
      }
      offset += 1

      if (skill.type === SkillState.COOLDOWN) {
        skill.value = buffer.readUInt16BE(offset)
        offset += 2
      }

      return { skill, offset }
    }

    let changed = false

    let result = parseSkill(buffer, offset)
    if (this.skills.skillA1 &&
        result.skill.type !== this.skills.skillA1.type) {
      changed = true
    }
    this.skills.skillA1 = result.skill
    offset = result.offset

    result = parseSkill(buffer, offset)
    if (this.skills.skillA2 &&
        result.skill.type !== this.skills.skillA2.type) {
      changed = true
    }
    this.skills.skillA2 = result.skill
    offset = result.offset

    if (changed) {
      this.emit('skills', this.skills)
    }
  }
}

export default Game