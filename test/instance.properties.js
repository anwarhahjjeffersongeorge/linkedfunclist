import test from 'ava'
import { LinkedFuncList } from '../main.js'

let testlist, testlist2, testlist3, testlist4
let testfunc
let baddata

test.beforeEach(t => {
  testlist = new LinkedFuncList()
  testlist2 = new LinkedFuncList()
  testlist3 = new LinkedFuncList()
  testlist4 = new LinkedFuncList()
  testfunc = () => {}
  baddata = [
    5, '3a73a', {}, []
  ]
})

test(`import class`, t => {
  t.is(typeof LinkedFuncList, 'function', 'imported class should be of type "function"')
})

test('1|a "next"', t => {
  t.is(testlist.next, null, '|a. is null by default')
})

test('1|b "next"', t => {
  for (let data of baddata) {
    testlist.next = data
    t.not(testlist.next, data, 'can only have a value of null or instance of LinkedFuncList')
  }
  testlist.next = testlist2
  t.is(testlist.next, testlist2, 'can be an instance of LinkedFuncList')
  testlist.next = testlist
  t.is(testlist.next, testlist, 'can be a instance of LinkedFuncList self-inclusive')
  testlist.next = null
  t.is(testlist.next, null, 'can be null')
})

test('2|a "func"', t => {
  t.is(testlist.func, null, 'is null by default')
})

test('2|b "func"', t => {
  for (let data of baddata) {
    testlist.func = data
    t.not(testlist.func, data, 'can only have a value of null or an object of type function')
  }
  testlist.func = testfunc
  t.is(testlist.func, testfunc, 'can be an object of type function')
  testlist.func = null
  t.is(testlist.func, null, 'can be null')
})

test('3|a [Symbol.iterator]', t => {
  for (var terminalType in [testlist, null]) {
    let label = (terminalType === testlist)
      ? 'starting LinkedFuncList instance'
      : 'null'
    let tlists = [testlist, testlist2, testlist3, testlist4]
    let c = 1
    for (let i = 0; i < tlists.length; i++) {
      tlists[i].next = (i < tlists.length - 1)
        ? tlists[i + 1]
        : tlists[i].next
      tlists[i].func = () => c++
    }
    // testlist.next = testlist2
    // testlist2.next = testlist3
    // testlist3.next = testlist4
    const iterated = [...testlist]
    t.is(iterated.length, tlists.length, `${label} iterated result length  matches source length`)
    for (let i in iterated) {
      t.is(iterated[i], tlists[i], `${label} iterated contents match source contents in order`)
    }
  }
})

test('4|a "traverse"', t => {
  t.is(typeof testlist.traverse, 'function', 'is a function')
  t.is(testlist.traverse.length, 1, 'has unit length')
  let tlists = [testlist, testlist2, testlist3, testlist4]
  let c = 1
  let start = 'sss'
  for (let i = 0; i < tlists.length; i++) {
    tlists[i].next = (i < tlists.length - 1) ? tlists[i + 1] : tlists[i].next
    tlists[i].func = (aa) => {
      setTimeout(() => `${aa}${c++}`, 555)
    }
  }
  const promise = testlist.traverse()
  return promise.then(result => {
    t.is(result, start + '1234', `result should begin with starting value and include ordered results of all promise function calls`)
  })
})
