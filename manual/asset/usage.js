// ES
// import { LinkedFuncList as LfL } from 'linkedfunclist'

const LfL = require('linkedfunclist').LinkedFuncList

let l = new LfL() // a new linked list
console.log(...l) // it has only its own node for company

// give it something else to link up
let toLink = [ 4, 5, 2, 3, 0, 1 ].map((linkee, i) => {
  switch (i % 3) {
    case 0:
      return linkee // a number
    case 1:
      return () => linkee // a function returning a number
    case 2:
      let n = new LfL()
      n.func = () => `${linkee}`
      return n // a LfL instance whose .func returns a string
  }
})
console.log(toLink) // a mix of types

// use spread syntax to create links from
// each element of toLink, not a single
// link that produces the toLink array!
l.link(...toLink)
console.log(...l) // it has other nodes for company

// let's call everyone in sequence
l.chainCall().then(console.log)

// let's call everyone at once
l.callAll().then(console.log)

// the results look the same.
