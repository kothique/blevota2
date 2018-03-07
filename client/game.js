import EventEmitter from 'events'
import ioc from 'socket.io-client'
import { Buffer } from 'buffer-browserify'
import _ from 'lodash'

import Keyboard from './keyboard'
import PlayoutBuffer from './playoutbuffer'
import World from './game/world'
import EntityFactory from './game/entity-factory'

import * as entities from '@common/entities'
import SkillState from '@common/skill-state'

import './registerWorldObjects'

export default class Game extends EventEmitter {
  constructor(options) {
    super()

    const { context, host, token, user, regionName } = options
    this.user = user
    this.orbID = null
    this.regionName = regionName

    this.host = host

    this.svg = context
    this.skills = Object.create(null)

    World.init({
      svg:  this.svg
    })

    this.svg.addEventListener('mousemove', ({ offsetX, offsetY }) => {
      this.sendControls({
        pX: World.viewport.x + offsetX,
        pY: World.viewport.y + offsetY
      })
    })

    this.svg.addEventListener('mouseup', ({ offsetX, offsetY, button }) => {
      const controls = {
        pX: World.viewport.x + offsetX,
        pY: World.viewport.y + offsetY
      }

      console.log('viewport: ', World.viewport)
      console.log('offset: ', { pX: offsetX, pY: offsetY })
      console.log('controls: ', controls)
      console.log('orb: ', EntityFactory.entities[this.orbID].position)

      if (button === 0) {
        controls.move = false
      }

      this.sendControls(controls)
    })

    this.svg.addEventListener('mousedown', ({ offsetX, offsetY, button }) => {
      const controls = {
        pX: World.viewport.x + offsetX,
        pY: World.viewport.y + offsetY
      }

      if (button === 0) {
        controls.move = true
      }

      this.sendControls(controls)
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
    this.buffer.on('frame', ({
      previousFrame,
      frame,
      currentTimestamp
    }) => {
      if (frame) {
        if (frame.skills) {
          this.parseSkills(frame.skills)
        }
        World.parse(frame.world)

        // if (previousFrame) {
        //   World.extrapolate({
        //     prev: previousFrame.timestamp,
        //     curr: frame.timestamp,
        //     next: currentTimestamp
        //   })
        // }

        let div = this.div
        if (!this.div) {
          div = this.div = this.div || document.createElement('div')
          div.style.border = '3px solid black'
          div.style.position = 'fixed'
          div.style.width = World.size.x + 'px'
          div.style.height = World.size.y + 'px'
          div.style.pointerEvents = 'none'
          document.body.appendChild(div)
        }

        div.style.left = -World.viewport.x + 'px'
        div.style.top = -World.viewport.y + 'px'

        World.render()
        if (EntityFactory.entities[this.orbID]) {
          this.emit('orb', EntityFactory.entities[this.orbID])
        }
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
    this.socket.disconnect()
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
