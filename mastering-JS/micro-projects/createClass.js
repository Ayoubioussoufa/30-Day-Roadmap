// createClass: { extends?: Parent, constructor?: fn, methods?: {...}, statics?: {...} }

// re-create a minimal “class system” without using class.

function constructor(value) {
    let obj = {};
    obj.__proto__ = constructor.prototype;
    obj.value = value;
    return obj;
}

constructor.prototype.increment = function() {
    this.value += 1;
};

constructor.staticMethod = function(instance) {
    console.log("I'm a static method");
    console.log(instance.value);
}

let p = new constructor(5);
constructor.staticMethod(p);
console.log(p);
p.increment();
console.log(p);

function constructor2(value, extra) {
    let obj = constructor(value);
    Object.setPrototypeOf(obj, constructor2.prototype);
    obj.extra = extra;
    return obj;
}

constructor2.prototype.showExtra = function() {
    console.log("Extra :", this.extra);
}

constructor2.static = function() {
    console.log("I'm a static method too");
}

// will not show in for .. in loops
Object.defineProperty(constructor2.prototype, 'showExtra', {
    value: function() {console.log("Extra :", this.extra);},
    writable: true,
    configurable: true,
    enumerable: false,
});

constructor2.prototype.__proto__ = constructor.prototype;
constructor2.prototype.constructor = constructor2;
let child = new constructor2(5, 9);
console.log(child.value);
child.showExtra();
child.increment();
console.log(child.value);

function classBuilder() {
    let obj = {};
}

// Function that builds classes automatically

function CreateFuntion({constructor, parent, methods}) {
    function Child(...args) {
        constructor.apply(this, args);
    }
    if (parent) {
        Child.prototype = Object.create(parent.prototype);
    }
    for (let key in methods) {
        Object.defineProperty(Child.prototype, key, {
            value: methods[key],
            writable: true,
            configurable: true,
            enumerable: false,
        });
    }
    Child.prototype.constructor = Child;
    return Child;
}

let MyClass = CreateFuntion({
    constructor: function(value) {this.value = value;},
    parent: null,
    methods: {
        incrementing: function() {this.value++}
    }
});

let instance = new MyClass(5);
console.log(instance.value);
instance.incrementing();
console.log(instance.value);


let Person = CreateFuntion({
    constructor: function(name, age) {this.name = name; this.age = age;},
    parent: null,
    methods: {
        greet: function() {
            console.log(`"Hi, my name is ${this.name}`);
        },
        haveBirthday: function() {
            this.age++;
        }
    }
});

Person.describe = function(instance) {
    console.log(`${instance.name} is ${instance.age} years old.`)
};

let Student = CreateFuntion({
    constructor: function(name, age, grade) {
        this.name = name; this.age = age; this.grade = grade;
    },
    parent: Person,
    methods: {
        study: function() {
            console.log(`${this.name} is studying.`);
        }
    }
});

Student.promote = function(instance) {
    instance.grade++;
};

let instance5 = new Student("Ayoub", 10, 10);

instance5.greet();
instance5.study();
Student.promote(instance5);
console.log(instance5.grade);

Person.describe(instance5);