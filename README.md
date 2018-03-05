[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)

## ROADMAP

- refactoring
  - move server/simulation/* -> server/game
- physics
  - verlet integration (!)
  - spacial partitioning instead of brute-force
- ui
  - dark background around login- and register forms
  - 404 not found page
  - user profile
  - persistent redux state
  - loading animation
  - mobile menu
- optimizations
  - UDP (WebRTC??)
  - profiling
- tests
  - tests/serialization/entities/entity
  - server/game/collision-detector.js
  - change entity ids from 24b-strings to numbers
  - react components (far away future)