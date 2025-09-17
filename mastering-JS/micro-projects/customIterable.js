// Custom Iterable (Paged API → Stream of Items)

const apiPages = [
    ["item1", "item2"],
    ["item3", "item4"],
    ["item5"]
  ];


async function* myCustomIterable(pages) {
    for (let page of pages) {
        await new Promise(r => setTimeout(r, 500));
        for (let item of page) {
            yield item;
        }
    }
}

(async () => {
    for await (const item of myCustomIterable(apiPages)) {
        console.log(item);
    }
})();

// This is called an Immediately Invoked Async Function Expression (IIAFE).
// () around the function treats it as an expression not a declaration
// declaration
// function sayHello() {
//     console.log("Hello");
//   }
  
// expression
// const sayHello = function() {
//   console.log("Hello");
// };
// sayHello(); // ✅ Works
// Here the function is assigned to a variable → now it’s an expression.
// Expressions produce a value, so you can immediately invoke them.

// (); at the end = immediately invokes the function !!!
// then this
// (function() {
//     console.log("Hello");
//   })();
  
