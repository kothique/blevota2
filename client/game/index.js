/**
  this* @module client/game/index
 */

import EventEmitter from 'events'
import ioc from 'socket.io-client'
import { Buffer } from 'buffer-browserify'
import _ from 'lodash'

import Keyboard      from '@client/keyboard'
import PlayoutBuffer from '@client/playout-buffer'
import World         from '@client/game/world'
import Decorator     from '@client/game/decorator'

import SkillState      from '@common/skill-state'
import { Vector, V }   from '@common/vector'
import { globalToSVG } from '@common/game'

/** @const */
const KEYMAP = {
  'q': 0,
  'w': 1,
  'e': 2,
  'r': 3,
  'a': 4,
  's': 5,
  'd': 6,
  'f': 7
}

/** @class */
class Game extends EventEmitter {
  constructor(options) {
    super()

    const { svg, scene, host, token, user, regionName } = options
    this.svg        = svg
    this.host       = host
    this.user       = user
    this.regionName = regionName

    this.orbID  = null
    this.lastP  = null
    this.skills = Object.create(null)

    this.world     = new World({ svg })
    this.decorator = new Decorator({ svg })

    document.addEventListener('mousemove',  this.onMouseMove)
    document.addEventListener('mouseup',    this.onMouseUp)
    document.addEventListener('mousedown',  this.onMouseDown)
    document.addEventListener('mouseleave', this.onMouseLeave)
    document.addEventListener('keyup',      this.onKeyUp)
    document.addEventListener('keydown',    this.onKeyDown)

    /**
     * Configure playout buffer.
     */
    this.buffer = new PlayoutBuffer()
    this.buffer.on('frame', ({ previousFrame, frame, currentTimestamp, dt }) => {
      if (!frame) {
        return
      }

      this.world.parse(frame.world)

      const orb = this.world.orbFactory.orbs[this.orbID]

      if (frame.skills && orb) {
        const { skills, offset } = orb.parseSkills(frame.skills)
        this.emit('skills', skills)
      }

      /**
       * Even though this.world.viewport has changed, pointer position has not,
       * so mousemove will not be triggered. Hence send new position manually.
       */
      if (this.lastP) {
        this.sendControls({
          pX: this.lastP.x,
          pY: this.lastP.y
        })
      }

      // if (previousFrame) {
      //   this.world.extrapolate({
      //     prev: previousFrame.timestamp,
      //     curr: frame.timestamp,
      //     next: currentTimestamp
      //   })
      // }

      this.world.render(currentTimestamp, dt)
      this.decorator.render({
        worldSize: this.world.size,
        viewport: this.world.viewport
      })

      orb && this.emit('orb', orb)
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

    socket.on('new-orb', (orbID, orbType) => {
      const options = {
        isPlayer: orbID === this.orbID
      }

      this.world.new(orbID, orbType, options)
    })

    socket.on('remove-orb', (orbID) => {
      this.world.remove(orbID)
    })

    socket.on('event:join', (data) => {
      this.emit('event', 'Player ' + _.escape(data.user.username) + ' joined the game <br />')
    })

    socket.on('event:leave', (data) => {
      this.emit('event', 'Player ' + _.escape(data.user.username) + ' left <br />')
    })

    socket.on('event:death', (data) => {
      this.emit('event', 'Player ' + _.escape(data.user.username) + ' died :( <br />')
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
      viewport: this.world.viewport,
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
      viewport: this.world.viewport,
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
    const skills = [],
          index = KEYMAP[event.key]

    if (index !== undefined) {
      skills[index] = false
      event.preventDefault()
    }

    if (skills.length !== 0) {
      this.sendControls({ skills })
    }
  }

  onKeyDown = (event) => {
    const skills = [],
          index = KEYMAP[event.key]

    if (index !== undefined) {
      skills[index] = true
      event.preventDefault()
    }

    if (skills.length !== 0) {
      this.sendControls({ skills })
    }
  }

  sendControls = (controls) => {
    if (controls.pX) {
      const newPoint = globalToSVG(this.svg, V(controls.pX, controls.pY))

      controls.pX = this.world.viewport.x + newPoint.x
      controls.pY = this.world.viewport.y + newPoint.y
    }

    this.socket.emit('controls', controls)
  }

  end = () => {
    document.body.removeEventListener('mousemove',  this.onMouseMove)
    document.body.removeEventListener('mouseup',    this.onMouseUp)
    document.body.removeEventListener('mousedown',  this.onMouseDown)
    document.body.removeEventListener('mouseleave', this.onMouseLeave)

    this.world.clear()
    this.socket.disconnect()
  }
}

export default Game