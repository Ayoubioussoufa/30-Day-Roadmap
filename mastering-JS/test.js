// function test() {
//     let obj = {name: 'John', age: 20};
//     return obj;
// }

// let object = test();
// console.log(object);
// object = null;
// console.log(object);

// console.log('5' + 2);   // "52" (number → string)
// console.log('5' - 2);   // 3   (string → number)
// console.log(true + 1);  // 2   (true → 1)
// console.log([] + []);   // ""  (empty string)
// console.log([] + {});   // "[object Object]"
// console.log({} + []);   // 0 or "[object Object]" (tricky due to parsing)


// if (!"") console.log("won't run");
// if ([]) console.log("runs");   // true, because [] is object

// console.log([] + []);        // ""
// console.log([] + {});        // [object Object]
// console.log({} + []);        // [object Object]
// console.log('5' - '2');      // 3
// console.log('5' + 2);        // 52
// console.log(true + false);   // 1
// console.log(null == undefined); // true
// console.log(null === undefined);// false

// console.log(null == undefined);  // true
// console.log(null === undefined); // false
// console.log(NaN == NaN);        // false
// console.log(Boolean([]));        // true
// console.log([] == false);        // true
// console.log([].length == false); // true

// function processData(primitive, obj) {
//     console.log("Start processing");

//     // Macrotask
//     setTimeout(() => {
//         console.log("Macrotask: primitive =", primitive);
//     }, 0);

//     // Microtask
//     Promise.resolve().then(() => {
//         obj.modified = true;
//         console.log("Microtask: object modified =", obj);
//     });

//     // queueMicrotask
//     queueMicrotask(() => {
//         console.log("Microtask 2: primitive doubled =", primitive * 2);
//     });

//     // Boxing example
//     console.log("Boxing example:", primitive.toString());

//     // Return new object
//     return { value: primitive, obj: obj };
// }

// // Primitive and object
// let num = 5;
// let myObj = {original: true};

// let result = processData(num, myObj);

// // Nullify object reference to test GC
// myObj = null;

// // Final log
// console.log("Final object:", result);

// setTimeout(() => {
//     console.log("Final object:", result);
// }, 0);


// function makeCounter() {
//     let count = 0;
//     return () => ++count;
//   }
//   const c = makeCounter();
//   console.log(c()); // 1
//   console.log(c()); // 2
//   const d = makeCounter();

//   console.log(d()); // 1
//   console.log(d()); // 2
//   console.log(c()); // 3

// function outer() {
//   this.value = 100;

//   const arrow = () => this.value;
//   return arrow;
// }

// const obj = {value: 200};
// const arrowFn = outer.call(obj);

// console.log(arrowFn()); // 100

// const obj = {x: 1, getX(){ return this.x; }};
// console.log(obj.getX.bind());
// const g = obj.getX.bind();
// console.log(g()); // undefined or global value — lost `this`


// function Person(name) {
//   this.name = name;
// }

// Person.prototype.sayHi = function() {
//   return "Hi, " + this.name;
// };

// const alice = new Person("Alice");
// console.log(alice.sayHi());

// Person.prototype.sayBye = function() {
//   return "Bye, " + this.name;
// };

// console.log(alice.sayBye());

// const obj = {};
// Object.defineProperty(obj, 'x', {
//   value: 42,
//   writable: false, // read-only
//   enumerable: false,
//   configurable: false
// });

// console.log(Object.getOwnPropertyDescriptor(obj, 'x'));
// // { value: 42, writable: false, enumerable: false, configurable: false }

// console.log(obj);
// console.log(obj.x);

// const arr = [1, 2, 3];
// let string = "Hello there";
// for (const num of string) {
//   console.log(num); // 1 2 3
// }

// function mapTransducer(fn) {
//     return function (reducer) {
//       return function (acc, value) {
//         // transform value first
//         return reducer(acc, fn(value));
//       };
//     };
//   }
  

// function filterTransducer(predicate) {
//     return function (reducer) {
//       return function (acc, value) {
//         if (predicate(value)) {
//           return reducer(acc, value);
//         }
//         return acc; // skip
//       };
//     };
//   }
  

// const double = mapTransducer(x => x * 2);
// const isEven = filterTransducer(x => x % 2 === 0);
// const sumReducer = (a, v) => a + v;

// // combine them
// const pipeline = double(isEven(sumReducer));

// console.log([1,2,3,4,5].reduce(pipeline, 0)); 
// // → 12   (doubled numbers are [2,4,6,8,10], evens [2,4,6,8,10], sum = 30 actually? let's check!)

const arr = [1, 2, 3, 4, 5, 6];
// keep only odd numbers
// triple each number 
// find sum of the resulting number (reduce)


function mapTransducer(fn) {
    return function(reducer) {
        return function(acc, value) {
            return reducer(acc, fn(value));
        }
    }
}

function filterTransducer(fn) {
    return function(reducer) {
        return function(acc, value) {
            if (fn(value))
                return reducer(acc, value);
            return acc;
        }
    }
}

let sumReducer = filterTransducer((x) => x % 2)(mapTransducer(x => x * 3)((acc, v) => acc + v));

console.log(arr.toArray(sumReducer(0)));