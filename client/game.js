import EventEmitter from 'events'
import ioc from 'socket.io-client'
import { Buffer } from 'buffer-browserify'
import _ from 'lodash'

import Keyboard from './keyboard'
import PlayoutBuffer from './playoutbuffer';
import World from './game/world'

import * as entities from '../common/entities'

import './registerWorldObjects'

export default class Game extends EventEmitter {
  static host = 'http://localhost:3000/'

  constructor(options) {
    super()

    const { context, info, log, host, token, user, regionName } = options
    this.user = user
    this.orbID = null
    this.regionName = regionName

    this.svg = context
    this.info = info
    this.log = log

    World.init({
      svg:  this.svg,
      info: this.info
    })

    this.svg.addEventListener('mousemove', ({ offsetX, offsetY }) => {
      this.sendControls({
        pX: offsetX,
        pY: offsetY
      })
    })

    this.svg.addEventListener('mouseup', ({ offsetX, offsetY, button }) => {
      const controls = {
        pX: offsetX,
        pY: offsetY
      }

      if (button === 0) {
        controls.move = false
      }

      this.sendControls(controls)
    })

    this.svg.addEventListener('mousedown', ({ offsetX, offsetY, button }) => {
      const controls = {
        pX: offsetX,
        pY: offsetY
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
        /** @todo parse frame.skills and render them */
        World.parse(frame.world)

        // if (previousFrame) {
        //   World.extrapolate({
        //     prev: previousFrame.timestamp,
        //     curr: frame.timestamp,
        //     next: currentTimestamp
        //   })
        // }

        World.render()

        // for (const id in Entity.entities) {
        //   const entity = Entity.entities[id]

        //   this.info.innerHTML = `
        //     t: ${timestamp.toFixed(4)}<br />
        //     f: ${orb.force.toString(n => n.toFixed(4))}<br />
        //     p: ${orb.position.toString(n => n.toFixed(4))}<br />
        //     v: ${orb.velocity.toString(n => n.toFixed(4))}<br />
        //     a: ${orb.acceleration.toString(n => n.toFixed(4))}<br />
        //     hp: ${orb.hp} / ${orb.maxHp}<br />
        //     mp: ${orb.mp} / ${orb.maxMp}<br />`

        //   this.scene.updateOrb(id, {
        //     radius:   orb.radius,
        //     position: orb.position,
        //     maxHp:    orb.maxHp,
        //     hp:       orb.hp,
        //     maxMp:    orb.maxMp,
        //     mp:       orb.mp
        //   })
        // }
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
    const socket = this.socket = ioc(Game.host, {
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

      this.log.innerHTML += 'Player <strong>' + _.escape(username) + '</strong> died :('
      this.log.innerHTML += '<br />'
    })
  }

  sendControls = (controls) => {
    this.socket.emit('controls', controls)
  }

  stop = () => {
    World.clear()
    this.socket.disconnect()
  }
}
