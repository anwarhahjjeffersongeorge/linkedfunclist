// ESM syntax is supported.
class LinkedFuncList {
  constructor () {
    this._func = null
    this._next = null
  }

  get next () {
    return this._next
  }

  set next (n) {
    this._next = ((n === null) || (n instanceof LinkedFuncList))
      ? n
      : this._next
  }

  get func () {
    return this._func
  }

  set func (f) {
    this._func = ((f === null) || (typeof f === 'function'))
      ? f
      : this._func
  }

  get [Symbol.iterator] () {
    return function * () {
      yield this
      if (this.next instanceof LinkedFuncList) {
        yield * [...this.next]
      }
    }
  }

  traverse (start, errorhandler) {
    errorhandler = (typeof errorhandler === 'function')
      ? errorhandler
      : console.error
    const iterated = [...this]
    let promise = new Promise((resolve) => {
      resolve(start)
    })
    let payload = start
    for (let { func } of iterated) {
      promise = promise.then(() => {
        return new Promise((resolve, reject) => {
          if (typeof func === 'function') {
            try {
              // console.log(payload)
              let result = func.call(this, payload)
              payload = result
              resolve(result)
            } catch (e) {
              reject(e)
            }
          } else {
            resolve(payload)
          }
        })
      }, errorhandler)
    }
    return promise
  }
}

export { LinkedFuncList }
