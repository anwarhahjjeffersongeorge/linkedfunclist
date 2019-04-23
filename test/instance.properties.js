import test from 'ava'
import { LinkedFuncList } from '../src/index.js'

let testlist, testlist2, testlist3, testlist4, testlist5, testlist6, testlist7
let testfunc
let baddata

test.beforeEach(t => {
  testlist = new LinkedFuncList()
  testlist2 = new LinkedFuncList()
  testlist3 = new LinkedFuncList()
  testlist4 = new LinkedFuncList()
  testlist5 = new LinkedFuncList()
  testlist6 = new LinkedFuncList()
  testlist7 = new LinkedFuncList()

  testfunc = () => {}
  baddata = [
    5, '3a73a', {}, []
  ]
})

/** @test {LinkedFuncList} */
test(`import class`, t => {
  t.is(typeof LinkedFuncList, 'function', 'imported class should be of type "function"')
})

/** @test {LinkedFuncList#next} */
test('1.a "next"', t => {
  t.is(testlist.next, null, '|a. is null by default')
})

/** @test {LinkedFuncList#next} */
test('1.b "next"', t => {
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

/** @test {LinkedFuncList#func} */
test('2.a "func"', t => {
  t.is(testlist.func, null, 'is null by default')
})

/** @test {LinkedFuncList#func} */
test('2.b "func"', t => {
  for (let data of baddata) {
    testlist.func = data
    t.not(testlist.func, data, 'can only have a value of null or an object of type function')
  }
  testlist.func = testfunc
  t.is(testlist.func, testfunc, 'can be an object of type function')
  testlist.func = null
  t.is(testlist.func, null, 'can be null')
})

/** @test {LinkedFuncList#[Symbol.iterator]} */
test('3.a.A|3.a.B|3.a.C.i [Symbol.iterator]', t => {
  for (var terminalType in [testlist, null]) {
    let label = (terminalType === testlist)
      ? 'starting LinkedFuncList instance'
      : 'null'
    let tlists = [testlist, new LinkedFuncList(), new LinkedFuncList(), new LinkedFuncList()]
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

/** @test {LinkedFuncList#[Symbol.iterator]} */
test('3.a.A|3.a.B|3.a.C.j [Symbol.iterator]', t => {
  for (var terminalType in [testlist, null]) {
    let label = (terminalType === testlist)
      ? 'starting LinkedFuncList instance'
      : 'null'
    let tlists = [testlist7, new LinkedFuncList(), new LinkedFuncList(), new LinkedFuncList()]
    let c = 1
    for (let i = 0; i < tlists.length; i++) {
      tlists[i].next = (i < tlists.length - 1)
        ? tlists[i + 1]
        : tlists[i].next
      tlists[i].func = () => c++
    }
    tlists[tlists.length - 1].next = testlist7
    // testlist.next = testlist2
    // testlist2.next = testlist3
    // testlist3.next = testlist4
    const iterated = [...testlist7]
    t.is(iterated.length, tlists.length, `${label} iterated result length  matches source length`)
    for (let i in iterated) {
      t.is(iterated[i], tlists[i], `${label} iterated contents match source contents in order`)
    }
  }
})

/** @test {LinkedFuncList#chainCall} */
test('4.a "chainCall"', t => {
  t.is(typeof testlist.chainCall, 'function', 'is a function')
  // t.is(testlist.chainCall.length, 1, 'has unit length')
})

/** @test {LinkedFuncList#chainCall} */
test('4.b.A|4.b.B "chainCall"', t => {
  let tlists = [testlist2, new LinkedFuncList(), new LinkedFuncList(), new LinkedFuncList()]
  let c = 1
  let start = 'sss'
  for (let i = 0; i < tlists.length; i++) {
    tlists[i].next = (i < tlists.length - 1) ? tlists[i + 1] : tlists[i].next
    tlists[i].func = (aa) => {
      // console.log(aa, c)
      return `${aa}${c++}`
    }
  }
  const promise = testlist2.chainCall(start)
  return promise.then(result => {
    t.is(result, start + '1234', `result should begin with starting value and include ordered results of all promise function calls`)
  })
})

/** @test {LinkedFuncList#chainCall} */
test('4.b.C "chainCall"', t => {
  // t.is(typeof testlist.chainCall, 'function', 'is a function')
  // t.is(testlist.chainCall.length, 1, 'has unit length')
  let tlists = [testlist3, new LinkedFuncList(), new LinkedFuncList(), new LinkedFuncList()]
  let c = 1
  let start = 'uuu'
  for (let i = 0; i < tlists.length; i++) {
    tlists[i].next = (i < tlists.length - 1) ? tlists[i + 1] : tlists[i].next
    tlists[i].func = function (aa) {
      // console.log(aa, c)
      t.is(this, testlist3, 'function called with appropriately overidden "this" value')
      return `${aa}${c++}`
    }
  }
  const promise = testlist3.chainCall(start)
  return promise.then(result => {
    t.is(result, start + '1234', `result should begin with starting value and include ordered results of all promise function calls`)
  })
})

/** @test {LinkedFuncList#chainCall} */
test('4.b.D "chainCall"', async t => {
  // t.is(typeof testlist.chainCall, 'function', 'is a function')
  // t.is(testlist.chainCall.length, 1, 'has unit length')
  let tlists = [testlist4, new LinkedFuncList(), new LinkedFuncList(), new LinkedFuncList()]
  let c = 1
  let start = 'ddd'
  let errormessage = 'an intentional test error'
  let testError = new Error(errormessage)
  for (let i = 0; i < tlists.length; i++) {
    tlists[i].next = (i < tlists.length - 1) ? tlists[i + 1] : tlists[i].next
    tlists[i].func = function (aa) {
      // console.log(aa, c
      if (i === tlists.length - 2) {
        throw testError
      }
      return `${aa}${c++}`
    }
  }
  const promise = testlist4.chainCall(start)
  await t.throwsAsync(promise, { is: testError })
})

/** @test {LinkedFuncList#chainCall} */
test('4.b.E "chainCall"', async t => {
  // t.is(typeof testlist.chainCall, 'function', 'is a function')
  // t.is(testlist.chainCall.length, 1, 'has unit length')
  let tlists = [testlist5, new LinkedFuncList(), new LinkedFuncList(), new LinkedFuncList()]
  let c = 1
  let start = 'bbb'
  for (let i = 0; i < tlists.length; i++) {
    tlists[i].next = (i < tlists.length - 1) ? tlists[i + 1] : tlists[i].next
    tlists[i].func = async function (aa) {
    // console.log(aa, c
      return new Promise((resolve) => setTimeout(() => resolve(`${aa}${c++}`), 111 / c))
    }
  }
  const promise = testlist5.chainCall(start)
  return promise.then(result => {
    t.is(result, start + '1234', `result should begin with starting value and include ordered results of all promise async function calls`)
  })
})

/** @test {LinkedFuncList#chainCall} */
test('4.b.F "chainCall"', async t => {
  // t.is(typeof testlist.chainCall, 'function', 'is a function')
  // t.is(testlist.chainCall.length, 1, 'has unit length')
  let tlists = [testlist6, new LinkedFuncList(), new LinkedFuncList(), new LinkedFuncList()]
  let start = 'www'
  for (let i = 0; i < tlists.length; i++) {
    tlists[i].next = (i < tlists.length - 1) ? tlists[i + 1] : tlists[i].next
    if (i % 2 !== 0) {
      tlists[i].func = async function (aa) {
      // console.log(aa, c
        return new Promise((resolve) => setTimeout(() => resolve(`${aa}${i}`), 111 / i))
      }
    }
  }
  const promise = testlist6.chainCall(start)
  return promise.then(result => {
    t.is(result, start + '13', `result should begin with starting value and include ordered results of all calls while skipping null funcs`)
  })
})

/** @test {LinkedFuncList#callAll} */
test('5.a "callAll"', t => {
  t.is(typeof testlist.callAll, 'function', 'is a function')
  // t.is(testlist.callAll.length, 1, 'has unit length')
})

/** @test {LinkedFuncList#callAll} */
test('5.b.A "callAll"', t => {
  let testl = new LinkedFuncList()
  let tlists = [testl, new LinkedFuncList(), new LinkedFuncList(), new LinkedFuncList()]
  let c = 1
  let start = 'sss'
  for (let i = 0; i < tlists.length; i++) {
    tlists[i].next = (i < tlists.length - 1) ? tlists[i + 1] : tlists[i].next
    tlists[i].func = (aa) => {
      // console.log(aa, c)
      return `${aa}${c++}`
    }
  }
  const promise = testl.callAll(start)
  return promise.then(result => {
    t.deepEqual(result, [
      start + '1',
      start + '2',
      start + '3',
      start + '4'
    ], `result should begin with starting value and include ordered results of all promise function calls`)
  })
})

/** @test {LinkedFuncList#callAll} */
test('5.b.B "callAll"', t => {
  let testl = new LinkedFuncList()
  let tlists = [testl, new LinkedFuncList(), new LinkedFuncList(), new LinkedFuncList()]
  let c = 1
  let start = 'sss'
  for (let i = 0; i < tlists.length; i++) {
    tlists[i].next = (i < tlists.length - 1) ? tlists[i + 1] : tlists[i].next
    tlists[i].func = function (aa) {
      // console.log(aa, c)
      t.is(this, testl, 'function called with appropriately overidden "this" value')
      return `${aa}${c++}`
    }
  }
  const promise = testl.callAll(start)
  return promise.then(result => {
    t.deepEqual(result, [
      start + '1',
      start + '2',
      start + '3',
      start + '4'
    ], `result should begin with starting value and include ordered results of all promise function calls`)
  })
})

/** @test {LinkedFuncList#callAll} */
test('5.b.C "callAll"', async t => {
  let testl = new LinkedFuncList()
  let tlists = [testl, new LinkedFuncList(), new LinkedFuncList(), new LinkedFuncList()]
  let c = 1
  let start = 'ddd'
  let errormessage = 'an intentional test error'
  let testError = new Error(errormessage)
  for (let i = 0; i < tlists.length; i++) {
    tlists[i].next = (i < tlists.length - 1) ? tlists[i + 1] : tlists[i].next
    tlists[i].func = function (aa) {
      // console.log(aa, c
      if (i === tlists.length - 2) {
        throw testError
      }
      return `${aa}${c++}`
    }
  }
  const promise = testl.callAll(start)
  await t.throwsAsync(promise, { is: testError })
})

/** @test {LinkedFuncList#callAll} */
test('5.b.D "callAll"', t => {
  let testl = new LinkedFuncList()
  let tlists = [testl, new LinkedFuncList(), new LinkedFuncList(), new LinkedFuncList()]
  let start = 'sss'
  for (let i = 0; i < tlists.length; i++) {
    tlists[i].next = (i < tlists.length - 1) ? tlists[i + 1] : tlists[i].next
    if (i % 2 !== 0) {
      tlists[i].func = async function (aa) {
      // console.log(aa, c
        return new Promise((resolve) => setTimeout(() => resolve(`${aa}${i}`), 111 / i))
      }
    }
  }
  const promise = testl.callAll(start)
  return promise.then(result => {
    t.deepEqual(result, [
      start,
      start + '1',
      start,
      start + '3'
    ], `result should begin with starting value and include result of promise function call`)
  })
})

/** @test {LinkedFuncList#link} */
test('6.a "link"', t => {
  t.is(typeof testlist.link, 'function', 'is a function')
  // t.is(testlist.callAll.length, 1, 'has unit length')
})

/** @test {LinkedFuncList#link} */
test('6.b|6.c.A|6.c.B|6.c.C "link"', t => {
  let testl = new LinkedFuncList()
  let testArgs = [
    'oo',
    new LinkedFuncList(),
    new LinkedFuncList(),
    () => 555,
    new LinkedFuncList()
  ]
  testl.link(...testArgs)
  let iterated = [...testl]
  t.is(iterated.length, 1 + testArgs.length, 'adds chain element for all arguments')
  let srcArr = [testl, ...testArgs]
  for (let i = 0; i < srcArr.length; i++) {
    let v = srcArr[i]
    if (v instanceof LinkedFuncList) {
      t.is(iterated[i], v, 'chain element corresponds to LinkedFuncList instance')
    } else if (typeof v === 'function') {
      t.is(iterated[i] instanceof LinkedFuncList, true, 'new chain element from function is LinkedFuncList instance')
      t.is(typeof iterated[i].func, 'function', 'new chain element from function has function-type "func" property')
      t.is(iterated[i].func, v, 'new chain element from function has "func" property corresponding to original function')
    } else {
      t.is(iterated[i] instanceof LinkedFuncList, true, 'new chain element from nonfunction is LinkedFuncList instance')
      t.is(typeof iterated[i].func, 'function', 'new chain element from function has function-type "func" property')
      t.is(iterated[i].func(), v, 'new chain element from function has "func" property corresponding to passthrough function returning original argument')
    }
  }
})
