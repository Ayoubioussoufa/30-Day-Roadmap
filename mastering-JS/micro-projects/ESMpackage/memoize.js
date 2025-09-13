/**
 * What it does: caches the results of function calls.
 * If you call it again with the same arguments, it just returns the cached value instead of recalculating.
 * Use case: speeding up expensive computations (like Fibonacci, API calls, etc.).
 * @param {*} fn function
 */
export default function memoize(fn) {
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