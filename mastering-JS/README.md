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