# linkedfunclist

Exports a single class `LinkedFuncList`,  whose instances have the properties:
1. `next` that
  a. is `null` by default
  b. can only have a value of
    - `null`, or
    - an instance of `LinkedFuncList`, self-inclusive
2. `func` that
  a. is `null` by default
  b. can only have a value of
    - `null`, or
    - an `object` of type `function`
3. `[Symbol.iterator]` that
  a. returns a generator function  that produces the ordered unique set of `next` properties
    - starting with this `LinkedFuncList` instance,
    - continuing with all `LinkedFuncList` instances linked via `next`, and
    - terminating before any `next` whose value is
      * `null`, or
      * this (starting) `LinkedFuncList` instance.
4. `traverse` that
  a. is a `function` that accepts any `start` argument and a `function`-valued `errorhandler` argument ,
  b. returns a `Promise` chain corresponding to the ordered unique set of calls to `func` properties of the `next` properties of the `LinkedFuncList`
    * the `function` values are called with their `this` values set to this `LinkedFuncList`
    * the starting function recieves the `start` argument
    * each function in the `Promise` chain recieves the result of the previous function in the chain
