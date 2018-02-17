#!/usr/bin/env node

const { exec } = require('child_process')
const { resolve } = require('path')

const icons = [
  {
    input:  resolve(__dirname, '../client/images/logo.svg'),
    output: resolve(__dirname, '../client/images/favicon.ico'),
    density: '256x256'
  }
]

icons.forEach(({ input, output, density }) => {
  const cmd = `convert \
-density ${density} \
-background transparent \
${input} \
-define icon:auto-resize \
${output}`

  console.log(`Executing: '${cmd}'...`)

  exec(
    cmd,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`)
        return
      }
    }
  )
})
