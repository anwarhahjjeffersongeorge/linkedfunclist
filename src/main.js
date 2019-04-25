// ESM syntax is supported.
/**
 * LinkedFuncList
 * A class of linked lists that contain function data.
 */
class LinkedFuncList {
  constructor () {
    /** @ignore */
    this._func = null
    /** @ignore */
    this._next = null
  }

  /** @type {null|LinkedFuncList} The next node in the list. */
  get next () {
    return this._next
  }

  /** @type {null|LinkedFuncList} */
  set next (n) {
    this._next = ((n === null) || (n instanceof LinkedFuncList))
      ? n
      : this._next
  }

  /** @type {null|function} The function data for this list node.  */
  get func () {
    return this._func
  }

  /** @type {null|function} */
  set func (f) {
    this._func = ((f === null) || (typeof f === 'function'))
      ? f
      : this._func
  }

  /** @type {generator} */
  get [Symbol.iterator] () {
    return function * (startingthis = this) {
      yield this
      if ((this.next instanceof LinkedFuncList) && (this.next !== startingthis)) {
        yield * this.next[Symbol.iterator](startingthis)
      }
    }
  }

  /**
   * async chainCall
   * returns a Promise corresponding to the ordered unique set of calls to func properties of the `next` properties of the LinkedFuncList
   *
   * @param {object} [start] - any starting payload
   * @return {Promise}
   */
  async chainCall (start) {
    const iterator = this[Symbol.iterator]()
    let promise = new Promise(async (resolve, reject) => {
      let loop = {
        i: 0,
        payload: start
      }
      for (let list of iterator) {
        const func = (typeof list.func === 'function')
          ? list.func
          : m => m
        try {
          // console.log('oo o', loop.payload)
          loop.payload = await func.call(this, loop.payload)
          // console.log('oooo', loop.payload)
        } catch (e) {
          reject(e)
        } finally {
          loop.i++
        }
      }
      resolve(loop.payload)
    })
    return promise
  }

  /**
   * async callAll
   * returns a Promise corresponding to the ordered unique set of simultaneous calls to func properties of the next properties of the LinkedFuncList
   *
   * @param {object} [start] - any starting payload
   * @return {Promise}
   */
  async callAll (start) {
    const iterator = [...this].map(async ({ func }) => {
      func = (typeof func === 'function')
        ? func
        : m => m
      return new Promise(async (resolve, reject) => {
        try {
          // console.log('oo o', loop.payload)
          let result = await func.call(this, start)
          // console.log('oooo', loop.payload)
          resolve(result)
        } catch (e) {
          reject(e)
        }
      })
    })
    let promise = Promise.all(iterator)
    return promise
  }

  /**
   * link
   * creates a chained list of LinkedFuncList instances attached to this instance, creating new LinkedFuncList to replace any arguments that are not already LinkedFuncList instances, and setting the func property of a new instance to a function that either corresponds to the supplied function argument or returns its value when called
   *
   * @param {(function|LinkedFuncList|object)} [linkees] - the LinkedFuncList instances to link up or the functions and objects to use to create new instances
   * @return {Promise}
   */
  link (...linkees) {
    if (linkees.length > 0) {
      let current = this
      linkees.forEach((linkee, i) => {
        if (!(linkee instanceof LinkedFuncList)) {
          if (typeof linkee === 'function') {
            const f = linkee
            linkee = new LinkedFuncList()
            linkee.func = f
          } else {
            const s = linkee
            linkee = new LinkedFuncList()
            linkee.func = () => s
          }
        }
        current.next = linkee
        current = linkee
      })
    }
  }
}

export { LinkedFuncList }
