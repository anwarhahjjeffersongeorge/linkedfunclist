// ESM syntax is supported.
/**
 * A class of linked lists that contain function data.
 */
class LinkedFuncList {
  /**
   * Create a new LinkedFuncList instance.
   */
  constructor () {
    /** @ignore */
    this._func = null
    /** @ignore */
    this._next = null
  }

  /**  The next node in the list.
    *  @type {null|LinkedFuncList}
    */
  get next () {
    return this._next
  }

  /** @type {null|LinkedFuncList} */
  set next (n) {
    this._next = ((n === null) || (n instanceof LinkedFuncList))
      ? n
      : this._next
  }

  /** The function data for this list node.
    *  @type {null|function}
    */
  get func () {
    return this._func
  }

  /** @type {null|function} */
  set func (f) {
    this._func = ((f === null) || (typeof f === 'function'))
      ? f
      : this._func
  }

  /** The number of nodes in this list, including this instance.
   * @type {number}
   */
  get length () {
    let e = 1
    let next = this.next
    while (next instanceof LinkedFuncList) {
      e++
      next = next.next
    }
    return e
  }

  /** @type {GeneratorFunction} */
  get [Symbol.iterator] () {
    return function * (startingthis = this) {
      yield this
      if ((this.next instanceof LinkedFuncList) && (this.next !== startingthis)) {
        yield * this.next[Symbol.iterator](startingthis)
      }
    }
  }

  /**
   * call this list's functions mutating a start value
   * through nodes' functions until done.
   *
   * @param {object} [start] - any start value
   * @return {Promise} resolves to single value or Error
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

  /** call all of the list's functions with start value.
   *
   * @param {object} [start] - any start value
   * @return {Promise} resolves to Array or Error
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

  /** adds some links to this list
   *
   * parses each link:
   * - if link isnt already a LinkedFuncList instance, make a new one.
   * - if link is a function, the new instance contains that function.
   * - if link isn't a function, the new instance contains a function that returns link.
   *
   * @param {(function|LinkedFuncList|object)} [links] - the links to add
   */
  link (...links) {
    if (links.length > 0) {
      let current = this
      links.forEach((link, i) => {
        if (!(link instanceof LinkedFuncList)) {
          if (typeof link === 'function') {
            const f = link
            link = new LinkedFuncList()
            link.func = f
          } else {
            const s = link
            link = new LinkedFuncList()
            link.func = () => s
          }
        }
        current.next = link
        current = link
      })
    }
  }
}

export { LinkedFuncList }
