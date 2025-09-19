What i studied so far in this repo:

**DAY 1:**
* Call Stack & Heap
* Execution context: global, function, block
* Call stack behavior: push/pop
* Heap: memory allocation for objects
* Microtask/Macrotask and in general flow of the code
* Garbage Collection basics

*Summary*:
- Microtasks: Promises, queueMicrotask → higher priority
- Macrotasks: setTimeout, setInterval, I/O → lower priority
- Event Loop: Executes stack → microtasks → macrotasks → repeat
- Garbage Collection: JS automatically frees memory for unreachable objects using mark-and-sweep.

****** Primitives vs objects, boxing, equality, coercion.

7 primitives : string, number, boolean, null, undefined, symbol, bigint
immutable, stored in stack, compared by value

```javascript
let x = 10;
let y = x;
y = 20;
console.log(x); // 10
console.log(y); // 20
```

objects are mutable, stored by reference in the heap, includes arrays, functions, dates, regex etc.

exemple:
```javascript
let obj1 = {name: "Alice"};
let obj2 = obj1;   // both variables reference the same object
obj2.name = "Bob";

console.log(obj1.name); // "Bob"
console.log(obj2.name); // "Bob"
```

primitives dont have methods but JS allows them to behave like objects temporarily
JS automatically wraps primitives in a wrapper object when a method is called

```javascript
let str = "hello";
// same as
let str = new String("hello");
```
Works for String, Number, Boolean primitives


** Equality: 
Strict equality (===) : no type conversion, two values equal only if type and value match
```javascript
1 === 1       // true
1 === '1'     // false
null === undefined // false
```
Loose equality (==) : type coercion happens before comparison
converts values to the same type: 
boolean -> number
object -> primitive
null/undefined are equal to each oher, but nothing else

```javascript
0 == false     // true
'0' == 0       // true
null == undefined // true
```

Object equality: Objects are compared by reference, not content.

Type Coercion: Automatic type coercion
JS often converts types implicitly in expression
```javascript
console.log('5' + 2);   // "52" (number → string)
console.log('5' - 2);   // 3   (string → number)
console.log(true + 1);  // 2   (true → 1)
console.log([] + []);   // ""  (empty string)
console.log([] + {});   // "[object Object]"
console.log({} + []);   // 0 or "[object Object]" (tricky due to parsing)
```
Rules : 
+ operator -> string concatenation if one operand is a string
+ -,*,/ -> numeric conversion
+ booleans -> numbers in numeric context (true == 1, false == 0)
+ objects -> primitives via valueOf() or toString()

Truthy vs Falsy Values:
falsy values: false, 0, "", null, undefined, NaN
everything else -> truthy !!! IN A BOOLEAN CONTEXT !!!
```javascript
if ("") console.log("won't run"); // false
if ([]) console.log("runs");   // true, because [] is object
```
What's the difference between null, undefined and NaN ?
| Value       | Type      | Meaning / Use                                          | Boolean context | Example of usage                      |
| ----------- | --------- | ------------------------------------------------------ | --------------- | ------------------------------------- |
| `null`      | object    | Intentional absence of value / “empty”                 | false           | `let x = null;`                       |
| `undefined` | undefined | Variable declared but not assigned / missing parameter | false           | `let y; console.log(y); // undefined` |
| `NaN`       | number    | Result of invalid numeric operation                    | false           | `0/0`, `parseInt("abc")`              |

Mic

**DAY 2:**
Scopes, Closures, TDZ Lexical envs, shadowing, garbage collection of closures.

For var the binding is created and initialized to undefined at creation (hoisted).
For let/const the binding is created but is uninitialized — it is in the Temporal Dead Zone (TDZ) until the actual declaration line runs.

**Scopes: practical differences & examples**

Global scope : top-level variables on globalThis.
Function scope : var is function-scoped.
Block scope : let/const are block-scoped (curly braces).
```javascript
console.log(a); // undefined (var hoisted)
var a = 1;

console.log(b); // ReferenceError (TDZ)
let b = 2;
```

Loop capture pitfall :
```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(()=>console.log(i), 10); // prints 3,3,3  (same i shared)
}

for (let i = 0; i < 3; i++) {
  setTimeout(()=>console.log(i), 10); // prints 0,1,2 (new binding per iteration)
}
```
Reason: let creates a fresh binding on each iteration; var uses the same function-scoped binding.

**Closures : what they capture & semantics**

A closure is just a function that retains access to its lexical environment (variables it closed over) even after the outer function returned.

***Captured by reference(not by copy)***: if inner function uses a variable from outer scope, it reflects that variable's current value at execution time (unless the language semantics) create a new biding per iteration [[let does that]]
Exemple : 
```javascript
function makeCounter() {
  let count = 0; // or *var* 
  return () => ++count;
}
const c = makeCounter();
c(); // 1
c(); // 2
```
count lives on because c references that lexical environment.

**Garbage collection + closures**

JS GC is reachability-based (not naive reference counting). An object (including a lexical environment) is collectible when no reachable reference points to it.
A closure keeps its lexical environment reachable as long as the function object (or something referencing it) is reachable.

Memory leaks via closures:
- Storing big objects in long-lived closures (e.g., global caches) — they won't be GC'd.
- DOM event handlers retaining references to DOM nodes in closures (preventing node GC).

Solutions:

- Remove event listeners when not needed.
- Null out large references when done.
- Use WeakMap/WeakRef for caches keyed by objects (so entries don’t keep keys alive).
- Design caches with eviction (LRU / TTL) to avoid unbounded memory growth. ===> LRU (Least Recently Used) // TTL (Time To Live)

First:
- The cache keeps track of when each item was last used.
- If the cache is full and a new item comes in, it evicts the item that hasn’t been used for the longest time.
- Good when you expect recently used items to be needed again soon.
** so it's like a queue, when it's full, remove the first not used one.
Second:
- Each item is stored with an expiration time (e.g., 5 minutes).
- After that time passes, the item is automatically removed from the cache.
- Useful for data that becomes stale quickly (like API results).
** mini bombs

Without eviction:
- Your app might consume more and more memory.
- Eventually, the system slows down or crashes.
So, designing caches with eviction is about balance: keep useful items, drop old or expired ones.

**Shadowing, hoisting gotchas & safe patterns**
- Don’t mix var and let/const for the same logic — prefer let/const.
- Prefer const for things that shouldn't be reassigned.
- Use let for loop counters you capture in closures.
- Avoid creating large objects inside closures that live longer than necessary.

***Micro-build: “Once / Memoize / After” utilities from scratch.***

**Day 3:**
this, prototypes, classes, call/apply/bind, prototype chain, property descriptors.

**this**
isnt a reference to the function itself, its determined by HOW the function is called.

1- Default/Global binding
Non-strict: calling fn() -> this is the global object (window in browsers, global in node)
Strict mode: this is undefined.

2- Implicit binding (method call)
obj.method() -> this is obj.
```javascript
const o = {x:1, y(){ return this.x; }};
o.y(); // 1
```

3- Explicit binding(call/apply/bind)
fn.call(obj, ...) or fn.apply(obj, args) sets this to obj.
fn.bind(obj) returns a new function permanently bound to obj.
```javascript
function show() { return this.name; }
show.call({name:'A'}); // "A"
const bound = show.bind({name:'B'});
bound(); // "B"
```
4- Constructor / new binding
new fn() creates a fresh object; inside fn, this is the new object. if fn returns an object, that object replaces this
```javascript
function Person(n){ this.name = n; }
const p = new Person('x'); // p.name === 'x'
```
Arrow functions dont own this. They capture the surrounding lexical this (the this where the arrow was created).

Important pitfalls
Methods detached from their object lose implicit binding:
```javascript
const obj = {x: 1, getX(){ return this.x; }};
const g = obj.getX;
g(); // undefined or global value — lost `this`
```
In JavaScript, this is determined by how a function is called, not where it comes from.
obj.getX() → called as a method → this = obj.
g() → called as a plain function → this = undefined (strict mode) or global object (non-strict).

Use .bind() or arrow wrappers for safe callbacks (e.g., dom event handlers).

**call, apply, bind — full mechanics & tricks**

fn.call(thisArg, arg1, arg2, ...) — call with explicit this and arguments.
fn.apply(thisArg, [argsArray]) — call with explicit this and an array of args.
fn.bind(thisArg, ...presetArgs) — returns a new function permanently bound; useful for partial application and preserving this.

Edge: binded functions can still be used with new — if you new a bound function, this behavior is different (ES6 semantics: the new target takes precedence).

**Prototype chain — objects, .prototype, __proto__, lookup**
* Every object has an internal [[Prototype]] (often visible as __proto__), which points to another object or null.
* When accessing obj.prop, JS looks on obj. If not found, it follows obj.__proto__, then obj.__proto__.__proto__, ... until it finds the property or reaches null.
* Functions have a .prototype property (used when creating objects via new): new Fn() creates an object whose [[Prototype]] is Fn.prototype.
* Object.create(proto) creates a new object with [[Prototype]] = proto.
```javascript
function A(){}
A.prototype.say = function(){ return 'hi'; };

const a = new A();
a.say(); // 'hi'
a.hasOwnProperty('say'); // false (method is on prototype)

// Shadowing: If you set a.say = () => 'no';, you add an own property that shadows the prototype method.

// Mutating prototype affects instances:

A.prototype.newMethod = () => 'x';
a.newMethod(); // 'x' — even for instances created earlier
```
*in vs hasOwnProperty*
prop in obj returns true if property exists anywhere in prototype chain.

*obj.hasOwnProperty(prop)* returns true only for own properties.

*instanceof*
obj instanceof Fn checks whether Fn.prototype is in obj's prototype chain.bj's prototype chain.

**ES6 class — sugar over prototypes (what the transpiler does)**

ES6 class is syntactic sugar; it sets up constructor functions, prototypes, non-enumerable methods, static methods, and proper prototype chain.
```javascript
class Animal {
  constructor(name){ this.name = name; }
  speak(){ return `${this.name} makes a noise`; }
  static kingdom(){ return 'Animalia'; }
}

class Dog extends Animal {
  constructor(name, breed){ super(name); this.breed = breed; }
  speak(){ return `${this.name} barks`; }
}

const d = new Dog('Rex', 'shepherd');
d instanceof Dog; // true
d instanceof Animal; // true
```
Behind the scenes:
- class creates a function Dog and sets Dog.prototype with methods, sets Dog.prototype.constructor = Dog, and sets Object.setPrototypeOf(Dog, Animal) (so static inheritance works) and Object.setPrototypeOf(Dog.prototype, Animal.prototype) for instances.

super semantics
- Inside subclass constructors: super(...) calls the parent constructor with this bound to the new instance (must be called before using this in subclass constructor).

Methods: super.method() looks up the parent prototype's method.

***Micro-build: Minimal class system using prototypes (no class).***

**Day 4: Modules & packaging**

ESM vs CJS, import graphs, default vs named, tree-shaking.

1️⃣ ESM vs CJS
JavaScript has two major module systems:

- CommonJS (CJS)
Used in Node.js before ESM was fully supported.
Synchronous require() for imports, module.exports for exports.
Files are interpreted individually; each file is a module.

```javascript
// math.js
function add(a, b) { return a + b; }
function multiply(a, b) { return a * b; }
module.exports = { add, multiply };

// main.js
const math = require('./math');
console.log(math.add(2, 3)); // 5
```
Key points:
Works everywhere Node.js runs.
require() is synchronous — can’t do conditional imports easily.
Exports an object; destructuring is needed for named exports.

- ECMAScript Modules (ESM)
Standard JS module system, also supported in Node.js (.mjs or "type": "module" in package.json).
Uses import / export.
Supports static analysis, tree-shaking, and async loading.
```javascript
// math.js
export function add(a, b) { return a + b; }
export function multiply(a, b) { return a * b; }

export default function subtract(a, b) { return a - b; }

// main.js
import { add, multiply } from './math.js';
console.log(add(2, 3)); // 5
```
Features:
export default → module has a single “default” export:

Static imports allow tree-shaking (removes unused exports when bundling).
Tree-shaking is a build-time optimization used in JavaScript bundlers (like Webpack, Rollup, or Vite) to remove unused code from your final bundle.

* Default vs Named Exports

Default export: a module’s main export; imported without braces.

```javascript
// default export (1 per module [file])
export default function main() {}
import mainFunc from './main.js';

// named exports
export function f1() {}
export function f2() {}
import { f1, f2 } from './module.js';

// mixing
export default function main() {}
export function helper() {}
import mainFunc, { helper } from './module.js';
```

- Tree-shaking

Bundlers (e.g., Webpack, Rollup, Vite) can remove unused exports from ESM code.
Only works for static imports.
Not possible in CJS because require() is dynamic.

***Micro-build: Split utilities into ESM package; local install & use ***

**Day 5: Iteration & Generators**
  * Iterables, iterators, `for..of`, generator functions, async generators.

1️⃣ Iterables & Iterators

- Iterable: An object that defines how to access a sequence of values, one at a time.
An object is iterable if it implements the Symbol.iterator method.
Common examples: arrays, strings, sets, maps.

- Iterator: An object returned by the iterable’s Symbol.iterator() method.
Has a next() method.
Each call to next() returns an object: { value: <currentValue>, done: <true/false> }.

```javascript
const arr = [10, 20, 30];

// Get iterator
const iterator = arr[Symbol.iterator]();

console.log(iterator.next()); // { value: 10, done: false }
console.log(iterator.next()); // { value: 20, done: false }
console.log(iterator.next()); // { value: 30, done: false }
console.log(iterator.next()); // { value: undefined, done: true }
```
Key idea: Iterators allow manual iteration. Iterables let us use automatic iteration like for..of.

2️⃣ for..of Loop

for..of works on any iterable (array, string, map, set, custom iterables).
It automatically calls the iterator’s next() under the hood.

```javascript
const arr = [1, 2, 3];

for (const num of arr) {
  console.log(num); // 1 2 3
}
```
for..of is simpler than using for loops or manually calling next().

3️⃣ Generator Functions

Generators are special functions that can pause and resume execution.
Declared with function*.
Use yield to produce a value.
Calling a generator returns an iterator.
```javascript
function* countUpTo(max) {
  for (let i = 1; i <= max; i++) {
    yield i; // pause here and return i
  }
}

// it returns a generator object with a .next() method.
const counter = countUpTo(3);

console.log(counter.next()); // { value: 1, done: false }
console.log(counter.next()); // { value: 2, done: false }
console.log(counter.next()); // { value: 3, done: false }
console.log(counter.next()); // { value: undefined, done: true }
// it keeps internal state without using an external variable.
```

Key points:
Generators make custom iteration simple.
Can be infinite: you can generate values lazily, only when needed.
Streaming / paging – useful when working with large datasets or APIs that return chunks of data.

4️⃣ Async Generators
Works like generators but can await asynchronous operations.
Declared with async function*.
Iterated with for await..of.

Example (simulated API fetch):
```javascript
async function* fetchPages(pages) {
  for (let i = 1; i <= pages; i++) {
    // simulate async fetch
    await new Promise(r => setTimeout(r, 500));
    yield `Page ${i} data`;
  }
}

(async () => {
  for await (const page of fetchPages(3)) {
    console.log(page);
  }
})();
```
Use case: When data comes in chunks from APIs or streams.

***Micro-build: Custom iterable (paged API → stream of items).***


**Day 6: Functional Foundations**
* Purity, immutability, composition vs inheritance.

Functional programming (FP) is about writing programs using pure functions, avoiding shared state, and focusing on composition of behavior instead of inheritance.

1. Purity

A pure function always returns the same output for the same input and causes no side effects.
for exemple: add(a,b)

Pure functions are predictable, easy to test, and easier to reason about.

2. Immutability

Instead of mutating data, you create new copies with changes.
This avoids side effects and bugs from shared references.

```javascript
// mutable
let arr = [1, 2, 3];
arr.push(4); // changes arr directly

// immutable
let arr = [1, 2, 3];
let newArr = [...arr, 4]; // arr stays unchanged
```


3. Composition vs Inheritance

Inheritance: extend functionality by creating subclasses. (OOP style)

Composition: build bigger functions by combining smaller ones. (FP style)

```javascript
function double(x) { return x * 2; }
function square(x) { return x * x; }

// Composition
let result = square(double(3)); // 36
```

4. Core FP Tools
**a Compose & Pipe**

compose: right → left execution
pipe: left → right execution

```javascript
const compose = (f, g) => (x) => f(g(x));

const double = (x) => x * 2;
const square = (x) => x * x;

let f = compose(square, double); 
console.log(f(3)); // square(double(3)) → 36
```

**b Curry**

Transform a multi-arg function into a chain of single-arg functions.

```javascript
function add(a, b) { return a + b; }

// curried
function curriedAdd(a) {
  return function(b) {
    return a + b;
  };
}

curriedAdd(2)(3); // 5
```
Currying allows partial application and function reuse.


**c Partial**

Fix some arguments of a function in advance.

```javascript
function multiply(a, b) { return a * b; }

const double = multiply.bind(null, 2); 
console.log(double(5)); // 10
```
Partial application is like pre-configuring a function.

Interesting links about functional programming and compositional software techniques in JavaScript ES6+ from the ground up.

https://medium.com/javascript-scene/composing-software-an-introduction-27b72500d6ea
https://medium.com/javascript-scene/transducers-efficient-data-processing-pipelines-in-javascript-7985330fe73d
https://web.mit.edu/6.001/6.037/sicp.pdf

Excellent question — you’ve built them, now it’s time to understand **what they *are***, their **names**, and **when you’d actually use them** in real projects.

---

## 1️⃣ **Pipe / Compose**

* **What it’s called:** *Function composition* (pipe = left→right, compose = right→left).
* **Use case:** Whenever you have **a sequence of operations** you want to glue together into a single function.

  * E.g. data transformations, string manipulations, sanitizing inputs, formatting outputs.
* **When to think of it:**

  * You catch yourself writing `fn3(fn2(fn1(value)))` → nesting looks ugly.
  * Pipe makes it clean: `pipe(fn1, fn2, fn3)(value)`.

---

## 2️⃣ **Curry**

* **What it’s called:** *Currying* (named after mathematician Haskell Curry).
* **Use case:** Turning a function of multiple arguments into a **chain of single-argument functions**.

  * Useful when you want **part of a function’s arguments fixed early**, and the rest provided later.
* **When to think of it:**

  * You need reusability: e.g. `multiply(2)(x)` to make a “double” function.
  * You want to create function factories (functions that make functions).

---

## 3️⃣ **Partial**

* **What it’s called:** *Partial application*.
* **Use case:** Similar to currying, but instead of forcing one-by-one arguments, you “lock in” **some arguments up front**.

  * Example: Instead of writing a new function `areaOfCircle(r)`, you can `partial(multiply, Math.PI)` to prefill π.
* **When to think of it:**

  * You reuse the same function with some arguments always the same.
  * Great for config-driven functions or setting defaults.

---

## 4️⃣ **Transducer-style Mapper**

* **What it’s called:** *Transducers*.
* **Use case:** Efficient **data transformation pipelines**. They avoid creating intermediate arrays when chaining `map` → `filter` → `reduce`.

  * Instead of `[...].map(...).filter(...)`, you build reusable *composable transformations* that can run on arrays, streams, async data, etc.
* **When to think of it:**

  * You’re transforming **large datasets** or **streams**.
  * Performance matters and you want **no extra allocations**.
  * Or you want your same transformations to work on arrays, generators, async iterables.

---

## 📌 Why they’re grouped together?

They’re all about **functional programming techniques**:

* **Pipe / compose** = glue functions together
* **Curry / partial** = manage arguments flexibly
* **Transducers** = manage data transformations efficiently

**treat functions as building blocks** and **data as a flow** you transform step by step.

---

⚡ Quick mental triggers:

* **Ugly nested calls?** → Use **pipe**.
* **Want a function factory?** → Use **curry**.
* **Want defaults baked in?** → Use **partial**.
* **Transforming streams of data?** → Use **transducers**.

**RealWorld developer scenarios.**
1️⃣ Pipe / Compose

📌 Scenario: API data cleanup before showing it in UI.
You fetch data from an API → it’s messy:
- Needs trimming whitespace
- Needs lowercasing
- Needs capitalizing the first letter

Instead of:
```javascript
capitalize(trim(apiData.toLowerCase()))
// You write:
const cleanData = pipe(
  str => str.toLowerCase(),
  str => str.trim(),
  str => str.charAt(0).toUpperCase() + str.slice(1)
);
```

✅ Much cleaner. Now you can reuse cleanData(user.name) anywhere in your app.

***Micro-build: Compose/pipe, curry, partial, transducer-style mapper.***