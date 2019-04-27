# Specification
This module exports a single class, `LinkedFuncList`.

##  Instance Properties:

### 1. `next`

- a. is `null` by default
- b. can only have a value of
  - `null`, or
  - an instance of `LinkedFuncList`, self-inclusive

### 2. `func`

- a. is `null` by default
- b. can only have a value of
  - `null`, or
  - an `object` of type `function`

### 3. `[Symbol.iterator]`
- a. returns a `generator function`  that produces the ordered unique set of `next` properties
  - A. starting with this `LinkedFuncList` instance,
  - B. continuing with all `LinkedFuncList` instances linked via `next`, and
  - C. terminating before any `next` whose value is
    - i. `null`, or
    - j.  this (starting) `LinkedFuncList` instance.

### 4. `chainCall`

- a. is an `asynchronous function` that accepts any `start` argument,
- b. returns a `Promise` corresponding to the ordered set of _chained_ calls to unique `func` properties of the `next` properties of the `LinkedFuncList` where
  - A. the starting function recieves the `start` argument
  - B. each function called in the `Promise` recieves the result of the previous function in the chain
  - C. the functions are called with their `this` values set to this `LinkedFuncList` instance (the initiator of the traversal
  - D. errors thrown in the functions cause the `Promise` to reject
  - E. the order of the calls to the functions corresponds to the order of iteration produced by `this[Symbol.iterator]` even if the functions are asynchronous
  - F. any `func` properties having non-function values will be replaced with a passthrough function that preserves the recieved value supplied to it

### 5. `callAll`

- a. is an `asynchronous function` that accepts any `start` argument,
- b. returns a `Promise` corresponding to the ordered set of calls to unique `func` properties of the `next` properties of the `LinkedFuncList` where
 - A. all functions recieve the `start` argument
 - B. the functions are called with their `this` values set to this `LinkedFuncList` instance (the initiator of the traversal
 - C. errors thrown in the functions cause the `Promise` to reject
 - D. any `func` properties having non-function values will be replaced with a passthrough function that preserves the recieved value supplied to it

### 6. `link`

- a. is a `function` that accepts any number of arguments
- b. substitutes passthrough functions for arguments that are not
  - `function` objects, or
  - `LinkedFuncList` instances
- c. creates a chained list of `LinkedFuncList` instances where
  - A. the first element in the chain is this instance (the caller)
  - B. the order of the elements in the chain correspond to the order of arguments supplied to the `link` function
  - C. `function`-valued arguments are replaced with new `LinkedFuncList` instances whose `func` properties correspond to the argument being replaced

### 7. `length`

- a. is a `number`  always greater than 0
- b. reveals the number of `LinkedFuncList` instances in this list, including this current instance
