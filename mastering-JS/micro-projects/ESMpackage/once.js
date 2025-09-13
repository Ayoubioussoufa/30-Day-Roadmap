/**
 * What it does: ensures a function runs only one time.
 * First call → executes the function.
 * Later calls → return the same result without running it again.
 * @param {*} fn function
 */
export default function once(fn) {
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

// {
//     "name": "my-utils", The package name.
//     "version": "1.0.0", Follows semantic versioning (major.minor.patch)
//     "type": "module", Tells Node this package uses ESM.
//     "main": "index.js", default entry point when someone imports your package
//     "exports": {
//         ".": "./index.js" Modern ESM-friendly way to tell Node which file(s) can be imported from outside your package.
//     } Future-proofs your package for tree-shaking and bundlers.
//       Allows you to hide internal files (e.g., once.js) from direct imports.
// }     Works for conditional exports (like import vs require) if needed.
