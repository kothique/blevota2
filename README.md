[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)

## ROADMAP

### Refactoring

### Physics
* verlet integration
* spacial partitioning instead of brute*force

### **Game Mechanics**
* all 18 skills

### **UI**
* modals
  * dark background around login and register forms
  * modals that don't stick to the header, then
    * remove forbidden-game.js
* game page
  * skill icons
  * adequate behaviour
    * on the player dying
    * on connection error
* 404 not found page
* user profile
* persistent redux state
* mobile menu

### Optimization
* UDP (WebRTC??)
* profiling

### Tests
* tests/serialization/entities/entity
* server/game/collision*detector.js
* change entity ids from 24b*strings to numbers
* react components (far away future)