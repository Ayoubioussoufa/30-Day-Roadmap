// Micro-build: Compose/pipe, curry, partial, transducer-style mapper.


// pipe
function pipe(...fns) {
    return function(input) {
        return fns.reduce((acc, fn) => fn(acc), input);
    }
}

function addExclamationMark(input) {
    return input + "!";
}

function doubleString(input) {
    return input + input;
}

let pipeV = pipe(addExclamationMark, doubleString);
console.log(pipeV("hi"));

// curry
function curry(fn) {
    return function(a) {
        return function(b) {
            return function(c) {
                return fn(a,b,c);
            }
        }
    }
}

function multiply(a, b, c) {
    return a * b * c;
}

let curryV = curry(multiply);

console.log(curryV(2)(3)(4));

// Partial
function partial(fn) {
    return function(a, b) {
        return fn(5, a, b);
    }
}

function multiply(a, b, c) {
    return a * b * c;
}

let partialV = partial(multiply);

console.log(partialV(2, 3));

// Transducer-Style Mapper

function mapTransducer(fn) {
    return function(reducer) {
        return function(acc, input) {
            console.log(acc, input);
            return reducer(acc, fn(input));
        }
    }
}

function filterTransducer(fn) {
    return function(reducer) {
        return function(acc, input) {
            if (fn(input))
                return reducer(acc, input);
            return acc;
        }
    }
}

function sumReducer(a, b) {
    return a + b;
}

let total = filterTransducer(x => !(x % 2))(mapTransducer(x => x * 3)(sumReducer));
let arr = [1,2,3,4,5];
console.log(arr.reduce(total, 0));