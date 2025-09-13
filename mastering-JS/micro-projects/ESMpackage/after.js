/**
 * What it does: returns a function that will call fn only after it has been invoked n times.
 * Use case: waiting until several async tasks finish, then running a callback.
* @param {*} n times
 * @param {*} fn function
 */
export default function after(n, fn) {
    var counter = 0;
    return (function() {
        ++counter;
        if (counter >= n)
            return (fn());
        return undefined;
    });
}