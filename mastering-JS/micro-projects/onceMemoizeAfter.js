// Micro-build: Once / Memoize / After utilities from scratch

/**
 * What it does: ensures a function runs only one time.
 * First call → executes the function.
 * Later calls → return the same result without running it again.
 * @param {*} fn function
 */
function once(fn) {
    let called = false;
    var result = 0;
    return (function(...args) {
        if (!called) {
            result = fn(...args);
            called = true;
        }
        return result;
    });
}

const initialize = once(() => {
    console.log("Initializing...");
    return 42;
});

console.log(initialize()); // "Initializing..." then 42
console.log(initialize()); // 42, no "Initializing..." printed
console.log(initialize()); // 42

/**
 * What it does: caches the results of function calls.
 * If you call it again with the same arguments, it just returns the cached value instead of recalculating.
 * Use case: speeding up expensive computations (like Fibonacci, API calls, etc.).
 * @param {*} fn function
 */
function memoize(fn) {
    let cache = new Map();
    return (function(...args) {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            return cache.get(key);
        } else {
            console.log("Calculating ...");
            let response = fn(...args);
            cache.set(key, response);
            return response;
        }
    });
}

const memory = memoize((x) => x * 2);
console.log(memory(10));
console.log(memory(10));

/**
 * What it does: returns a function that will call fn only after it has been invoked n times.
 * Use case: waiting until several async tasks finish, then running a callback.
* @param {*} n times
 * @param {*} fn function
 */
function after(n, fn) {
    var counter = 0;
    return (function() {
        ++counter;
        if (counter >= n)
            return (fn());
        return undefined;
    });
}

const done = after(3, () => console.log("all done!"));
done(); // nothing
done(); // nothing
done(); // all done!
