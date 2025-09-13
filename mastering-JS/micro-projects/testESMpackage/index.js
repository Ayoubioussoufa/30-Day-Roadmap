import { once, memoize, after } from 'my-utils';

function test() {
    console.log("Hello, first package");
}

let runOnce = once(test);
runOnce();
runOnce(); // print nothing
console.log('*****************');
let memo = memoize(test);
memo();
console.log('*****************');
let nTime = after(2,test);
nTime(); // 1
nTime(); // 2 ==  prints