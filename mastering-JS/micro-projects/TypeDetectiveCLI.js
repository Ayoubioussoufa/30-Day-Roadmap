// Create a CLI tool that prints detailed type information for any value you pass in, including:

// Primitive vs Object

// Specific type (number, string, array, function, etc.)

// Whether it’s null, undefined, NaN

// Boxing behavior for primitives

// Optional: check equality quirks (== vs ===)

function detectType(value) {
    if (value === null) return "null";
    if (typeof value === "number" && isNaN(value)) return "NaN";
    if (Array.isArray(value)) return "Array";
    if (typeof value === "function") return "Function";
    return typeof value; // number, string, boolean, undefined, object, symbol, bigint
}

function primitiveOrObject(value) {
    if (value === null) return "null";
    if (typeof value === "object" || typeof value === "function") return "Object";
    return "Primitive";
}

function truthyOrFalsy(value) {
    return Boolean(value);
}

function boxing(value) {
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
        let boxed = Object(value);
        console.log("Boxed version:", boxed, "Type:", typeof boxed);
    }    
}

function typeDetective(value) {
    console.log("Value: ", value);
    console.log("Type: ", detectType(value));
    console.log("Primitive or Object: ", primitiveOrObject(value));
    console.log("Truthy or Falsy: ", truthyOrFalsy(value));
    console.log("Boxing: ", boxing(value));
    console.log("***********************************");
}

typeDetective(5);
typeDetective("hello");
typeDetective(null);
typeDetective(undefined);
typeDetective([1,2,3]);
typeDetective({name:"Alice"});
typeDetective(() => {});
typeDetective(NaN);
typeDetective(0);

const arg = process.argv[2];
let parsed;
try {
    parsed = JSON.parse(arg);
} catch {
    parsed = arg;
}

typeDetective(parsed);