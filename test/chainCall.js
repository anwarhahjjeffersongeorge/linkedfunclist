import test from 'ava'
import { LinkedFuncList } from '../src/index.js'

const endPromiseValue = '####a3y'

/** @test {LinkedFuncList#chainCall} */
test(`4.a "chainCall"`, t => {
  const testlist0 = new LinkedFuncList()
  t.is(typeof testlist0.chainCall, 'function', 'is a function')
  // t.is(testlist.chainCall.length, 1, 'has unit length')
})

for (let end of [null, Promise.resolve(endPromiseValue)]) {
  const endTestTitle = (end) ? '4.c end › ' :  ''
  const endExpected = expected => (end) ? expected + endPromiseValue : expected

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

  /** @test {LinkedFuncList#chainCall} */
  test(`${endTestTitle}4.b.A|4.b.B "chainCall"`, t => {
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
    const promise = testlist2.chainCall(start, end)

    return promise.then(result => {
      t.is(result, endExpected(start + '1234'), `result should begin with starting value and include ordered results of all promise function calls`)
    })
  })

  /** @test {LinkedFuncList#chainCall} */
  test(`${endTestTitle}4.b.C "chainCall"`, t => {
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
    const promise = testlist3.chainCall(start, end)
    return promise.then(result => {
      t.is(result, endExpected(start + '1234'), `result should begin with starting value and include ordered results of all promise function calls`)
    })
  })

  /** @test {LinkedFuncList#chainCall} */
  test(`${endTestTitle}4.b.D "chainCall"`, async t => {
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
    const promise = testlist4.chainCall(start, end)
    await t.throwsAsync(promise, { is: testError })
  })

  /** @test {LinkedFuncList#chainCall} */
  test(`${endTestTitle}4.b.E "chainCall"`, async t => {
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
    const promise = testlist5.chainCall(start, end)
    return promise.then(result => {
      t.is(result, endExpected(start + '1234'), `result should begin with starting value and include ordered results of all promise async function calls`)
    })
  })

  /** @test {LinkedFuncList#chainCall} */
  test(`${endTestTitle}4.b.F "chainCall"`, async t => {
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
    const promise = testlist6.chainCall(start, end)
    return promise.then(result => {
      t.is(result, endExpected(start + '13'), `result should begin with starting value and include ordered results of all calls while skipping null funcs`)
    })
  })

}
