/**
  this* @module client/game/index
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

import * as entities   from '@common/entities'
import SkillState      from '@common/skill-state'
import { Vector, V }   from '@common/vector'
import { globalToSVG } from '@common/game'

import '@client/game/registerWorldObjects'

/**
 * @constant
 */
const KEYMAP = {
  'q': 'skill1',
  'w': 'skill2',
  'e': 'skill3',
  'r': 'skill4',
  'a': 'skill5',
  's': 'skill6',
  'd': 'skill7',
  'f': 'skill8'
}


/**
 * @class
 */
class Game extends EventEmitter {
  constructor(options) {
    super()

    const { svg, scene, host, token, user, regionName } = options
    this.svg = svg
    this.host = host
    this.user = user
    this.regionName = regionName

    this.orbID = null
    this.lastP = null
    this.skills = Object.create(null)

    World.init({ svg })
    Decorator.init({ svg })

    document.addEventListener('mousemove',  this.onMouseMove)
    document.addEventListener('mouseup',    this.onMouseUp)
    document.addEventListener('mousedown',  this.onMouseDown)
    document.addEventListener('mouseleave', this.onMouseLeave)
    document.addEventListener('keyup',      this.onKeyUp)
    document.addEventListener('keydown',    this.onKeyDown)

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
       * so mousemove will not be triggered. Hence send new position manually.
       */
      if (this.lastP) {
        this.sendControls({
          pX: this.lastP.x,
          pY: this.lastP.y
        })
      }

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

  onMouseMove = ({ clientX, clientY }) => {
    this.sendControls({
      pX: clientX,
      pY: clientY
    })

    this.lastP = V(clientX, clientY)
  }

  onMouseUp = ({ clientX, clientY, button }) => {
    const controls = {
      viewport: World.viewport,
      clientX,
      clientY
    }

    if (button === 0) {
      controls.move = false
    }

    this.sendControls(controls)
  }
 
  onMouseDown = ({ clientX, clientY, button }) => {
    const controls = {
      viewport: World.viewport,
      clientX,
      clientY
    }

    if (button === 0) {
      controls.move = true
    }

    this.sendControls(controls)
  }

  onMouseLeave = () => {
    this.sendControls({ move: false })
  }

  onKeyUp = (event) => {
    const controls = Object.create(null)

    const skill = KEYMAP[event.key]
    if (skill) {
      controls[skill] = false
      event.preventDefault()
    }

    if (Object.keys(controls).length !== 0) {
      this.sendControls(controls)
    }
  }

  onKeyDown = (event) => {
    const controls = Object.create(null)

    const skill = KEYMAP[event.key]
    if (skill) {
      controls[skill] = true
      event.preventDefault()
    }

    if (Object.keys(controls).length !== 0) {
      this.sendControls(controls)
    }
  }

  sendControls = (controls) => {
    if (controls.pX) {
      const newPoint = globalToSVG(this.svg, V(controls.pX, controls.pY))

      controls.pX = World.viewport.x + newPoint.x
      controls.pY = World.viewport.y + newPoint.y
    }

    this.socket.emit('controls', controls)
  }

  stop = () => {
    document.body.removeEventListener('mousemove',  this.onMouseMove)
    document.body.removeEventListener('mouseup',    this.onMouseUp)
    document.body.removeEventListener('mousedown',  this.onMouseDown)
    document.body.removeEventListener('mouseleave', this.onMouseLeave)

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

    for (let i = 1; i <= 6; i++) {
      let result = parseSkill(buffer, offset)
      if (this.skills[`skill${i}`] &&
          result.skill.type !== this.skills[`skill${i}`].type) {
        changed = true
      }

      this.skills[`skill${i}`] = result.skill
      offset = result.offset
    }

    if (changed) {
      this.emit('skills', this.skills)
    }
  }
}

export default Game